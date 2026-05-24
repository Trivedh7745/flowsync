"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X, ArrowRight } from "lucide-react";

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
            <button 
              onClick={() => alert("FlowSync Simulated Login:\nIn a production app, this would route to your Cognito, Auth0, or custom backend portal.")}
              className="text-sm font-medium hover:text-primary-600 transition-colors cursor-pointer"
            >
              Log in
            </button>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent("open-modal", { detail: { type: "signup" } }))}
              className="text-sm font-medium bg-foreground text-background hover:bg-foreground/90 px-4 py-2 rounded-full transition-colors flex items-center gap-2 cursor-pointer"
            >
              Start Free
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground cursor-pointer"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
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
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              alert("FlowSync Simulated Login:\nIn a production app, this would route to your Cognito, Auth0, or custom backend portal.");
            }}
            className="text-base font-medium text-left w-full cursor-pointer"
          >
            Log in
          </button>
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              window.dispatchEvent(new CustomEvent("open-modal", { detail: { type: "signup" } }));
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
