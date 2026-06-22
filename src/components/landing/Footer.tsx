"use client";

import { useState, useEffect } from "react";
import { ChevronUp, MapPin, Phone, Mail, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import SocialIcon from "./SocialIcon";
import type { SocialMediaItem } from "@/types";

type FooterProps = {
  settings: {
    brandName?: string;
    footerDescription?: string;
    footerEmail?: string;
    footerPhone?: string;
    footerAddress?: string;
    footerOperatingHours?: string;
    socialMedia?: SocialMediaItem[];
  };
};

const quickLinks = [
  { label: "Beranda", href: "#hero" },
  { label: "Katalog Produk", href: "#katalog" },
  { label: "Tentang Kami", href: "#tentang" },
  { label: "Kontak", href: "#kontak" },
];

export default function Footer({ settings }: FooterProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#1A1A2E] text-white">
      {/* Gradient Border Top */}
      <div className="h-1 bg-gradient-to-r from-maroon via-orange to-maroon" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold font-fredoka mb-4">
              <span className="text-maroon-light">Muara</span>{" "}
              <span className="text-orange">Teweh</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {settings?.footerDescription ||
                "Toko mebel online terpercaya di Muara Teweh."}
            </p>

            {/* Social Media */}
            {settings?.socialMedia && (
              <div className="flex gap-3">
                {settings.socialMedia
                  .filter((s) => s.active && s.url)
                  .map((s) => (
                    <a
                      key={s.platform}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-maroon flex items-center justify-center transition-colors"
                    >
                      <SocialIcon platform={s.platform} className="w-4 h-4" />
                    </a>
                  ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold mb-4 text-white/90">
              Tautan Cepat
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .querySelector(link.href)
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-sm text-gray-400 hover:text-orange transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base font-semibold mb-4 text-white/90">
              Kontak
            </h4>
            <ul className="space-y-4">
              {settings?.footerAddress && (
                <li className="flex gap-3 text-sm text-gray-400">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-orange" />
                  <span>{settings.footerAddress}</span>
                </li>
              )}
              {settings?.footerPhone && (
                <li className="flex gap-3 text-sm text-gray-400">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0 text-orange" />
                  <a
                    href={`tel:${settings.footerPhone}`}
                    className="hover:text-orange transition-colors"
                  >
                    {settings.footerPhone}
                  </a>
                </li>
              )}
              {settings?.footerEmail && (
                <li className="flex gap-3 text-sm text-gray-400">
                  <Mail className="w-4 h-4 mt-0.5 shrink-0 text-orange" />
                  <a
                    href={`mailto:${settings.footerEmail}`}
                    className="hover:text-orange transition-colors"
                  >
                    {settings.footerEmail}
                  </a>
                </li>
              )}
              {settings?.footerOperatingHours && (
                <li className="flex gap-3 text-sm text-gray-400">
                  <Clock className="w-4 h-4 mt-0.5 shrink-0 text-orange" />
                  <span>{settings.footerOperatingHours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Muara Teweh Furniture. Hak Cipta
          Dilindungi.
        </div>
      </div>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-40 w-10 h-10 rounded-full bg-maroon text-white shadow-lg hover:bg-maroon-light transition-all flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </footer>
  );
}