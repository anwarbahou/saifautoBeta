"use client";

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CarCard, Car as SharedCar } from "@/components/car-card";

async function fetchAllCars(): Promise<SharedCar[]> {
  const { data, error } = await supabase
    .from('cars')
    .select('id, make, model, year, category, color, license_plate, status, daily_rate, images, primary_image');

  if (error) {
    console.error('Error fetching cars from Supabase:', error);
    return [];
  }
  if (!data) {
    return [];
  }

  return data.map((car: any) => ({
    id: car.id,
    make: car.make,
    model: car.model,
    year: car.year,
    category: car.category,
    color: car.color,
    license_plate: car.license_plate,
    status: car.status,
    daily_rate: car.daily_rate,
    images: car.images || [],
    primary_image: car.primary_image,
  }));
}

// NOTE: This component always fetches the latest car list from Supabase on every load.
// No static or cached data is used. If a car is removed from the database, it will not appear in the search results.
// If a car is added, it will appear immediately on reload.

const SearchResultsDisplay = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cars, setCars] = useState<SharedCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const destination = searchParams ? searchParams.get('destination') : null;
  const pickupDateTime = searchParams ? searchParams.get('pickupDateTime') : null;
  const dropoffDateTime = searchParams ? searchParams.get('dropoffDateTime') : null;

  const handleEdit = useCallback((car: SharedCar) => {
    console.log("Edit car:", car.id);
  }, []);

  const handleDelete = useCallback(async (carId: number) => {
    console.log("Delete car:", carId);
  }, []);

  const handlePreview = useCallback((car: SharedCar) => {
    console.log('[Preview] Car object:', car);
    if (searchParams) {
      const carUrl = `/cars/${car.id}?${searchParams.toString()}`;
      console.log('[Preview] Navigating to:', carUrl, 'with searchParams:', searchParams.toString());
      router.push(carUrl);
    } else {
      console.warn('[Preview] No searchParams found, navigating to car page without params.');
      router.push(`/cars/${car.id}`);
    }
  }, [searchParams, router]);

  useEffect(() => {
    async function loadCars() {
      setLoading(true);
      setError(null);
      try {
        console.log('[Search] Params:', { destination, pickupDateTime, dropoffDateTime });
        // Always fetch the latest cars from Supabase
        const fetchedCars = await fetchAllCars();
        console.log('[Search] Cars fetched:', fetchedCars.length, fetchedCars);
        setCars(fetchedCars);
        setLoading(false);
      } catch (err) {
        console.error('[Search] Error fetching or filtering cars:', err);
        setError('Une erreur est survenue lors du chargement des voitures. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    }
    loadCars();
  }, [destination, pickupDateTime, dropoffDateTime]);

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Résultats de Recherche
      </h1>
      {destination && (
        <p className="mb-2 text-lg text-gray-700">
          Résultats pour : <strong>{destination}</strong>
        </p>
      )}
      {pickupDateTime && dropoffDateTime && (
        <p className="mb-6 text-md text-gray-600">
          Du : <strong>{new Date(pickupDateTime).toISOString().slice(0, 19).replace('T', ' ')}</strong> Au : <strong>{new Date(dropoffDateTime).toISOString().slice(0, 19).replace('T', ' ')}</strong>
        </p>
      )}
      {error && (
        <div className="text-center py-6">
          <p className="text-lg text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white shadow-lg rounded-lg p-4 animate-pulse">
              <div className="w-full h-48 bg-gray-300 rounded mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                <div className="h-10 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {cars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onEdit={() => handleEdit(car)}
              onDelete={() => handleDelete(Number(car.id))}
              onPreview={() => handlePreview(car)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">Aucune voiture disponible pour les critères sélectionnés.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsDisplay; 