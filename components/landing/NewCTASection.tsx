import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function NewCTASection() {
  return (
    <section className="py-16 md:py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">Prêt à Prendre la Route ?</h2>
            <p className="text-lg mb-6 max-w-xl">
              Rejoignez des milliers de clients satisfaits qui choisissent DriveEasy pour leurs besoins de location de voiture. Inscrivez-vous aujourd'hui et obtenez 10% de réduction sur votre première location.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="secondary" size="lg" asChild className="text-base font-semibold">
                <Link href="/fleet">Découvrez Notre Flotte</Link>
              </Button>
              <Button variant="outline" size="lg" className="bg-transparent border-gray-300 text-gray-50 hover:bg-gray-100 hover:text-primary text-base font-semibold">
                Contactez-nous
              </Button>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Subscribe to Our Newsletter</h3>
            <p className="mb-4 text-base">
              Stay updated with our latest offers, new car models, and travel tips.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-100 border-gray-300 placeholder:text-gray-500 text-base rounded-md"
                aria-label="Email for newsletter"
              />
              <Button variant="secondary" type="submit" className="text-base font-semibold">Subscribe</Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
} 