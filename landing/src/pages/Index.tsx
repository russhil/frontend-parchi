import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import DashboardMockup from "@/components/DashboardMockup";
import HowItWorksSection from "@/components/HowItWorksSection";
import CofoundersSection from "@/components/CofoundersSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <DashboardMockup />
      <FeaturesSection />
      <HowItWorksSection />
      <CofoundersSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
