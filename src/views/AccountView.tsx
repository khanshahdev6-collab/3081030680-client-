import React, { useState } from 'react';
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  Plus,
  ShieldCheck,
  CheckCircle,
  Clock,
  Truck,
  ExternalLink,
} from 'lucide-react';
import { UserAccount, Order, Product, Address } from '../types';
import { storeService } from '../services/storeService';
import { ProductCard } from '../components/ProductCard';

interface AccountViewProps {
  user: UserAccount;
  orders: Order[];
  allProducts: Product[];
  wishlist: string[];
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onUpdateUser: (updatedUser: UserAccount) => void;
  onNavigate: (view: string, param?: string) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  user,
  orders,
  allProducts,
  wishlist,
  onSelectProduct,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  onUpdateUser,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile' | 'wishlist'>('orders');
  const [newAddressModal, setNewAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    label: 'Home',
    address: '',
    city: 'Islamabad',
    postalCode: '44000',
    isDefault: false,
  });

  const wishlistedProducts = allProducts.filter((p) => wishlist.includes(p.id));

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.address.trim()) return;

    const updatedAddresses = [
      ...user.addresses,
      {
        ...newAddress,
        id: `addr-${Date.now()}`,
      },
    ];

    const updated = { ...user, addresses: updatedAddresses };
    onUpdateUser(updated);
    storeService.setCurrentUser(updated);
    setNewAddressModal(false);
    setNewAddress({
      label: 'Home',
      address: '',
      city: 'Islamabad',
      postalCode: '44000',
      isDefault: false,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Account Hero Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#282326]/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#F8E8EC] text-[#C8798D] flex items-center justify-center font-serif text-xl font-bold shadow-2xs">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#282326]">
              {user.name}
            </h1>
            <p className="text-xs text-[#5E555A]">{user.email} · {user.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('admin')}
            className="flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-[#F8E8EC] text-[#282326] text-xs font-semibold rounded-xl transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-[#C8798D]" />
            <span>Store Admin View</span>
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar (lg:col-span-3) */}
        <aside className="lg:col-span-3 bg-white p-4 rounded-2xl border border-[#282326]/10 shadow-xs space-y-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'orders'
                ? 'bg-[#282326] text-white shadow-xs font-semibold'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'wishlist'
                ? 'bg-[#282326] text-white shadow-xs font-semibold'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Wishlist ({wishlistedProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'addresses'
                ? 'bg-[#282326] text-white shadow-xs font-semibold'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Delivery Addresses ({user.addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-[#282326] text-white shadow-xs font-semibold'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Security</span>
          </button>
        </aside>

        {/* Content Pane (lg:col-span-9) */}
        <main className="lg:col-span-9 bg-white p-6 sm:p-8 rounded-3xl border border-[#282326]/10 shadow-xs min-h-[420px]">
          
          {/* 1. Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <h2 className="font-serif text-xl font-bold text-[#282326]">
                  Past Orders & Tracking
                </h2>
                <span className="text-xs text-stone-500">
                  {orders.length} orders placed
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="py-12 text-center text-stone-400">
                  <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No orders yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl border border-stone-200 bg-[#FAF7F2] space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#282326]">
                              Order #{ord.id}
                            </span>
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                ord.status === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.status === 'Processing'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-400">
                            Placed on {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-[#282326] tabular-nums">
                            Rs. {ord.total.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-stone-500 block uppercase">
                            {ord.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {ord.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5 truncate">
                              <img
                                src={item.product.images[0]}
                                alt=""
                                className="w-8 h-8 rounded object-cover bg-stone-200"
                              />
                              <span className="truncate">{item.product.name}</span>
                              <span className="text-stone-400">x{item.quantity}</span>
                            </div>
                            <span className="tabular-nums font-semibold text-[#282326]">
                              Rs. {(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Tracking updates */}
                      {ord.trackingNotes && (
                        <div className="pt-2 border-t border-stone-200 text-xs flex items-start gap-2 text-[#5E555A]">
                          <Truck className="w-4 h-4 text-[#C8798D] shrink-0 mt-0.5" />
                          <span>Status Note: {ord.trackingNotes}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <h2 className="font-serif text-xl font-bold text-[#282326]">
                  Your Saved Beauty Items
                </h2>
                <span className="text-xs text-stone-500">
                  {wishlistedProducts.length} items
                </span>
              </div>

              {wishlistedProducts.length === 0 ? (
                <div className="py-12 text-center text-stone-400">
                  <Heart className="w-10 h-10 mx-auto mb-2 opacity-50 text-[#C8798D]" />
                  <p className="text-xs">Your wishlist is empty.</p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="mt-3 text-xs text-[#C8798D] font-bold hover:underline"
                  >
                    Browse Catalog →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistedProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onSelect={onSelectProduct}
                      onQuickView={onQuickView}
                      onAddToCart={onAddToCart}
                      onToggleWishlist={onToggleWishlist}
                      isWishlisted={true}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <h2 className="font-serif text-xl font-bold text-[#282326]">
                  Saved Delivery Addresses
                </h2>
                <button
                  onClick={() => setNewAddressModal(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#C8798D] hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-5 rounded-2xl border border-stone-200 bg-[#FAF7F2] space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#282326] uppercase tracking-wider">
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#5E555A] leading-relaxed">
                      {addr.address}
                    </p>
                    <p className="text-xs text-[#282326] font-medium">
                      {addr.city}, {addr.postalCode}
                    </p>
                  </div>
                ))}
              </div>

              {/* Add Address Modal */}
              {newAddressModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
                  <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
                    <h3 className="font-serif text-lg font-bold text-[#282326]">
                      Add New Delivery Address
                    </h3>
                    <form onSubmit={handleAddAddress} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1">Label</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Home, Office, Studio"
                          value={newAddress.label}
                          onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                          className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Street Address</label>
                        <textarea
                          required
                          rows={2}
                          placeholder="House/Building #, Street, Area"
                          value={newAddress.address}
                          onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                          className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold mb-1">City</label>
                          <input
                            type="text"
                            required
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1">Postal Code</label>
                          <input
                            type="text"
                            value={newAddress.postalCode}
                            onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                            className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-xs"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setNewAddressModal(false)}
                          className="flex-1 py-2 text-xs font-semibold border rounded-xl"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2 text-xs font-bold bg-[#282326] hover:bg-[#C8798D] text-white rounded-xl"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-stone-100">
                <h2 className="font-serif text-xl font-bold text-[#282326]">
                  Personal Profile & Settings
                </h2>
              </div>

              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-[#282326] mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => onUpdateUser({ ...user, name: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#282326] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => onUpdateUser({ ...user, email: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#282326] mb-1">
                    Mobile Phone (Pakistan)
                  </label>
                  <input
                    type="text"
                    value={user.phone}
                    onChange={(e) => onUpdateUser({ ...user, phone: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div className="p-4 bg-[#FCF4F6] rounded-2xl border border-[#F2D2DA] text-xs space-y-1">
                  <span className="font-semibold text-[#9B4D60]">Data Protection Notice</span>
                  <p className="text-stone-500 text-[11px]">
                    Your information is stored securely for delivery coordination and dispatch tracking.
                  </p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
