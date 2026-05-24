"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function SolutionSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-full h-[600px] -translate-y-1/2 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-500/20 via-transparent to-primary-500/20 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              One Operating System for <span className="text-gradient">Everything</span>.
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              FlowSync replaces your CRM, project management tool, invoicing software, and client portal with one seamless, beautiful experience.
            </p>

            <div className="space-y-4">
              {[
                "Centralized client communication and file sharing",
                "Automated invoice generation and payment tracking",
                "Smart project timelines with AI estimations",
                "Unified dashboard for a birds-eye view of your business"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary-500 shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-background">
              {/* Abstract Solution Visual */}
              <div className="aspect-square md:aspect-[4/3] bg-muted/20 relative flex items-center justify-center p-8">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <div className="w-64 h-64 border-4 border-primary-500 rounded-full animate-[spin_20s_linear_infinite]" />
                  <div className="absolute w-48 h-48 border-4 border-accent-500 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                </div>
                
                {/* Central Hub UI Concept */}
                <div className="relative z-10 w-full max-w-sm glass rounded-xl p-6 shadow-xl border border-border/50">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                        <span className="text-primary-600 dark:text-primary-400 font-bold">F</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">FlowSync Hub</div>
                        <div className="text-xs text-muted-foreground">All systems active</div>
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="h-10 bg-background rounded-lg border border-border flex items-center px-4 justify-between">
                      <span className="text-sm font-medium">Client CRM</span>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="h-10 bg-background rounded-lg border border-border flex items-center px-4 justify-between">
                      <span className="text-sm font-medium">Projects & Tasks</span>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="h-10 bg-background rounded-lg border border-border flex items-center px-4 justify-between">
                      <span className="text-sm font-medium">Invoicing</span>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
