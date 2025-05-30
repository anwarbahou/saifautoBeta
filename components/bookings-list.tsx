"use client"

import { useState, useEffect } from "react"
import { Edit, Eye, MoreHorizontal, Plus, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getBookings } from "@/lib/actions"
import { useToast } from "@/components/ui/use-toast"
import { BookingRowSkeleton } from "@/components/booking-row-skeleton"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface Client {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  // Add other client properties if needed, e.g., email
}

interface Car {
  id: number;
  make: string;
  model: string;
  license_plate?: string; // Optional as it might not always be there
  // Add other car properties if needed
}

interface Booking {
  id: number;
  clients: Client | null; // Can be null if client data is not fully joined
  cars: Car | null;     // Can be null if car data is not fully joined
  start_date: string; // or Date
  end_date: string;   // or Date
  total_price: number | string;
  status: string;
  // Snapshot fields
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  car_make?: string;
  car_model?: string;
  car_license_plate?: string;
  // Add any other properties from your getBookings() response
}

const statusStyles: Record<string, string> = {
  Confirmed: "bg-green-100 text-green-800 border-green-300",
  Active: "bg-blue-100 text-blue-800 border-blue-300",
  Completed: "bg-gray-100 text-gray-800 border-gray-300",
  Cancelled: "bg-red-100 text-red-800 border-red-300",
};

export function BookingsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", bookingId)
  }

  useEffect(() => {
    async function loadBookings() {
      try {
        const data = await getBookings()
        setBookings(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load bookings",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [toast])

  const filteredBookings = bookings.filter(
    (booking) =>
      (booking.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       booking.last_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      `${booking.car_make || booking.cars?.make || ''} ${booking.car_model || booking.cars?.model || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.car_license_plate || booking.cars?.license_plate || '').toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">All Bookings</CardTitle>
            <CardDescription>Manage your rental bookings</CardDescription>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Booking
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center py-4">
          <Input
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Car</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <BookingRowSkeleton key={index} />
                ))
              ) : filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-10">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => {
                  const start = new Date(booking.start_date);
                  const end = new Date(booking.end_date);
                  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">B-{booking.id.toString().padStart(4, "0")}</TableCell>
                      <TableCell>{booking.first_name}</TableCell>
                      <TableCell>{booking.last_name}</TableCell>
                      <TableCell>{booking.email}</TableCell>
                      <TableCell>{booking.phone}</TableCell>
                      <TableCell>{`${booking.cars?.make} ${booking.cars?.model} (${booking.cars?.license_plate})`}</TableCell>
                      <TableCell>{`${start.toLocaleDateString()} to ${end.toLocaleDateString()} (${days} days)`}</TableCell>
                      <TableCell>
                        {typeof booking.total_price !== "undefined" && booking.total_price !== null
                          ? `${Number(booking.total_price).toFixed(2)} MAD`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className={`w-full justify-start border ${statusStyles[booking.status] || ""}`}
                              aria-label="Booking Status"
                            >
                              {booking.status}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {["Confirmed", "Active", "Completed", "Cancelled"].map((status) => (
                              <DropdownMenuItem
                                key={status}
                                onClick={async () => {
                                  if (status !== booking.status) {
                                    await handleStatusChange(booking.id, status);
                                    setBookings((prev) =>
                                      prev.map((b) =>
                                        b.id === booking.id ? { ...b, status } : b
                                      )
                                    );
                                  }
                                }}
                                className={statusStyles[status] + " cursor-pointer"}
                              >
                                {status}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" /> View details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" /> Edit booking
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash className="mr-2 h-4 w-4" /> Cancel booking
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
