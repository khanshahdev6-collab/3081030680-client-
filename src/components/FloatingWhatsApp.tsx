import React, { useState } from 'react';
import { MessageCircle, X, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { StoreSettings } from '../types';

interface FloatingWhatsAppProps {
  settings: StoreSettings;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ settings }) => {
  const [open, setOpen] = useState(false);

  const directChatUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
    'Assalam-o-Alaikum Makeup Junction! I have an inquiry regarding your cosmetics collection in Iqbal Town, Islamabad.'
  )}`;

  const storeInfoUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
    'Assalam-o-Alaikum! Please share your store directions and today\'s opening hours at 1, Iqbal Town, Islamabad.'
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Quick Menu Popover */}
      {open && (
        <div className="mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-[#282326]/10 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
          {/* Header */}
          <div className="bg-[#282326] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold font-serif tracking-wide">Makeup Junction Care</h4>
                <p className="text-[11px] text-white/70">Iqbal Town, Islamabad</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white p-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Notice */}
          <div className="p-4 bg-[#FCF4F6] text-xs text-[#282326]/80 border-b border-[#F2D2DA]">
            <p className="text-[11px] leading-relaxed">
              We respond promptly during store hours:
              <br />
              <strong className="text-[#9B4D60]">{settings.openingHours}</strong>
            </p>
            <p className="text-[10px] text-stone-500 mt-1 italic">
              Note: WhatsApp orders are order requests until confirmed by our store team.
            </p>
          </div>

          {/* Action options */}
          <div className="p-3 space-y-2 bg-white">
            <a
              href={directChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-[#F8E8EC] text-xs font-medium text-[#282326] transition-colors group"
            >
              <span className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Chat with Beauty Consultant</span>
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#C8798D]" />
            </a>

            <a
              href={storeInfoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-[#F8E8EC] text-xs font-medium text-[#282326] transition-colors group"
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C8798D]" />
                <span>Store Location & Directions</span>
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#C8798D]" />
            </a>
          </div>

          <div className="px-4 py-2 bg-stone-50 border-t border-stone-100 text-center">
            <span className="text-[10px] text-stone-500">
              Helpline: {settings.phone}
            </span>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group focus:outline-none"
        aria-label="Contact Makeup Junction on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="text-xs font-bold tracking-wide">
          WhatsApp Store
        </span>
      </button>
    </div>
  );
};
