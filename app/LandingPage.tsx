import React from 'react';
import NewNavbar from '@/components/landing/NewNavbar'
import NewHeroSection from '@/components/landing/NewHeroSection'
import NewCTASection from "@/components/landing/NewCTASection";
import NewFAQSection from "@/components/landing/NewFAQSection";
import NewFleetSection from "@/components/landing/NewFleetSection";
import NewFooter from "@/components/landing/NewFooter";
import NewHowItWorksSection from "@/components/landing/NewHowItWorksSection";
import NewLocationsSection from "@/components/landing/NewLocationsSection";
import NewTestimonialsSection from "@/components/landing/NewTestimonialsSection";

const LandingPage = async () => {
  const fleetContent = await NewFleetSection();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <NewNavbar />
      <main className="flex-grow">
        <NewHeroSection />
        {fleetContent}
        <NewHowItWorksSection />
        <NewLocationsSection />
        <NewTestimonialsSection />
        <NewFAQSection />
        <NewCTASection />
      </main>
      <NewFooter />
    </div>
  );
}

export default LandingPage 