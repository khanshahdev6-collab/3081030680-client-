import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Lock, FileText } from 'lucide-react';
import { StoreSettings } from '../types';

interface PolicyViewProps {
  policyType: 'shipping-policy' | 'refund-policy' | 'privacy-policy' | 'terms';
  settings: StoreSettings;
  onNavigate: (view: string) => void;
}

export const PolicyViews: React.FC<PolicyViewProps> = ({
  policyType,
  settings,
  onNavigate,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      
      {/* 1. Shipping Policy */}
      {policyType === 'shipping-policy' && (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#282326]/10 shadow-xs space-y-6 text-xs sm:text-sm text-[#5E555A] leading-relaxed">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <Truck className="w-6 h-6 text-[#C8798D]" />
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282326]">
              Shipping & Delivery Policy
            </h1>
          </div>

          <p>
            At <strong>Makeup Junction</strong> (1, Iqbal Town, Islamabad, Pakistan), we provide reliable, secure delivery across all cities and rural areas of Pakistan.
          </p>

          <h2 className="font-serif text-base font-bold text-[#282326] pt-2">
            1. Delivery Timelines
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Islamabad & Rawalpindi:</strong> Same-day or next-day delivery (within 24 hours) for orders placed before 3:00 PM.</li>
            <li><strong>Major Cities (Lahore, Karachi, Peshawar, Faisalabad, Multan):</strong> 2 to 3 business days via TCS or Leopards Courier.</li>
            <li><strong>Rest of Pakistan:</strong> 3 to 5 business days depending on courier route accessibility.</li>
          </ul>

          <h2 className="font-serif text-base font-bold text-[#282326] pt-2">
            2. Shipping Rates
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Free Delivery:</strong> All orders over <strong>Rs. {settings.freeDeliveryThreshold.toLocaleString()}</strong> qualify for complimentary delivery across Pakistan.</li>
            <li><strong>Standard Nationwide Shipping:</strong> Flat Rs. {settings.standardDeliveryFee} for orders below Rs. {settings.freeDeliveryThreshold.toLocaleString()}.</li>
            <li><strong>Local Islamabad Delivery:</strong> Flat Rs. {settings.islamabadDeliveryFee} for local Islamabad deliveries.</li>
          </ul>

          <h2 className="font-serif text-base font-bold text-[#282326] pt-2">
            3. Order Verification & Dispatch
          </h2>
          <p>
            Orders placed via Cash on Delivery may receive a brief verification WhatsApp message or phone call from our dispatch desk at <strong>+92 308 1030680</strong> before rider handover.
          </p>
        </div>
      )}

      {/* 2. Refund & Exchange Policy */}
      {policyType === 'refund-policy' && (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#282326]/10 shadow-xs space-y-6 text-xs sm:text-sm text-[#5E555A] leading-relaxed">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <RotateCcw className="w-6 h-6 text-[#C8798D]" />
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282326]">
              Returns & Refund Policy
            </h1>
          </div>

          <p>
            Because we sell cosmetic and skincare personal care items, your health and hygiene are paramount.
          </p>

          <h2 className="font-serif text-base font-bold text-[#282326] pt-2">
            1. Hygiene Standards
          </h2>
          <p>
            Due to strict hygiene regulations, opened, sampled, or unsealed cosmetics (such as lipsticks, mascaras, serums, and foundations) cannot be accepted for return or exchange unless defective upon receipt.
          </p>

          <h2 className="font-serif text-base font-bold text-[#282326] pt-2">
            2. Damaged or Incorrect Items
          </h2>
          <p>
            If your package arrives damaged in transit or contains an incorrect shade or item, please contact our support team within <strong>48 hours</strong> of courier receipt via WhatsApp at <strong>+92 308 1030680</strong> with:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Your Order Reference Number (#MJ-XXXX).</li>
            <li>Clear photos/videos of the package and damaged seal.</li>
          </ul>

          <h2 className="font-serif text-base font-bold text-[#282326] pt-2">
            3. Refund Resolution
          </h2>
          <p>
            Approved claims will receive an immediate complimentary replacement dispatched from our Iqbal Town store, or a direct bank/Easypaisa refund processed within 2-3 business days.
          </p>
        </div>
      )}

      {/* 3. Privacy Policy */}
      {policyType === 'privacy-policy' && (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#282326]/10 shadow-xs space-y-6 text-xs sm:text-sm text-[#5E555A] leading-relaxed">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <Lock className="w-6 h-6 text-[#C8798D]" />
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282326]">
              Privacy Policy & Data Security
            </h1>
          </div>

          <p>
            <strong>Makeup Junction</strong> respects your personal privacy. We never sell, rent, or distribute customer information to third-party marketing companies.
          </p>

          <h2 className="font-serif text-base font-bold text-[#282326] pt-2">
            1. Information We Collect
          </h2>
          <p>
            We collect customer details necessary to fulfill orders: your name, contact phone number, delivery address, city, and email.
          </p>

          <h2 className="font-serif text-base font-bold text-[#282326] pt-2">
            2. Payment Security
          </h2>
          <p>
            We do not collect or store raw credit card details on our servers. For Cash on Delivery, payments are collected in person by courier representatives.
          </p>

          <h2 className="font-serif text-base font-bold text-[#282326] pt-2">
            3. Communication Preferences
          </h2>
          <p>
            You may opt in to receive beauty updates or unsubscribe at any time with a single click or message to our helpline.
          </p>
        </div>
      )}

      {/* 4. Terms & Conditions */}
      {policyType === 'terms' && (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#282326]/10 shadow-xs space-y-6 text-xs sm:text-sm text-[#5E555A] leading-relaxed">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <FileText className="w-6 h-6 text-[#C8798D]" />
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282326]">
              Terms and Conditions
            </h1>
          </div>

          <p>
            Welcome to Makeup Junction. By using this website, ordering through our shopping bag, or submitting a WhatsApp order request, you agree to these terms.
          </p>

          <h2 className="font-serif text-base font-bold text-[#282326] pt-2">
            1. Store Orders & Availability
          </h2>
          <p>
            All products displayed on our website are subject to stock availability at our physical boutique in Iqbal Town, Islamabad. In the rare event of inventory discrepancy, our concierge will notify you before dispatch.
          </p>

          <h2 className="font-serif text-base font-bold text-[#282326] pt-2">
            2. WhatsApp Order Requests
          </h2>
          <p>
            Orders submitted via WhatsApp messages are treated as order requests until our store team confirms item availability and confirms delivery details.
          </p>

          <h2 className="font-serif text-base font-bold text-[#282326] pt-2">
            3. Pricing & Currency
          </h2>
          <p>
            All prices are quoted in Pakistani Rupees (PKR / Rs.) and include applicable taxes unless otherwise stated.
          </p>
        </div>
      )}

      <div className="pt-8 text-center">
        <button
          onClick={() => onNavigate('shop')}
          className="text-xs font-bold text-[#C8798D] hover:underline"
        >
          ← Return to Shopping Collection
        </button>
      </div>

    </div>
  );
};
