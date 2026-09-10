"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const googlePopupRef = useRef<Window | null>(null);
  const router = useRouter();

  useEffect(() => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (
        event === "SIGNED_IN" &&
        session?.user
      ) {
        googlePopupRef.current?.close();
        googlePopupRef.current = null;

        setGoogleLoading(false);

        toast.success("Logged in successfully");

        router.replace("/dashboard");
      }
    }
  );

  return () => {
    subscription.unsubscribe();
  };
}, [router]);

useEffect(() => {
  const handleGoogleMessage = async (event: MessageEvent) => {
    if (event.origin !== window.location.origin) {
      return;
    }

    if (
      event.data?.type ===
      "FLOWSYNC_GOOGLE_LOGIN_SUCCESS"
    ) {
      setGoogleLoading(false);

      toast.success("Logged in successfully");

      router.replace("/dashboard");
    }

    if (
      event.data?.type ===
      "FLOWSYNC_GOOGLE_LOGIN_ERROR"
    ) {
      setGoogleLoading(false);

      toast.error("Google login failed");
    }
  };

  window.addEventListener(
    "message",
    handleGoogleMessage
  );

  return () => {
    window.removeEventListener(
      "message",
      handleGoogleMessage
    );
  };
}, [router]);

  useEffect(() => {
  const handleAuthState = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      router.replace("/dashboard");
    }
  };

  handleAuthState();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" && session?.user) {
      router.replace("/dashboard");
    }
  });

  return () => {
    subscription.unsubscribe();
  };
}, [router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Logged in successfully");
    router.push("/dashboard");
  };

const handleGoogleLogin = async () => {
  const popup = window.open(
    "",
    "flowsync-google-login",
    "width=500,height=650,left=200,top=100"
  );

  if (!popup) {
    toast.error("Please allow popups for Google login");
    return;
  }

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/popup-callback`,
      },
    });

    if (error) {
      popup.close();
      toast.error(error.message);
      return;
    }

    if (data.url) {
      popup.location.href = data.url;
    }

    const checkPopup = setInterval(async () => {
      if (popup.closed) {
        clearInterval(checkPopup);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          window.location.replace("/dashboard");
        }
      }
    }, 500);
  } catch (error) {
    popup.close();
    console.error(error);
    toast.error("Google login failed");
  }
};

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
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
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl px-7 py-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Sign in to continue to your FlowSync workspace
            </p>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full h-12 border border-gray-300 rounded-xl flex items-center justify-center gap-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
          >
            <svg
  width="20"
  height="20"
  viewBox="0 0 48 48"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
>
  <path
    fill="#EA4335"
    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.39 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.39 17.74 9.5 24 9.5z"
  />
  <path
    fill="#4285F4"
    d="M46.5 24.5c0-1.64-.15-3.22-.41-4.75H24v9h12.65c-.55 2.96-2.18 5.47-4.64 7.16l7.52 5.84C43.82 37.55 46.5 31.46 46.5 24.5z"
  />
  <path
    fill="#FBBC05"
    d="M10.54 28.59A14.39 14.39 0 0 1 9.5 24c0-1.59.27-3.13.75-4.59l-7.69-5.98A23.94 23.94 0 0 0 0 24c0 3.82.91 7.43 2.56 10.57l7.98-5.98z"
  />
  <path
    fill="#34A853"
    d="M24 48c6.47 0 11.9-2.14 15.87-5.81l-7.52-5.84c-2.09 1.4-4.77 2.23-8.35 2.23-6.26 0-11.57-3.89-13.46-9.34l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
  />
</svg>

            {googleLoading
              ? "Connecting to Google..."
              : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">
              OR
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Email */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Email
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLogin();
                    }
                  }}
                  className="w-full h-12 pl-11 pr-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-95 transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}

              {!loading && (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Signup */}
          <p className="text-center text-sm text-gray-500 mt-7">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="font-semibold text-violet-600 hover:text-violet-700"
            >
              Create an account
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} FlowSync. All rights reserved.
        </p>
      </div>
    </main>
  );
}