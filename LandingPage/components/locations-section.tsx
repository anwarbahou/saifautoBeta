import Image from "next/image"
import { MapPin } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

const locations = [
  {
    id: 1,
    city: "New York",
    address: "123 Broadway, New York, NY 10001",
    image: "/placeholder.svg?height=200&width=350",
    phone: "+1 (212) 555-1234",
    hours: "Mon-Sun: 7:00 AM - 10:00 PM",
  },
  {
    id: 2,
    city: "Los Angeles",
    address: "456 Hollywood Blvd, Los Angeles, CA 90028",
    image: "/placeholder.svg?height=200&width=350",
    phone: "+1 (323) 555-6789",
    hours: "Mon-Sun: 7:00 AM - 10:00 PM",
  },
  {
    id: 3,
    city: "Chicago",
    address: "789 Michigan Ave, Chicago, IL 60611",
    image: "/placeholder.svg?height=200&width=350",
    phone: "+1 (312) 555-9012",
    hours: "Mon-Sun: 7:00 AM - 10:00 PM",
  },
  {
    id: 4,
    city: "Miami",
    address: "101 Ocean Drive, Miami, FL 33139",
    image: "/placeholder.svg?height=200&width=350",
    phone: "+1 (305) 555-3456",
    hours: "Mon-Sun: 7:00 AM - 10:00 PM",
  },
]

export default function LocationsSection() {
  return (
    <section id="locations" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Our Locations</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            With convenient locations across the country, DriveEasy makes it easy to pick up and drop off your rental
            car.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {locations.map((location) => (
            <Card key={location.id} className="overflow-hidden">
              <div className="relative h-40 w-full">
                <Image src={location.image || "/placeholder.svg"} alt={location.city} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white">{location.city}</h3>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm">{location.address}</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold">Phone:</p>
                    <p>{location.phone}</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold">Hours:</p>
                    <p>{location.hours}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
