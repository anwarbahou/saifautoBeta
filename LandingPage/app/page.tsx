import CarRentalHero from "@/components/car-rental-hero"
import CTASection from "@/components/cta-section"
import FAQSection from "@/components/faq-section"
import FleetSection from "@/components/fleet-section"
import Footer from "@/components/footer"
import HowItWorks from "@/components/how-it-works"
import LocationsSection from "@/components/locations-section"
import Navbar from "@/components/navbar"
import Testimonials from "@/components/testimonials"

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <CarRentalHero />
        <FleetSection />
        <HowItWorks />
        <LocationsSection />
        <Testimonials />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
