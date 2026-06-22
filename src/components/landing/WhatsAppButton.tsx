"use client";

import { MessageCircle } from "lucide-react";
import { buildWaLink } from "@/lib/wa";

type WhatsAppButtonProps = {
  phoneNumber: string;
  message?: string;
};

export default function WhatsAppButton({
  phoneNumber,
  message,
}: WhatsAppButtonProps) {
  const waLink = buildWaLink(phoneNumber, message);

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-[#20BD5A] transition-all duration-300 animate-pulse-glow group"
      aria-label="Chat via WhatsApp"
    >
      <MessageCircle size={22} className="fill-white" />
      <span className="text-sm font-medium hidden sm:inline">Chat WhatsApp</span>
    </a>
  );
}