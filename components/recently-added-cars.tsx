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
        const allCars: Car[] = await getCars(); // getCars should sort by creation date descending
        setCars(allCars.slice(0, 4)); // Take the first 4 for example
      } catch (e) {
        console.error("Failed to fetch recent cars:", e);
        setError("An unexpected error occurred while fetching cars.");
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
          <CardTitle className="text-lg font-medium">Recently Added Cars</CardTitle>
          <CardDescription className="text-sm">Newest additions to your fleet.</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/cars">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center h-48 text-destructive">
            <AlertTriangle className="h-8 w-8 mb-2" />
            <p className="text-center">{error}</p>
          </div>
        )}
        {!loading && !error && cars.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48">
            <p className="text-muted-foreground">No cars added recently.</p>
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
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-medium truncate text-sm">{car.make} {car.model}</h4>
                    <p className="text-xs text-muted-foreground">Year: {car.year}</p>
                    <Badge variant={car.status === "Available" ? "default" : car.status === "Rented" ? "destructive" : "secondary"} className="mt-1 text-xs">
                      {car.status}
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