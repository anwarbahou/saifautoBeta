"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { LatLngExpression } from 'leaflet';

// Dynamically import the Map component with no SSR
const Map = dynamic(() => import('./map'), {
  ssr: false,
  loading: () => (
    <div className="p-8 text-center text-gray-500">Loading map...</div>
  ),
});

interface CarLocation {
  id: number;
  make: string;
  model: string;
  location: LatLngExpression;
  status: string;
  license_plate?: string;
}

export function CarTracker() {
  const [cars, setCars] = useState<CarLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('cars')
        .select('id, make, model, status, license_plate, location');

      if (error) {
        console.error('Error fetching cars:', error);
        setError(error.message);
        return;
      }

      // Transform the data to match our CarLocation interface
      const transformedCars = data
        .filter(car => car.location) // Only include cars with location data
        .map(car => {
          try {
            // Try to parse the location string
            const [lat, lng] = car.location?.split(',').map(Number) || [33.5784, -7.7022];
            
            // Validate coordinates
            if (isNaN(lat) || isNaN(lng) || !lat || !lng) {
              console.warn(`Invalid location for car ${car.id}: ${car.location}`);
              return null;
            }

            return {
              id: car.id,
              make: car.make,
              model: car.model,
              status: car.status || 'Unknown',
              license_plate: car.license_plate,
              location: [lat, lng] as [number, number]
            };
          } catch (err) {
            console.warn(`Error parsing location for car ${car.id}:`, err);
            return null;
          }
        })
        .filter(car => car !== null) as CarLocation[];

      setCars(transformedCars);
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('An unexpected error occurred while fetching cars');
    } finally {
      setLoading(false);
    }
  };

  const handleCarUpdate = () => {
    fetchCars(); // Refresh the car data
  };

  return (
    <Card className="p-0 overflow-hidden">
      {error && (
        <div className="p-4 text-red-600 bg-red-50 border-b border-red-100">
          Error: {error}
        </div>
      )}
      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading car locations...</div>
      ) : cars.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No cars with location data available.
          {!error && " Please add location data to your cars to see them on the map."}
        </div>
      ) : (
        <div style={{ height: "70vh", width: "100%" }}>
          <Map cars={cars} onCarUpdate={handleCarUpdate} />
        </div>
      )}
    </Card>
  );
} 