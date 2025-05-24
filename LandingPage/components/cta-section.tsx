import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function CTASection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Ready to Hit the Road?</h2>
            <p className="mb-6 max-w-md">
              Join thousands of satisfied customers who choose DriveEasy for their car rental needs. Sign up today and
              get 10% off your first rental.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="secondary" size="lg" asChild>
                <Link href="#fleet">Explore Our Fleet</Link>
              </Button>
              <Button variant="outline" size="lg" className="bg-transparent">
                Contact Us
              </Button>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4">Subscribe to Our Newsletter</h3>
            <p className="mb-4">
              Stay updated with our latest offers, new car models, and travel tips. Subscribe to our newsletter.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/20 border-white/30 placeholder:text-white/70"
              />
              <Button variant="secondary">Subscribe</Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
