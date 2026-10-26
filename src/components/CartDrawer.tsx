import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Sparkles, MessageCircle, ShoppingBag } from 'lucide-react';
import { CartItem, StoreSettings, DiscountCode } from '../types';
import { storeService } from '../services/storeService';
import { Language, translations } from '../utils/i18n';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  settings: StoreSettings;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedCheckout: () => void;
  lang?: Language;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  settings,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout,
  lang = 'en',
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<DiscountCode | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const t = translations[lang];
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Delivery calculation
  const isFreeDeliveryQualified = subtotal >= settings.freeDeliveryThreshold;
  const remainingForFreeDelivery = Math.max(0, settings.freeDeliveryThreshold - subtotal);
  const freeDeliveryPercent = Math.min(100, Math.round((subtotal / settings.freeDeliveryThreshold) * 100));

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.type === 'fixed') {
      discountAmount = appliedCoupon.value;
    }
  }

  let deliveryFee = subtotal > 0 ? (isFreeDeliveryQualified ? 0 : settings.standardDeliveryFee) : 0;
  if (appliedCoupon?.type === 'free_shipping') {
    deliveryFee = 0;
  }

  const grandTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);

    if (!couponCode.trim()) return;

    const result = storeService.validateDiscount(couponCode, subtotal);
    if (!result.valid) {
      setCouponError(result.message || 'Invalid coupon');
      setAppliedCoupon(null);
    } else if (result.discount) {
      setAppliedCoupon(result.discount);
      setCouponSuccess(`Coupon applied: ${result.discount.description}`);
    }
  };

  const handleWhatsAppOrder = () => {
    const url = storeService.getWhatsAppCartOrderUrl(cart, undefined, grandTotal);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#282326]/50 backdrop-blur-xs transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDF9] flex flex-col shadow-2xl border-l border-[#282326]/10">
          
          {/* Header */}
          <div className="p-5 border-b border-[#282326]/10 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C8798D]" />
              <h2 className="font-serif text-lg font-bold text-[#282326]">
                {t.cart} ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-100 text-[#282326]/70 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cart.length > 0 && (
            <div className="bg-[#FCF4F6] px-5 py-3 border-b border-[#F2D2DA]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-[#282326]">
                  {isFreeDeliveryQualified ? (
                    <span className="text-[#9B4D60] font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Free Delivery unlocked across Pakistan!
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-[#C8798D] tabular-nums">Rs. {remainingForFreeDelivery.toLocaleString()}</strong> more for Free Delivery
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-bold text-[#5E555A] tabular-nums">
                  {freeDeliveryPercent}%
                </span>
              </div>
              <div className="w-full bg-[#F2D2DA] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#C8798D] h-full rounded-full transition-all duration-300"
                  style={{ width: `${freeDeliveryPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
                <div className="w-16 h-16 rounded-full bg-[#F8E8EC] flex items-center justify-center text-[#C8798D] mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#282326] mb-1">
                  {t.emptyCartTitle}
                </h3>
                <p className="text-xs text-[#5E555A] max-w-xs mb-6">
                  {t.emptyCartSubtitle}
                </p>
                <button
                  onClick={onClose}
                  className="bg-[#282326] hover:bg-[#C8798D] text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-colors"
                >
                  {t.continueShopping}
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 bg-white p-3 rounded-xl border border-[#282326]/10 shadow-xs"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-18 h-18 object-cover rounded-lg bg-stone-100 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-semibold text-[#A9874F] uppercase tracking-wider">
                            {item.product.brand}
                          </span>
                          <h4 className="text-xs font-semibold text-[#282326] line-clamp-1">
                            {item.product.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.variantName && (
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#5E555A]">
                          {item.shadeHex && (
                            <span
                              style={{ backgroundColor: item.shadeHex }}
                              className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                            />
                          )}
                          <span>{item.variantName}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#282326]/15 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-stone-100 text-stone-600"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#282326] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-stone-100 text-stone-600"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#282326] tabular-nums">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Calculations */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-[#282326]/10 space-y-3">
              {/* Coupon input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code (e.g. WELCOME10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-[#FAF7F2] border border-[#282326]/15 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C8798D]"
                />
                <button
                  type="submit"
                  className="bg-[#FAF7F2] hover:bg-[#F8E8EC] text-[#282326] text-xs font-semibold px-4 py-2 rounded-xl border border-[#282326]/15 transition-colors"
                >
                  Apply
                </button>
              </form>

              {couponError && (
                <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
              )}
              {couponSuccess && (
                <p className="text-[11px] text-emerald-700 font-medium">{couponSuccess}</p>
              )}

              {/* Price summary */}
              <div className="space-y-1.5 text-xs text-[#5E555A] pt-2 border-t border-stone-100">
                <div className="flex justify-between">
                  <span>{t.subtotal}</span>
                  <span className="font-semibold text-[#282326] tabular-nums">
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#9B4D60]">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span className="font-semibold tabular-nums">
                      - Rs. {discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Fee (Nationwide)</span>
                  <span className="font-semibold tabular-nums">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase text-[11px]">FREE</span>
                    ) : (
                      `Rs. ${deliveryFee.toLocaleString()}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-[#282326] pt-2 border-t border-stone-200">
                  <span>{t.orderTotal}</span>
                  <span className="tabular-nums text-[#C8798D]">
                    Rs. {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onProceedCheckout();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#282326] hover:bg-[#C8798D] text-white py-3 px-4 rounded-xl text-xs font-bold tracking-wide transition-colors shadow-md"
                >
                  <span>{t.checkout}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.whatsAppOrder}</span>
                </button>
              </div>

              <p className="text-[10px] text-center text-[#5E555A]">
                Cash on Delivery available across Pakistan · Direct store support: +92 308 1030680
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
