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
    name: "Sarah J.",
    location: "New York, USA",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    text: "DriveEasy a rendu notre vacances en famille beaucoup plus agréable ! Le processus de réservation était simple, la voiture était propre et confortable, et le service client était exceptionnel.",
  },
  {
    id: 2,
    name: "Michael C.",
    location: "Toronto, Canada",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    text: "Je voyage pour le travail fréquemment et DriveEasy est maintenant mon service de location de voiture préféré. Leur flotte est toujours bien entretenue et le processus de récupération/dépose est fluide.",
  },
  {
    id: 3,
    name: "Emma R.",
    location: "Miami, USA",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 4,
    text: "Une excellente expérience avec DriveEasy ! Les prix sont compétitifs et les voitures sont des modèles plus récents avec tous les fonctionnalités dont vous avez besoin. Je les utiliserai à nouveau.",
  },
  {
    id: 4,
    name: "David T.",
    location: "London, UK",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
    rating: 5,
    text: "J'ai utilisé DriveEasy pour notre voyage à travers l'Europe et je ne pourrais être plus heureux. La politique transfrontalière était simple et la distance illimitée était un plus.",
  },
  {
    id: 5,
    name: "Linda K.",
    location: "Chicago, USA",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    rating: 5,
    text: "La sélection des voitures était fantastique, et le site web était très facile à naviguer. La récupération était rapide et l'équipe était super sympa et utile !",
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
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">Ce Que Disent Nos Clients</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Ne vous fiez pas qu'à notre parole. Voici ce que nos clients disent de leur expérience avec DriveEasy.
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