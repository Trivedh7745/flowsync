"use client";

import { motion } from "framer-motion";
import { MailQuestion, FileSpreadsheet, Clock, AlertCircle, LayoutTemplate, Briefcase } from "lucide-react";

const problems = [
  {
    icon: <MailQuestion className="w-6 h-6 text-red-500" />,
    title: "Lost Email Conversations",
    description: "Searching through messy email threads to find client feedback or approval."
  },
  {
    icon: <FileSpreadsheet className="w-6 h-6 text-green-500" />,
    title: "Spreadsheet Chaos",
    description: "Tracking projects, invoices, and leads across 5 different disconnected Google Sheets."
  },
  {
    icon: <Clock className="w-6 h-6 text-amber-500" />,
    title: "Late Invoices",
    description: "Forgetting to bill clients because you're too busy doing the actual work."
  },
  {
    icon: <AlertCircle className="w-6 h-6 text-rose-500" />,
    title: "Missed Deadlines",
    description: "Tasks slipping through the cracks due to poor project visibility."
  },
  {
    icon: <LayoutTemplate className="w-6 h-6 text-indigo-500" />,
    title: "Switching Between Apps",
    description: "Context switching between Slack, Asana, Notion, and Gmail 50 times a day."
  },
  {
    icon: <Briefcase className="w-6 h-6 text-purple-500" />,
    title: "Difficult Project Tracking",
    description: "Clients constantly asking 'what's the status?' because they have no visibility."
  }
];

export function ProblemSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            The old way of working is broken.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Freelancers and small businesses waste up to 15 hours a week just managing their tools and trying to find information.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                {problem.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
              <p className="text-muted-foreground">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
