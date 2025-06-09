"use client";

import Image from "next/image"
import { Car, Fuel, Users, Cog } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabaseClient"; // Import Supabase client
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

// Removed unused carCategories static data

export interface CarData {
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

// Removed hardcoded SUPABASE_PROJECT_ID

async function fetchCarsFromDB(): Promise<CarData[]> {
  try {
    const { data: cars_data, error } = await supabase
      .from('cars')
      .select('id, make, model, category, daily_rate, primary_image') // Select actual column names
      .limit(6);

    if (error) {
      console.error("Error fetching cars from Supabase:", error);
      // Log the full error for more details
      if (error.message) console.error("Supabase error message:", error.message);
      if (error.details) console.error("Supabase error details:", error.details);
      if (error.hint) console.error("Supabase error hint:", error.hint);
      return [];
    }
    if (!cars_data) {
        console.warn("No data returned from Supabase for cars.");
        return [];
    }

    // Map the fetched data to the CarData interface
    const formattedCars: CarData[] = cars_data.map((car_item: any) => ({
      id: car_item.id,
      name: `${car_item.make} ${car_item.model}`,
      make: car_item.make,
      model: car_item.model,
      type: car_item.category || "N/A",
      price_per_day: car_item.daily_rate || 0,
      image_url: car_item.primary_image, // Use only Supabase URL, no default placeholder
      seats: null, // Placeholder as it's not in the DB
      fuel_type: null, // Placeholder as it's not in the DB
      transmission: null, // Placeholder as it's not in the DB
    }));

    return formattedCars;
  } catch (err) {
    console.error("Exception during fetchCarsFromDB:", err);
    return [];
  }
}

export function CarCard({ car }: { car: CarData }) {
  const searchParams = useSearchParams();
  // Ensure searchParams is not null before calling toString()
  const queryString = searchParams ? searchParams.toString() : "";
  const carUrl = `/cars/${car.id}${queryString ? `?${queryString}` : ""}`;

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
            <span>{car.seats || "N/A"} Places</span>
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
            <span className="text-sm font-normal text-muted-foreground">/jour</span>
          </p>
        </div>
        <Button asChild size="default" className="text-base font-semibold">
          <Link href={carUrl}>Réserver</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function NewFleetSection() {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCars() {
      const fetchedCars = await fetchCarsFromDB();
      setCars(fetchedCars);
      setLoading(false);
    }
    loadCars();
  }, []);

  return (
    <section id="fleet" className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">Découvrez Notre Flotte</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Choisissez parmi notre large gamme de véhicules adaptés à vos besoins et à votre budget. Des voitures économiques pour les trajets urbains aux SUV spacieux pour les aventures en famille.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement des véhicules...</p>
          </div>
        ) : cars && cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {cars.map((car_item) => (
              <CarCard key={car_item.id} car={car_item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun Véhicule Disponible</h3>
            <p className="text-muted-foreground">
              Nous n'avons trouvé aucun véhicule pour le moment. Veuillez réessayer plus tard ou contacter le support.
            </p>
          </div>
        )}

        <div className="mt-12 md:mt-16 text-center">
          <Button asChild size="lg" className="text-lg font-semibold px-8 py-3">
            <Link href={`/fleet${searchParams ? `?${searchParams.toString()}` : ""}`}>Voir Tous les Véhicules</Link>
          </Button>
        </div>
      </div>
    </section>
  );
} 