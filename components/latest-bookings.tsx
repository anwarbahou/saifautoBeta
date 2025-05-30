"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getRecentBookings } from "@/lib/actions";
import { AlertTriangle, Loader2 } from "lucide-react";

interface Booking {
  id: number; // Assuming id from bookings table is number
  start_date: string;
  end_date: string;
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled" | "Active"; // Ensure this matches DB enum and usage
  total_amount?: number;
  created_at: string; // From the .order("created_at") clause
  // Joined data
  clients: { id: number; name: string; } | null;
  cars: { id: number; make: string; model: string; } | null;
  // Add other direct fields from the 'bookings' table that are selected by '*'
  client_id?: number;
  car_id?: number;
  // ... any other fields from bookings.*
}

export function LatestBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        setError(null);
        const fetchedBookings = await getRecentBookings(5);

        if (Array.isArray(fetchedBookings)) {
          const mappedBookings: Booking[] = fetchedBookings.map((dbBooking: any) => ({
            id: dbBooking.id,
            start_date: dbBooking.start_date,
            end_date: dbBooking.end_date,
            status: dbBooking.status,
            total_amount: dbBooking.total_amount,
            created_at: dbBooking.created_at,
            clients: dbBooking.clients,
            cars: dbBooking.cars,
            client_id: dbBooking.client_id,
            car_id: dbBooking.car_id,
          }));
          setBookings(mappedBookings);
        } else {
          console.error("getRecentBookings did not return an array:", fetchedBookings);
          setError("Failed to fetch bookings: Invalid data format received.");
        }
      } catch (e: any) {
        console.error("Failed to fetch latest bookings:", e);
        setError(e.message || "An unexpected error occurred while fetching bookings.");
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const getStatusBadgeVariant = (status: Booking["status"]) => {
    switch (status) {
      case "Confirmed":
        return "default";
      case "Completed":
        return "secondary";
      case "Pending":
        return "outline";
      case "Cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-1"> {/* Adjusted for a 3-column layout on lg screens */}
      <CardHeader>
        <CardTitle>Latest Bookings</CardTitle>
        <CardDescription>Recently added bookings in your system.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="ml-2">Loading bookings...</p>
          </div>
        )}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center h-40 text-destructive">
            <AlertTriangle className="h-8 w-8 mb-2" />
            <p className="text-center">Error loading bookings: {error}</p>
          </div>
        )}
        {!loading && !error && bookings.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40">
            <p className="text-muted-foreground">No recent bookings found.</p>
          </div>
        )}
        {!loading && !error && bookings.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Car</TableHead>
                <TableHead className="hidden sm:table-cell">Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right hidden md:table-cell">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="font-medium">{booking.clients?.name || "N/A"}</div>
                  </TableCell>
                  <TableCell>{booking.cars ? `${booking.cars.make} ${booking.cars.model}` : "N/A"}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(booking.status)}>{booking.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right hidden md:table-cell">
                    {booking.total_amount ? `${booking.total_amount.toFixed(2)} MAD` : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
} 