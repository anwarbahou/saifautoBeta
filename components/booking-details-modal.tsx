"use client";

import {
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog"; // Assuming these are shadcn/ui dialog components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarEvent } from "../app/dashboard/calendar/page"; // Adjust path as necessary
import { format as formatDate } from 'date-fns';

interface BookingDetailsModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingDetailsModal({ event, isOpen, onClose }: BookingDetailsModalProps) {
  if (!event || !event.resource) {
    return null;
  }

  const booking = event.resource; // Original booking data stored in the event resource
  const clientName = booking.clients?.name || `${booking.clients?.first_name || ''} ${booking.clients?.last_name || ''}`.trim() || "N/A";
  const carName = booking.cars ? `${booking.cars.make || ''} ${booking.cars.model || ''}`.trim() : "N/A";
  const carLicensePlate = booking.cars?.license_plate || "N/A";

  const getStatusBadgeVariant = (status: string | undefined) => {
    switch (status) {
      case "Confirmed":
      case "Active":
        return "default"; // Typically green in shadcn/ui
      case "Completed":
        return "secondary"; // Typically gray
      case "Pending":
        return "outline"; // Check your theme, might be yellow-ish
      case "Cancelled":
        return "destructive"; // Typically red
      default:
        return "secondary";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Booking Details - ID: {booking.id}</DialogTitle>
          <DialogDescription>
            Detailed information for the selected booking.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-semibold text-sm">Status:</span>
            <div className="col-span-2">
                {booking.status && <Badge variant={getStatusBadgeVariant(booking.status)}>{booking.status}</Badge>}
            </div>
          </div>
          <hr />
          <h4 className="font-semibold text-md mb-[-10px]">Client Information</h4>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm">Name:</span>
            <span className="col-span-2 text-sm">{clientName}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm">Email:</span>
            <span className="col-span-2 text-sm">{booking.clients?.email || "N/A"}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm">Phone:</span>
            <span className="col-span-2 text-sm">{booking.clients?.phone || "N/A"}</span>
          </div>
          <hr />
          <h4 className="font-semibold text-md mb-[-10px]">Car Information</h4>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm">Car:</span>
            <span className="col-span-2 text-sm">{carName}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm">License Plate:</span>
            <span className="col-span-2 text-sm">{carLicensePlate}</span>
          </div>
          <hr />
          <h4 className="font-semibold text-md mb-[-10px]">Booking Period & Price</h4>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm">Start Date:</span>
            <span className="col-span-2 text-sm">{formatDate(new Date(event.start), 'PPP p')}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm">End Date:</span>
            <span className="col-span-2 text-sm">{formatDate(new Date(event.end), 'PPP p')}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm">Total Price:</span>
            <span className="col-span-2 text-sm font-semibold">
              {booking.total_price ? `${parseFloat(booking.total_price).toFixed(2)} MAD` : "N/A"}
            </span>
          </div>

        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 