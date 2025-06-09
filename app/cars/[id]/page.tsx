import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import NewNavbar from "@/components/landing/NewNavbar";
import NewFooter from "@/components/landing/NewFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, DollarSign, CheckCircle, XCircle, Palette, Tag, Users, Cog, Fuel } from "lucide-react";
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
  category: string | null;
  primary_image: string;
  features: string[] | null;
}

async function fetchCarDetails(id: string): Promise<CarDetailsData | null> {
  try {
    const { data: car_data, error } = await supabase
      .from('cars')
      // Removed seats, fuel_type, transmission from select as they don't exist
      .select('id, make, model, year, color, category, daily_rate, primary_image, images, status, features') 
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
      category: car_data.category,
      primary_image: car_data.primary_image,
      features: car_data.features,
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
            <h1 className="text-3xl font-bold mb-2">Voiture Non Trouvée</h1>
            <p className="text-muted-foreground mb-6">Désolé, nous n'avons pas pu trouver les détails de cette voiture.</p>
            <Button asChild>
              <Link href="/fleet">Retour à la Flotte</Link>
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
                  Réserver Cette Voiture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Complétez vos informations pour demander une réservation pour la {car.name}.
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
            <div className="grid gap-8">
              {/* Car Images */}
              <div className="aspect-[16/9] relative rounded-lg overflow-hidden bg-muted">
                <Image
                  src={car.primary_image || "/img/cars/car-placeholder.png"}
                  alt={car.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Car Info */}
              <div className="grid gap-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{car.name}</h1>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-sm">
                      {car.category || "Non spécifié"}
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      Année {car.year || "Non spécifiée"}
                    </Badge>
                    {car.color && (
                      <Badge variant="outline" className="text-sm flex items-center gap-1">
                        <Palette className="h-3 w-3" />
                        {car.color}
                      </Badge>
                    )}
                    {car.status && (
                      <Badge variant={car.status === "Available" ? "default" : "secondary"} className="text-sm">
                        {car.status === "Available" ? "Disponible" : "Non disponible"}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 text-2xl font-bold">
                  <DollarSign className="h-6 w-6 text-primary" />
                  {car.daily_rate} MAD
                  <span className="text-base font-normal text-muted-foreground">/jour</span>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {car.seats && (
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span>{car.seats} Places</span>
                    </div>
                  )}
                  {car.fuel_type && (
                    <div className="flex items-center gap-2">
                      <Fuel className="h-5 w-5 text-primary" />
                      <span>{car.fuel_type}</span>
                    </div>
                  )}
                  {car.transmission && (
                    <div className="flex items-center gap-2">
                      <Cog className="h-5 w-5 text-primary" />
                      <span>{car.transmission}</span>
                    </div>
                  )}
                </div>

                {/* Features List */}
                {car.features && car.features.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Caractéristiques</h2>
                    <div className="grid grid-cols-2 gap-2">
                      {car.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <NewFooter />
    </div>
  );
} 