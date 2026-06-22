"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWaLink } from "@/lib/wa";
import SocialIcon from "./SocialIcon";
import type { SocialMediaItem } from "@/types";

type ContactSectionProps = {
  settings: {
    contactEmail?: string;
    contactPhone?: string;
    contactAddress?: string;
    contactMapUrl?: string;
    operatingHours?: string;
    socialMedia?: SocialMediaItem[];
    whatsappNumber?: string;
    whatsappMessage?: string;
  };
};

const contactItems = (
  settings: ContactSectionProps["settings"]
) => [
  { icon: MapPin, label: "Alamat", value: settings.contactAddress },
  { icon: Phone, label: "Telepon", value: settings.contactPhone, href: `tel:${settings.contactPhone}` },
  { icon: Mail, label: "Email", value: settings.contactEmail, href: `mailto:${settings.contactEmail}` },
  { icon: Clock, label: "Jam Operasional", value: settings.operatingHours },
];

export default function ContactSection({ settings }: ContactSectionProps) {
  return (
    <section id="kontak" className="py-16 sm:py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-text-primary mb-3">
            Hubungi <span className="text-maroon">Kami</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Punya pertanyaan atau butuh bantuan? Hubungi kami melalui kontak di bawah ini
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contactItems(settings).map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-5 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-maroon/10 text-maroon flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-1">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-sm text-text-primary hover:text-maroon transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm text-text-primary">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* WhatsApp CTA & Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {/* WhatsApp CTA */}
            <div className="bg-gradient-to-br from-[#25D366] to-[#128C7E] p-6 rounded-xl text-white text-center">
              <MessageCircle className="w-10 h-10 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">
                Chat via WhatsApp
              </h3>
              <p className="text-sm text-white/80 mb-4">
                Respons cepat untuk pertanyaan Anda
              </p>
              <a
                href={buildWaLink(
                  settings.whatsappNumber || "6285234567890",
                  settings.whatsappMessage
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#25D366] px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-white/90 transition-colors shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                Hubungi Kami
              </a>
            </div>

            {/* Social Media */}
            {settings.socialMedia && settings.socialMedia.filter(s => s.active && s.url).length > 0 && (
              <div className="bg-white p-5 rounded-xl border border-border text-center">
                <p className="text-sm font-medium text-text-primary mb-3">
                  Ikuti Kami
                </p>
                <div className="flex justify-center gap-3">
                  {settings.socialMedia
                    .filter((s) => s.active && s.url)
                    .map((s) => (
                      <a
                        key={s.platform}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-cream text-maroon hover:bg-maroon hover:text-white flex items-center justify-center transition-colors"
                      >
                        <SocialIcon platform={s.platform} className="w-4 h-4" />
                      </a>
                    ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}