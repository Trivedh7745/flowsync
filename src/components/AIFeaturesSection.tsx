"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, BrainCircuit, CheckCircle2 } from "lucide-react";

export function AIFeaturesSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-zinc-950 text-white">
      {/* Dark mode specific section, overrides theme to always be dark for emphasis */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-500/20 to-transparent blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-accent-400" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-accent-400">FlowSync AI</h2>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Let AI handle the busywork.
            </h3>
            <p className="text-lg text-zinc-400 mb-8">
              FlowSync uses advanced AI to automate the most tedious parts of running your business, giving you back hours of your week.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-1">AI Invoice Generation</h4>
                  <p className="text-zinc-400">Generates invoices automatically based on completed tasks and tracked time.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                  <BrainCircuit className="w-6 h-6 text-accent-400" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-1">Smart Email Summaries</h4>
                  <p className="text-zinc-400">Reads client emails, extracts action items, and adds them to your project board.</p>
                </div>
              </div>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative"
          >
            {/* Mock AI Interface */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
              <div className="w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-accent-400" />
              </div>
              <span className="font-medium">FlowSync Assistant</span>
            </div>
            
            <div className="space-y-4">
              <div className="bg-zinc-800/50 rounded-lg p-4 w-[85%]">
                <p className="text-sm text-zinc-300">"Hey, the website redesign project for Acme Corp just hit 100% completion. Should I generate and send the final invoice for $4,500?"</p>
              </div>
              <div className="flex justify-end">
                <div className="bg-accent-600 rounded-lg p-4 w-[70%] text-right">
                  <p className="text-sm text-white">Yes, generate it and send it to john@acmecorp.com.</p>
                </div>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4 w-[85%]">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-zinc-300">Invoice #INV-2026-042 sent.</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
