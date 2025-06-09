import Image from "next/image";
import { Car, Fuel, Users, Cog } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";
import NewNavbar from "@/components/landing/NewNavbar";
import NewFooter from "@/components/landing/NewFooter";
import FleetControlsAndList from "@/components/fleet/FleetControlsAndList";
import FleetHero from "@/components/fleet/FleetHero";

interface CarData {
  id: string | number;
  make: string;
  model: string;
  name: string; 
  type: string; 
  price_per_day: number; 
  image_url: string; 
  seats: number | null; 
  fuel_type: string | null; 
  transmission: string | null; 
}

async function fetchAllCars(): Promise<CarData[]> {
  try {
    const { data: cars_data, error } = await supabase
      .from('cars')
      .select('id, make, model, category, daily_rate, primary_image');

    if (error) {
      console.error("Error fetching all cars from Supabase:", error);
      if (error.message) console.error("Supabase error message:", error.message);
      if (error.details) console.error("Supabase error details:", error.details);
      if (error.hint) console.error("Supabase error hint:", error.hint);
      return [];
    }
    if (!cars_data) {
      console.warn("No data returned from Supabase for all cars.");
      return [];
    }

    const formattedCars: CarData[] = cars_data.map((car_item: any) => ({
      id: car_item.id,
      make: car_item.make || "Unknown Make",
      model: car_item.model || "Unknown Model",
      name: `${car_item.make || ''} ${car_item.model || ''}`.trim() || "Unknown Car",
      type: car_item.category || "N/A",
      price_per_day: car_item.daily_rate || 0,
      image_url: car_item.primary_image,
      seats: null, 
      fuel_type: null, 
      transmission: null, 
    }));

    return formattedCars;
  } catch (err) {
    console.error("Exception during fetchAllCars:", err);
    return [];
  }
}

export default async function FleetPage() {
  const allCarsData: CarData[] = await fetchAllCars();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NewNavbar />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <FleetHero />
        <FleetControlsAndList initialCars={allCarsData} />
      </main>
      <NewFooter />
    </div>
  );
}

export const metadata = {
  title: "Saifauto - Notre flotte",
}; 