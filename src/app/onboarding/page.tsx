"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Building2,
  ArrowRight,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace("/login");
        return;
      }

      const metadata = user.user_metadata || {};

      setName(
        metadata.full_name ||
          metadata.name ||
          ""
      );

      setEmail(user.email || "");

      setLoading(false);
    };

    loadUser();
  }, [router]);

  const handleContinue = async () => {
    if (!name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!email.trim()) {
      toast.error("Email address is required");
      return;
    }

    setSaving(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("Your session has expired. Please log in again.");
        router.replace("/login");
        return;
      }

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim() || null,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.error || "Failed to create workspace"
        );
        return;
      }

      toast.success("Welcome to FlowSync!");

      router.replace("/dashboard");
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm text-gray-500">
            Loading your account...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
              F
            </div>

            <span className="text-2xl font-bold text-gray-900">
              FlowSync
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl px-8 py-9">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome to FlowSync
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Complete your workspace setup to get started.
            </p>
          </div>

          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full h-12 pl-11 pr-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Email
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full h-12 pl-11 pr-4 border border-gray-200 bg-gray-50 rounded-xl text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company / Agency Name
                <span className="text-gray-400 font-normal ml-1">
                  (Optional)
                </span>
              </label>

              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Your company or agency name"
                  className="w-full h-12 pl-11 pr-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Continue */}
            <button
              type="button"
              onClick={handleContinue}
              disabled={saving}
              className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-95 transition disabled:opacity-60 mt-2"
            >
              {saving
                ? "Creating workspace..."
                : "Continue to FlowSync"}

              {!saving && (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            You can update your workspace information later.
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} FlowSync. All rights reserved.
        </p>
      </div>
    </main>
  );
}