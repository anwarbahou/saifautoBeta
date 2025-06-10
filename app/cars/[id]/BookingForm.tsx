"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { sendBookingConfirmationEmail } from "@/app/api/Resend/ResendClient";

interface Car {
  id: string | number;
  daily_rate: number;
  name: string;
  make: string;
  model: string;
  license_plate?: string;
  licensePlate?: string;
  year?: number;
  color?: string | null;
  category: string | null;
  features: string[] | null;
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
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        setError("Veuillez entrer une adresse email valide");
        setLoading(false);
        return;
      }

      // Validate dates
      const startDate = new Date(form.pickupDate);
      const endDate = new Date(form.returnDate);
      if (endDate <= startDate) {
        setError("Return date must be after pickup date");
        setLoading(false);
        return;
      }

      // Send booking data to API route
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          phone: form.phone,
          pickup_location: form.pickupLocation,
          dropoff_location: '', // Add dropoff if you have it
          start_date: form.pickupDate,
          end_date: form.returnDate,
          car_id: car.id,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || 'Booking failed');
        setLoading(false);
        return;
      }

      setSuccess(true);
      toast.success("Booking request sent successfully!");

      // Send confirmation email
      try {
        const emailResponse = await fetch('/api/send-confirmation-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerName: `${form.firstName} ${form.lastName}`,
            carDetails: {
              make: car.make,
              model: car.model,
              year: car.year,
              licensePlate: car.license_plate || car.licensePlate
            },
            bookingDetails: {
              pickupDate: form.pickupDate,
              returnDate: form.returnDate,
              pickupLocation: form.pickupLocation,
              totalPrice: car.daily_rate ? `${car.daily_rate * Math.ceil((new Date(form.returnDate).getTime() - new Date(form.pickupDate).getTime()) / (1000 * 60 * 60 * 24))}` : undefined
            },
            customerDetails: {
              email: form.email,
              phone: form.phone
            }
          })
        });

        const emailResult = await emailResponse.json();

        if (!emailResult.success) {
          console.error('Failed to send confirmation email:', emailResult.error);
          toast.error("Votre réservation est confirmée, mais l'email de confirmation n'a pas pu être envoyé. Notre équipe vous contactera sous peu.");
        } else {
          toast.success("Un email de confirmation vous a été envoyé!");
        }
      } catch (error) {
        console.error('Error sending confirmation email:', error);
        toast.error("Votre réservation est confirmée, mais l'email de confirmation n'a pas pu être envoyé. Notre équipe vous contactera sous peu.");
      }

      // ---- START: Added Twilio Notification ----
      try {
        const fullName = `${form.firstName} ${form.lastName}`.trim();
        const serviceType = car.category || car.name || "Not specified"; // Fallback for serviceType

        const twilioResponse = await fetch('/api/sendBooking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: fullName,
            phone: form.phone,
            bookingDate: form.pickupDate, // This is already in YYYY-MM-DD string format from the form
            returnDate: form.returnDate, // Added returnDate
            serviceType: serviceType,
          }),
        });

        if (twilioResponse.ok) {
          try {
            const twilioResult = await twilioResponse.json();
            console.log('Twilio message sent successfully:', twilioResult.sid);
          } catch (jsonError) {
            console.error('Failed to parse successful Twilio JSON response:', jsonError);
            const responseText = await twilioResponse.text(); // Get text for successful but non-JSON response
            console.error('Raw successful Twilio response text:', responseText);
          }
        } else {
          const responseText = await twilioResponse.text(); // Get raw text first
          console.error('Failed to send Twilio message. Status:', twilioResponse.status, 'Raw Response Text:', responseText);
          try {
            const twilioErrorResult = JSON.parse(responseText); // Attempt to parse if it might be JSON despite error status
            console.error('Parsed Twilio error from response text:', twilioErrorResult.error);
          } catch (parseError) {
            console.error('Failed to parse Twilio error response text as JSON. It was likely HTML.');
          }
          // Optional: Show a non-blocking toast for Twilio failure
          // toast.error("Notification could not be sent, but your booking is confirmed.");
        }
      } catch (twilioError) {
        console.error('Error sending Twilio message:', twilioError);
        // Optional: Show a non-blocking toast for Twilio failure
        // toast.error("Notification could not be sent due to an unexpected error, but your booking is confirmed.");
      }
      // ---- END: Added Twilio Notification ----

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        pickupDate: "",
        returnDate: "",
        pickupLocation: "",
      });
      // Redirect to confirmation page with booking details
      const params = new URLSearchParams({
        car: `${car.make} ${car.model}`,
        carMake: car.make || '',
        carModel: car.model || '',
        carYear: car.year ? String(car.year) : '',
        carColor: car.color || '',
        carLicensePlate: car.license_plate || car.licensePlate || '',
        carCategory: car.category || '',
        carFeatures: Array.isArray(car.features) ? car.features.join(',') : '',
        pickupDate: form.pickupDate,
        returnDate: form.returnDate,
        pickupLocation: form.pickupLocation,
        totalPrice: '', // You can recalculate if needed
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
      });
      router.push(`/confirmation?${params.toString()}`);
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
      <Dialog open={showRulesModal} onOpenChange={setShowRulesModal}>
        <DialogContent className="max-w-[800px] w-full p-6 max-h-[calc(100vh-4rem)] overflow-y-auto rounded-xl">
          <DialogTitle>Official Rental Rules & Laws of Morocco</DialogTitle>
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
        </DialogContent>
      </Dialog>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 rounded bg-green-50 border border-green-200 text-green-600 text-sm">
            Votre demande de réservation a été envoyée avec succès !
          </div>
        )}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom</label>
          <input type="text" id="firstName" name="firstName" autoComplete="given-name" required value={form.firstName} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 focus:ring-primary focus:border-primary" tabIndex={0} aria-label="Prénom" />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
          <input type="text" id="lastName" name="lastName" autoComplete="family-name" required value={form.lastName} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 focus:ring-primary focus:border-primary" tabIndex={0} aria-label="Nom" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input type="email" id="email" name="email" autoComplete="email" required value={form.email} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 focus:ring-primary focus:border-primary" tabIndex={0} aria-label="Email" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone</label>
          <input type="tel" id="phone" name="phone" autoComplete="tel" required value={form.phone} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 focus:ring-primary focus:border-primary" tabIndex={0} aria-label="Téléphone" />
        </div>
        <div>
          <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-1">Lieu de prise en charge</label>
          <input
            type="text"
            id="pickupLocation"
            name="pickupLocation"
            required
            value={form.pickupLocation}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-primary focus:border-primary"
            tabIndex={0}
            aria-label="Lieu de prise en charge"
          />
        </div>
        <div>
          <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-1">Date et heure de prise en charge</label>
          <DateTimePicker
            value={form.pickupDate ? new Date(form.pickupDate) : undefined}
            onChange={date => setForm({ ...form, pickupDate: date ? date.toISOString() : "" })}
            disabled={date => date < new Date(new Date().setHours(0,0,0,0))}
          />
        </div>
        <div>
          <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">Date et heure de retour</label>
          <DateTimePicker
            value={form.returnDate ? new Date(form.returnDate) : undefined}
            onChange={date => setForm({ ...form, returnDate: date ? date.toISOString() : "" })}
            disabled={date => {
              const pickupDate = form.pickupDate ? new Date(form.pickupDate) : null;
              return date < (pickupDate || new Date());
            }}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            "Réserver maintenant"
          )}
        </Button>
      </form>
    </>
  );
};

export default BookingForm; 