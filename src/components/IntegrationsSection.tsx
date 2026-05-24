"use client";

import { motion } from "framer-motion";

const integrations = [
  "Gmail", "Slack", "Google Drive", "Stripe", "Razorpay", "Zoom", "Notion", "WhatsApp"
];

export function IntegrationsSection() {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-semibold mb-12 text-muted-foreground">Integrates with the tools you already use</h2>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          {integrations.map((app, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-2xl md:text-3xl font-bold tracking-tighter"
            >
              {app}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
