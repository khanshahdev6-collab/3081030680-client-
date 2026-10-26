import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { StoreSettings } from '../types';
import { storeService } from '../services/storeService';
import { Language, translations } from '../utils/i18n';

interface FooterProps {
  settings: StoreSettings;
  onNavigate: (view: string, param?: string) => void;
  lang?: Language;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  lang = 'en',
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const t = translations[lang];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    storeService.subscribeNewsletter(email);
    setSubscribed(true);
    setEmail('');
  };

  const googleMapsUrl =
    'https://www.google.com/maps/search/?api=1&query=Makeup+Junction%2C+1+Iqbal+Town%2C+Islamabad%2C+Pakistan';

  return (
    <footer className="bg-[#282326] text-[#FFFDF9] pt-16 pb-12 border-t border-[#282326]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Section */}
        <div className="bg-[#342D31] rounded-3xl p-8 sm:p-12 mb-16 border border-white/5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A46D] block mb-1">
              Privilege Club
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
              Receive Beauty Edit & Exclusive Islamabad Invitations
            </h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Subscribe to discover new arrivals, shade releases, skincare guidance, and private VIP promotional offers.
            </p>
          </div>

          <div className="w-full lg:w-auto min-w-[320px]">
            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/50 border border-emerald-500/20 px-4 py-3 rounded-2xl text-xs font-medium">
                <Check className="w-4 h-4 shrink-0" />
                <span>Thank you! You are subscribed to Makeup Junction news.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/30 border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#C8798D] flex-1"
                />
                <button
                  type="submit"
                  className="bg-[#C8798D] hover:bg-[#B76277] text-white px-5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            <p className="text-[10px] text-white/40 mt-2">
              We respect your privacy. Unsubscribe anytime with one click.
            </p>
          </div>
        </div>

        {/* 4-Column Footer Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Column 1: Store & Identity */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold tracking-tight text-white">
              Makeup Junction
            </h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Your premier cosmetics boutique located in Iqbal Town, Islamabad. Curating 100% authentic international makeup, clinical skincare, and luxury fragrances.
            </p>

            <div className="space-y-2 text-xs text-white/80 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" />
                <span>
                  {settings.address}, {settings.city}, {settings.postalCode}, Pakistan
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A46D] shrink-0" />
                <a
                  href={`tel:${settings.phone}`}
                  className="hover:text-[#C8798D] transition-colors tabular-nums"
                >
                  {settings.phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#25D366] transition-colors"
                >
                  WhatsApp: +92 308 1030680
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C5A46D] shrink-0" />
                <span>{settings.openingHours}</span>
              </div>
            </div>

            <div className="pt-1">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C5A46D] hover:underline"
              >
                <span>Get Directions on Google Maps</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Beauty Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <button
                  onClick={() => onNavigate('shop', 'makeup')}
                  className="hover:text-[#C8798D] transition-colors"
                >
                  Makeup & Complexion
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'skincare')}
                  className="hover:text-[#C8798D] transition-colors"
                >
                  Clinical Skincare & Serums
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'lipsticks')}
                  className="hover:text-[#C8798D] transition-colors"
                >
                  Lipsticks & Lip Oils
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'foundations')}
                  className="hover:text-[#C8798D] transition-colors"
                >
                  Foundations & Concealers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'fragrances')}
                  className="hover:text-[#C8798D] transition-colors"
                >
                  Haute Fragrances
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'tools')}
                  className="hover:text-[#C8798D] transition-colors"
                >
                  Velvet Brushes & Tools
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#C8798D] transition-colors"
                >
                  Store Location & Hours
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('account')}
                  className="hover:text-[#C8798D] transition-colors"
                >
                  Order History & Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-[#C8798D] transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shipping-policy')}
                  className="hover:text-[#C8798D] transition-colors"
                >
                  Shipping & Delivery Across Pakistan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('refund-policy')}
                  className="hover:text-[#C8798D] transition-colors"
                >
                  Returns & Exchange Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy-policy')}
                  className="hover:text-[#C8798D] transition-colors"
                >
                  Privacy Policy & Data Security
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-[#C8798D] transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Store Authenticity & Admin */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Authenticity Guarantee
            </h4>
            <p className="text-xs text-white/70 leading-relaxed mb-4">
              Every product in our store is 100% genuine and verified. We ship securely packaged with Cash on Delivery nationwide.
            </p>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs space-y-1.5 mb-4">
              <span className="text-[11px] font-semibold text-[#C5A46D] block">
                Cash on Delivery (COD)
              </span>
              <p className="text-[11px] text-white/60">
                Inspect package before payment upon courier arrival.
              </p>
            </div>

            <button
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Store Management Admin</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Makeup Junction, Islamabad. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Plus Code: {settings.plusCode}</span>
            <span>·</span>
            <span>Made for Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
