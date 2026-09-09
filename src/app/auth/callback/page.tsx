"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          window.location.replace("/login");
          return;
        }

        const response = await fetch(
          `/api/signup?email=${encodeURIComponent(user.email || "")}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          window.location.replace("/login");
          return;
        }

        const data = await response.json();

        if (data.exists) {
          window.location.replace("/dashboard");
          return;
        }

        window.location.replace("/onboarding");
      } catch (error) {
        console.error("Auth callback error:", error);
        window.location.replace("/login");
      }
    };

    handleAuthCallback();
  }, []);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />

        <h1 className="text-lg font-semibold text-gray-900">
          Signing you in...
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Setting up your FlowSync account.
        </p>
      </div>
    </main>
  );
}