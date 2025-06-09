"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const topCars = [
  {
    model: "Toyota Camry",
    bookings: 42,
    percentage: 85,
  },
  {
    model: "Honda Civic",
    bookings: 38,
    percentage: 76,
  },
  {
    model: "Ford Explorer",
    bookings: 35,
    percentage: 70,
  },
  {
    model: "Nissan Altima",
    bookings: 32,
    percentage: 64,
  },
  {
    model: "Tesla Model 3",
    bookings: 30,
    percentage: 60,
  },
]

export function TopCars() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Véhicules les Plus Populaires</CardTitle>
        <CardDescription>Les véhicules les plus performants de votre flotte</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topCars.map((car) => (
            <div key={car.model} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">{car.model}</div>
                <div className="text-sm text-muted-foreground">{car.bookings} réservations</div>
              </div>
              <Progress value={car.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
