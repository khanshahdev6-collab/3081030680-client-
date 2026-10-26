import React from 'react';
import { ShieldCheck, Heart, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { StoreSettings } from '../types';

interface AboutViewProps {
  settings: StoreSettings;
  onNavigate: (view: string, param?: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ settings, onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Narrative */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#A9874F] block">
          Our Heritage & Passion
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#282326] leading-tight">
          Redefining Luxury Beauty in Islamabad & Across Pakistan
        </h1>
        <p className="text-xs sm:text-sm text-[#5E555A] leading-relaxed">
          Makeup Junction was founded in Iqbal Town, Islamabad, with a single guiding mission: to bring 100% authentic, world-class cosmetics and personalized beauty consultation to women who demand excellence.
        </p>
      </div>

      {/* Visual Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-6 rounded-3xl overflow-hidden shadow-xl border border-[#282326]/10">
          <img
            src="/src/assets/images/store_front_boutique_1793032176303.jpg"
            alt="Makeup Junction Boutique Interior, Islamabad"
            className="w-full h-auto object-cover aspect-[4/3]"
          />
        </div>

        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C8798D]">
            Authenticity First
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#282326] leading-snug">
            No Compromises on What Touches Your Skin
          </h2>
          <p className="text-xs sm:text-sm text-[#5E555A] leading-relaxed">
            In an era where counterfeit cosmetics flood digital marketplaces, Makeup Junction stands as an unshakeable pillar of authenticity. Every foundation, liquid lipstick, and dermatological serum on our shelves is meticulously sourced, sealed, and verified.
          </p>
          <p className="text-xs sm:text-sm text-[#5E555A] leading-relaxed">
            Whether you step inside our boutique at 1, Iqbal Town, Islamabad, or order via our online portal with nationwide Cash on Delivery, you receive genuine luxury backed by our store guarantee.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('shop')}
              className="bg-[#282326] hover:bg-[#C8798D] text-white text-xs font-bold px-6 py-3 rounded-full uppercase tracking-wider transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="border border-[#282326]/20 hover:bg-[#F8E8EC] text-[#282326] text-xs font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Visit Iqbal Town Store
            </button>
          </div>
        </div>
      </div>

      {/* 3 Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        <div className="bg-white p-8 rounded-3xl border border-[#282326]/10 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F8E8EC] text-[#C8798D] flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#282326]">
            Strict Authenticity
          </h3>
          <p className="text-xs text-[#5E555A] leading-relaxed">
            We partner with authorized distributors and directly inspect every batch to ensure formula freshness and integrity.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#282326]/10 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F8E8EC] text-[#C8798D] flex items-center justify-center mb-4">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#282326]">
            Personalized Beauty Guidance
          </h3>
          <p className="text-xs text-[#5E555A] leading-relaxed">
            Our beauty consultants help you find the precise foundation undertone, lip shade, or serum match for your unique skin type.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#282326]/10 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F8E8EC] text-[#C8798D] flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#282326]">
            Deep Local Islamabad Roots
          </h3>
          <p className="text-xs text-[#5E555A] leading-relaxed">
            Located at 1, Iqbal Town, Islamabad, we understand the local climate, skincare needs, and provide rapid citywide fulfillment.
          </p>
        </div>
      </div>

    </div>
  );
};
