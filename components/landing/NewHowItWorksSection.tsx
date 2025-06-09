import { CalendarCheck, Car, MapPin, Search } from "lucide-react"

const steps = [
  {
    icon: <Search className="h-10 w-10 text-primary" />,
    title: "Rechercher & Découvrir",
    description: "Entrez votre destination, vos dates et vos préférences pour trouver le véhicule parfait pour votre voyage.",
  },
  {
    icon: <Car className="h-10 w-10 text-primary" />,
    title: "Choisissez Votre Véhicule",
    description: "Choisissez parmi notre large gamme de véhicules, de l'économique au luxe, selon vos besoins et votre budget.",
  },
  {
    icon: <CalendarCheck className="h-10 w-10 text-primary" />,
    title: "Réservez Facilement",
    description: "Complétez votre réservation en quelques minutes avec notre système de réservation sécurisé et facile à utiliser.",
  },
  {
    icon: <MapPin className="h-10 w-10 text-primary" />,
    title: "Récupérez & Profitez",
    description: "Récupérez votre voiture dans l'un de nos emplacements pratiques et commencez votre voyage en toute confiance.",
  },
]

export default function NewHowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">Comment ça Marche</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Louer une voiture avec DriveEasy est simple et sans tracas. Suivez ces étapes simples pour prendre la route rapidement.
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