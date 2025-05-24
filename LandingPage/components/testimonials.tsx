import Image from "next/image"
import { Star } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, USA",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
    text: "DriveEasy made our family vacation so much better! The booking process was simple, the car was clean and comfortable, and the customer service was exceptional.",
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Toronto, Canada",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
    text: "I travel for business frequently and DriveEasy has become my go-to car rental service. Their fleet is always well-maintained and the pickup/drop-off process is seamless.",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    location: "Miami, USA",
    image: "/placeholder.svg?height=80&width=80",
    rating: 4,
    text: "Great experience with DriveEasy! The prices are competitive and the cars are newer models with all the features you need. Will definitely use them again.",
  },
  {
    id: 4,
    name: "David Thompson",
    location: "London, UK",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
    text: "Used DriveEasy for our trip across Europe and couldn't be happier. The cross-border policy was straightforward and the unlimited mileage was a huge plus.",
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our customers have to say about their experience with
            DriveEasy.
          </p>
        </div>

        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative h-12 w-12 overflow-hidden rounded-full">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground flex-grow">{testimonial.text}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8">
            <CarouselPrevious className="relative mr-2" />
            <CarouselNext className="relative" />
          </div>
        </Carousel>
      </div>
    </section>
  )
}
