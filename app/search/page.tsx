'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import NewNavbar from '@/components/landing/NewNavbar';
import NewFooter from '@/components/landing/NewFooter';
import { CarCard, CarData } from '@/components/landing/NewFleetSection'; // Reusing CarCard and CarData
import { Skeleton } from '@/components/ui/skeleton';

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
    seats: null, // Or fetch if available
    fuel_type: null, // Or fetch if available
    transmission: null, // Or fetch if available
  }));
}

function SearchResultsDisplay() {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);

  const destination = searchParams.get('destination');
  const pickupDateTime = searchParams.get('pickupDateTime');
  const dropoffDateTime = searchParams.get('dropoffDateTime');

  useEffect(() => {
    async function loadCars() {
      setLoading(true);
      // TODO: In the future, filter cars based on searchParams (destination, pickupDateTime, dropoffDateTime)
      const fetchedCars = await fetchAllCars();
      setCars(fetchedCars);
      setLoading(false);
    }
    loadCars();
  }, [destination, pickupDateTime, dropoffDateTime]); // Re-fetch if params change

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
        Search Results
      </h1>
      {destination && (
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          Showing results for: <strong>{destination}</strong>
        </p>
      )}
      {pickupDateTime && dropoffDateTime && (
        <p className="mb-6 text-md text-gray-600 dark:text-gray-400">
          From: <strong>{new Date(pickupDateTime).toISOString().slice(0, 19).replace('T', ' ')}</strong> To: <strong>{new Date(dropoffDateTime).toISOString().slice(0, 19).replace('T', ' ')}</strong>
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : cars.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <p className="text-center text-xl text-gray-500 dark:text-gray-400">
          No cars found matching your criteria. (Currently showing all cars as a placeholder)
        </p>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search page...</div>}> {/* Suspense for useSearchParams */}
      <NewNavbar />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <SearchResultsDisplay />
      </main>
      <NewFooter />
    </Suspense>
  );
} 