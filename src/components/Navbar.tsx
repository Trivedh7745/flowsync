"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showSignoutDialog, setShowSignoutDialog] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Load current authenticated user
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    loadUser();

    // Listen for login/logout changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Handle navbar scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut({
      scope: "local",
    });

    if (error) {
      console.error("Sign out error:", error);
      toast.error("Unable to sign out");
      return;
    }

    setShowSignoutDialog(false);
    setUser(null);
    setMobileMenuOpen(false);

    toast.success("Signed out successfully");

    // Stay on Home
    router.replace("/");
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>

              <span className="text-xl font-bold tracking-tight">
                FlowSync
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>

              <a
                href="#workflow"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Workflow
              </a>

              <a
                href="#pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </a>

              <a
                href="#faq"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                FAQ
              </a>
            </div>

            {/* Desktop Right Side Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="text-sm font-medium bg-foreground text-background hover:bg-foreground/90 px-4 py-2 rounded-full transition-colors cursor-pointer"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={() => setShowSignoutDialog(true)}
                    className="text-sm font-medium hover:text-primary-600 transition-colors cursor-pointer"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push("/login")}
                    className="text-sm font-medium hover:text-primary-600 transition-colors cursor-pointer"
                  >
                    Log in
                  </button>

                  <button
                    onClick={() => router.push("/signup")}
                    className="text-sm font-medium bg-foreground text-background hover:bg-foreground/90 px-4 py-2 rounded-full transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-foreground cursor-pointer"
              >
                {mobileMenuOpen ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border shadow-lg py-4 px-4 flex flex-col space-y-4">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium"
            >
              Features
            </a>

            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium"
            >
              Workflow
            </a>

            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium"
            >
              Pricing
            </a>

            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium"
            >
              FAQ
            </a>

            <div className="h-px bg-border my-2" />

            {user ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/dashboard");
                  }}
                  className="text-base font-medium text-left"
                >
                  Dashboard
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowSignoutDialog(true);
                  }}
                  className="text-base font-medium text-left"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/login");
                  }}
                  className="text-base font-medium text-left"
                >
                  Log in
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/signup");
                  }}
                  className="text-base font-medium bg-foreground text-background px-4 py-2 rounded-lg text-center cursor-pointer"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Sign Out Confirmation Dialog */}
      {showSignoutDialog && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white border border-gray-200 shadow-2xl p-7">
            <h2 className="text-xl font-bold text-gray-900">
              Sign out?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to sign out of your FlowSync
              account?
            </p>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowSignoutDialog(false)}
                className="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="flex-1 h-11 rounded-xl bg-black text-white text-sm font-semibold hover:bg-gray-900 transition"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}