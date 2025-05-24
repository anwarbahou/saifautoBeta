"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getRecentBookings } from "@/lib/actions"
import { useToast } from "@/components/ui/use-toast"

export function RecentBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadBookings() {
      try {
        const data = await getRecentBookings(5)
        setBookings(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load recent bookings",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [toast])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
        <CardDescription>Latest bookings in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Car</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  Loading bookings...
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  No recent bookings
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">B-{booking.id.toString().padStart(4, "0")}</TableCell>
                  <TableCell>{booking.clients?.name}</TableCell>
                  <TableCell>{`${booking.cars?.make} ${booking.cars?.model}`}</TableCell>
                  <TableCell>{`${new Date(booking.start_date).toLocaleDateString()} to ${new Date(booking.end_date).toLocaleDateString()}`}</TableCell>
                  <TableCell>
                    <Badge variant={booking.status === "Active" ? "default" : "secondary"}>{booking.status}</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
