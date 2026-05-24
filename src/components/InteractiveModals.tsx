"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, CheckCircle2, Loader2, Sparkles, User, Mail, Shield, Building, Globe } from "lucide-react";

export function InteractiveModals() {
  const [modalType, setModalType] = useState<"signup" | "demo" | null>(null);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sign up form state
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "", company: "" });

  // Demo booking state
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [demoData, setDemoData] = useState({ name: "", email: "", size: "1" });

  useEffect(() => {
    const handleOpenModal = (e: Event) => {
      const customEvent = e as CustomEvent;
      setModalType(customEvent.detail.type);
      setSuccess(false);
      setIsSubmitting(false);
      setLoadingStep(0);
    };

    window.addEventListener("open-modal", handleOpenModal);
    return () => window.removeEventListener("open-modal", handleOpenModal);
  }, []);

  const closeModal = () => setModalType(null);

  // Simulated signup pipeline with real DB saving
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const steps = [
      "Securing connection...",
      "Creating FlowSync workspace...",
      "Initializing AI email parsing node...",
      "Setting up standard templates...",
      "Workspace ready!"
    ];

    for (let i = 0; i < steps.length - 1; i++) {
      setLoadingStep(i);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          company: signupData.company
        })
      });
      
      if (res.ok) {
        setLoadingStep(steps.length - 1);
        await new Promise((resolve) => setTimeout(resolve, 300));
        window.dispatchEvent(new CustomEvent("db-updated"));
        setIsSubmitting(false);
        setSuccess(true);
      } else {
        setIsSubmitting(false);
        alert("Failed to register workspace in database");
      }
    } catch (err) {
      setIsSubmitting(false);
      alert("Network database connection failure");
    }
  };

  // Simulated demo booking with real DB saving
  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: demoData.name,
          email: demoData.email,
          date: selectedDate,
          time: selectedTime
        })
      });
      
      if (res.ok) {
        window.dispatchEvent(new CustomEvent("db-updated"));
        setIsSubmitting(false);
        setSuccess(true);
      } else {
        setIsSubmitting(false);
        alert("Failed to schedule booking in database");
      }
    } catch (err) {
      setIsSubmitting(false);
      alert("Network database connection failure");
    }
  };

  // Calendar dates helper (next 5 working days)
  const getNextDays = () => {
    const days = [];
    const options: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" };
    let current = new Date();
    
    while (days.length < 5) {
      current.setDate(current.getDate() + 1);
      if (current.getDay() !== 0 && current.getDay() !== 6) { // Exclude weekends
        days.push(current.toLocaleDateString("en-US", options));
      }
    }
    return days;
  };

  const nextDays = getNextDays();
  const timeSlots = ["10:00 AM", "11:30 AM", "1:00 PM", "3:30 PM", "5:00 PM"];

  return (
    <AnimatePresence>
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          {/* Backdrop click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={closeModal}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg overflow-hidden bg-background border border-border/80 shadow-2xl rounded-3xl z-10 glass"
          >
            {/* Header close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* 1. SIGNUP MODAL CONTENT */}
            {modalType === "signup" && (
              <div className="p-8">
                {!success && !isSubmitting && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center">
                        <span className="text-white font-bold text-md">F</span>
                      </div>
                      <span className="text-xl font-bold tracking-tight">FlowSync</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-1">Create your free workspace</h2>
                    <p className="text-sm text-muted-foreground mb-6">No credit card required. 14-day free trial.</p>

                    <form onSubmit={handleSignupSubmit} className="space-y-4">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          required
                          placeholder="Full Name"
                          value={signupData.name}
                          onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-muted/40 border border-border hover:border-primary-500/30 focus:border-primary-500 rounded-xl outline-none transition-colors text-sm"
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="email"
                          required
                          placeholder="Work Email"
                          value={signupData.email}
                          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-muted/40 border border-border hover:border-primary-500/30 focus:border-primary-500 rounded-xl outline-none transition-colors text-sm"
                        />
                      </div>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          required
                          placeholder="Company/Agency Name"
                          value={signupData.company}
                          onChange={(e) => setSignupData({ ...signupData, company: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-muted/40 border border-border hover:border-primary-500/30 focus:border-primary-500 rounded-xl outline-none transition-colors text-sm"
                        />
                      </div>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="password"
                          required
                          placeholder="Password"
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-muted/40 border border-border hover:border-primary-500/30 focus:border-primary-500 rounded-xl outline-none transition-colors text-sm"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-foreground text-background hover:bg-foreground/90 font-semibold rounded-xl text-sm transition-colors mt-6"
                      >
                        Launch Free Workspace
                      </button>
                    </form>
                  </div>
                )}

                {isSubmitting && (
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                    <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-6" />
                    <h3 className="text-xl font-bold mb-2">Setting up workspace</h3>
                    <div className="h-6 overflow-hidden relative w-64 text-center">
                      <motion.p
                        key={loadingStep}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="text-sm text-muted-foreground"
                      >
                        {[
                          "Securing connection...",
                          "Creating FlowSync workspace...",
                          "Initializing AI email parsing node...",
                          "Setting up standard templates...",
                          "Workspace ready!"
                        ][loadingStep]}
                      </motion.p>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-6"
                    >
                      <CheckCircle2 className="w-10 h-10" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2">Workspace Ready!</h3>
                    <p className="text-muted-foreground mb-6 max-w-xs">
                      We've created a premium workspace for <strong>{signupData.company || "your agency"}</strong>. Check your email for login credentials!
                    </p>
                    <button
                      onClick={closeModal}
                      className="px-6 py-2.5 bg-foreground text-background hover:bg-foreground/90 rounded-xl text-sm font-semibold transition-colors"
                    >
                      Enter Dashboard
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 2. DEMO MODAL CONTENT */}
            {modalType === "demo" && (
              <div className="p-8">
                {!success && !isSubmitting && (
                  <div>
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-accent-500" />
                      Book a FlowSync Demo
                    </h2>
                    <p className="text-sm text-muted-foreground mb-6">See how FlowSync can consolidate your workflow in 15 minutes.</p>

                    <form onSubmit={handleDemoSubmit} className="space-y-4">
                      {/* Interactive Calendar Select */}
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-2">Select Date</label>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                          {nextDays.map((day) => (
                            <button
                              key={day}
                              type="button"
                              onClick={() => setSelectedDate(day)}
                              className={`px-3 py-2 border rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                                selectedDate === day
                                  ? "bg-foreground text-background border-foreground"
                                  : "border-border hover:border-primary-500/30"
                              }`}
                            >
                              <Calendar className="w-3.5 h-3.5 inline mr-1" />
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Time Select */}
                      {selectedDate && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <label className="text-xs font-semibold text-muted-foreground block mb-2">Select Time (EST)</label>
                          <div className="grid grid-cols-3 gap-2">
                            {timeSlots.map((time) => (
                              <button
                                key={time}
                                type="button"
                                onClick={() => setSelectedTime(time)}
                                className={`px-2 py-2 border rounded-xl text-xs font-medium transition-colors ${
                                  selectedTime === time
                                    ? "bg-foreground text-background border-foreground"
                                    : "border-border hover:border-primary-500/30"
                                }`}
                              >
                                <Clock className="w-3 h-3 inline mr-1" />
                                {time}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={demoData.name}
                          onChange={(e) => setDemoData({ ...demoData, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-muted/40 border border-border hover:border-primary-500/30 focus:border-primary-500 rounded-xl outline-none transition-colors text-sm"
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="email"
                          required
                          placeholder="Work Email"
                          value={demoData.email}
                          onChange={(e) => setDemoData({ ...demoData, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-muted/40 border border-border hover:border-primary-500/30 focus:border-primary-500 rounded-xl outline-none transition-colors text-sm"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={!selectedDate || !selectedTime}
                        className="w-full py-3 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 disabled:hover:bg-foreground font-semibold rounded-xl text-sm transition-colors mt-4"
                      >
                        Confirm Booking
                      </button>
                    </form>
                  </div>
                )}

                {isSubmitting && (
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                    <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-6" />
                    <h3 className="text-xl font-bold mb-2">Booking Demo</h3>
                    <p className="text-sm text-muted-foreground">Checking availability with our product specialist...</p>
                  </div>
                )}

                {success && (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-6"
                    >
                      <CheckCircle2 className="w-10 h-10" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2">Demo Scheduled!</h3>
                    <p className="text-muted-foreground mb-1 text-sm">
                      Hi <strong>{demoData.name}</strong>, you are scheduled for:
                    </p>
                    <p className="font-semibold text-foreground mb-4">
                      {selectedDate} at {selectedTime} EST
                    </p>
                    <p className="text-xs text-muted-foreground mb-6">
                      A calendar invite has been sent to {demoData.email}.
                    </p>
                    <button
                      onClick={closeModal}
                      className="px-6 py-2.5 bg-foreground text-background hover:bg-foreground/90 rounded-xl text-sm font-semibold transition-colors"
                    >
                      Close Window
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
