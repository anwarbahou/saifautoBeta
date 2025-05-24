import Image from "next/image"
import { Car, Fuel, Users, Zap } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const carCategories = [
  {
    id: "economy",
    name: "Economy",
    cars: [
      {
        id: "car1",
        name: "Toyota Corolla",
        price: 45,
        image: "/placeholder.svg?height=200&width=350",
        seats: 5,
        transmission: "Automatic",
        fuelType: "Hybrid",
      },
      {
        id: "car2",
        name: "Honda Civic",
        price: 48,
        image: "/placeholder.svg?height=200&width=350",
        seats: 5,
        transmission: "Automatic",
        fuelType: "Gasoline",
      },
      {
        id: "car3",
        name: "Hyundai Elantra",
        price: 42,
        image: "/placeholder.svg?height=200&width=350",
        seats: 5,
        transmission: "Automatic",
        fuelType: "Gasoline",
      },
    ],
  },
  {
    id: "suv",
    name: "SUV",
    cars: [
      {
        id: "car4",
        name: "Toyota RAV4",
        price: 65,
        image: "/placeholder.svg?height=200&width=350",
        seats: 5,
        transmission: "Automatic",
        fuelType: "Hybrid",
      },
      {
        id: "car5",
        name: "Honda CR-V",
        price: 68,
        image: "/placeholder.svg?height=200&width=350",
        seats: 5,
        transmission: "Automatic",
        fuelType: "Gasoline",
      },
      {
        id: "car6",
        name: "Ford Explorer",
        price: 75,
        image: "/placeholder.svg?height=200&width=350",
        seats: 7,
        transmission: "Automatic",
        fuelType: "Gasoline",
      },
    ],
  },
  {
    id: "luxury",
    name: "Luxury",
    cars: [
      {
        id: "car7",
        name: "Mercedes-Benz E-Class",
        price: 120,
        image: "/placeholder.svg?height=200&width=350",
        seats: 5,
        transmission: "Automatic",
        fuelType: "Hybrid",
      },
      {
        id: "car8",
        name: "BMW 5 Series",
        price: 125,
        image: "/placeholder.svg?height=200&width=350",
        seats: 5,
        transmission: "Automatic",
        fuelType: "Gasoline",
      },
      {
        id: "car9",
        name: "Audi A6",
        price: 115,
        image: "/placeholder.svg?height=200&width=350",
        seats: 5,
        transmission: "Automatic",
        fuelType: "Gasoline",
      },
    ],
  },
]

export default function FleetSection() {
  return (
    <section id="fleet" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Explore Our Fleet</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from our wide range of vehicles to suit your needs and budget. From economy to luxury, we have the
            perfect car for your journey.
          </p>
        </div>

        <Tabs defaultValue="economy" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            {carCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {carCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {category.cars.map((car) => (
                  <Card key={car.id} className="overflow-hidden">
                    <div className="relative h-48 w-full">
                      <Image src={car.image || "/placeholder.svg"} alt={car.name} fill className="object-cover" />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{car.name}</h3>
                          <p className="text-sm text-muted-foreground">or similar</p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold">${car.price}</span>
                          <p className="text-sm text-muted-foreground">per day</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{car.seats} Seats</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-muted-foreground" />
                          <span>{car.transmission}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Fuel className="h-4 w-4 text-muted-foreground" />
                          <span>{car.fuelType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-muted-foreground" />
                          <span>A/C</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
