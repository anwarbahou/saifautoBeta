"use client";

import { useState, useEffect } from "react";
import {
  PrinterIcon as Print,
  Calendar,
  MapPin,
  User,
  Car,
  Clock,
  CreditCard,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface UserInfo {
  name?: string;
  email?: string;
  phone?: string;
  licenseNumber?: string;
}

interface CarInfo {
  make?: string;
  model?: string;
  year?: string;
  color?: string;
  licensePlate?: string;
  category?: string;
  features?: string[];
}

interface BookingDetails {
  pickupDate?: string;
  pickupTime?: string;
  returnDate?: string;
  returnTime?: string;
  pickupLocation?: string;
  returnLocation?: string;
  duration?: string;
  totalAmount?: string;
  paymentMethod?: string;
}

interface BookingState {
  bookingId?: string;
  user: UserInfo;
  car: CarInfo;
  booking: BookingDetails;
}

export default function BookingConfirmation() {
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState<BookingState>({
    bookingId: undefined,
    user: {},
    car: {},
    booking: {},
  });

  useEffect(() => {
    setBooking({
      bookingId: searchParams.get("bookingId") || undefined,
      user: {
        name: searchParams.get("firstName") && searchParams.get("lastName") ? `${searchParams.get("firstName")} ${searchParams.get("lastName")}` : searchParams.get("firstName") || undefined,
        email: searchParams.get("email") || undefined,
        phone: searchParams.get("phone") || undefined,
        licenseNumber: searchParams.get("licenseNumber") || undefined,
      },
      car: {
        make: searchParams.get("carMake") || searchParams.get("car")?.split(" ")[0] || undefined,
        model: searchParams.get("carModel") || searchParams.get("car")?.split(" ")[1] || undefined,
        year: searchParams.get("carYear") || undefined,
        color: searchParams.get("carColor") || undefined,
        licensePlate: searchParams.get("carLicensePlate") || undefined,
        category: searchParams.get("carCategory") || undefined,
        features: searchParams.get("carFeatures") ? searchParams.get("carFeatures")!.split(",") : undefined,
      },
      booking: {
        pickupDate: searchParams.get("pickupDate") || undefined,
        pickupTime: searchParams.get("pickupTime") || undefined,
        returnDate: searchParams.get("returnDate") || undefined,
        returnTime: searchParams.get("returnTime") || undefined,
        pickupLocation: searchParams.get("pickupLocation") || undefined,
        returnLocation: searchParams.get("returnLocation") || undefined,
        duration: searchParams.get("duration") || (searchParams.get("pickupDate") && searchParams.get("returnDate") ? `${Math.ceil((new Date(searchParams.get("returnDate")!).getTime() - new Date(searchParams.get("pickupDate")!).getTime()) / (1000 * 60 * 60 * 24))} days` : undefined),
        totalAmount: searchParams.get("totalPrice") ? `${searchParams.get("totalPrice") + " MAD"}` : undefined,
        paymentMethod: searchParams.get("paymentMethod") || undefined,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white text-black py-8 px-4 print:bg-white print:py-0" data-theme="light">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 print:mb-6">
          <h1 className="text-3xl font-bold text-black mb-2">Booking Confirmed!</h1>
          <p className="text-black">Your car rental has been successfully booked</p>
          {booking.bookingId && (
            <div className="mt-4">
              <Badge variant="secondary" className="text-lg px-4 py-2 bg-primary/10 text-primary border-primary/20">
                Booking ID: <span className="font-bold">{booking.bookingId}</span>
              </Badge>
            </div>
          )}
        </div>

        {/* Print Button */}
        <div className="flex justify-end mb-6 print:hidden">
          <Button onClick={handlePrint} className="gap-2 bg-primary text-white hover:bg-primary/90">
            <Print className="w-4 h-4" />
            Print Confirmation
          </Button>
        </div>

        {/* Details Grid */}
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 items-start">
          {/* Left: Customer & Booking Info */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-black flex items-center gap-2 mb-2">
                <User className="w-5 h-5" /> Customer
              </h2>
              <div className="text-base">
                {booking.user.name && <div className="font-bold text-black">{booking.user.name}</div>}
                {booking.user.email && <div className="text-black">{booking.user.email}</div>}
                {booking.user.phone && <div className="text-black">{booking.user.phone}</div>}
                {booking.user.licenseNumber && <div className="text-black">License: {booking.user.licenseNumber}</div>}
              </div>
            </div>
            <Separator className="bg-primary/10" />
            <div>
              <h2 className="text-xl font-bold text-black flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5" /> Booking
              </h2>
              <div className="text-base">
                {booking.booking.pickupDate && (
                  <div><span className="font-bold">Pickup:</span> {booking.booking.pickupDate} {booking.booking.pickupTime}</div>
                )}
                {booking.booking.returnDate && (
                  <div><span className="font-bold">Return:</span> {booking.booking.returnDate} {booking.booking.returnTime}</div>
                )}
                {booking.booking.pickupLocation && (
                  <div><span className="font-bold">Pickup Location:</span> {booking.booking.pickupLocation}</div>
                )}
                {booking.booking.returnLocation && (
                  <div><span className="font-bold">Return Location:</span> {booking.booking.returnLocation}</div>
                )}
                {booking.booking.duration && (
                  <div><span className="font-bold">Duration:</span> {booking.booking.duration}</div>
                )}
                {booking.booking.totalAmount && (
                  <div><span className="font-bold">Total:</span> <span className="text-green-600 font-bold">{booking.booking.totalAmount}</span></div>
                )}
                {booking.booking.paymentMethod && (
                  <div><span className="font-bold">Payment:</span> <span className="font-mono">{booking.booking.paymentMethod}</span></div>
                )}
              </div>
            </div>
          </div>
          {/* Right: Car Info */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-black flex items-center gap-2 mb-2">
                <Car className="w-5 h-5" /> Vehicle
              </h2>
              <div className="text-base">
                {(booking.car.year || booking.car.make || booking.car.model) && (
                  <div className="font-bold text-black">{[booking.car.year, booking.car.make, booking.car.model].filter(Boolean).join(" ")}</div>
                )}
                {booking.car.color && <div className="text-black"><span className="font-bold">Color:</span> {booking.car.color}</div>}
                {booking.car.licensePlate && <div className="text-black"><span className="font-bold">License Plate:</span> <span className="font-mono">{booking.car.licensePlate}</span></div>}
                {booking.car.category && <div className="text-black"><span className="font-bold">Category:</span> {booking.car.category}</div>}
                {booking.car.features && booking.car.features.length > 0 && (
                  <div className="mt-2"><span className="font-bold">Features:</span> {booking.car.features.map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-primary/10 text-primary ml-1">{feature}</Badge>
                  ))}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-black text-sm print:mt-6">
          <p>Thank you for choosing our car rental service!</p>
          <p>For any questions or changes, please contact us at support@carrental.com or (555) 123-4567</p>
        </div>
      </div>
    </div>
  );
} 