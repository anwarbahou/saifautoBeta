import React from 'react';
import NewNavbar from '@/components/landing/NewNavbar'
import NewHeroSection from '@/components/landing/NewHeroSection'
import NewCTASection from "@/components/landing/NewCTASection";
import NewFAQSection from "@/components/landing/NewFAQSection";
import NewFleetSection from "@/components/landing/NewFleetSection";
import NewFooter from "@/components/landing/NewFooter";
import NewHowItWorksSection from "@/components/landing/NewHowItWorksSection";
import NewTestimonialsSection from "@/components/landing/NewTestimonialsSection";
import ContactMapSection from "@/components/landing/ContactMapSection";

const LandingPage = () => {
  return (
    <div className="light flex flex-col min-h-screen bg-white">
      <NewNavbar />
      <main className="flex-grow">
        <NewHeroSection />
        <NewFleetSection />
        <NewHowItWorksSection />
        <NewTestimonialsSection />
        <ContactMapSection />
        <NewFAQSection />
        <NewCTASection />
      </main>
      <NewFooter />
    </div>
  );
}

export default LandingPage; 