"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavbarProps = {
  settings?: {
    brandName?: string;
    logo?: string;
    tagline?: string;
  };
};

const navLinks = [
  { href: "#hero", label: "Beranda" },
  { href: "#katalog", label: "Katalog" },
  { href: "#tentang", label: "Tentang" },
  { href: "#kontak", label: "Kontak" },
];

export default function Navbar({ settings }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "glass shadow-sm py-2"
            : "bg-transparent py-4"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#hero");
            }}
            className="flex items-center gap-2"
          >
            <span className="text-xl sm:text-2xl font-bold font-fredoka">
              <span className="text-maroon">Muara</span>{" "}
              <span className="text-orange">Teweh</span>
            </span>
            {settings?.tagline && (
              <span className="hidden sm:block text-xs text-muted-foreground border-l pl-2 ml-2">
                {settings.tagline}
              </span>
            )}
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-maroon transition-colors rounded-md hover:bg-maroon/5"
              >
                {link.label}
              </button>
            ))}
            <Button
              size="sm"
              className="ml-4"
              onClick={() => handleNavClick("#katalog")}
            >
              Lihat Katalog
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-maroon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sheet */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-6 pt-20">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="w-full text-left px-4 py-3 text-base font-medium text-text-secondary hover:text-maroon hover:bg-maroon/5 rounded-lg transition-colors"
              >
                {link.label}
              </button>
            ))}
            <Button
              className="mt-4 w-full"
              onClick={() => handleNavClick("#katalog")}
            >
              Lihat Katalog
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}