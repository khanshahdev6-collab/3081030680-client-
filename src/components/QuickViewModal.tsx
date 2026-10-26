import React, { useState } from 'react';
import { X, Heart, ShoppingBag, MessageCircle, Check, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { storeService } from '../services/storeService';
import { Language, translations } from '../utils/i18n';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, variantId?: string, quantity?: number) => void;
  onBuyNow: (product: Product, variantId?: string, quantity?: number) => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
  onViewDetails: (product: Product) => void;
  lang?: Language;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isWishlisted,
  onViewDetails,
  lang = 'en',
}) => {
  if (!product) return null;

  const t = translations[lang];
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const currentPrice = (product.salePrice ?? product.price) + (selectedVariant?.extraPrice || 0);

  const handleWhatsAppInquiry = () => {
    const url = storeService.getWhatsAppProductUrl(product, selectedVariant?.name);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          onClick={onClose}
          className="fixed inset-0 bg-[#282326]/60 backdrop-blur-xs transition-opacity"
        />

        <div className="relative inline-block w-full max-w-3xl bg-[#FFFDF9] rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all my-8 border border-[#282326]/10">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-stone-600 transition-colors shadow-xs"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery Column */}
            <div className="p-6 bg-[#FAF7F2] flex flex-col justify-between">
              <div className="aspect-square bg-white rounded-xl overflow-hidden border border-[#282326]/10 mb-4">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImageIndex === i
                          ? 'border-[#C8798D] shadow-xs'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Column */}
            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-[#5E555A] mb-1">
                  <span className="font-semibold uppercase tracking-wider text-[#A9874F]">
                    {product.brand}
                  </span>
                  <span>SKU: {product.sku}</span>
                </div>

                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#282326] leading-snug mb-2">
                  {product.name}
                </h2>

                {/* Rating */}
                {product.reviewCount > 0 && (
                  <div className="flex items-center gap-2 text-xs mb-3 text-[#5E555A]">
                    <div className="flex text-[#C5A46D]">
                      {'★'.repeat(Math.round(product.rating))}
                    </div>
                    <span className="font-semibold text-[#282326]">{product.rating.toFixed(1)}</span>
                    <span>· {product.reviewCount} verified reviews</span>
                  </div>
                )}

                {/* Price display */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-2xl font-bold text-[#282326] tabular-nums">
                    Rs. {currentPrice.toLocaleString()}
                  </span>
                  {product.salePrice && (
                    <span className="text-sm text-[#5E555A] line-through tabular-nums">
                      Rs. {product.price.toLocaleString()}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {product.inStock ? 'In Stock · Islamabad Store' : 'Out of Stock'}
                  </span>
                </div>

                <p className="text-xs text-[#5E555A] leading-relaxed line-clamp-3 mb-4">
                  {product.description}
                </p>

                {/* Variants / Shade selection */}
                {product.variants.length > 0 && (
                  <div className="mb-5">
                    <label className="block text-xs font-semibold text-[#282326] mb-2">
                      Option / Shade:{' '}
                      <span className="font-normal text-[#C8798D]">{selectedVariant?.name}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            selectedVariantId === v.id
                              ? 'border-[#C8798D] bg-[#F8E8EC] text-[#282326] shadow-2xs'
                              : 'border-stone-200 hover:border-stone-400 text-stone-700 bg-white'
                          }`}
                        >
                          {v.shadeHex && (
                            <span
                              style={{ backgroundColor: v.shadeHex }}
                              className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                            />
                          )}
                          <span>{v.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity selector */}
                <div className="flex items-center gap-4 mb-6">
                  <label className="text-xs font-semibold text-[#282326]">Quantity:</label>
                  <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-1 text-sm text-stone-600 hover:bg-stone-100"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold text-[#282326] tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2.5 py-1 text-sm text-stone-600 hover:bg-stone-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-stone-100">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onAddToCart(product, selectedVariantId, quantity);
                      onClose();
                    }}
                    className="flex items-center justify-center gap-2 bg-[#F8E8EC] hover:bg-[#F2D2DA] text-[#282326] py-2.5 px-4 rounded-xl text-xs font-bold transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t.addToCart}</span>
                  </button>

                  <button
                    onClick={() => {
                      onBuyNow(product, selectedVariantId, quantity);
                      onClose();
                    }}
                    className="flex items-center justify-center gap-2 bg-[#282326] hover:bg-[#C8798D] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-colors shadow-sm"
                  >
                    <span>{t.buyNow}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleWhatsAppInquiry}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white py-2 px-3 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Inquire via WhatsApp</span>
                  </button>

                  <button
                    onClick={() => onToggleWishlist(product.id)}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      isWishlisted
                        ? 'border-[#C8798D] bg-[#F8E8EC] text-[#C8798D]'
                        : 'border-stone-200 text-stone-500 hover:text-[#C8798D] bg-white'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onViewDetails(product);
                  }}
                  className="w-full text-center text-xs text-[#5E555A] hover:text-[#C8798D] font-medium pt-1"
                >
                  View full specifications & ingredients →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
