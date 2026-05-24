"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, X, RefreshCw, Trash2, Calendar, ShieldCheck, Mail, Building, Clock } from "lucide-react";
import { Workspace, Booking } from "@/lib/db";

export function AdminDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<"workspaces" | "bookings">("workspaces");
  const [loading, setLoading] = useState(false);

  const fetchDb = async () => {
    setLoading(true);
    try {
      const resSignup = await fetch("/api/signup");
      const resBooking = await fetch("/api/booking");
      if (resSignup.ok) setWorkspaces(await resSignup.json());
      if (resBooking.ok) setBookings(await resBooking.json());
    } catch (err) {
      console.error("Error fetching database", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDb();
    
    // Listen to custom updates from modals submission
    const handleDbUpdate = () => {
      fetchDb();
    };

    window.addEventListener("db-updated", handleDbUpdate);
    return () => window.removeEventListener("db-updated", handleDbUpdate);
  }, []);

  const handleClearDb = async () => {
    if (!confirm("Are you sure you want to simulate clearing the database table entries?")) return;
    // For safety in this environment, we just let them know or we could hook up a clear API.
    // Let's do a simple frontend reset alert or fetch clear if we want, but letting them know is perfect!
    alert("Simulated: Admin database truncate completed.");
    setWorkspaces([]);
    setBookings([]);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          fetchDb();
        }}
        className="fixed bottom-6 left-6 z-40 p-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-2xl transition-all hover:scale-110 flex items-center gap-2 font-semibold text-xs border border-primary-500 cursor-pointer"
        title="Open Live Database Viewer"
      >
        <Database className="w-4 h-4" />
        <span>Live DB</span>
      </button>

      {/* Slide-up Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs">
            {/* Click backdrop to close */}
            <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-5xl h-[80vh] md:h-[60vh] bg-background border-t border-border rounded-t-3xl shadow-2xl z-10 flex flex-col glass"
            >
              {/* Drawer Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-border/50 bg-muted/20">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-primary-500" />
                  <div>
                    <h3 className="font-bold text-lg">FlowSync Live Database Admin Panel</h3>
                    <p className="text-xs text-muted-foreground">Persisting live submissions to database.json locally</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={fetchDb}
                    disabled={loading}
                    className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  </button>
                  <button
                    onClick={handleClearDb}
                    className="p-2 hover:bg-red-500/10 text-red-500 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                    title="Clear database entries"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tabs selector */}
              <div className="flex border-b border-border/50 px-6 bg-muted/10">
                <button
                  onClick={() => setActiveTab("workspaces")}
                  className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors cursor-pointer ${
                    activeTab === "workspaces"
                      ? "border-primary-500 text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Workspaces Table ({workspaces.length})
                </button>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors cursor-pointer ${
                    activeTab === "bookings"
                      ? "border-primary-500 text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Scheduled Demos Table ({bookings.length})
                </button>
              </div>

              {/* Tables Content (Scrollable) */}
              <div className="flex-1 overflow-auto p-6">
                {activeTab === "workspaces" ? (
                  workspaces.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12 text-muted-foreground">
                      <ShieldCheck className="w-12 h-12 mb-3 stroke-1" />
                      <p className="font-medium">No workspace signups yet.</p>
                      <p className="text-xs">Click "Start Free" in the landing page above to register a workspace!</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto w-full border border-border/50 rounded-2xl">
                      <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider font-semibold border-b border-border/50">
                          <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Full Name</th>
                            <th className="px-6 py-3">Email Address</th>
                            <th className="px-6 py-3">Company Name</th>
                            <th className="px-6 py-3">Created Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {workspaces.map((row) => (
                            <tr key={row.id} className="hover:bg-muted/10 transition-colors">
                              <td className="px-6 py-4 font-mono text-xs text-primary-500">{row.id}</td>
                              <td className="px-6 py-4 font-medium flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 text-xs flex items-center justify-center font-bold">
                                  {row.name.charAt(0)}
                                </span>
                                {row.name}
                              </td>
                              <td className="px-6 py-4 text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                  <Mail className="w-3.5 h-3.5" />
                                  {row.email}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="flex items-center gap-1.5 font-medium">
                                  <Building className="w-3.5 h-3.5 text-muted-foreground" />
                                  {row.company}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-xs text-muted-foreground">
                                {new Date(row.createdAt).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                ) : (
                  bookings.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12 text-muted-foreground">
                      <Calendar className="w-12 h-12 mb-3 stroke-1" />
                      <p className="font-medium">No scheduled demos yet.</p>
                      <p className="text-xs">Click "Book Demo" in the landing page above to select a time slot!</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto w-full border border-border/50 rounded-2xl">
                      <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider font-semibold border-b border-border/50">
                          <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Client Name</th>
                            <th className="px-6 py-3">Email Address</th>
                            <th className="px-6 py-3">Demo Date</th>
                            <th className="px-6 py-3">Time Slot</th>
                            <th className="px-6 py-3">Booked At</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {bookings.map((row) => (
                            <tr key={row.id} className="hover:bg-muted/10 transition-colors">
                              <td className="px-6 py-4 font-mono text-xs text-primary-500">{row.id}</td>
                              <td className="px-6 py-4 font-medium flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-accent-100 dark:bg-accent-950/40 text-accent-600 dark:text-accent-400 text-xs flex items-center justify-center font-bold">
                                  {row.name.charAt(0)}
                                </span>
                                {row.name}
                              </td>
                              <td className="px-6 py-4 text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                  <Mail className="w-3.5 h-3.5" />
                                  {row.email}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-semibold text-accent-500">
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {row.date}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-full text-xs font-semibold">
                                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                  {row.time}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-xs text-muted-foreground">
                                {new Date(row.createdAt).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
