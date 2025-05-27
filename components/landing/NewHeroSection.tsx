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
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col justify-center text-white text-center lg:text-left">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl drop-shadow-md">Your Journey Begins Here</h1>
            <p className="mb-8 max-w-xl text-lg text-gray-200 sm:text-xl mx-auto lg:mx-0 drop-shadow-sm">
              Discover our premium fleet and enjoy the freedom of the open road with our hassle-free rental service.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10 lg:mb-0">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-medium">24/7 Support</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-medium">100+ Locations</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md shadow-2xl bg-white/90 backdrop-blur-md dark:bg-gray-900/90">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Book Your Dream Car</CardTitle>
                <CardDescription>Find the perfect vehicle for your adventure</CardDescription>
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
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" /> {/* Added z-10 */}
                            <FormControl>
                              {/* <Input placeholder="Enter your destination" {...field} className="pl-10 h-12 text-base" /> */}
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="pl-10 h-12 text-base w-full">
                                  <SelectValue placeholder="Select your destination" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Casablanca">Casablanca</SelectItem>
                                  <SelectItem value="Casablanca airport">Casablanca airport</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="pickupDateTime"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="font-semibold">Pickup Date & Time</FormLabel>
                            <FormControl>
                              <DateTimePicker
                                value={field.value}
                                onChange={field.onChange}
                                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dropoffDateTime"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="font-semibold">Return Date & Time</FormLabel>
                            <FormControl>
                              <DateTimePicker
                                value={field.value}
                                onChange={field.onChange}
                                disabled={(date) => {
                                  const pickupDateTime = form.getValues("pickupDateTime");
                                  const today = new Date(new Date().setHours(0,0,0,0));
                                  if (pickupDateTime) {
                                    // Prevent selecting a date/time before or on the same day as pickupDateTime,
                                    // or a time on the same day that is earlier than pickupDateTime's time.
                                    return date < pickupDateTime;
                                  }
                                  return date < today;
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Removed the old date/time pickers that were in two separate rows */}

                    <Button type="submit" className="w-full h-12 text-lg font-semibold">
                      Search Available Cars
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
} 