"use client";

import { motion } from "framer-motion";
import { ArrowRight, UserPlus, FileText, Kanban, CheckSquare, Receipt, CreditCard, PieChart } from "lucide-react";

const steps = [
  { icon: <UserPlus />, label: "Lead" },
  { icon: <FileText />, label: "Client" },
  { icon: <Kanban />, label: "Project" },
  { icon: <CheckSquare />, label: "Tasks" },
  { icon: <Receipt />, label: "Invoice" },
  { icon: <CreditCard />, label: "Payment" },
  { icon: <PieChart />, label: "Analytics" }
];

export function WorkflowVisualization() {
  return (
    <section id="workflow" className="py-24 bg-muted/30 border-y border-border/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">A seamless flow from Lead to Paid.</h2>
          <p className="text-muted-foreground">Watch how data moves automatically through your entire business.</p>
        </div>

        <div className="relative py-12">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 hidden md:block" />
          <motion.div 
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 -translate-y-1/2 hidden md:block" 
          />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-2 relative z-10">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center group relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.2 }}
                  className="w-16 h-16 rounded-full bg-background border-2 border-primary-500/30 flex items-center justify-center text-foreground shadow-lg group-hover:border-primary-500 group-hover:text-primary-600 transition-colors relative z-10"
                >
                  {step.icon}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.2 + 0.2 }}
                  className="mt-4 font-medium text-sm text-center"
                >
                  {step.label}
                </motion.div>
                
                {/* Mobile arrows */}
                {i < steps.length - 1 && (
                  <div className="md:hidden mt-4 text-muted">
                    <ArrowRight className="rotate-90 md:rotate-0" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
