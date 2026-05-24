import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProblemSection } from "@/components/ProblemSection";
import { SolutionSection } from "@/components/SolutionSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { WorkflowVisualization } from "@/components/WorkflowVisualization";
import { IntegrationsSection } from "@/components/IntegrationsSection";
import { AIFeaturesSection } from "@/components/AIFeaturesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PricingSection } from "@/components/PricingSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { InteractiveModals } from "@/components/InteractiveModals";
import { AdminDrawer } from "@/components/AdminDrawer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <WorkflowVisualization />
      <IntegrationsSection />
      <AIFeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <Footer />
      <InteractiveModals />
      <AdminDrawer />
    </main>
  );
}
