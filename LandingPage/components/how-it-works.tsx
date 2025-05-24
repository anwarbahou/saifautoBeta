import { CalendarCheck, Car, MapPin, Search } from "lucide-react"

const steps = [
  {
    icon: <Search className="h-10 w-10 text-primary" />,
    title: "Search",
    description: "Enter your destination, dates, and preferences to find the perfect vehicle for your journey.",
  },
  {
    icon: <Car className="h-10 w-10 text-primary" />,
    title: "Select",
    description: "Choose from our wide range of vehicles, from economy to luxury, to suit your needs and budget.",
  },
  {
    icon: <CalendarCheck className="h-10 w-10 text-primary" />,
    title: "Book",
    description: "Complete your booking in minutes with our secure and easy-to-use reservation system.",
  },
  {
    icon: <MapPin className="h-10 w-10 text-primary" />,
    title: "Enjoy",
    description: "Pick up your car at one of our convenient locations and start your journey with confidence.",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Renting a car with DriveEasy is simple and hassle-free. Follow these easy steps to get on the road quickly.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">{step.icon}</div>
              <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
