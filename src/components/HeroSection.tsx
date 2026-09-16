"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Check,
  Users,
  FolderKanban,
  ListTodo,
  FileText,
  CalendarDays,
  CreditCard,
} from "lucide-react";

type WorkflowNodeProps = {
  label: string;
  icon: React.ElementType;
  className?: string;
  delay: number;
};

function WorkflowNode({
  label,
  icon: Icon,
  className = "",
  delay,
}: WorkflowNodeProps) {
  return (
    <motion.div
      className={`
        absolute
        -translate-x-1/2
        flex
        flex-col
        items-center
        ${className}
      `}
    >

      {/* Circle */}
      <div className="relative">

        <div
          className="
            w-[72px]
            h-[72px]
            rounded-full
            bg-white
            border
            border-gray-200
            shadow-[0_8px_30px_rgba(99,102,241,0.12)]
            flex
            items-center
            justify-center
          "
        >

          {/* Gray icon */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{
              delay: delay + 1,
              duration: 0.25,
            }}
            className="absolute"
          >
            <Icon
              size={26}
              strokeWidth={1.8}
              className="text-gray-400"
            />
          </motion.div>

          {/* Indigo icon */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: delay + 1,
              duration: 0.25,
            }}
            className="absolute"
          >
            <Icon
              size={26}
              strokeWidth={1.8}
              className="text-indigo-600"
            />
          </motion.div>

        </div>


        {/* Check */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            delay: delay + 1,
            duration: 0.25,
          }}
          className="
            absolute
            -top-2
            -right-2
            w-6
            h-6
            rounded-full
            bg-indigo-600
            text-white
            flex
            items-center
            justify-center
            shadow-md
          "
        >
          <Check
            size={13}
            strokeWidth={2.5}
          />
        </motion.div>

      </div>


      {/* Label outside circle */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: delay + 1,
          duration: 0.3,
        }}
        className="
          mt-3
          text-sm
          font-medium
          text-gray-700
          whitespace-nowrap
        "
      >
        {label}
      </motion.span>

    </motion.div>
  );
}
export function HeroSection() {
  const router = useRouter();
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/20 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-500/20 blur-3xl rounded-full mix-blend-multiply" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Left Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-sm font-medium mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary-600"></span>
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
                onClick={() => router.push("/signup")}
                className="w-full sm:w-auto px-8 py-4 bg-foreground text-background hover:bg-foreground/90 rounded-full font-medium text-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                Start Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
  href="#problem"
  className="w-full sm:w-auto px-8 py-4 bg-transparent border border-border hover:bg-muted rounded-full font-medium text-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
>
  View More
</a>
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

        {/* Right Workflow Animation */}
<motion.div
  initial={{ opacity: 0, x: 30 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{
    duration: 0.7,
    delay: 0.2,
  }}
  className="flex-1 w-full max-w-2xl lg:max-w-none"
>
  <div className="relative w-full h-[500px]">

    {/* Soft glow */}
    <div className="
      absolute
      inset-0
      bg-primary-500/10
      blur-[100px]
      rounded-full
      pointer-events-none
    " />

    {/* Workflow SVG */}
    <svg
  viewBox="0 0 600 500"
  className="
    absolute
    inset-0
    w-full
    h-full
    overflow-visible
  "
  fill="none"
>
  {/* ================================= */}
  {/* BASE FLOW */}
  {/* ================================= */}

  {/* Clients → Projects */}
  <path
    d="M 90 91 C 175 91 235 100 300 136"
    stroke="#E5E7EB"
    strokeWidth="3"
    strokeLinecap="round"
  />

  {/* Projects → Tasks */}
  <path
    d="M 300 136 C 375 175 445 205 492 246"
    stroke="#E5E7EB"
    strokeWidth="3"
    strokeLinecap="round"
  />

  {/* Tasks → Documents */}
  <path
    d="M 492 246 C 445 305 395 325 348 348"
    stroke="#E5E7EB"
    strokeWidth="3"
    strokeLinecap="round"
  />

  {/* Documents → Meetings */}
  <path
    d="M 348 348 C 285 375 215 410 168 446"
    stroke="#E5E7EB"
    strokeWidth="3"
    strokeLinecap="round"
  />

  {/* Meetings → Invoices */}
  <path
    d="M 168 446 C 265 485 395 470 492 426"
    stroke="#E5E7EB"
    strokeWidth="3"
    strokeLinecap="round"
  />


  {/* ================================= */}
  {/* ANIMATED INDIGO FLOW */}
  {/* ================================= */}

  {/* Clients → Projects */}
  <motion.path
    d="M 90 91 C 175 91 235 100 300 136"
    stroke="url(#flowGradient)"
    strokeWidth="4"
    strokeLinecap="round"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{
      duration: 1,
      delay: 0,
      ease: "easeInOut",
    }}
  />

  {/* Projects → Tasks */}
  <motion.path
    d="M 300 136 C 375 175 445 205 492 246"
    stroke="url(#flowGradient)"
    strokeWidth="4"
    strokeLinecap="round"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{
      duration: 1,
      delay: 1,
      ease: "easeInOut",
    }}
  />

  {/* Tasks → Documents */}
  <motion.path
    d="M 492 246 C 445 305 395 325 348 348"
    stroke="url(#flowGradient)"
    strokeWidth="4"
    strokeLinecap="round"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{
      duration: 1,
      delay: 2,
      ease: "easeInOut",
    }}
  />

  {/* Documents → Meetings */}
  <motion.path
    d="M 348 348 C 285 375 215 410 168 446"
    stroke="url(#flowGradient)"
    strokeWidth="4"
    strokeLinecap="round"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{
      duration: 1,
      delay: 3,
      ease: "easeInOut",
    }}
  />

  {/* Meetings → Invoices */}
  <motion.path
    d="M 168 446 C 265 485 395 470 492 426"
    stroke="url(#flowGradient)"
    strokeWidth="4"
    strokeLinecap="round"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{
      duration: 1,
      delay: 4,
      ease: "easeInOut",
    }}
  />

  {/* FLOW GRADIENT */}
  <defs>
    <linearGradient
      id="flowGradient"
      x1="0"
      y1="0"
      x2="1"
      y2="0"
    >
      <stop
        offset="0%"
        stopColor="#6366F1"
      />
      <stop
        offset="100%"
        stopColor="#9333EA"
      />
    </linearGradient>
  </defs>
</svg>

    {/* CLIENTS */}
    <WorkflowNode
      label="Clients"
      icon={Users}
      className="left-[15%] top-[11%]"
      delay={0}
    />

    {/* PROJECTS */}
    <WorkflowNode
      label="Projects"
      icon={FolderKanban}
      className="left-[50%] top-[20%]"
      delay={1}
    />

    {/* TASKS */}
    <WorkflowNode
      label="Tasks"
      icon={ListTodo}
      className="left-[82%] top-[42%]"
      delay={2}
    />

    <WorkflowNode
  label="Documents"
  icon={FileText}
  className="left-[52%] top-[61%]"
  delay={3}
/>

<WorkflowNode
  label="Meetings"
  icon={CalendarDays}
  className="left-[28%] top-[82%]"
  delay={4}
/>

<WorkflowNode
  label="Invoices"
  icon={CreditCard}
  className="left-[82%] top-[78%]"
  delay={5}
/>

  </div>
</motion.div>

        </div>
      </div>
    </section>
  );
}
