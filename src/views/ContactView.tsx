import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Mail,
  Send,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { StoreSettings } from '../types';

interface ContactViewProps {
  settings: StoreSettings;
}

export const ContactView: React.FC<ContactViewProps> = ({ settings }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Product Shade Inquiry',
    message: '',
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({
        name: '',
        phone: '',
        email: '',
        subject: 'Product Shade Inquiry',
        message: '',
      });
    }, 3000);
  };

  const googleMapsUrl =
    'https://www.google.com/maps/search/?api=1&query=Makeup+Junction%2C+1+Iqbal+Town%2C+Islamabad%2C+Pakistan';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#A9874F] block mb-1">
          Visit Us or Reach Out
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#282326]">
          Contact Makeup Junction
        </h1>
        <p className="text-xs sm:text-sm text-[#5E555A] mt-2">
          We welcome you to visit our physical showroom in Iqbal Town, Islamabad, or reach our concierge team online.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Store Details & Google Maps (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#282326]/10 shadow-xs space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#282326] pb-3 border-b border-stone-100">
              Boutique Store Information
            </h2>

            <div className="space-y-4 text-xs text-[#282326]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F8E8EC] flex items-center justify-center text-[#C8798D] shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-sm font-semibold">Store Address</strong>
                  <p className="text-[#5E555A] mt-0.5 leading-relaxed">
                    1, Iqbal Town, Islamabad, 43000, Pakistan
                  </p>
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    Plus Code: {settings.plusCode}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F8E8EC] flex items-center justify-center text-[#C8798D] shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-sm font-semibold">Opening Hours</strong>
                  <p className="text-[#5E555A] mt-0.5">{settings.openingHours}</p>
                  <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                    Open until 11:00 PM for evening beauty testing & pickup.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F8E8EC] flex items-center justify-center text-[#C8798D] shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-sm font-semibold">Call & Support</strong>
                  <a
                    href={`tel:${settings.phone}`}
                    className="text-[#C8798D] hover:underline font-medium tabular-nums block mt-0.5"
                  >
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-[#25D366] shrink-0 mt-0.5">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-sm font-semibold">Official WhatsApp</strong>
                  <a
                    href={`https://wa.me/${settings.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#25D366] hover:underline font-medium tabular-nums block mt-0.5"
                  >
                    +92 308 1030680
                  </a>
                  <span className="text-[11px] text-stone-400 block mt-0.5">
                    Fast response for swatches, shade matching & order verification.
                  </span>
                </div>
              </div>
            </div>

            {/* Google Maps Directions Button */}
            <div className="pt-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#282326] hover:bg-[#C8798D] text-white py-3 px-4 rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Store visual showcase card */}
          <div className="rounded-3xl overflow-hidden border border-[#282326]/10 shadow-sm bg-white">
            <img
              src="/src/assets/images/store_front_boutique_1793032176303.jpg"
              alt="Makeup Junction Physical Store interior"
              className="w-full h-48 object-cover"
            />
            <div className="p-4 text-xs text-[#5E555A]">
              <span className="font-semibold text-[#282326] block">Physical Showroom Atmosphere</span>
              Testers for foundations, lipsticks, and fragrances under verified beauty lighting.
            </div>
          </div>
        </div>

        {/* Right Column: Contact Inquiry Form (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-[#282326]/10 shadow-xs space-y-6">
          <div className="pb-3 border-b border-stone-100">
            <h2 className="font-serif text-xl font-bold text-[#282326]">
              Send a Message or Shade Request
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Have questions regarding formulation, availability, or delivery? Write to our beauty advisors.
            </p>
          </div>

          {sent ? (
            <div className="p-8 text-center bg-[#FCF4F6] rounded-2xl border border-[#F2D2DA] space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-[#282326]">
                Message Delivered to Store Concierge
              </h3>
              <p className="text-xs text-[#5E555A]">
                Thank you! Our team will reply shortly via phone or WhatsApp at +92 308 1030680.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#282326] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fatima Ali"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8798D]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#282326] mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0300-1234567"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8798D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#282326] mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8798D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#282326] mb-1">
                  Inquiry Topic
                </label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8798D]"
                >
                  <option value="Product Shade Inquiry">Product Shade & Undertone Inquiry</option>
                  <option value="Store Visit & Tester Availability">Store Visit & Tester Availability</option>
                  <option value="Delivery & Order Tracking">Delivery & Nationwide COD Status</option>
                  <option value="Bulk or Bridal Order">Bridal / Wedding Beauty Package</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#282326] mb-1">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe what product you are looking for, shade preferences, or delivery instructions..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C8798D]"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#282326] hover:bg-[#C8798D] text-white py-3 px-6 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Send Inquiry to Store</span>
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-stone-100 flex items-center gap-2 text-stone-400 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-[#C5A46D] shrink-0" />
            <span>Direct boutique communication · No third-party spam.</span>
          </div>
        </div>

      </div>

    </div>
  );
};
