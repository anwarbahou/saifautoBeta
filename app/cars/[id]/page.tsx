import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import NewNavbar from "@/components/landing/NewNavbar";
import NewFooter from "@/components/landing/NewFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Fuel, Cog, CalendarDays, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface CarDetailsData {
  id: string | number;
  make: string;
  model: string;
  name: string;
  type: string;
  year: number | null;
  color: string | null;
  price_per_day: number;
  image_url: string;
  images: string[] | null;
  seats: number | null; // Will be null as it's not in DB
  fuel_type: string | null; // Will be null as it's not in DB
  transmission: string | null; // Will be null as it's not in DB
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
      year: car_data.year,
      color: car_data.color,
      price_per_day: car_data.daily_rate || 0,
      image_url: car_data.primary_image || "/img/cars/car-placeholder.png",
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
  params: { id: string };
}

export default async function CarDetailsPage({ params }: CarDetailsPageProps) {
  const car = await fetchCarDetails(params.id);

  if (!car) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
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
    <div className="flex flex-col min-h-screen bg-background">
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
                <BookingForm car={car} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Car Details */}
          <div className="md:col-span-2">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-lg shadow-xl mb-8 bg-gray-200 dark:bg-gray-700">
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
            <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <p className="text-3xl font-bold text-primary">
                        ${car.price_per_day}
                        <span className="text-lg font-normal text-muted-foreground">/day</span>
                    </p>
                </div>
                <Badge 
                    variant={car.status === 'Rented' ? 'destructive' : 'outline'}
                    className={`text-lg px-4 py-2 whitespace-nowrap ${car.status === 'Available' ? 'border-green-500 text-green-700 dark:border-green-400 dark:text-green-300 bg-green-50 dark:bg-green-900/30' : car.status === 'Rented' ? '' : 'border-yellow-500 text-yellow-700 dark:border-yellow-400 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/30' }`}
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-medium">Seats</span>
                </div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{car.seats || "N/A"}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Fuel className="h-5 w-5 text-primary" />
                  <span className="font-medium">Fuel Type</span>
                </div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{car.fuel_type || "N/A"}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Cog className="h-5 w-5 text-primary" />
                  <span className="font-medium">Transmission</span>
                </div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{car.transmission || "N/A"}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-muted-foreground">
                  {/* Using a generic icon like ListChecks or similar if Car icon is too specific */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-car-taxi-front text-primary"><path d="M10 2h4"/><path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8"/><path d="M7 14h.01"/><path d="M17 14h.01"/><rect width="18" height="8" x="3" y="10" rx="2"/><path d="M5 18v2"/><path d="M19 18v2"/></svg>
                  <span className="font-medium">Type</span>
                </div>
                <Badge variant="outline" className="font-semibold text-base px-3 py-1">{car.type || "N/A"}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-palette text-primary"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/><path d="m10.5 10.5-5 5"/><circle cx="7.5" cy="13.5" r=".5" fill="currentColor"/><circle cx="15.5" cy="8.5" r=".5" fill="currentColor"/></svg>
                  <span className="font-medium">Color</span>
                </div>
                <Badge variant="outline" className="font-semibold text-base px-3 py-1">{car.color || "N/A"}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <span className="font-medium">Year</span>
                </div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{car.year || "N/A"}</span>
              </div>
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

const BookingForm = ({ car }: { car: any }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    pickupDate: "",
    returnDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      // Insert booking into Supabase
      const { data, error } = await supabase.from("bookings").insert([
        {
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          phone: form.phone,
          start_date: form.pickupDate,
          end_date: form.returnDate,
          car_id: car.id,
          car_make: car.make,
          car_model: car.model,
          car_name: car.name,
          car_type: car.type,
          car_year: car.year,
          car_color: car.color,
          car_price_per_day: car.price_per_day,
        },
      ]);
      if (error) {
        setError("Failed to create booking. Please try again.");
        return;
      }
      setSuccess(true);
      toast.success("Booking request sent!");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        pickupDate: "",
        returnDate: "",
      });
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Booking form">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
        <input type="text" id="firstName" name="firstName" autoComplete="given-name" required value={form.firstName} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 focus:ring-primary focus:border-primary" tabIndex={0} aria-label="First Name" />
      </div>
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
        <input type="text" id="lastName" name="lastName" autoComplete="family-name" required value={form.lastName} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 focus:ring-primary focus:border-primary" tabIndex={0} aria-label="Last Name" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
        <input type="email" id="email" name="email" autoComplete="email" required value={form.email} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 focus:ring-primary focus:border-primary" tabIndex={0} aria-label="Email Address" />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
        <input type="tel" id="phone" name="phone" autoComplete="tel" required value={form.phone} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 focus:ring-primary focus:border-primary" tabIndex={0} aria-label="Phone Number" />
      </div>
      <div>
        <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pick-up Date</label>
        <input type="date" id="pickupDate" name="pickupDate" required value={form.pickupDate} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 focus:ring-primary focus:border-primary" tabIndex={0} aria-label="Pick-up Date" />
      </div>
      <div>
        <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Return Date</label>
        <input type="date" id="returnDate" name="returnDate" required value={form.returnDate} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 focus:ring-primary focus:border-primary" tabIndex={0} aria-label="Return Date" />
      </div>
      <Button type="submit" className="w-full text-lg py-3 mt-2" size="lg" disabled={loading} aria-label="Request to Book">
        {loading ? "Submitting..." : "Request to Book"}
      </Button>
      {success && <p className="text-green-600 text-center mt-2" role="status">Booking request sent!</p>}
      {error && <p className="text-red-600 text-center mt-2" role="alert">{error}</p>}
    </form>
  );
}; 