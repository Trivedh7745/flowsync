"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, X } from "lucide-react";

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

export default function Home() {
  const [showSignupSuccess, setShowSignupSuccess] =
    useState(false);

  useEffect(() => {
  const homeToast = sessionStorage.getItem(
    "flowsync_home_toast"
  );

  const signupSuccess = sessionStorage.getItem(
    "flowsync_signup_success"
  );

  // Existing account:
  // show ONLY the toast and remove any stale success flag.
  if (homeToast) {
    sessionStorage.removeItem(
      "flowsync_home_toast"
    );

    sessionStorage.removeItem(
      "flowsync_signup_success"
    );

    setTimeout(() => {
      toast.error(homeToast);
    }, 100);

    return;
  }

  // New successful signup:
  // show the success card.
  if (signupSuccess) {
    sessionStorage.removeItem(
      "flowsync_signup_success"
    );

    setShowSignupSuccess(true);
  }
}, []);

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

      {/* Signup Success Modal */}
      {showSignupSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 px-4">
          <div className="relative w-full max-w-md rounded-[24px] bg-white px-8 py-10 text-center shadow-2xl border border-gray-200">
            {/* Close */}
            <button
              type="button"
              onClick={() => setShowSignupSuccess(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Success icon */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900">
              Successfully Signed Up!
            </h2>

            {/* Description */}
            <p className="mt-3 text-sm leading-6 text-gray-500">
              Your FlowSync workspace has been created
              successfully.
            </p>

            <p className="mt-2 text-sm font-medium text-gray-700">
              You can now log in to access your dashboard.
            </p>

            {/* Login */}
            <button
              type="button"
              onClick={() => {
                setShowSignupSuccess(false);
                window.location.href = "/login";
              }}
              className="mt-7 w-full h-12 rounded-xl bg-black text-white text-sm font-semibold hover:bg-gray-900 transition"
            >
              Login to FlowSync
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
