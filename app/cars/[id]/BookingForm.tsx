"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/DateTimePicker";

interface Car {
  id: string | number;
  daily_rate: number;
  name: string;
  make: string;
  model: string;
  license_plate?: string;
  licensePlate?: string;
}

interface BookingFormProps {
  car: Car;
  initialPickupDate?: string;
  initialReturnDate?: string;
  initialPickupLocation?: string;
}

const AccordionSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded mb-2 bg-gray-50">
      <button
        type="button"
        className="w-full flex justify-between items-center px-4 py-3 font-semibold text-left text-gray-900 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={title.replace(/\s+/g, "-").toLowerCase() + "-content"}
      >
        {title}
        <span className="ml-2">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div id={title.replace(/\s+/g, "-").toLowerCase() + "-content"} className="px-4 pb-4 text-gray-800 text-sm">
          {children}
        </div>
      )}
    </div>
  );
};

const BookingForm = ({ car, initialPickupDate = "", initialReturnDate = "", initialPickupLocation = "" }: BookingFormProps) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    pickupDate: initialPickupDate,
    returnDate: initialReturnDate,
    pickupLocation: initialPickupLocation,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [rulesInput, setRulesInput] = useState("");
  const [pendingSubmit, setPendingSubmit] = useState<React.FormEvent | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRulesConfirm = async () => {
    setShowRulesModal(false);
    setRulesInput("");
    if (pendingSubmit) {
      await actuallySubmitBooking(pendingSubmit);
      setPendingSubmit(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPendingSubmit(e);
    setShowRulesModal(true);
  };

  const actuallySubmitBooking = async (e: React.FormEvent) => {
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      // Validate dates
      const startDate = new Date(form.pickupDate);
      const endDate = new Date(form.returnDate);
      if (endDate <= startDate) {
        setError("Return date must be after pickup date");
        setLoading(false);
        return;
      }

      console.log("Creating client with data:", {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        phone: form.phone,
      });

      // 1. First try to get existing client
      const { data: existingClient, error: fetchError } = await supabase
        .from("clients")
        .select()
        .eq('email', form.email)
        .single();

      let clientId;

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows returned
        console.error("Error checking for existing client:", fetchError);
        setError(`Failed to check existing client: ${fetchError.message || 'Unknown error'}`);
        setLoading(false);
        return;
      }

      if (existingClient) {
        // Update existing client
        const { error: updateError } = await supabase
          .from("clients")
          .update({
            first_name: form.firstName,
            last_name: form.lastName,
            phone: form.phone,
          })
          .eq('email', form.email)
          .select();

        if (updateError) {
          console.error("Error updating existing client:", JSON.stringify(updateError, null, 2));
          setError(`Failed to update client profile: ${updateError.message || 'Unknown error'}`);
          setLoading(false);
          return;
        }
        clientId = existingClient.id;
      } else {
        // Create new client
        const { data: newClient, error: insertError } = await supabase
          .from("clients")
          .insert({
            first_name: form.firstName,
            last_name: form.lastName,
            email: form.email,
            phone: form.phone,
          })
          .select()
          .single();

        if (insertError) {
          console.error("Error creating new client:", insertError);
          setError(`Failed to create client profile: ${insertError.message || 'Unknown error'}`);
          setLoading(false);
          return;
        }
        clientId = newClient.id;
      }

      if (!clientId) {
        console.error("No client ID available after operation");
        setError("Failed to process client information");
        setLoading(false);
        return;
      }

      console.log("Client processed successfully, ID:", clientId);

      // Calculate total price based on number of days and daily rate
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = days * car.daily_rate;

      // 2. Create booking with correct schema
      const bookingData = {
        car_id: car.id,
        client_id: clientId,
        start_date: form.pickupDate,
        end_date: form.returnDate,
        total_price: totalPrice,
        status: "Confirmed",
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        car_make: car.make,
        car_model: car.model,
        car_license_plate: car.license_plate || car.licensePlate || "",
        pickup_location: form.pickupLocation,
      };

      console.log("Creating booking with data:", bookingData);

      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert([bookingData])
        .select();

      if (bookingError) {
        console.error("Booking creation error:", bookingError);
        setError(`Failed to create booking: ${bookingError.message || 'Unknown error'}`);
        setLoading(false);
        return;
      }

      console.log("Booking created successfully:", booking);

      setSuccess(true);
      toast.success("Booking request sent successfully!");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        pickupDate: "",
        returnDate: "",
        pickupLocation: "",
      });
      router.refresh();
    } catch (err) {
      console.error("Unexpected error:", err);
      setError(`An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 max-[820px]:inset-0 max-[820px]:w-screen max-[820px]:h-screen max-[820px]:items-start max-[820px]:justify-start">
          <div className="bg-white shadow-2xl border border-gray-200 w-full max-w-[800px] p-6 relative max-h-[calc(100vh-4rem)] overflow-y-auto rounded-xl max-[820px]:w-screen max-[820px]:h-screen max-[820px]:rounded-none max-[820px]:p-0 max-[820px]:overflow-y-auto">
            <header className="mb-4">
              <h1 className="text-2xl font-bold text-center mb-1">Official Rental Rules & Laws of Morocco</h1>
              <p className="text-center text-base text-gray-700 italic">Please read carefully before proceeding with your booking</p>
            </header>
            <div className="space-y-2 mb-6">
              <AccordionSection title="General Requirements">
                <ul className="list-disc pl-5 mb-2">
                  <li>Driver must be at least <b>21 years old</b> and hold a valid driver's license for at least 1 year.</li>
                  <li>International drivers require a valid passport and international driving permit.</li>
                  <li>Rental agreements must be signed in person with valid identification.</li>
                </ul>
              </AccordionSection>
              <AccordionSection title="Traffic Laws & Safety">
                <ul className="list-disc pl-5 mb-2">
                  <li>Seat belts are mandatory for all passengers at all times.</li>
                  <li>Driving under the influence of alcohol or drugs is strictly prohibited and subject to severe penalties.</li>
                  <li>Observe all Moroccan traffic laws and posted speed limits (typically 60 km/h in cities, 100 km/h on highways).</li>
                  <li>Use of mobile phones while driving is prohibited unless using a hands-free system.</li>
                </ul>
              </AccordionSection>
              <AccordionSection title="Rental & Return Policies">
                <ul className="list-disc pl-5 mb-2">
                  <li>Return the car with the same fuel level as at pickup; refueling charges may apply.</li>
                  <li>Report any accidents or damages immediately to the rental agency and local authorities.</li>
                  <li>Late returns may incur additional charges.</li>
                  <li>Smoking is not permitted in rental vehicles.</li>
                </ul>
              </AccordionSection>
              <AccordionSection title="Insurance & Liability">
                <ul className="list-disc pl-5 mb-2">
                  <li>Basic insurance is included; additional coverage is available upon request.</li>
                  <li>The renter is responsible for all traffic fines and violations during the rental period.</li>
                  <li>Loss of keys or documents may result in extra charges.</li>
                </ul>
              </AccordionSection>
            </div>
            <footer className="mt-4 mb-2">
              <p className="text-sm text-gray-700">By proceeding, you acknowledge that you have read and understood the official rules and laws governing car rentals in Morocco. Failure to comply may result in penalties or cancellation of your rental agreement.</p>
            </footer>
            <label htmlFor="rulesInput" className="block mt-4 mb-2 font-medium text-gray-900">Type <span className="font-mono bg-gray-100 px-1 rounded">i understand</span> to proceed:</label>
            <input
              id="rulesInput"
              type="text"
              value={rulesInput}
              onChange={e => setRulesInput(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 bg-white text-black focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Acknowledge rules"
              autoFocus
            />
            <Button
              onClick={handleRulesConfirm}
              disabled={rulesInput.trim().toLowerCase() !== "i understand"}
              className="w-full"
              aria-label="Confirm rules and proceed"
            >
              I Understand & Proceed
            </Button>
            <button
              onClick={() => setShowRulesModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
              aria-label="Close rules modal"
              tabIndex={0}
            >
              ×
            </button>
          </div>
        </div>
      )}
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
          <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-1">Pick-up Location</label>
          <input
            type="text"
            id="pickupLocation"
            name="pickupLocation"
            required
            value={form.pickupLocation}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-primary focus:border-primary"
            tabIndex={0}
            aria-label="Pick-up Location"
          />
        </div>
        <div>
          <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-1">Pick-up Date & Time</label>
          <DateTimePicker
            value={form.pickupDate ? new Date(form.pickupDate) : undefined}
            onChange={date => setForm({ ...form, pickupDate: date ? date.toISOString() : "" })}
            disabled={date => date < new Date(new Date().setHours(0,0,0,0))}
          />
        </div>
        <div>
          <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">Return Date & Time</label>
          <DateTimePicker
            value={form.returnDate ? new Date(form.returnDate) : undefined}
            onChange={date => setForm({ ...form, returnDate: date ? date.toISOString() : "" })}
            disabled={date => {
              const pickupDate = form.pickupDate ? new Date(form.pickupDate) : new Date(new Date().setHours(0,0,0,0));
              return date < pickupDate;
            }}
          />
        </div>
        <Button
          id="booking-form-submit"
          type="submit"
          className="w-full text-lg py-3 mt-2"
          size="lg"
          disabled={loading}
          aria-label="Request to Book"
        >
          {loading ? "Submitting..." : "Request to Book"}
        </Button>
        {success && <p className="text-green-600 text-center mt-2" role="status">Booking request sent!</p>}
        {error && <p className="text-red-600 text-center mt-2" role="alert">{error}</p>}
      </form>
    </>
  );
};

export default BookingForm; 