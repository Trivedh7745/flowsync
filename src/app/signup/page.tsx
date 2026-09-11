"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Building2,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [signupSuccess, setSignupSuccess] = useState(false);

  // Email verification
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  /*
   * Detect return from Google OAuth.
   */
  useEffect(() => {
    const handleGoogleSignupReturn = async () => {
      try {
        const googleSignupStarted =
          sessionStorage.getItem("flowsync_google_signup") === "true";

        // Only handle this effect when we actually started Google signup.
        if (!googleSignupStarted) {
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          return;
        }

        const user = session.user;

        // Prevent this Google flow from running again.
        sessionStorage.removeItem("flowsync_google_signup");

        // Google profile information
        const googleName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          "";

        const googleEmail = user.email || "";

        // Restore optional company entered before Google redirect.
        const savedCompany =
          sessionStorage.getItem("flowsync_signup_company") || "";

        setName(googleName);
        setEmail(googleEmail);
        setCompany(savedCompany);

        /*
         * Check whether a workspace already exists.
         */
        const checkResponse = await fetch(
          `/api/signup?email=${encodeURIComponent(googleEmail)}`,
          {
            cache: "no-store",
          }
        );

        if (!checkResponse.ok) {
          const { error: signOutError } =
  await supabase.auth.signOut({
    scope: "local",
  });

if (signOutError) {
  console.error(
    "Google signup sign-out error:",
    signOutError
  );
}
          sessionStorage.removeItem("flowsync_signup_company");

          toast.error("Unable to verify your FlowSync account");
          return;
        }

        const checkData = await checkResponse.json();

        /*
         * Existing Google user:
         * sign out and send them to Login.
         */

if (checkData.exists) {
  const { error: signOutError } =
    await supabase.auth.signOut({
      scope: "local",
    });

  if (signOutError) {
    console.error(
      "Google signup sign-out error:",
      signOutError
    );
  }

  sessionStorage.removeItem("flowsync_google_signup");
  sessionStorage.removeItem("flowsync_signup_company");

  sessionStorage.setItem(
    "flowsync_home_toast",
    "You already have a FlowSync account. Please log in from the Home page to continue."
  );

  window.location.replace("/");
  return;
}
        /*
         * New Google user:
         * create the FlowSync workspace.
         */
        const workspaceResponse = await fetch("/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: googleName,
            email: googleEmail,
            company: savedCompany.trim() || null,
            userId: user.id,
          }),
        });

        const workspaceData = await workspaceResponse.json();

        if (!workspaceResponse.ok) {
          const { error: signOutError } = await supabase.auth.signOut({
  scope: "local",
});

if (signOutError) {
  console.error("Sign out error:", signOutError);
}

          sessionStorage.removeItem("flowsync_signup_company");

          toast.error(
            workspaceData.error || "Failed to create workspace"
          );

          return;
        }

        /*
         * Google OAuth automatically signs the user in.
         * Your desired signup flow is:
         *
         * Google signup
         * → Success
         * → Home
         * → Login
         * → Dashboard
         */
        const { error: signOutError } = await supabase.auth.signOut({
  scope: "local",
});

if (signOutError) {
  console.error("Sign out error:", signOutError);
}

        sessionStorage.removeItem("flowsync_signup_company");

        setSignupSuccess(true);

        setTimeout(() => {
          window.location.replace("/");
        }, 3000);
      } catch (error) {
        console.error("Google signup return error:", error);

        const { error: signOutError } =
  await supabase.auth.signOut({
    scope: "local",
  });

if (signOutError) {
  console.error(
    "Sign out error:",
    signOutError
  );
}

        sessionStorage.removeItem("flowsync_google_signup");
        sessionStorage.removeItem("flowsync_signup_company");

        toast.error("Something went wrong during Google signup");
      }
    };

    handleGoogleSignupReturn();
  }, []);

  /*
   * Manual email/password signup.
   *
   * IMPORTANT:
   * Workspace is NOT created here.
   * It is created only after email OTP verification.
   */

  const handleSignup = async () => {
  if (!name.trim() || !email.trim() || !password.trim()) {
    toast.error("Please fill in all required fields");
    return;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  setLoading(true);

  try {
    /*
     * First check whether this email already has
     * a FlowSync workspace.
     */
    const checkResponse = await fetch(
      `/api/signup?email=${encodeURIComponent(normalizedEmail)}`,
      {
        cache: "no-store",
      }
    );

    if (!checkResponse.ok) {
      toast.error("Unable to check this email address");
      return;
    }

    const checkData = await checkResponse.json();

    /*
     * Existing FlowSync user:
     * do not start another signup.
     */
    if (checkData.exists) {
  await supabase.auth.signOut({ scope: "local" });

  sessionStorage.setItem(
    "flowsync_home_toast",
    "This email already has a FlowSync account. Please log in from the Home page to continue."
  );

  window.location.replace("/");
  return;
}

    /*
     * New FlowSync user:
     * create the Supabase Auth account.
     */
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          name: name.trim(),
          company: company.trim() || null,
        },
      },
    });

    if (error) {
      const message = error.message.toLowerCase();

      /*
       * Handle any direct duplicate-email error returned
       * by Supabase.
       */
      if (
  message.includes("already registered") ||
  message.includes("already exists") ||
  message.includes("email_exists")
) {
  await supabase.auth.signOut({ scope: "local" });

  sessionStorage.setItem(
    "flowsync_home_toast",
    "This email already has a FlowSync account. Please log in from the Home page to continue."
  );

  window.location.replace("/");
  return;
}

      toast.error(error.message);
      return;
    }

    if (!data.user) {
      toast.error("Unable to create account");
      return;
    }

    /*
     * Email confirmation is enabled.
     * Do not create the workspace yet.
     */
    setVerificationEmail(normalizedEmail);
    setVerificationCode("");
    setShowVerification(true);

    toast.success(
      "Verification code sent to your email"
    );
  } catch (error) {
    console.error("Signup error:", error);
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};

  const handleResendCode = async () => {
  try {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: verificationEmail,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    setVerificationCode("");
    toast.success("A new verification code has been sent.");
  } catch (error) {
    console.error("Resend verification error:", error);
    toast.error("Unable to resend verification code");
  }
};

  /*
   * Verify manual signup email using the 8-digit OTP.
   */
  const handleVerifyEmail = async () => {
    const code = verificationCode.trim();

    if (code.length !== 8) {
      toast.error("Please enter the 8-digit verification code");
      return;
    }

    setVerificationLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: verificationEmail,
        token: code,
        type: "email",
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (!data.user) {
        toast.error("Email verification failed");
        return;
      }

      /*
       * Email is now verified.
       * Create workspace only now.
       */
      const workspaceResponse = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name:
            data.user.user_metadata?.name ||
            name.trim(),
          email:
            data.user.email ||
            verificationEmail,
          company:
            data.user.user_metadata?.company ||
            company.trim() ||
            null,
          userId: data.user.id,
        }),
      });

      const workspaceData = await workspaceResponse.json();

      if (!workspaceResponse.ok) {
        toast.error(
          workspaceData.error ||
            "Failed to create workspace"
        );
        return;
      }

      /*
       * Do not keep the user logged in after signup.
       * They should return Home and explicitly Login.
       */
      const { error: signOutError } = await supabase.auth.signOut({
  scope: "local",
});

