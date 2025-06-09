"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCars } from "@/lib/actions"; // Assuming getCars fetches in a way that latest are first or can be sliced
import { AlertTriangle, Loader2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  primary_image: string | null;
  status: string;
  // Add other relevant fields if needed for display
}

export function RecentlyAddedCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecentCars() {
      try {
        setLoading(true);
        setError(null);
        const response = await getCars(1, 4);
        
        if (response.error) {
          throw new Error(response.error);
        }

        // Explicitly use response.data and ensure it's an array
        setCars(Array.isArray(response.data) ? response.data : []);
      } catch (e: any) {
        console.error("Failed to fetch recent cars:", e);
        setError(e.message || "An unexpected error occurred while fetching cars.");
        setCars([]); // Ensure cars is an empty array on error
      } finally {
        setLoading(false);
      }
    }
    fetchRecentCars();
  }, []);

  return (
    <Card className="col-span-1 md:col-span-1 lg:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-medium">Véhicules Récemment Ajoutés</CardTitle>
          <CardDescription className="text-sm">Les derniers véhicules ajoutés à la flotte</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/cars">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">Chargement des véhicules...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-8">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <span className="ml-3 text-destructive">Erreur lors du chargement des véhicules</span>
          </div>
        )}

        {!loading && !error && cars.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Aucun véhicule ajouté récemment
          </div>
        )}

        {!loading && !error && cars.length > 0 && (
          <div className="space-y-3 pt-2">
            {cars.map((car) => (
              <Link href={`/dashboard/cars?view=${car.id}`} key={car.id} className="block hover:bg-muted/50 p-2 rounded-md transition-colors">
                <div className="flex items-center gap-3">
                  <div className="relative h-16 w-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {car.primary_image ? (
                      <Image 
                        src={car.primary_image} 
                        alt={`${car.make} ${car.model}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-muted text-muted-foreground text-xs">
                        Pas d'image
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-medium truncate text-sm">{car.make} {car.model}</h4>
                    <p className="text-xs text-muted-foreground">Année : {car.year}</p>
                    <Badge variant={car.status === "Available" ? "default" : car.status === "Rented" ? "destructive" : "secondary"} className="mt-1 text-xs">
                      {car.status === "Available" ? "Disponible" : car.status === "Rented" ? "Loué" : car.status}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 