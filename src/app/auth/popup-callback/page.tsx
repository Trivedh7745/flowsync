"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function PopupCallbackPage() {
  useEffect(() => {
    let mounted = true;

    const finishAuth = async () => {
      try {
        // Give Supabase a moment to process the OAuth URL fragment.
        await new Promise((resolve) => setTimeout(resolve, 500));

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.user) {
          // Close the OAuth popup.
          window.close();
          return;
        }

        // If the popup was not opened by window.open(),
        // send it back to login instead of leaving a blank page.
        window.location.replace("/login");
      } catch (error) {
        console.error("Google popup callback error:", error);

        if (mounted) {
          window.close();
        }
      }
    };

    finishAuth();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />

        <h1 className="text-lg font-semibold text-gray-900">
          Signing you in...
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Please wait...
        </p>
      </div>
    </main>
  );
}