if (signOutError) {
  console.error("Sign out error:", signOutError);
}

      setShowVerification(false);
      setVerificationCode("");
      setSignupSuccess(true);

      setTimeout(() => {
        window.location.replace("/");
      }, 3000);
    } catch (error) {
      console.error("Verification error:", error);
      toast.error(
        "Something went wrong during email verification"
      );
    } finally {
      setVerificationLoading(false);
    }
  };

  /*
   * Start Google signup.
   */

  const handleGoogleSignup = async () => {
  try {
    sessionStorage.setItem(
      "flowsync_signup_company",
      company.trim()
    );

    sessionStorage.setItem(
      "flowsync_google_signup",
      "true"
    );

    setGoogleLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/signup`,
      },
    });

    if (error) {
      sessionStorage.removeItem(
        "flowsync_google_signup"
      );

      sessionStorage.removeItem(
        "flowsync_signup_company"
      );

      setGoogleLoading(false);

      toast.error(error.message);
    }
  } catch (error) {
    console.error("Google signup start error:", error);

    sessionStorage.removeItem(
      "flowsync_google_signup"
    );

    sessionStorage.removeItem(
      "flowsync_signup_company"
    );

    setGoogleLoading(false);

    toast.error("Unable to start Google signup");
  }
};

  /*
   * Google signup / email signup success screen.
   */
  if (signupSuccess) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white border border-gray-200 rounded-[22px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] px-8 py-12">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-9 h-9 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Signup Successful
            </h1>

            <p className="text-sm text-gray-500 mt-3">
              Your FlowSync workspace has been created
              successfully.
            </p>

            <p className="text-xs text-gray-400 mt-5">
              Returning to FlowSync home...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Manual email verification screen.
   */
  if (showVerification) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[510px]">
          <div className="relative bg-white border border-gray-200 rounded-[22px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] px-8 py-8">

            {/* Back to signup */}
            <button
              type="button"
              onClick={() => {
                setShowVerification(false);
                setVerificationCode("");
              }}
              className="absolute top-5 left-5 w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
              aria-label="Back to signup"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                F
              </div>

              <span className="text-2xl font-bold text-gray-900">
                FlowSync
              </span>
            </div>

            {/* Header */}
            <div className="text-center">
              <h1 className="text-[25px] font-bold text-gray-900">
                Verify your email
              </h1>

              <p className="text-sm text-gray-500 mt-2">
                We sent a 8-digit verification code to
              </p>

              <p className="text-sm font-semibold text-gray-900 mt-1 break-all">
                {verificationEmail}
              </p>
            </div>

            {/* OTP */}
            <div className="mt-7">
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={8}
                value={verificationCode}
                onChange={(e) => {
                  const value =
                    e.target.value.replace(/\D/g, "");

                  setVerificationCode(
                    value.slice(0, 8)
                  );
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleVerifyEmail();
                  }
                }}
                placeholder="Enter 8-digit code"
                className="w-full h-12 text-center tracking-[0.35em] text-lg font-semibold rounded-xl border border-gray-200 bg-gray-50 text-gray-900 outline-none focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
              />

              <button
                type="button"
                onClick={handleVerifyEmail}
                disabled={
                  verificationLoading ||
                  verificationCode.length !== 8
                }
                className="w-full h-12 mt-5 rounded-xl bg-black text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-900 transition disabled:opacity-50"
              >
                {verificationLoading
                  ? "Verifying..."
                  : "Verify Email"}

                {!verificationLoading && (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>

              <button
  type="button"
  onClick={handleResendCode}
  className="w-full mt-3 text-sm font-medium text-violet-600 hover:text-violet-700 transition"
>
  Resend verification code
</button>

              <p className="text-center text-xs text-gray-400 mt-5">
                Enter the verification code sent to your
                email.
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            © {new Date().getFullYear()} FlowSync. All rights reserved.
          </p>
        </div>
      </main>
    );
  }

  /*
   * Normal signup page.
   */
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[510px]">
        {/* Signup Card */}
        <div className="relative bg-white border border-gray-200 rounded-[22px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] px-8 py-8">

          {/* Back Button */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="absolute top-5 left-5 w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
              F
            </div>

            <span className="text-2xl font-bold text-gray-900">
              FlowSync
            </span>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-[25px] leading-tight font-bold text-gray-900">
              Create your free workspace
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              No credit card required. 14-day free trial.
            </p>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="w-full h-[47px] rounded-xl border border-gray-300 bg-white text-gray-800 font-semibold text-sm flex items-center justify-center gap-3 hover:bg-gray-50 transition disabled:opacity-60"
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
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-gray-200" />

            <span className="text-xs text-gray-400">
              OR
            </span>

            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Fields */}
          <div className="space-y-4">

            {/* Name */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-500" />

              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full h-[47px] rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-500" />

              <input
                type="email"
                placeholder="Work Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full h-[47px] rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
              />
            </div>

            {/* Company */}
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-500" />

              <input
                type="text"
                placeholder="Company/Agency Name (Optional)"
                value={company}
                onChange={(e) =>
                  setCompany(e.target.value)
                }
                className="w-full h-[47px] rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-500" />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSignup();
                  }
                }}
                className="w-full h-[47px] rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
              />
            </div>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={handleSignup}
            disabled={loading}
            className="w-full h-[47px] mt-5 rounded-xl bg-black text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-900 transition disabled:opacity-60"
          >
            {loading
              ? "Sending verification code..."
              : "Launch Free Workspace"}

            {!loading && (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>

          {/* Login */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="font-semibold text-violet-600 hover:text-violet-700"
            >
              Login
            </button>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} FlowSync. All rights reserved.
        </p>
      </div>
    </main>
  );
}