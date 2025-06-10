"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Database } from '@/types/supabase';
import { CarLocation } from '@/types/cars';

// Custom SVG marker icon
const icon = L.divIcon({
  html: `<svg width="36" height="48" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.3"/>
    </filter>
    <path d="M18 0C8.076 0 0 8.076 0 18C0 33 18 48 18 48C18 48 36 33 36 18C36 8.076 27.924 0 18 0ZM18 25.5C13.86 25.5 10.5 22.14 10.5 18C10.5 13.86 13.86 10.5 18 10.5C22.14 10.5 25.5 13.86 25.5 18C25.5 22.14 22.14 25.5 18 25.5Z" 
      fill="#FF6B00" 
      filter="url(#shadow)"
    />
    <circle cx="18" cy="18" r="7.5" fill="#FFFFFF"/>
  </svg>`,
  className: 'custom-marker',
  iconSize: [36, 48],
  iconAnchor: [18, 48],
  popupAnchor: [0, -48]
});

// Add some global styles for the marker
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .custom-marker {
      filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2));
      transition: transform 0.2s;
    }
    .custom-marker:hover {
      transform: scale(1.1);
    }
  `;
  document.head.appendChild(style);
}

interface MapProps {
  cars: CarLocation[];
  onCarUpdate?: (carId: number) => void;
}

// Center near Morocco Mall where the car is located
const CASABLANCA_CENTER: [number, number] = [33.5784, -7.7022];

export default function Map({ cars, onCarUpdate }: MapProps) {
  const [disabling, setDisabling] = useState<number | null>(null);
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleDisableCar = async (carId: number) => {
    try {
      setDisabling(carId);
      const { error } = await supabase
        .from('cars')
        .update({ status: 'Maintenance' })
        .eq('id', carId);

      if (error) {
        console.error('Error disabling car:', error);
        return;
      }

      // Notify parent component to refresh car data
      if (onCarUpdate) {
        onCarUpdate(carId);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setDisabling(null);
    }
  };

  return (
    <MapContainer
      center={CASABLANCA_CENTER}
      zoom={14}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {cars.map((car) => (
        <Marker
          key={car.id}
          position={car.location}
          icon={icon}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold">{car.make} {car.model}</h3>
              <p className="text-sm">Status: {car.status}</p>
              {car.license_plate && (
                <p className="text-sm">License: {car.license_plate}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Near Morocco Mall, Casablanca
              </p>
              {car.status !== 'Maintenance' && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => handleDisableCar(car.id)}
                  disabled={disabling === car.id}
                >
                  {disabling === car.id ? 'Disabling...' : 'Disable Car'}
                </Button>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 