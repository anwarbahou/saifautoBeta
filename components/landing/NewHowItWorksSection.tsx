import { CalendarCheck, Car, MapPin, Search } from "lucide-react"

const steps = [
  {
    icon: <Search className="h-10 w-10 text-primary" />,
    title: "Search & Discover",
    description: "Enter your destination, dates, and preferences to find the perfect vehicle for your journey.",
  },
  {
    icon: <Car className="h-10 w-10 text-primary" />,
    title: "Select Your Ride",
    description: "Choose from our wide range of vehicles, from economy to luxury, to suit your needs and budget.",
  },
  {
    icon: <CalendarCheck className="h-10 w-10 text-primary" />,
    title: "Book With Ease",
    description: "Complete your booking in minutes with our secure and easy-to-use reservation system.",
  },
  {
    icon: <MapPin className="h-10 w-10 text-primary" />,
    title: "Pick Up & Enjoy",
    description: "Pick up your car at one of our convenient locations and start your journey with confidence.",
  },
]

export default function NewHowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Renting a car with DriveEasy is simple and hassle-free. Follow these easy steps to get on the road quickly.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="mb-6 rounded-full bg-primary/10 p-5 inline-block">{step.icon}</div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 