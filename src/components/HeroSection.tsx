"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/20 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-500/20 blur-3xl rounded-full mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Left Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary-600 dark:bg-primary-500"></span>
              FlowSync 2.0 is now live
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
            >
              Stop Managing Work <br className="hidden lg:block" />
              <span className="text-gradient">Across 10 Different Apps</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Manage clients, projects, invoices, files, emails, and payments in one optimized workspace designed for the modern freelancer and agency.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent("open-modal", { detail: { type: "signup" } }))}
                className="w-full sm:w-auto px-8 py-4 bg-foreground text-background hover:bg-foreground/90 rounded-full font-medium text-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                Start Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent("open-modal", { detail: { type: "demo" } }))}
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-border hover:bg-muted rounded-full font-medium text-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Book Demo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary-500" />
                <span>Cancel anytime</span>
              </div>
            </motion.div>
          </div>

          {/* Right Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1 w-full max-w-2xl lg:max-w-none relative"
          >
            {/* Soft shadow glow */}
            <div className="absolute inset-0 bg-primary-500/10 blur-[100px] rounded-full" />
            
            <div className="relative glass-panel rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
              {/* Fake Browser Chrome */}
              <div className="h-10 border-b border-border/50 flex items-center px-4 gap-2 bg-muted/30">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              
              {/* Mockup Content */}
              <div className="aspect-[4/3] p-4 sm:p-6 bg-card flex flex-col gap-4">
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-border/30">
                  <div className="w-32 h-6 bg-muted rounded-md animate-pulse" />
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
                    <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
                  </div>
                </div>
                {/* Content Grid */}
                <div className="flex-1 grid grid-cols-3 gap-4">
                  {/* Sidebar */}
                  <div className="col-span-1 hidden sm:flex flex-col gap-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-8 bg-muted rounded-md animate-pulse" style={{ opacity: 1 - i * 0.15 }} />
                    ))}
                  </div>
                  {/* Main Content */}
                  <div className="col-span-3 sm:col-span-2 flex flex-col gap-4">
                    <div className="flex gap-4">
                      <div className="flex-1 h-24 bg-primary-500/10 rounded-xl border border-primary-500/20 flex flex-col justify-center px-4">
                        <div className="w-16 h-4 bg-primary-500/30 rounded mb-2" />
                        <div className="w-24 h-8 bg-primary-500/40 rounded" />
                      </div>
                      <div className="flex-1 h-24 bg-muted rounded-xl flex flex-col justify-center px-4 animate-pulse">
                        <div className="w-16 h-4 bg-border rounded mb-2" />
                        <div className="w-20 h-8 bg-border rounded" />
                      </div>
                    </div>
                    <div className="flex-1 bg-muted/50 rounded-xl border border-border/50 p-4">
                      <div className="w-1/3 h-5 bg-border rounded mb-4 animate-pulse" />
                      <div className="flex flex-col gap-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-full h-12 bg-card rounded-lg border border-border/50 flex items-center px-3 gap-3 shadow-sm">
                            <div className="w-6 h-6 rounded-full bg-muted animate-pulse" />
                            <div className="w-1/2 h-3 bg-muted rounded animate-pulse" />
                          </div>
                        ))}
                      </div>
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
