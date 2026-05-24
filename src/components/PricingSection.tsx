"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$15",
    description: "Perfect for solo freelancers just getting started.",
    features: ["Up to 5 active clients", "Basic CRM & Invoicing", "Kanban boards", "Stripe integration", "Standard support"],
    highlighted: false,
    cta: "Start Free Trial"
  },
  {
    name: "Professional",
    price: "$29",
    description: "For busy professionals who need automation.",
    features: ["Unlimited clients", "AI Email Tracking", "Automated Invoice Generation", "Client Portal", "Priority support"],
    highlighted: true,
    cta: "Get Professional"
  },
  {
    name: "Agency",
    price: "$79",
    description: "For small teams and growing agencies.",
    features: ["Up to 5 team members", "Team collaboration tools", "Advanced analytics", "Custom branding", "24/7 dedicated support"],
    highlighted: false,
    cta: "Contact Sales"
  }
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing.</h2>
          <p className="text-lg text-muted-foreground">Start for free, upgrade when you need more power.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-3xl p-8 ${
                plan.highlighted 
                  ? "bg-foreground text-background shadow-2xl scale-105 border-none" 
                  : "bg-background border border-border shadow-sm"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className={`text-xl font-bold mb-2 ${plan.highlighted ? "text-background" : "text-foreground"}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                  <span className={plan.highlighted ? "text-background/70" : "text-muted-foreground"}>/mo</span>
                </div>
                <p className={`mt-4 text-sm ${plan.highlighted ? "text-background/80" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.highlighted ? "text-primary-400" : "text-primary-500"}`} />
                    <span className="text-sm font-medium">{f}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => {
                  if (plan.name === "Agency") {
                    window.dispatchEvent(new CustomEvent("open-modal", { detail: { type: "demo" } }));
                  } else {
                    window.dispatchEvent(new CustomEvent("open-modal", { detail: { type: "signup" } }));
                  }
                }}
                className={`w-full py-3 rounded-xl font-semibold transition-colors cursor-pointer ${
                  plan.highlighted
                    ? "bg-primary-500 hover:bg-primary-600 text-white"
                    : "bg-muted hover:bg-border text-foreground"
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
