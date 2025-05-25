import Image from "next/image"
import { MapPin, Phone, Clock } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

// Placeholder data - consider fetching this from a CMS or API in a real application
const locations = [
  {
    id: 1,
    city: "New York",
    address: "123 Broadway, New York, NY 10001",
    image: "/img/locations/new-york.jpg", // Placeholder path
    phone: "+1 (212) 555-1234",
    hours: "Mon-Sun: 7:00 AM - 10:00 PM",
  },
  {
    id: 2,
    city: "Los Angeles",
    address: "456 Hollywood Blvd, Los Angeles, CA 90028",
    image: "/img/locations/los-angeles.jpg", // Placeholder path
    phone: "+1 (323) 555-6789",
    hours: "Mon-Sun: 7:00 AM - 10:00 PM",
  },
  {
    id: 3,
    city: "Chicago",
    address: "789 Michigan Ave, Chicago, IL 60611",
    image: "/img/locations/chicago.jpg", // Placeholder path
    phone: "+1 (312) 555-9012",
    hours: "Mon-Sun: 7:00 AM - 10:00 PM",
  },
  {
    id: 4,
    city: "Miami",
    address: "101 Ocean Drive, Miami, FL 33139",
    image: "/img/locations/miami.jpg", // Placeholder path
    phone: "+1 (305) 555-3456",
    hours: "Mon-Sun: 7:00 AM - 10:00 PM",
  },
]

export default function NewLocationsSection() {
  return (
    <section id="locations" className="py-16 md:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">Our Locations</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            With convenient locations across the country, DriveEasy makes it easy to pick up and drop off your rental car.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {locations.map((location) => (
            <Card key={location.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg flex flex-col">
              <div className="relative h-48 w-full">
                <Image 
                  src={location.image || "/img/locations/placeholder-location.jpg"} 
                  alt={location.city} 
                  fill 
                  className="object-cover" 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end justify-start p-4">
                  <h3 className="text-2xl font-semibold text-white drop-shadow-md">{location.city}</h3>
                </div>
              </div>
              <CardContent className="p-6 flex-grow flex flex-col gap-3 bg-white dark:bg-gray-800">
                <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{location.address}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <span>{location.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <span>{location.hours}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 