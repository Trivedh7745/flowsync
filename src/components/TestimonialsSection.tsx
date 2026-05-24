"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "FlowSync completely changed how I run my freelance design business. I used to spend 10 hours a week just organizing Notion boards and chasing invoices. Now it's all automated.",
    author: "Sarah J.",
    role: "Freelance UI/UX Designer",
    avatar: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    quote: "We replaced Asana, Hubspot, and QuickBooks with FlowSync. It's the cleanest, fastest piece of software our agency has ever used. The AI email parsing is literal magic.",
    author: "Mark T.",
    role: "Founder, Creative Agency",
    avatar: "https://i.pravatar.cc/150?u=mark"
  },
  {
    quote: "Finally, a tool that actually looks good and works fast. The Notion-like interface makes taking client notes a breeze, and the integrated invoicing means I get paid faster.",
    author: "Elena R.",
    role: "Independent Consultant",
    avatar: "https://i.pravatar.cc/150?u=elena"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Loved by top freelancers and agencies</h2>
          <p className="text-muted-foreground">Don't just take our word for it.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-background border border-border p-6 rounded-2xl shadow-sm"
            >
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-primary-500 text-primary-500" />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full" />
                <div>
                  <div className="font-semibold text-sm">{t.author}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
