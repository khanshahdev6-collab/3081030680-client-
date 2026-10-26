import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  ArrowRight,
  MessageCircle,
  ShoppingBag,
  Building2,
  CheckCircle,
} from 'lucide-react';
import { CartItem, CustomerDetails, StoreSettings, Order, DiscountCode } from '../types';
import { storeService } from '../services/storeService';
import { Language, translations } from '../utils/i18n';

interface CheckoutViewProps {
  cart: CartItem[];
  settings: StoreSettings;
  onOrderPlaced: (order: Order) => void;
  onNavigate: (view: string) => void;
  lang?: Language;
}

const PAKISTAN_CITIES = [
  'Islamabad',
  'Rawalpindi',
  'Lahore',
  'Karachi',
  'Peshawar',
  'Faisalabad',
  'Multan',
  'Quetta',
  'Gujranwala',
  'Sialkot',
  'Abbottabad',
  'Wah Cantt',
  'Taxila',
  'Hyderabad',
  'Other City (Pakistan)',
];

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cart,
  settings,
  onOrderPlaced,
  onNavigate,
  lang = 'en',
}) => {
  const t = translations[lang];

  const [formData, setFormData] = useState<CustomerDetails>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Islamabad',
    postalCode: '44000',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer'>('cod');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<DiscountCode | null>(null);
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Delivery fee logic
  const isFreeDelivery = subtotal >= settings.freeDeliveryThreshold || appliedCoupon?.type === 'free_shipping';
  const deliveryFee = subtotal > 0 ? (isFreeDelivery ? 0 : (formData.city === 'Islamabad' ? settings.islamabadDeliveryFee : settings.standardDeliveryFee)) : 0;

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.type === 'fixed') {
      discountAmount = appliedCoupon.value;
    }
  }

  const grandTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  // Validate Pakistani phone number format
  const validatePakPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s-]/g, '');
    // Common formats: 03001234567 or +923001234567 or 923001234567
    const regex = /^((\+92)|(92)|(0))?3[0-9]{9}$/;
    return regex.test(cleaned);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponMsg(null);
    if (!couponCode.trim()) return;

    const res = storeService.validateDiscount(couponCode, subtotal);
    if (!res.valid) {
      setCouponMsg({ text: res.message || 'Invalid coupon code', isError: true });
      setAppliedCoupon(null);
    } else if (res.discount) {
      setAppliedCoupon(res.discount);
      setCouponMsg({ text: `Applied: ${res.discount.description}`, isError: false });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);

    if (!validatePakPhone(formData.phone)) {
      setPhoneError('Please enter a valid Pakistani mobile number (e.g. 0308-1030680 or 03001234567)');
      return;
    }

    if (!formData.address.trim()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = storeService.createOrder(
        formData,
        cart,
        subtotal,
        deliveryFee,
        discountAmount,
        appliedCoupon?.code,
        paymentMethod
      );
      setIsSubmitting(false);
      onOrderPlaced(order);
    }, 600);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-12 h-12 text-[#C8798D] mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold text-[#282326] mb-2">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-xs text-[#5E555A] mb-6">
          Please add items to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="bg-[#282326] hover:bg-[#C8798D] text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#A9874F] block mb-1">
          Secure Order Completion
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#282326]">
          Checkout & Delivery Details
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Customer & Delivery Info (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Customer Details Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#282326]/10 shadow-xs space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#282326] pb-3 border-b border-stone-100 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C8798D]" />
              <span>1. Contact & Shipping Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#282326] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahnoor Abbasi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-[#282326] focus:outline-none focus:border-[#C8798D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#282326] mb-1">
                  Mobile / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0308-1030680"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (phoneError) setPhoneError(null);
                  }}
                  className={`w-full bg-[#FAF7F2] border rounded-xl px-3.5 py-2.5 text-xs text-[#282326] focus:outline-none ${
                    phoneError ? 'border-rose-500' : 'border-stone-200 focus:border-[#C8798D]'
                  }`}
                />
                {phoneError && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{phoneError}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#282326] mb-1">
                Email Address (Optional, for receipt & tracking)
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-[#282326] focus:outline-none focus:border-[#C8798D]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#282326] mb-1">
                  City *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#282326] focus:outline-none focus:border-[#C8798D]"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#282326] mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  placeholder="44000"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-[#282326] focus:outline-none focus:border-[#C8798D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#282326] mb-1">
                Complete Street Address (House/Flat #, Street, Sector / Area) *
              </label>
              <textarea
                required
                rows={2}
                placeholder="e.g. House 14, Street 25, Sector F-8/2, Islamabad"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-[#282326] focus:outline-none focus:border-[#C8798D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#282326] mb-1">
                Order Notes / Special Delivery Instructions
              </label>
              <input
                type="text"
                placeholder="e.g. Please deliver after 2 PM or call upon arrival"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-[#282326] focus:outline-none focus:border-[#C8798D]"
              />
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#282326]/10 shadow-xs space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#282326] pb-3 border-b border-stone-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C8798D]" />
              <span>2. Select Payment Method</span>
            </h2>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#C8798D] bg-[#F8E8EC]/40 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 accent-[#C8798D]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-[#282326]">
                      Cash on Delivery (COD)
                    </strong>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Most Popular in Pakistan
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5E555A] mt-1">
                    Pay in cash directly to courier rider upon delivery. Open and verify packaging before payment.
                  </p>
                </div>
              </label>

              {/* Direct Bank Transfer */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-[#C8798D] bg-[#F8E8EC]/40 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={() => setPaymentMethod('bank_transfer')}
                  className="mt-1 accent-[#C8798D]"
                />
                <div className="flex-1">
                  <strong className="text-xs font-bold text-[#282326]">
                    Direct Bank Transfer / Store Payment (Meezan / HBL)
                  </strong>
                  <p className="text-[11px] text-[#5E555A] mt-1">
                    Transfer payment via Raast / Online Banking and WhatsApp proof to +92 308 1030680.
                  </p>
                  {paymentMethod === 'bank_transfer' && (
                    <div className="mt-3 p-3 bg-white rounded-xl border border-stone-200 text-[11px] text-[#282326] space-y-1">
                      <p><strong>Bank:</strong> Meezan Bank Ltd (Islamabad Branch)</p>
                      <p><strong>Account Title:</strong> Makeup Junction Cosmetics</p>
                      <p><strong>IBAN / Raast:</strong> PK00MEZN0001030680000001</p>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#282326]/10 shadow-xs space-y-5 sticky top-28">
            <h2 className="font-serif text-lg font-bold text-[#282326] pb-3 border-b border-stone-100">
              Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
            </h2>

            {/* Itemized list */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[#282326] truncate">{item.product.name}</h4>
                    {item.variantName && (
                      <span className="text-[11px] text-stone-500 block">{item.variantName}</span>
                    )}
                    <span className="text-[11px] text-stone-400">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-semibold text-[#282326] tabular-nums shrink-0">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon promo code box */}
            <div className="pt-3 border-t border-stone-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. WELCOME10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C8798D]"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-[#282326] hover:bg-[#C8798D] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponMsg && (
                <p
                  className={`text-[11px] font-medium mt-1.5 ${
                    couponMsg.isError ? 'text-rose-600' : 'text-emerald-700'
                  }`}
                >
                  {couponMsg.text}
                </p>
              )}
            </div>

            {/* Cost breakdown */}
            <div className="space-y-2 text-xs text-[#5E555A] pt-3 border-t border-stone-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
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
                <span>Shipping ({formData.city})</span>
                <span className="font-semibold tabular-nums">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-[11px]">FREE</span>
                  ) : (
                    `Rs. ${deliveryFee.toLocaleString()}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-[#282326] pt-3 border-t border-stone-200">
                <span>Total Amount Due</span>
                <span className="text-[#C8798D] tabular-nums text-xl">
                  Rs. {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-[#282326] hover:bg-[#C8798D] text-white py-3.5 px-4 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>Place Order with {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[11px] text-stone-400 text-center leading-relaxed">
              By confirming, you agree to receive order notifications and dispatch updates via SMS / WhatsApp at +92 308 1030680.
            </p>
          </div>
        </div>

      </form>

    </div>
  );
};
