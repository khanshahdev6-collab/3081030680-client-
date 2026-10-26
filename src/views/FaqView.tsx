import React, { useState } from 'react';
import { ChevronDown, MessageCircle, HelpCircle } from 'lucide-react';
import { StoreSettings } from '../types';

interface FaqViewProps {
  settings: StoreSettings;
  onNavigate: (view: string) => void;
}

const FAQS = [
  {
    q: 'Are all cosmetics and skincare products 100% authentic?',
    a: 'Yes, absolutely. At Makeup Junction, authenticity is our highest priority. We source directly from authorized brand distributors and official importers. Every cosmetic, serum, and fragrance is sealed and genuine.',
  },
  {
    q: 'How does Cash on Delivery (COD) work across Pakistan?',
    a: 'We offer Cash on Delivery to all major cities and towns across Pakistan, including Islamabad, Rawalpindi, Lahore, Karachi, Peshawar, Faisalabad, and Multan. You pay the exact amount in cash directly to the courier rider upon delivery of your parcel.',
  },
  {
    q: 'How long does delivery take in Islamabad & Rawalpindi versus other cities?',
    a: 'For Islamabad and Rawalpindi, orders placed before 3:00 PM are typically fulfilled same-day or within 24 hours. For other cities across Pakistan (e.g. Lahore, Karachi), delivery takes 2 to 4 working days via reputable couriers (TCS / Leopards).',
  },
  {
    q: 'What is the threshold for Free Delivery?',
    a: 'Free Delivery is automatically applied on all orders totaling Rs. 3,000 or more across Pakistan. For orders below this threshold, standard delivery is Rs. 250 (or Rs. 150 within Islamabad).',
  },
  {
    q: 'Can I test products in person before purchasing?',
    a: 'Yes! We encourage customers to visit our boutique showroom at 1, Iqbal Town, Islamabad. We have dedicated beauty counters and tester stations with verified lighting to try foundation shades, lip colors, and perfumes.',
  },
  {
    q: 'Can I order directly through WhatsApp?',
    a: 'Yes! You can browse our website and click "Order via WhatsApp" from the cart or product pages. This sends a prefilled message with your selected items, shades, and quantities to our store helpline at +92 308 1030680 for rapid confirmation.',
  },
  {
    q: 'What is your return and exchange policy?',
    a: 'Due to hygiene and cosmetic health standards, opened or used cosmetics cannot be returned. However, if an item arrives damaged, defective, or incorrect, please notify us within 48 hours of delivery with photographic proof for an immediate replacement or refund.',
  },
];

export const FaqView: React.FC<FaqViewProps> = ({ settings, onNavigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#A9874F] block mb-1">
          Help & Answers
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#282326]">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-[#5E555A] mt-2">
          Find clarity on nationwide shipping, shade matching, Cash on Delivery, and physical store visits in Islamabad.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl border border-[#282326]/10 shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="font-serif text-sm sm:text-base font-bold text-[#282326]">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#C8798D]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-[#5E555A] leading-relaxed border-t border-stone-100 pt-3 animate-in fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still need help CTA */}
      <div className="bg-[#FAF7F2] p-8 rounded-3xl border border-[#282326]/10 text-center space-y-4">
        <HelpCircle className="w-8 h-8 text-[#C8798D] mx-auto" />
        <h3 className="font-serif text-lg font-bold text-[#282326]">
          Have an unlisted question or need custom advice?
        </h3>
        <p className="text-xs text-[#5E555A] max-w-md mx-auto">
          Our beauty advisors in Iqbal Town, Islamabad are available daily on WhatsApp to assist with shades and queries.
        </p>
        <div className="pt-2">
          <a
            href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
              'Assalam-o-Alaikum Makeup Junction! I have a question regarding an order or product in your catalog.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white py-2.5 px-6 rounded-full text-xs font-bold transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp (+92 308 1030680)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
