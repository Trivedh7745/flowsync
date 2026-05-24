"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How does FlowSync replace my current tools?",
    a: "FlowSync integrates CRM, project boards, and invoicing into one database. Instead of copying data from HubSpot to Asana to QuickBooks, it all lives in one interconnected workspace."
  },
  {
    q: "Is it suitable for agencies with multiple team members?",
    a: "Yes! Our Agency plan supports up to 5 team members out of the box, with options to add more. You can assign tasks, share notes, and collaborate on client projects seamlessly."
  },
  {
    q: "How does the AI Email tracking work?",
    a: "Once you connect your Gmail or Outlook, our AI reads incoming client emails, summarizes them, and can automatically suggest new tasks or calendar events based on the content."
  },
  {
    q: "Can I accept payments directly through FlowSync?",
    a: "Absolutely. We integrate natively with Stripe and Razorpay. When you send an invoice, clients can click a link and pay via credit card, Apple Pay, or bank transfer directly."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-muted/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Everything you need to know about FlowSync.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-background border border-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-4 flex items-center justify-between font-semibold text-left"
              >
                {faq.q}
                <ChevronDown 
                  className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`} 
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-4 text-muted-foreground">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
