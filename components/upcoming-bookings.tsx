"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, CalendarCheck, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getUpcomingBookings } from "@/lib/actions";

interface UpcomingBooking {
  id: string; // or number
  client_name: string; // This will come from the joined clients table
  car_model: string;   // This will come from the joined cars table
  car_make: string;    // This will come from the joined cars table
  start_date: string;
  status: string; 
  // Joined data from server action
  clients: { id: number; name: string; } | null;
  cars: { id: number; make: string; model: string; } | null;
}

// Mock data removed as we will use server action

export function UpcomingBookings() {
  const [bookings, setBookings] = useState<UpcomingBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        setError(null);
        const result = await getUpcomingBookings(3); // Fetch next 3 upcoming
        
        if (result.success && result.data) {
          // Map the data if necessary, or use directly if fields match
          const mappedBookings: UpcomingBooking[] = result.data.map((dbBooking: any) => ({
            id: dbBooking.id.toString(),
            client_name: dbBooking.clients?.name || "N/A",
            car_make: dbBooking.cars?.make || "N/A",
            car_model: dbBooking.cars?.model || "N/A",
            start_date: dbBooking.start_date,
            status: dbBooking.status,
            clients: dbBooking.clients, // keep for potential detailed view or future use
            cars: dbBooking.cars,       // keep for potential detailed view or future use
          }));
          setBookings(mappedBookings);
        } else {
          setError(result.error || "Failed to load upcoming bookings.");
        }
      } catch (e) {
        console.error("Failed to fetch upcoming bookings:", e);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  return (
    <Card className="col-span-1 md:col-span-1 lg:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-medium">Upcoming Bookings</CardTitle>
          <CardDescription className="text-sm">Bookings starting soon.</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/bookings">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
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
        {!loading && !error && bookings.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48">
            <CalendarCheck className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No upcoming bookings.</p>
          </div>
        )}
        {!loading && !error && bookings.length > 0 && (
          <div className="space-y-3 pt-2">
            {bookings.map((booking) => (
              <Link href={`/dashboard/bookings?id=${booking.id}`} key={booking.id} className="block hover:bg-muted/50 p-2.5 rounded-md transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex-grow min-w-0">
                     <div className="flex justify-between items-baseline">
                        <h4 className="font-medium truncate text-sm">{booking.client_name}</h4>
                        <Badge variant={booking.status === "Confirmed" ? "default" : "outline"} className="text-xs">{booking.status}</Badge>
                     </div>
                    <p className="text-xs text-muted-foreground truncate">{booking.car_make} {booking.car_model}</p>
                    <p className="text-xs text-muted-foreground">
                      Starts: {new Date(booking.start_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
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