"use client" // Ensure this is at the top if using hooks like useState, useEffect

import Image from "next/image"
import { Star } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay" // For automatic sliding
import * as React from "react" // Import React for useRef

// Placeholder data - consider fetching this from a CMS or API
const testimonials = [
  {
    id: 1,
    name: "Sarah J.", // Slightly anonymized
    location: "New York, USA",
    image: "/img/testimonials/avatar-1.jpg", // Placeholder path
    rating: 5,
    text: "DriveEasy made our family vacation so much better! The booking process was simple, the car was clean and comfortable, and the customer service was exceptional.",
  },
  {
    id: 2,
    name: "Michael C.",
    location: "Toronto, Canada",
    image: "/img/testimonials/avatar-2.jpg", // Placeholder path
    rating: 5,
    text: "I travel for business frequently and DriveEasy has become my go-to car rental service. Their fleet is always well-maintained and the pickup/drop-off process is seamless.",
  },
  {
    id: 3,
    name: "Emma R.",
    location: "Miami, USA",
    image: "/img/testimonials/avatar-3.jpg", // Placeholder path
    rating: 4,
    text: "Great experience with DriveEasy! The prices are competitive and the cars are newer models with all the features you need. Will definitely use them again.",
  },
  {
    id: 4,
    name: "David T.",
    location: "London, UK",
    image: "/img/testimonials/avatar-4.jpg", // Placeholder path
    rating: 5,
    text: "Used DriveEasy for our trip across Europe and couldn't be happier. The cross-border policy was straightforward and the unlimited mileage was a huge plus.",
  },
  {
    id: 5,
    name: "Linda K.",
    location: "Chicago, USA",
    image: "/img/testimonials/avatar-5.jpg", // Placeholder path
    rating: 5,
    text: "The selection of cars was fantastic, and the website was very easy to navigate. Pick-up was quick and the staff were super friendly and helpful!",
  },
]

export default function NewTestimonialsSection() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <section id="testimonials" className="py-16 md:py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">What Our Customers Say</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our customers have to say about their experience with
            DriveEasy.
          </p>
        </div>

        <Carousel 
          opts={{ loop: true }} 
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="h-full flex flex-col shadow-lg rounded-lg bg-white">
                    <CardContent className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-4 mb-5">
                        <div className="relative h-14 w-14 overflow-hidden rounded-full shadow">
                          <Image
                            src={testimonial.image || "/img/testimonials/avatar-placeholder.png"}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{testimonial.name}</h3>
                          <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                        </div>
                      </div>
                      <div className="flex mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground flex-grow text-sm leading-relaxed">{testimonial.text}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 hidden sm:flex" />
          <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  )
} 