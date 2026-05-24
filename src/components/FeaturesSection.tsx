"use client";

import { motion } from "framer-motion";
import { Users, LayoutList, MailCheck, Receipt, CreditCard, Users2, FolderRoot, Timer, LineChart, Bell, FileSignature } from "lucide-react";

const features = [
  { icon: <Users className="w-5 h-5" />, title: "Client CRM", desc: "Manage leads, contacts, and client histories seamlessly." },
  { icon: <LayoutList className="w-5 h-5" />, title: "Smart Projects", desc: "Kanban, lists, and timelines with AI auto-scheduling." },
  { icon: <MailCheck className="w-5 h-5" />, title: "AI Email Tracking", desc: "Sync your inbox and let AI extract action items." },
  { icon: <Receipt className="w-5 h-5" />, title: "Invoice Generator", desc: "Create beautiful, professional invoices in seconds." },
  { icon: <CreditCard className="w-5 h-5" />, title: "Payment Tracking", desc: "Accept Stripe/Razorpay and track pending payments." },
  { icon: <Users2 className="w-5 h-5" />, title: "Team Collaboration", desc: "Tag team members, share notes, and delegate tasks." },
  { icon: <FolderRoot className="w-5 h-5" />, title: "File Management", desc: "Securely store and share project assets." },
  { icon: <Timer className="w-5 h-5" />, title: "Time Tracking", desc: "Built-in timer to track billable hours accurately." },
  { icon: <LineChart className="w-5 h-5" />, title: "Analytics Dashboard", desc: "Visualize revenue, profit margins, and time spent." },
  { icon: <Bell className="w-5 h-5" />, title: "Automated Reminders", desc: "Never chase a late invoice again." },
  { icon: <FileSignature className="w-5 h-5" />, title: "Proposals & Contracts", desc: "Send digital contracts with e-signatures." }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Everything you need. <span className="text-muted-foreground">Nothing you don't.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Premium tools designed specifically for the workflows of independent professionals.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass p-6 rounded-2xl group hover:border-primary-500/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
