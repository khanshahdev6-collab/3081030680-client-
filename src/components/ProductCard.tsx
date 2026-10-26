import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { Language } from '../utils/i18n';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
  lang?: Language;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  lang = 'en',
}) => {
  const [imageError, setImageError] = useState(false);
  const primaryImage = product.images[0];
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col bg-white border border-[#282326]/10 rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#C8798D]/40 transition-all duration-300">
      {/* Product Image Frame */}
      <div className="relative aspect-[4/3] sm:aspect-square bg-[#FAF7F2] overflow-hidden cursor-pointer">
        {!imageError && primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            onClick={() => onSelect(product)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            onClick={() => onSelect(product)}
            className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#F8E8EC]/40"
          >
            <Sparkles className="w-8 h-8 text-[#C8798D] mb-2 opacity-60" />
            <span className="text-xs font-serif font-medium text-[#282326]/70">{product.brand}</span>
            <span className="text-xs text-[#282326]/50 line-clamp-2 mt-1">{product.name}</span>
          </div>
        )}

        {/* Subtle Status Label (Single Text Tag Only - No Pill Sandwich) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
          {hasDiscount && (
            <span className="text-[11px] font-semibold text-[#9B4D60] tracking-wider uppercase bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-sm shadow-xs border border-[#F2D2DA]">
              Save {discountPercent}%
            </span>
          )}
          {!hasDiscount && product.isBestSeller && (
            <span className="text-[11px] font-semibold text-[#A9874F] tracking-wider uppercase bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-sm shadow-xs border border-[#DFCA9E]">
              Bestseller
            </span>
          )}
          {!hasDiscount && !product.isBestSeller && product.isNewArrival && (
            <span className="text-[11px] font-semibold text-[#282326] tracking-wider uppercase bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-sm shadow-xs border border-[#282326]/15">
              New Arrival
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            isWishlisted
              ? 'bg-[#C8798D] text-white shadow-md'
              : 'bg-white/80 text-[#282326]/70 hover:text-[#C8798D] hover:bg-white shadow-xs'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full flex items-center justify-center gap-1.5 bg-white/95 backdrop-blur-md text-[#282326] hover:bg-[#282326] hover:text-white text-xs font-medium py-2 px-3 rounded-lg shadow-md transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category Kicker */}
          <div className="flex items-center justify-between text-xs text-[#5E555A] mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-[#A9874F]">
              {product.brand}
            </span>
            <span>{product.categoryLabel}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onSelect(product)}
            className="font-serif text-sm sm:text-base font-semibold text-[#282326] line-clamp-2 cursor-pointer hover:text-[#C8798D] transition-colors leading-snug"
          >
            {product.name}
          </h3>

          {/* Star Rating */}
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#5E555A]">
              <div className="flex text-[#C5A46D]">
                {'★'.repeat(Math.round(product.rating))}
              </div>
              <span className="font-medium text-[#282326]">{product.rating.toFixed(1)}</span>
              <span className="text-[#5E555A]/70">({product.reviewCount})</span>
            </div>
          )}

          {/* Shade Swatches Preview */}
          {product.variants.some((v) => v.shadeHex) && (
            <div className="flex items-center gap-1.5 mt-2.5">
              {product.variants
                .filter((v) => v.shadeHex)
                .slice(0, 4)
                .map((variant) => (
                  <span
                    key={variant.id}
                    title={variant.name}
                    style={{ backgroundColor: variant.shadeHex }}
                    className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs"
                  />
                ))}
              {product.variants.length > 4 && (
                <span className="text-[10px] text-[#5E555A] font-medium">
                  +{product.variants.length - 4} shades
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart Action Row */}
        <div className="mt-4 pt-3 border-t border-[#282326]/10 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-[#282326] tabular-nums">
                Rs. {(product.salePrice ?? product.price).toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xs text-[#5E555A] line-through tabular-nums">
                  Rs. {product.price.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[10px] text-stone-500 font-medium">
              {product.inStock ? 'In stock · Islamabad' : 'Out of stock'}
            </span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            aria-label={`Add ${product.name} to bag`}
            className="flex items-center gap-1.5 bg-[#F8E8EC] hover:bg-[#C8798D] hover:text-white text-[#282326] text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-200 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
