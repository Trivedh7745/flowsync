"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function PopupCallbackPage() {
  useEffect(() => {
    let handled = false;

    const finishAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          // Give Supabase a moment to finish processing the OAuth session.
          setTimeout(finishAuth, 300);
          return;
        }

        if (handled) return;
        handled = true;

        // Redirect the ORIGINAL login window.
        if (window.opener && !window.opener.closed) {
          window.opener.location.replace("/dashboard");
        }

        window.close();
      } catch (error) {
        console.error("Google popup callback error:", error);

        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            {
              type: "FLOWSYNC_GOOGLE_LOGIN_ERROR",
            },
            window.location.origin
          );
        }

        window.close();
      }
    };

    finishAuth();
  }, []);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />

        <p className="text-sm text-gray-500">
          Completing Google sign in...
        </p>
      </div>
    </main>
  );
}