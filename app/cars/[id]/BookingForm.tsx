"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

interface Car {
  id: string | number;
  daily_rate: number;
  name: string;
}

const BookingForm = ({ car }: { car: Car }) => {
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
        return;
      }

      if (existingClient) {
        // Update existing client
        const { data: updatedClient, error: updateError } = await supabase
          .from("clients")
          .update({
            name: `${form.firstName} ${form.lastName}`,
            phone: form.phone,
          })
          .eq('email', form.email)
          .select()
          .single();

        if (updateError) {
          console.error("Error updating existing client:", updateError);
          setError(`Failed to update client profile: ${updateError.message || 'Unknown error'}`);
          return;
        }
        clientId = existingClient.id;
      } else {
        // Create new client
        const { data: newClient, error: insertError } = await supabase
          .from("clients")
          .insert({
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            phone: form.phone,
          })
          .select()
          .single();

        if (insertError) {
          console.error("Error creating new client:", insertError);
          setError(`Failed to create client profile: ${insertError.message || 'Unknown error'}`);
          return;
        }
        clientId = newClient.id;
      }

      if (!clientId) {
        console.error("No client ID available after operation");
        setError("Failed to process client information");
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
      };

      console.log("Creating booking with data:", bookingData);

      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert([bookingData])
        .select();

      if (bookingError) {
        console.error("Booking creation error:", bookingError);
        setError(`Failed to create booking: ${bookingError.message || 'Unknown error'}`);
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
        <input type="date" id="pickupDate" name="pickupDate" required value={form.pickupDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 focus:ring-primary focus:border-primary" tabIndex={0} aria-label="Pick-up Date" />
      </div>
      <div>
        <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Return Date</label>
        <input type="date" id="returnDate" name="returnDate" required value={form.returnDate} onChange={handleChange} min={form.pickupDate || new Date().toISOString().split('T')[0]} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 focus:ring-primary focus:border-primary" tabIndex={0} aria-label="Return Date" />
      </div>
      <Button type="submit" className="w-full text-lg py-3 mt-2" size="lg" disabled={loading} aria-label="Request to Book">
        {loading ? "Submitting..." : "Request to Book"}
      </Button>
      {success && <p className="text-green-600 text-center mt-2" role="status">Booking request sent!</p>}
      {error && <p className="text-red-600 text-center mt-2" role="alert">{error}</p>}
    </form>
  );
};

export default BookingForm; 