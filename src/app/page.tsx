"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import EmergencyModeSection from "@/components/EmergencyModeSection";
// import InvestmentSection from "@/components/InvestmentSection"; // Will be transformed to HealthcareProviders
// import BusinessSolutions from "@/components/BusinessSolutions"; // Will be transformed to PatientSolutions
// import MobileBanking from "@/components/MobileBanking"; // Will be transformed to MobileHealth
import CallToAction from "@/components/CallToAction";
// import FinancialPlanning from "@/components/FinancialPlanning"; // Will be transformed to HealthPlanning
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <div className="min-h-screen overflow flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        {/* <AboutSection /> */}
        <FeaturesSection />
        <EmergencyModeSection />
        {/* Temporarily commenting out sections that need transformation */}
        {/* <InvestmentSection /> */}
        {/* <BusinessSolutions /> */}
        {/* <MobileBanking /> */}
        <CallToAction />
        {/* <FinancialPlanning /> */}
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
