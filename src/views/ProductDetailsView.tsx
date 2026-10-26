import React, { useState } from 'react';
import {
  Heart,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Product, CustomerReview, StoreSettings } from '../types';
import { storeService } from '../services/storeService';
import { ProductCard } from '../components/ProductCard';
import { Language, translations } from '../utils/i18n';

interface ProductDetailsViewProps {
  product: Product;
  allProducts: Product[];
  reviews: CustomerReview[];
  settings: StoreSettings;
  wishlist: string[];
  onAddToCart: (product: Product, variantId?: string, quantity?: number) => void;
  onBuyNow: (product: Product, variantId?: string, quantity?: number) => void;
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onOpenReviewModal: (product: Product) => void;
  onNavigate: (view: string, param?: string) => void;
  lang?: Language;
}

export const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({
  product,
  allProducts,
  reviews,
  settings,
  wishlist,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  onSelectProduct,
  onQuickView,
  onOpenReviewModal,
  onNavigate,
  lang = 'en',
}) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addedToast, setAddedToast] = useState(false);

  const t = translations[lang];
  const isWishlisted = wishlist.includes(product.id);
  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const currentPrice = (product.salePrice ?? product.price) + (selectedVariant?.extraPrice || 0);

  const productReviews = reviews.filter((r) => r.productId === product.id);
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 4);

  const handleAddToCart = () => {
    onAddToCart(product, selectedVariantId, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleWhatsAppInquiry = () => {
    const url = storeService.getWhatsAppProductUrl(product, selectedVariant?.name);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <button onClick={() => onNavigate('home')} className="hover:text-[#C8798D]">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <button onClick={() => onNavigate('shop')} className="hover:text-[#C8798D]">
          Shop
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <button
          onClick={() => onNavigate('shop', product.category)}
          className="hover:text-[#C8798D]"
        >
          {product.categoryLabel}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-[#282326] font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP 2-Column Split: Gallery Left, Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        
        {/* Gallery Column (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square bg-[#FAF7F2] rounded-3xl overflow-hidden border border-[#282326]/10 shadow-sm">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            
            {product.salePrice && (
              <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-[#9B4D60] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm border border-[#F2D2DA] shadow-xs">
                Special Offer
              </span>
            )}

            <button
              onClick={() => onToggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-xs ${
                isWishlisted
                  ? 'bg-[#C8798D] text-white shadow-md'
                  : 'bg-white/80 text-stone-700 hover:text-[#C8798D] hover:bg-white'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === i
                      ? 'border-[#C8798D] shadow-md scale-102'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase Module (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[#A9874F]">
                {product.brand}
              </span>
              <span>SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#282326] leading-snug">
              {product.name}
            </h1>

            {/* Ratings & Authenticity note */}
            <div className="flex items-center gap-3 mt-3 text-xs text-stone-500">
              <div className="flex text-[#C5A46D]">
                {'★'.repeat(Math.round(product.rating))}
              </div>
              <span className="font-semibold text-[#282326] tabular-nums">{product.rating.toFixed(1)}</span>
              <span>· {product.reviewCount} customer reviews</span>
              <span>·</span>
              <span className="text-emerald-700 font-medium">100% Authentic Guaranteed</span>
            </div>

            {/* Price block */}
            <div className="mt-4 pt-4 border-t border-stone-200 flex items-baseline gap-4">
              <span className="text-3xl font-bold text-[#282326] tabular-nums">
                Rs. {currentPrice.toLocaleString()}
              </span>
              {product.salePrice && (
                <span className="text-base text-stone-400 line-through tabular-nums">
                  Rs. {product.price.toLocaleString()}
                </span>
              )}
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded">
                {product.inStock ? 'In Stock · Islamabad Store' : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Description summary */}
          <p className="text-xs sm:text-sm text-[#5E555A] leading-relaxed">
            {product.description}
          </p>

          {/* Variants / Shade selector */}
          {product.variants.length > 0 && (
            <div className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
              <label className="block text-xs font-semibold text-[#282326]">
                Select Option / Shade:{' '}
                <span className="font-normal text-[#C8798D]">{selectedVariant?.name}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                      selectedVariantId === v.id
                        ? 'border-[#C8798D] bg-[#F8E8EC] text-[#282326] shadow-2xs font-semibold'
                        : 'border-stone-200 hover:border-stone-400 text-stone-700 bg-white'
                    }`}
                  >
                    {v.shadeHex && (
                      <span
                        style={{ backgroundColor: v.shadeHex }}
                        className="w-4 h-4 rounded-full border border-black/15 shrink-0"
                      />
                    )}
                    <span>{v.name}</span>
                    {v.extraPrice && (
                      <span className="text-[10px] text-stone-400 font-normal">
                        (+Rs. {v.extraPrice})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <label className="text-xs font-semibold text-[#282326]">Quantity:</label>
              <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-stone-600 hover:bg-stone-100"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-[#282326] tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-stone-600 hover:bg-stone-100"
                >
                  +
                </button>
              </div>

              {addedToast && (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 animate-in fade-in">
                  <Check className="w-4 h-4" /> Added to your bag!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex items-center justify-center gap-2 bg-[#F8E8EC] hover:bg-[#F2D2DA] text-[#282326] py-3.5 px-6 rounded-2xl text-xs font-bold tracking-wider uppercase transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.addToCart}</span>
              </button>

              <button
                onClick={() => onBuyNow(product, selectedVariantId, quantity)}
                disabled={!product.inStock}
                className="flex items-center justify-center gap-2 bg-[#282326] hover:bg-[#C8798D] text-white py-3.5 px-6 rounded-2xl text-xs font-bold tracking-wider uppercase transition-colors shadow-md"
              >
                <span>{t.buyNow}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Direct WhatsApp Product Inquiry */}
            <button
              onClick={handleWhatsAppInquiry}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 px-4 rounded-2xl text-xs font-bold tracking-wide transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire & Order via WhatsApp (+92 308 1030680)</span>
            </button>
          </div>

          {/* Delivery & Trust Strip */}
          <div className="border-t border-stone-200 pt-6 space-y-3 text-xs text-[#5E555A]">
            <div className="flex items-start gap-3">
              <Truck className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#282326]">Nationwide Delivery & Islamabad Fulfillment:</strong>
                <p className="text-[11px] mt-0.5">
                  Same-day or next-day delivery in Islamabad & Rawalpindi. 2-4 business days across Pakistan. Free delivery on orders over Rs. 3,000.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#282326]">Cash on Delivery Available:</strong>
                <p className="text-[11px] mt-0.5">
                  Inspect parcel upon arrival. No credit card required.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Product Details Tabs / Accordion Content */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#282326]/10 shadow-xs space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A9874F] block mb-1">
            Formulation & Efficacy
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#282326] mb-4">
            Key Benefits & Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {product.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-[#282326]">
                <Sparkles className="w-4 h-4 text-[#C8798D] shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {product.howToUse && (
          <div className="pt-6 border-t border-stone-100">
            <h3 className="font-serif text-lg font-bold text-[#282326] mb-2">
              Application & Usage Instructions
            </h3>
            <p className="text-xs sm:text-sm text-[#5E555A] leading-relaxed">
              {product.howToUse}
            </p>
          </div>
        )}

        {product.ingredients && (
          <div className="pt-6 border-t border-stone-100">
            <h3 className="font-serif text-lg font-bold text-[#282326] mb-2">
              Full Ingredients Breakdown
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed font-mono bg-[#FAF7F2] p-4 rounded-xl border border-stone-200">
              {product.ingredients}
            </p>
          </div>
        )}
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-10 border border-[#282326]/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A9874F] block mb-1">
              Real Experiences
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#282326]">
              Customer Reviews ({productReviews.length})
            </h2>
          </div>
          <button
            onClick={() => onOpenReviewModal(product)}
            className="bg-[#282326] hover:bg-[#C8798D] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors shadow-xs"
          >
            Leave a Review
          </button>
        </div>

        {productReviews.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-stone-200 p-6">
            <p className="text-xs text-stone-500 mb-3">
              No customer reviews yet for this product. Be the first to share your experience!
            </p>
            <button
              onClick={() => onOpenReviewModal(product)}
              className="text-xs font-bold text-[#C8798D] hover:underline"
            >
              Write First Review →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex text-[#C5A46D] text-sm">
                    {'★'.repeat(rev.rating)}
                  </div>
                  <span className="text-[11px] text-stone-400 tabular-nums">{rev.date}</span>
                </div>
                <p className="text-xs text-[#282326] leading-relaxed mb-3 italic">
                  "{rev.comment}"
                </p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                  <span className="font-bold text-[#282326]">{rev.customerName}</span>
                  <span className="text-stone-400 text-[11px]">{rev.city}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#A9874F] block mb-1">
                You May Also Adore
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#282326]">
                Related Beauty Essentials
              </h2>
            </div>
            <button
              onClick={() => onNavigate('shop', product.category)}
              className="text-xs font-bold text-[#C8798D] hover:underline flex items-center gap-1"
            >
              <span>See More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={onSelectProduct}
                onQuickView={onQuickView}
                onAddToCart={(prod) => onAddToCart(prod)}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlist.includes(p.id)}
                lang={lang}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
