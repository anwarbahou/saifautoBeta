import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import NewNavbar from "@/components/landing/NewNavbar";
import NewFooter from "@/components/landing/NewFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, DollarSign, CheckCircle, XCircle, Palette, Tag } from "lucide-react";
import BookingForm from "./BookingForm";
import { SearchParams } from "@/lib/types";

interface CarDetailsData {
  id: string | number;
  make: string;
  model: string;
  name: string;
  type: string;
  year: number | undefined;
  color: string | null;
  daily_rate: number;
  image_url: string;
  images: string[] | null;
  seats: number | null;
  fuel_type: string | null;
  transmission: string | null;
  status: string | null;
}

async function fetchCarDetails(id: string): Promise<CarDetailsData | null> {
  try {
    const { data: car_data, error } = await supabase
      .from('cars')
      // Removed seats, fuel_type, transmission from select as they don't exist
      .select('id, make, model, year, color, category, daily_rate, primary_image, images, status') 
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching car details for ID ${id}:`, error);
      // Add more detailed logging from the error object if available
      if (error.message) console.error("Supabase error message:", error.message);
      if (error.details) console.error("Supabase error details:", error.details);
      if (error.hint) console.error("Supabase error hint:", error.hint);
      return null;
    }
    if (!car_data) {
      console.warn(`No car found with ID ${id}.`);
      return null;
    }

    return {
      id: car_data.id,
      make: car_data.make || "Unknown Make",
      model: car_data.model || "Unknown Model",
      name: `${car_data.make || ''} ${car_data.model || ''}`.trim() || "Unknown Car",
      type: car_data.category || "N/A",
      year: car_data.year ?? undefined,
      color: car_data.color,
      daily_rate: car_data.daily_rate || 0,
      image_url: car_data.primary_image,
      images: car_data.images,
      seats: null, // Explicitly null as not fetched
      fuel_type: null, // Explicitly null as not fetched
      transmission: null, // Explicitly null as not fetched
      status: car_data.status,
    };
  } catch (err) {
    console.error(`Exception during fetchCarDetails for ID ${id}:`, err);
    return null;
  }
}

interface CarDetailsPageProps {
  params?: Promise<{ id: string }>;
  searchParams?: Promise<SearchParams>;
}

export default async function CarDetailsPage({ params, searchParams }: CarDetailsPageProps) {
  const resolvedParams = params ? await params : { id: '' };
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const car = await fetchCarDetails(resolvedParams.id);

  // Get the dates from URL parameters
  const pickupDateTime = resolvedSearchParams.pickupDateTime ? new Date(resolvedSearchParams.pickupDateTime) : null;
  const dropoffDateTime = resolvedSearchParams.dropoffDateTime ? new Date(resolvedSearchParams.dropoffDateTime) : null;

  const pickupLocationRaw = resolvedSearchParams.destination || resolvedSearchParams.pickup_location || "";
  const pickupLocation = Array.isArray(pickupLocationRaw) ? pickupLocationRaw[0] : pickupLocationRaw;

  if (!car) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <NewNavbar />
        <main className="flex-grow container mx-auto px-4 py-12 md:py-16 flex items-center justify-center">
          <div className="text-center">
            <XCircle className="h-24 w-24 mx-auto text-destructive mb-4" />
            <h1 className="text-3xl font-bold mb-2">Car Not Found</h1>
            <p className="text-muted-foreground mb-6">Sorry, we couldn't find details for this car.</p>
            <Button asChild>
              <Link href="/fleet">Back to Fleet</Link>
            </Button>
          </div>
        </main>
        <NewFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NewNavbar />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column: Booking Form */}
          <div className="md:col-span-1">
            <Card className="shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <CalendarDays className="h-6 w-6 mr-3 text-primary" />
                  Book This Car
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Complete your details to request a booking for the {car.name}.
                </p>
                <BookingForm 
                  car={car} 
                  initialPickupDate={pickupDateTime ? pickupDateTime.toISOString().split('T')[0] : ''} 
                  initialReturnDate={dropoffDateTime ? dropoffDateTime.toISOString().split('T')[0] : ''} 
                  initialPickupLocation={pickupLocation}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Car Details */}
          <div className="md:col-span-2">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-lg shadow-xl mb-8 bg-gray-200">
              <Image
                src={car.image_url || "/img/cars/car-placeholder.png"}
                alt={`Image of ${car.name}`}
                width={1200}
                height={675}
                className="object-cover w-full h-full"
                priority // Prioritize loading the main car image
              />
            </div>
            
            {/* Price and Status */}
            <div className="mb-8 p-4 bg-gray-100 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <p className="text-3xl font-bold text-primary">
                        {car.daily_rate} MAD
                        <span className="text-lg font-normal text-muted-foreground">/day</span>
                    </p>
                </div>
                <Badge 
                    variant={car.status === 'Rented' ? 'destructive' : 'outline'}
                    className={`text-lg px-4 py-2 whitespace-nowrap ${car.status === 'Available' ? 'border-green-500 text-green-700 bg-green-50' : car.status === 'Rented' ? '' : 'border-yellow-500 text-yellow-700 bg-yellow-50' }`}
                >
                    {car.status === 'Available' && <CheckCircle className="h-5 w-5 mr-2" />}
                    {/* For 'Rented', destructive variant already implies an issue, no specific icon needed unless desired */}
                    {car.status !== 'Available' && car.status !== 'Rented' &&  <XCircle className="h-5 w-5 mr-2" />}
                    {car.status || 'Status N/A'}
                </Badge>
            </div>

            {/* Car Name, Type, and Model/Year - Moved here */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-1">{car.name}</h1>
              <p className="text-lg text-muted-foreground">
                {car.type} &bull; {car.model} {car.year ? `(${car.year})` : ''}
              </p>
            </div>

            <h2 className="text-2xl font-semibold mb-6 border-b pb-3">Specifications</h2>
            <div className="space-y-5">
              {car.type && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Tag className="h-5 w-5 text-primary" />
                    <span className="font-medium">Type</span>
                  </div>
                  <Badge variant="outline" className="font-semibold text-base px-3 py-1">{car.type}</Badge>
                </div>
              )}

              {car.color && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Palette className="h-5 w-5 text-primary" />
                    <span className="font-medium">Color</span>
                  </div>
                  <Badge variant="outline" className="font-semibold text-base px-3 py-1">{car.color}</Badge>
                </div>
              )}

              {car.year && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    <span className="font-medium">Year</span>
                  </div>
                  <span className="font-semibold text-gray-800">{car.year}</span>
                </div>
              )}
            </div>
            
            {/* Placeholder for Description or more features */}
            {/* {car.description && (
              <>
                <h2 className="text-2xl font-semibold mt-8 mb-4 border-b pb-2">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{car.description}</p>
              </>
            )} */}
          </div>
        </div>
      </main>
      <NewFooter />
    </div>
  );
} 