import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  MessageCircle,
  MapPin,
  Clock,
  Star,
  CheckCircle,
} from 'lucide-react';
import { Product, CategoryInfo, CustomerReview, StoreSettings } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Language, translations } from '../utils/i18n';

interface HomeViewProps {
  products: Product[];
  categories: CategoryInfo[];
  reviews: CustomerReview[];
  settings: StoreSettings;
  wishlist: string[];
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onNavigate: (view: string, param?: string) => void;
  onOpenReviewModal: (product?: Product) => void;
  lang?: Language;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  categories,
  reviews,
  settings,
  wishlist,
  onSelectProduct,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  onNavigate,
  onOpenReviewModal,
  lang = 'en',
}) => {
  const t = translations[lang];

  const bestsellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival || !p.isBestSeller).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. Hero Section (Editorial Split-Screen / Showcase) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F8E8EC]/60 to-[#FFFDF9] pt-8 sm:pt-14 pb-12 sm:pb-20 border-b border-[#282326]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Editorial Copy */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 border border-[#282326]/10 rounded-full shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#C8798D]" />
                <span className="text-xs font-semibold tracking-wider uppercase text-[#282326]">
                  Iqbal Town, Islamabad Boutique
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#282326] tracking-tight leading-[1.15] text-balance">
                Your Beauty.
                <br />
                <span className="italic font-normal text-[#C8798D]">Your Confidence.</span>
              </h1>

              <p className="text-sm sm:text-base text-[#5E555A] leading-relaxed max-w-xl mx-auto lg:mx-0">
                Discover your everyday essentials and elevate your beauty routine with Makeup Junction. Premium international cosmetics, skincare elixirs, and bespoke scents delivered across Pakistan.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <button
                  onClick={() => onNavigate('shop')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#282326] hover:bg-[#C8798D] text-white px-7 py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-md group"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('shop', 'bestsellers')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-[#F8E8EC] text-[#282326] border border-[#282326]/20 px-7 py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition-colors shadow-2xs"
                >
                  <span>Explore Bestsellers</span>
                </button>
              </div>

              {/* Quick Store Highlights */}
              <div className="pt-6 border-t border-[#282326]/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#5E555A]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C5A46D]" />
                  <span>100% Genuine Guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#C5A46D]" />
                  <span>Cash on Delivery Nationwide</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C8798D]" />
                  <span>Physical Store in Islamabad</span>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Hero Campaign Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border border-[#282326]/10 bg-white">
                <img
                  src="/src/assets/images/hero_luxury_beauty_campaign_1793032174160.jpg"
                  alt="Makeup Junction Luxury Campaign"
                  className="w-full h-auto object-cover aspect-[4/3] sm:aspect-[16/10]"
                />

                {/* Overlaid Floating Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#A9874F] uppercase tracking-wider block">
                      Featured Formula
                    </span>
                    <span className="font-serif text-sm font-bold text-[#282326]">
                      Aura Velvet Luminous Foundation
                    </span>
                    <p className="text-[11px] text-[#5E555A]">
                      Formulated for South Asian undertones · 16h wear
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('shop', 'foundations')}
                    className="p-2 rounded-full bg-[#282326] text-white hover:bg-[#C8798D] transition-colors shrink-0"
                    aria-label="View foundation"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Featured Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#A9874F] block mb-1">
              Curated Collections
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#282326]">
              Shop By Beauty Category
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold text-[#C8798D] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.slice(0, 8).map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('shop', cat.id)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white border border-[#282326]/10 shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-stone-100 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-4 bg-white flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-sm sm:text-base font-bold text-[#282326] group-hover:text-[#C8798D] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-[#5E555A] mt-1 line-clamp-1">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-[#5E555A] pt-2 border-t border-stone-100">
                  <span className="tabular-nums font-medium">{cat.itemCount} Items</span>
                  <span className="text-[#C8798D] font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center">
                    Explore →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Bestselling Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#A9874F] block mb-1">
              Top Loved in Islamabad
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#282326]">
              Bestselling Products
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop', 'bestsellers')}
            className="text-xs font-bold text-[#C8798D] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>See All Bestsellers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestsellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlist.includes(product.id)}
              lang={lang}
            />
          ))}
        </div>
      </section>

      {/* 4. Promotional Banner (Authentic Store Promotion) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#282326] via-[#3B2F35] to-[#282326] text-white p-8 sm:p-12 shadow-xl border border-white/10">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold tracking-widest uppercase text-[#C5A46D] inline-block">
              Exclusive Islamabad & Nationwide Promotion
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
              Get 10% Off Your First Beauty Order with Code{' '}
              <span className="text-[#C5A46D] underline decoration-[#C5A46D]/60 underline-offset-4">
                WELCOME10
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Valid on all authentic cosmetics, skincare, and fragrances above Rs. 2,000. Enjoy fast delivery and Cash on Delivery with complete confidence.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('shop')}
                className="bg-[#C8798D] hover:bg-[#B76277] text-white text-xs font-bold px-6 py-3 rounded-full uppercase tracking-wider transition-colors shadow-sm"
              >
                Claim Offer & Shop
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-6 py-3 rounded-full transition-colors border border-white/20"
              >
                Visit Store in Iqbal Town
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. New Arrivals Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#A9874F] block mb-1">
              Fresh Formulations
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#282326]">
              New Arrivals
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop', 'new')}
            className="text-xs font-bold text-[#C8798D] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>View All New Additions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlist.includes(product.id)}
              lang={lang}
            />
          ))}
        </div>
      </section>

      {/* 6. Why Shop With Makeup Junction? */}
      <section className="bg-[#FAF7F2] py-16 border-y border-[#282326]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#A9874F] block mb-1">
              The Makeup Junction Promise
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#282326]">
              Why Beauty Lovers Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#F8E8EC] flex items-center justify-center text-[#C8798D] mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#282326] mb-2">
                100% Authentic Products
              </h3>
              <p className="text-xs text-[#5E555A] leading-relaxed">
                Directly sourced and sealed items. We never compromise on product authenticity or quality.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#F8E8EC] flex items-center justify-center text-[#C8798D] mb-4">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#282326] mb-2">
                Nationwide Delivery & COD
              </h3>
              <p className="text-xs text-[#5E555A] leading-relaxed">
                Fast shipping across Islamabad, Rawalpindi, Lahore, Karachi, and all cities with Cash on Delivery.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#F8E8EC] flex items-center justify-center text-[#C8798D] mb-4">
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#282326] mb-2">
                WhatsApp Shade Assistance
              </h3>
              <p className="text-xs text-[#5E555A] leading-relaxed">
                Send us a message at +92 308 1030680 for shade matching, swatches, and skin type advice.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#F8E8EC] flex items-center justify-center text-[#C8798D] mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#282326] mb-2">
                Physical Store Presence
              </h3>
              <p className="text-xs text-[#5E555A] leading-relaxed">
                Visit our boutique at 1, Iqbal Town, Islamabad, open daily until 11:00 PM for live testing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Store Spotlight: Physical Boutique in Iqbal Town, Islamabad */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#282326]/10 overflow-hidden shadow-md grid grid-cols-1 lg:grid-cols-12">
          
          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#A9874F] block mb-1">
                Visit Our Store
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#282326] mb-3">
                Makeup Junction Boutique, Islamabad
              </h2>
              <p className="text-xs sm:text-sm text-[#5E555A] leading-relaxed mb-6">
                Step inside our inviting cosmetic showroom in Iqbal Town. Experience testers, match shades under natural lighting, and receive personalized recommendations from our beauty consultants.
              </p>

              <div className="space-y-3 text-xs text-[#282326]">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF7F2]">
                  <MapPin className="w-4 h-4 text-[#C8798D] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#282326]">Address</strong>
                    <span className="text-[#5E555A]">{settings.address}, {settings.city}, 43000, Pakistan</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF7F2]">
                  <Clock className="w-4 h-4 text-[#C8798D] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#282326]">Opening Hours</strong>
                    <span className="text-[#5E555A]">{settings.openingHours}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-wrap gap-3">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Makeup+Junction%2C+1+Iqbal+Town%2C+Islamabad%2C+Pakistan"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#282326] hover:bg-[#C8798D] text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors shadow-sm inline-flex items-center gap-2"
              >
                <span>Google Maps Directions</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => onNavigate('contact')}
                className="border border-[#282326]/20 hover:bg-[#F8E8EC] text-[#282326] text-xs font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Contact & Store Details
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 bg-stone-100">
            <img
              src="/src/assets/images/store_front_boutique_1793032176303.jpg"
              alt="Makeup Junction Physical Store, Iqbal Town Islamabad"
              className="w-full h-full object-cover min-h-[340px]"
            />
          </div>

        </div>
      </section>

      {/* 8. Genuine Customer Reviews & Submission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#A9874F] block mb-1">
              Verified Shoppers
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#282326]">
              Customer Reviews
            </h2>
          </div>
          <button
            onClick={() => onOpenReviewModal()}
            className="text-xs font-bold text-[#C8798D] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Write a Review</span>
            <Star className="w-3.5 h-3.5 fill-[#C8798D]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.slice(0, 4).map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-5 rounded-2xl border border-[#282326]/10 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex text-[#C5A46D] text-sm">
                    {'★'.repeat(rev.rating)}
                  </div>
                  <span className="text-[11px] text-stone-400 tabular-nums">{rev.date}</span>
                </div>
                <p className="text-xs text-[#282326] leading-relaxed italic mb-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#282326]">{rev.customerName}</h4>
                    <span className="text-[11px] text-[#5E555A]">{rev.city}</span>
                  </div>
                  {rev.verifiedPurchase && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-stone-400 mt-1 truncate">
                  Purchased: {rev.productName}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
