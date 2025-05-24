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

interface Client {
  id: number;
  name: string;
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
  total_amount: string; // or number, adjust based on actual data type
  status: string;
  // Add any other properties from your getBookings() response
}

export function BookingsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

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
      booking.clients?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${booking.cars?.make} ${booking.cars?.model}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.cars?.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()),
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
                <TableHead>Customer</TableHead>
                <TableHead>Car</TableHead>
                <TableHead>Dates</TableHead>
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
                  <TableCell colSpan={7} className="text-center py-10">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">B-{booking.id.toString().padStart(4, "0")}</TableCell>
                    <TableCell>{booking.clients?.name}</TableCell>
                    <TableCell>{`${booking.cars?.make} ${booking.cars?.model}`}</TableCell>
                    <TableCell>{`${new Date(booking.start_date).toLocaleDateString()} to ${new Date(booking.end_date).toLocaleDateString()}`}</TableCell>
                    <TableCell>${Number.parseFloat(booking.total_amount).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          booking.status === "Active"
                            ? "default"
                            : booking.status === "Completed"
                              ? "outline"
                              : "secondary"
                        }
                      >
                        {booking.status}
                      </Badge>
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
