import React from 'react';
import {
  CheckCircle,
  MessageCircle,
  Truck,
  ArrowRight,
  Printer,
  ShoppingBag,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Order, StoreSettings } from '../types';
import { storeService } from '../services/storeService';

interface OrderConfirmationViewProps {
  order: Order;
  settings: StoreSettings;
  onNavigate: (view: string, param?: string) => void;
}

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({
  order,
  settings,
  onNavigate,
}) => {
  const whatsappUrl = storeService.getWhatsAppOrderInquiryUrl(order);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      
      {/* Success Badge & Header */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#282326]/10 shadow-md text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle className="w-9 h-9" />
        </div>

        <span className="text-xs font-semibold uppercase tracking-widest text-[#A9874F] block">
          Order Placed Successfully
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#282326]">
          Thank You, {order.customer.name}!
        </h1>

        <p className="text-xs sm:text-sm text-[#5E555A] max-w-lg mx-auto leading-relaxed">
          Your order has been recorded at Makeup Junction, Iqbal Town, Islamabad. We are preparing your authentic cosmetics parcel for careful packing and dispatch.
        </p>

        {/* Reference Pill */}
        <div className="inline-flex items-center gap-3 bg-[#FAF7F2] border border-stone-200 px-5 py-2.5 rounded-full text-xs font-bold text-[#282326]">
          <span>Order Reference:</span>
          <span className="font-mono text-[#C8798D] text-sm tracking-wider">
            #{order.id}
          </span>
        </div>

        {/* WhatsApp Instant Status Confirmation Button */}
        <div className="pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 px-6 rounded-full text-xs font-bold tracking-wide transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Notify Store on WhatsApp for Fast Dispatch</span>
          </a>
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#282326]/10 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <h2 className="font-serif text-lg font-bold text-[#282326]">
            Order Receipt & Invoice Summary
          </h2>
          <button
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#282326]"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>

        {/* Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#5E555A] bg-[#FAF7F2] p-4 rounded-2xl">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Date</span>
            <span className="font-medium text-[#282326]">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Payment</span>
            <span className="font-medium text-[#282326] uppercase">
              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Status</span>
            <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px]">
              {order.status}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Dispatch From</span>
            <span className="font-medium text-[#282326]">Islamabad Store</span>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="divide-y divide-stone-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0"
                />
                <div className="truncate">
                  <h4 className="font-semibold text-[#282326] truncate">{item.product.name}</h4>
                  {item.variantName && (
                    <span className="text-[11px] text-stone-500 block">{item.variantName}</span>
                  )}
                  <span className="text-[11px] text-stone-400">Qty: {item.quantity}</span>
                </div>
              </div>
              <span className="font-bold text-[#282326] tabular-nums shrink-0">
                Rs. {(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-[#5E555A]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-[#282326] tabular-nums">
              Rs. {order.subtotal.toLocaleString()}
            </span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-[#9B4D60]">
              <span>Discount Applied</span>
              <span className="font-semibold tabular-nums">
                - Rs. {order.discountAmount.toLocaleString()}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Delivery Fee ({order.customer.city})</span>
            <span className="font-semibold tabular-nums">
              {order.deliveryFee === 0 ? 'FREE' : `Rs. ${order.deliveryFee.toLocaleString()}`}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold text-[#282326] pt-2 border-t border-stone-200">
            <span>Total Payable</span>
            <span className="text-[#C8798D] text-lg tabular-nums">
              Rs. {order.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Shipping address recap */}
        <div className="bg-[#FAF7F2] p-4 rounded-2xl text-xs space-y-1 text-[#282326]">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
            Delivery Address
          </span>
          <p className="font-semibold">{order.customer.name}</p>
          <p className="text-[#5E555A]">{order.customer.address}, {order.customer.city}</p>
          <p className="text-[#5E555A]">Contact Phone: {order.customer.phone}</p>
          {order.customer.notes && (
            <p className="text-stone-400 italic text-[11px] pt-1">
              Note: "{order.customer.notes}"
            </p>
          )}
        </div>
      </div>

      {/* Return to shop */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <button
          onClick={() => onNavigate('shop')}
          className="flex items-center gap-2 text-xs font-bold text-[#C8798D] hover:underline"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => onNavigate('account')}
          className="bg-[#282326] hover:bg-[#C8798D] text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-colors"
        >
          View in My Account & Track
        </button>
      </div>

    </div>
  );
};
