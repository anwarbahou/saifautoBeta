"use client"
import Image from "next/image"
import { /*CalendarIcon,*/ Clock, MapPin } from "lucide-react" // CalendarIcon will come from DateTimePicker
// import { format } from "date-fns" // format is used within DateTimePicker

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar" // Calendar is used within DateTimePicker
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Added Select imports
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover" // Popover is used within DateTimePicker
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Select is removed
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { DateTimePicker } from "@/components/ui/DateTimePicker" // Import the new component
import { useRouter } from 'next/navigation'; // Import useRouter
import { motion } from "framer-motion"

const formSchema = z.object({
  destination: z.string({
    required_error: "Please select a destination.",
    invalid_type_error: "Please select a valid destination.",
  }).min(2, {
    message: "Please select a valid destination.",
  }),
  pickupDateTime: z.date({
    required_error: "Please select a pickup date and time.",
  }),
  dropoffDateTime: z.date({
    required_error: "Please select a return date and time.",
  }),
}).refine(data => data.dropoffDateTime > data.pickupDateTime, {
  message: "Return date and time must be after pickup date and time.",
  path: ["dropoffDateTime"], // specify which field the error is associated with
});

// Renamed function for clarity
export default function NewHeroSection() {
  const router = useRouter(); // Initialize router
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: undefined,
      // pickupDateTime: undefined, // Let placeholder show
      // dropoffDateTime: undefined, // Let placeholder show
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form Submitted! Values:", values);
    const params = new URLSearchParams();
    params.append('destination', values.destination);
    if (values.pickupDateTime) {
      params.append('pickupDateTime', values.pickupDateTime.toISOString());
    }
    if (values.dropoffDateTime) {
      params.append('dropoffDateTime', values.dropoffDateTime.toISOString());
    }
    router.push(`/search?${params.toString()}`);
  }

  return (
    // The hero section should not be fixed height, let content define it or use padding
    <section className="relative w-full overflow-hidden pt-16 md:pt-24 lg:pt-32">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/heroimage.jpg"
          alt="Car rental parking lot with various vehicles"
          fill
          className="object-cover object-center"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-black/50" /> {/* Slightly adjusted overlay for better contrast */}
      </div>

      <div className="container relative z-10 mx-auto px-4 py-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center"
        >
          <div className="flex flex-col justify-center text-white text-center lg:text-left">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl drop-shadow-md">Votre Voyage Commence Ici</h1>
            <p className="mb-8 max-w-xl text-lg text-gray-200 sm:text-xl mx-auto lg:mx-0 drop-shadow-sm">
              Découvrez notre flotte premium et profitez de la liberté de la route avec notre service de location sans tracas.
            </p>
            <div className="flex justify-center lg:justify-start mb-10 lg:mb-0">
              <Button asChild size="lg" className="text-lg font-semibold px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground">
                <a href="#contact">Contactez-nous</a>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md shadow-2xl bg-white/90 backdrop-blur-md">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Réservez Votre Voiture de Rêve</CardTitle>
                <CardDescription>Trouvez le véhicule parfait pour votre aventure</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="destination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Destination</FormLabel>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="pl-10 h-12 text-base w-full">
                                  <SelectValue placeholder="Sélectionnez votre destination" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Casablanca">Casablanca</SelectItem>
                                  <SelectItem value="Casablanca airport">Aéroport de Casablanca</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="pickupDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">Date de départ</FormLabel>
                            <FormControl>
                              <DateTimePicker
                                value={field.value ? new Date(field.value) : undefined}
                                onChange={date => field.onChange(date ? date.toISOString() : "")}
                                disabled={date => date < new Date(new Date().setHours(0,0,0,0))}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="returnDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">Date de retour</FormLabel>
                            <FormControl>
                              <DateTimePicker
                                value={field.value ? new Date(field.value) : undefined}
                                onChange={date => field.onChange(date ? date.toISOString() : "")}
                                disabled={date => date < new Date(new Date().setHours(0,0,0,0))}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full text-base font-semibold">
                      Rechercher
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 