"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Fuel, Cog } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CarData {
  id: string | number;
  name: string;
  make: string;
  model: string;
  type: string;
  price_per_day: number;
  image_url: string;
  seats: number | null;
  fuel_type: string | null;
  transmission: string | null;
}

async function fetchAllCars(): Promise<CarData[]> {
  const { data, error } = await supabase
    .from('cars')
    .select('id, make, model, category, daily_rate, primary_image');

  if (error) {
    console.error('Error fetching cars from Supabase:', error);
    return [];
  }
  if (!data) {
    return [];
  }

  return data.map((car: any) => ({
    id: car.id,
    name: `${car.make} ${car.model}`,
    make: car.make,
    model: car.model,
    type: car.category,
    price_per_day: car.daily_rate,
    image_url: car.primary_image,
    seats: null,
    fuel_type: null,
    transmission: null,
  }));
}

const CarCard = ({ car, searchParams }: { car: CarData, searchParams: URLSearchParams }) => {
  const carUrl = `/cars/${car.id}?${searchParams.toString()}`;
  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
      <CardHeader className="p-0 relative">
        <Link href={carUrl} aria-label={`View details for ${car.name}`}>
          <div className="aspect-[16/10] w-full overflow-hidden">
            <Image
              src={car.image_url || "/img/cars/car-placeholder.png"}
              alt={car.name}
              width={600}
              height={375}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            />
          </div>
        </Link>
        <Badge variant="default" className="absolute top-4 right-4 bg-primary text-primary-foreground">
          {car.type || "N/A"}
        </Badge>
      </CardHeader>
      <CardContent className="p-5 flex-grow">
        <CardTitle className="text-xl font-semibold mb-2 text-gray-900">{car.name}</CardTitle>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>{car.seats || "N/A"} Seats</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-primary" />
            <span>{car.fuel_type || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Cog className="h-4 w-4 text-primary" />
            <span>{car.transmission || "N/A"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-5 bg-gray-50 border-t flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-primary">
            {car.price_per_day} MAD
          </p>
        </div>
        <Button asChild size="default" className="text-base font-semibold">
          <Link href={carUrl}>Book Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const SearchResultsDisplay = () => {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);

  const destination = searchParams ? searchParams.get('destination') : null;
  const pickupDateTime = searchParams ? searchParams.get('pickupDateTime') : null;
  const dropoffDateTime = searchParams ? searchParams.get('dropoffDateTime') : null;

  useEffect(() => {
    async function loadCars() {
      setLoading(true);
      const fetchedCars = await fetchAllCars();
      setCars(fetchedCars);
      setLoading(false);
    }
    loadCars();
  }, [destination, pickupDateTime, dropoffDateTime]);

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Search Results
      </h1>
      {destination && (
        <p className="mb-2 text-lg text-gray-700">
          Showing results for: <strong>{destination}</strong>
        </p>
      )}
      {pickupDateTime && dropoffDateTime && (
        <p className="mb-6 text-md text-gray-600">
          From: <strong>{new Date(pickupDateTime).toISOString().slice(0, 19).replace('T', ' ')}</strong> To: <strong>{new Date(dropoffDateTime).toISOString().slice(0, 19).replace('T', ' ')}</strong>
        </p>
      )}

      {loading ? (
        <div>Loading cars...</div>
      ) : cars.length === 0 ? (
        <div>No cars found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {cars.map((car) => (
            searchParams && <CarCard key={car.id} car={car} searchParams={searchParams} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsDisplay; 