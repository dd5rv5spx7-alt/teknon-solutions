import React from 'react';
import { MessageCircle } from 'lucide-react';
import { CONTACT } from '../data/siteData.js';

export default function WhatsAppButton() {
  const href = `https://wa.me/${CONTACT.phoneRaw}?text=${encodeURIComponent(CONTACT.whatsappMessage)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with A Teknon Solutions on WhatsApp"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 grid place-items-center rounded-full bg-[#25D366] text-white shadow-card-lg hover:scale-105 active:scale-95 transition-transform"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30" style={{ animation: 'ping 1.2s cubic-bezier(0,0,0.2,1) 3' }} aria-hidden="true" />
      <MessageCircle size={26} className="relative z-10" />
    </a>
  );
}
