"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const handleLogout = async () => {
  console.log("Logout clicked");

  const { error: signOutError } = await supabase.auth.signOut({
  scope: "local",
});

if (signOutError) {
  console.error("Sign out error:", signOutError);
}

  console.log("Signed out");

  window.location.href = "/";
  };

  useEffect(() => {
  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  };

  getUser();

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 20);
  };

  window.addEventListener("scroll", handleScroll);

  return () =>
    window.removeEventListener(
      "scroll",
      handleScroll
    );
}, []);

  return (
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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold tracking-tight">FlowSync</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#workflow" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Workflow</a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
           {user ? (
  <>
    <span className="text-sm text-muted-foreground">
      {user.email}
    </span>

    <button
      onClick={handleLogout}
      className="text-sm font-medium hover:text-primary-600"
    >
      Logout
    </button>
  </>
) : (
  <button
    onClick={() => {
      router.push("/login");
    }}
    className="text-sm font-medium hover:text-primary-600"
  >
    Log in
  </button>
)}
            <button 
              onClick={() => router.push("/signup")}
              className="text-sm font-medium bg-foreground text-background hover:bg-foreground/90 px-4 py-2 rounded-full transition-colors flex items-center gap-2 cursor-pointer"
            >
              Start Free
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground cursor-pointer"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border shadow-lg py-4 px-4 flex flex-col space-y-4">
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium">Features</a>
          <a href="#workflow" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium">Workflow</a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium">Pricing</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium">FAQ</a>
          <div className="h-px bg-border my-2" />
         
          {user ? (
  <button
    onClick={handleLogout}
    className="text-base font-medium text-left"
  >
    Logout
  </button>
) : (
  <button
    onClick={() => {
      router.push("/login");
    }}
    className="text-base font-medium text-left"
  >
    Log in
  </button>
)}
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              router.push("/signup");
            }}
            className="text-base font-medium bg-foreground text-background px-4 py-2 rounded-lg text-center cursor-pointer"
          >
            Start Free
          </button>
        </div>
      )}
    </nav>
  );
}
