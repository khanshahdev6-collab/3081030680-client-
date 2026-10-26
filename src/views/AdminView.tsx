import React, { useState } from 'react';
import {
  Package,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Save,
  Tag,
  Settings,
  Users,
  MessageSquare,
  Truck,
  ArrowRight,
  Download,
} from 'lucide-react';
import { Product, Order, DiscountCode, CustomerReview, StoreSettings, ProductCategory } from '../types';
import { storeService } from '../services/storeService';

interface AdminViewProps {
  products: Product[];
  orders: Order[];
  discounts: DiscountCode[];
  reviews: CustomerReview[];
  settings: StoreSettings;
  onRefreshData: () => void;
  onNavigate: (view: string, param?: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  products,
  orders,
  discounts,
  reviews,
  settings,
  onRefreshData,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'discounts' | 'reviews' | 'settings'>('overview');
  
  // Product Edit / Add State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Store Settings Edit State
  const [storeForm, setStoreForm] = useState<StoreSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Discount code form
  const [newDiscount, setNewDiscount] = useState<DiscountCode>({
    code: '',
    type: 'percentage',
    value: 10,
    minOrder: 2000,
    active: true,
    expiryDate: '2026-12-31',
    description: '',
  });

  // Calculate high level metrics
  const totalSalesPKR = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Confirmed').length;
  const lowStockProducts = products.filter((p) => p.stock <= 15);
  const subscribers = storeService.getSubscribers();

  // Handler to save product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    storeService.saveProduct(editingProduct);
    setEditingProduct(null);
    setIsNewProduct(false);
    onRefreshData();
    setSaveSuccess('Product saved successfully');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to remove this product from the catalog?')) {
      storeService.deleteProduct(id);
      onRefreshData();
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    storeService.updateOrderStatus(orderId, status);
    onRefreshData();
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storeService.updateSettings(storeForm);
    onRefreshData();
    setSaveSuccess('Store settings and announcement bar updated!');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleAddDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscount.code.trim()) return;
    storeService.saveDiscountCode({
      ...newDiscount,
      code: newDiscount.code.toUpperCase().trim(),
    });
    setNewDiscount({
      code: '',
      type: 'percentage',
      value: 10,
      minOrder: 2000,
      active: true,
      expiryDate: '2026-12-31',
      description: '',
    });
    onRefreshData();
  };

  const handleExportOrders = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Order ID,Date,Customer,Phone,City,Items Count,Total (PKR),Payment,Status']
        .concat(
          orders.map(
            (o) =>
              `${o.id},${o.createdAt.split('T')[0]},"${o.customer.name}",${o.customer.phone},${o.customer.city},${o.items.length},${o.total},${o.paymentMethod},${o.status}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `makeup_junction_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Top Header */}
      <div className="bg-[#282326] text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#C5A46D] block mb-1">
            Makeup Junction Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">
            Store Admin Dashboard
          </h1>
          <p className="text-xs text-white/70 mt-1">
            Location: 1, Iqbal Town, Islamabad · Phone: +92 308 1030680
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportOrders}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition-colors"
          >
            <Download className="w-4 h-4 text-[#C5A46D]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="bg-[#C8798D] hover:bg-[#B76277] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            View Live Store
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-2">
        {[
          { id: 'overview', label: 'Overview', icon: DollarSign },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'discounts', label: 'Coupons & Discounts', icon: Tag },
          { id: 'reviews', label: `Reviews (${reviews.length})`, icon: MessageSquare },
          { id: 'settings', label: 'Store Settings & Banner', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#282326] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-[#FAF7F2]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#282326]/10 shadow-xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Total Revenue
              </span>
              <p className="font-serif text-2xl font-bold text-[#282326] mt-2 tabular-nums">
                Rs. {totalSalesPKR.toLocaleString()}
              </p>
              <span className="text-[11px] text-emerald-700 font-medium block mt-1">
                Completed & Processing Orders
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#282326]/10 shadow-xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Total Orders Placed
              </span>
              <p className="font-serif text-2xl font-bold text-[#282326] mt-2 tabular-nums">
                {orders.length}
              </p>
              <span className="text-[11px] text-amber-700 font-medium block mt-1">
                {pendingOrders} awaiting fulfillment
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#282326]/10 shadow-xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Active Catalog Items
              </span>
              <p className="font-serif text-2xl font-bold text-[#282326] mt-2 tabular-nums">
                {products.length}
              </p>
              <span className="text-[11px] text-stone-500 block mt-1">
                Across 8 beauty categories
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#282326]/10 shadow-xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                VIP Subscribers
              </span>
              <p className="font-serif text-2xl font-bold text-[#282326] mt-2 tabular-nums">
                {subscribers.length}
              </p>
              <span className="text-[11px] text-[#C8798D] block mt-1">
                Islamabad Privilege Club
              </span>
            </div>
          </div>

          {/* Low Stock Warning Box */}
          {lowStockProducts.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl">
              <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Low Inventory Alert ({lowStockProducts.length} items with &le; 15 units)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="p-3 bg-white rounded-xl border border-amber-200/60 text-xs flex justify-between items-center">
                    <div>
                      <strong className="block text-[#282326] truncate">{p.name}</strong>
                      <span className="text-stone-400 text-[10px]">SKU: {p.sku}</span>
                    </div>
                    <span className="font-bold text-amber-800 tabular-nums bg-amber-100 px-2 py-0.5 rounded">
                      {p.stock} units
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Orders Overview */}
          <div className="bg-white p-6 rounded-3xl border border-[#282326]/10 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-lg font-bold text-[#282326]">
                Recent Customer Orders
              </h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-semibold text-[#C8798D] hover:underline"
              >
                View All Orders →
              </button>
            </div>

            <div className="divide-y divide-stone-100">
              {orders.slice(0, 5).map((ord) => (
                <div key={ord.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="font-bold text-[#282326]">#{ord.id}</span>
                    <span className="text-stone-500 ml-2">({ord.customer.name} · {ord.customer.city})</span>
                    <span className="text-stone-400 block text-[11px]">
                      {new Date(ord.createdAt).toLocaleDateString()} · {ord.items.length} items
                    </span>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span className="font-bold text-[#282326] tabular-nums">
                      Rs. {ord.total.toLocaleString()}
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
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Orders Management Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#282326]/10 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#282326]">
                Order Management & Dispatch Control
              </h2>
              <p className="text-xs text-stone-500">
                Track statuses, update delivery notes, and coordinate courier riders.
              </p>
            </div>
            <button
              onClick={handleExportOrders}
              className="text-xs font-bold text-[#C8798D] hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>

          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-2xl border border-stone-200 bg-[#FAF7F2] space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-[#282326]">Order #{ord.id}</span>
                      <span className="text-xs font-medium text-stone-500">
                        {new Date(ord.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-[#282326] mt-0.5">
                      <strong>Customer:</strong> {ord.customer.name} ·{' '}
                      <strong>Phone:</strong> {ord.customer.phone} ·{' '}
                      <strong>Address:</strong> {ord.customer.address}, {ord.customer.city}
                    </p>
                  </div>

                  {/* Status Changer */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-stone-500">Status:</span>
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                      className="bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-bold text-[#282326] focus:outline-none focus:border-[#C8798D]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Items in order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {ord.items.map((item) => (
                    <div key={item.id} className="p-2 bg-white rounded-xl border border-stone-200 text-xs flex items-center gap-2">
                      <img src={item.product.images[0]} alt="" className="w-8 h-8 rounded object-cover" />
                      <div className="truncate">
                        <span className="font-semibold block truncate">{item.product.name}</span>
                        <span className="text-stone-400 text-[10px]">
                          {item.variantName ? `${item.variantName} · ` : ''}Qty: {item.quantity} (Rs. {item.price})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown & WhatsApp Contact */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-stone-500">
                      Payment: <strong>{ord.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</strong> · Delivery: Rs. {ord.deliveryFee} · Total: <strong className="text-[#C8798D] text-sm tabular-nums">Rs. {ord.total.toLocaleString()}</strong>
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/${ord.customer.phone.replace(/[\s-+]/g, '')}?text=${encodeURIComponent(
                      `Assalam-o-Alaikum ${ord.customer.name}! This is Makeup Junction Iqbal Town Islamabad regarding your order #${ord.id}. Your order status is now ${ord.status}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>WhatsApp Customer</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Products Management Tab */}
      {activeTab === 'products' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#282326]/10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#282326]">
                Product Inventory & Catalog ({products.length})
              </h2>
              <p className="text-xs text-stone-500">
                Add luxury products, modify shades, update stock, and manage PKR pricing.
              </p>
            </div>

            <button
              onClick={() => {
                setIsNewProduct(true);
                setEditingProduct({
                  id: `mj-${Date.now().toString().slice(-4)}`,
                  slug: 'new-luxury-product',
                  name: '',
                  brand: 'Makeup Junction',
                  category: 'makeup',
                  categoryLabel: 'Makeup Essentials',
                  price: 2500,
                  sku: `MJ-${Math.floor(100 + Math.random() * 900)}`,
                  stock: 20,
                  inStock: true,
                  rating: 5.0,
                  reviewCount: 0,
                  images: ['/src/assets/images/category_makeup_beauty_1793032174880.jpg'],
                  description: '',
                  benefits: ['100% Authentic formula', 'Long-lasting wear'],
                  variants: [{ id: 'v-1', name: 'Standard', inStock: true }],
                  demoProduct: true,
                });
              }}
              className="flex items-center gap-1.5 bg-[#282326] hover:bg-[#C8798D] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Product Edit / Add Modal */}
          {editingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl my-8 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="font-serif text-lg font-bold text-[#282326]">
                    {isNewProduct ? 'Add New Product to Catalog' : `Edit: ${editingProduct.name}`}
                  </h3>
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-1">Product Name *</label>
                      <input
                        type="text"
                        required
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Brand *</label>
                      <input
                        type="text"
                        required
                        value={editingProduct.brand}
                        onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold mb-1">Category</label>
                      <select
                        value={editingProduct.category}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            category: e.target.value as ProductCategory,
                            categoryLabel: e.target.value.toUpperCase(),
                          })
                        }
                        className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 font-medium"
                      >
                        <option value="makeup">Makeup</option>
                        <option value="skincare">Skincare</option>
                        <option value="lipsticks">Lipsticks</option>
                        <option value="foundations">Foundations</option>
                        <option value="eyes">Eye Makeup</option>
                        <option value="fragrances">Fragrances</option>
                        <option value="tools">Tools & Brushes</option>
                        <option value="haircare">Hair Care</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Price (PKR) *</label>
                      <input
                        type="number"
                        required
                        value={editingProduct.price}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, price: parseInt(e.target.value, 10) || 0 })
                        }
                        className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Sale Price (Optional PKR)</label>
                      <input
                        type="number"
                        value={editingProduct.salePrice || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            salePrice: e.target.value ? parseInt(e.target.value, 10) : undefined,
                          })
                        }
                        className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-1">SKU</label>
                      <input
                        type="text"
                        value={editingProduct.sku}
                        onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Stock Quantity</label>
                      <input
                        type="number"
                        value={editingProduct.stock}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            stock: parseInt(e.target.value, 10) || 0,
                            inStock: (parseInt(e.target.value, 10) || 0) > 0,
                          })
                        }
                        className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2"
                    />
                  </div>

                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.isBestSeller}
                        onChange={(e) => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                        className="accent-[#C8798D]"
                      />
                      <span>Mark as Bestseller</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.isNewArrival}
                        onChange={(e) => setEditingProduct({ ...editingProduct, isNewArrival: e.target.checked })}
                        className="accent-[#C8798D]"
                      />
                      <span>Mark as New Arrival</span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-5 py-2.5 rounded-xl border border-stone-200 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#282326] hover:bg-[#C8798D] text-white rounded-xl font-bold flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Product</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Product Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#282326] uppercase text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Brand / Category</th>
                  <th className="py-3 px-4">Price (PKR)</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Badges</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0" />
                        <div>
                          <strong className="block text-[#282326] font-semibold">{p.name}</strong>
                          <span className="text-stone-400 text-[10px]">SKU: {p.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#5E555A]">
                      <span className="font-semibold text-[#282326]">{p.brand}</span>
                      <span className="block text-[11px]">{p.categoryLabel}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#282326] tabular-nums">
                      Rs. {(p.salePrice ?? p.price).toLocaleString()}
                      {p.salePrice && (
                        <span className="block text-[10px] text-stone-400 line-through">
                          Rs. {p.price.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 tabular-nums">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                          p.stock <= 15
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.stock} in stock
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[10px]">
                      {p.isBestSeller && <span className="bg-[#FAF7F2] text-[#A9874F] font-bold px-1.5 py-0.5 rounded border border-[#DFCA9E] mr-1">Bestseller</span>}
                      {p.isNewArrival && <span className="bg-stone-100 text-stone-700 font-bold px-1.5 py-0.5 rounded">New</span>}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setIsNewProduct(false);
                            setEditingProduct({ ...p });
                          }}
                          className="p-1.5 text-stone-600 hover:text-[#C8798D] hover:bg-stone-100 rounded-lg"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Discounts & Coupons Tab */}
      {activeTab === 'discounts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#282326]/10 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#282326]">
              Create Discount Code
            </h3>
            <form onSubmit={handleAddDiscount} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EIDGLOW25"
                  value={newDiscount.code}
                  onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })}
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Discount Type</label>
                  <select
                    value={newDiscount.type}
                    onChange={(e) => setNewDiscount({ ...newDiscount, type: e.target.value as any })}
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (PKR)</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Value (e.g. 10% or 500)</label>
                  <input
                    type="number"
                    required
                    value={newDiscount.value}
                    onChange={(e) => setNewDiscount({ ...newDiscount, value: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Min Order Amount (PKR)</label>
                <input
                  type="number"
                  value={newDiscount.minOrder}
                  onChange={(e) => setNewDiscount({ ...newDiscount, minOrder: parseInt(e.target.value, 10) || 0 })}
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description / Benefit</label>
                <input
                  type="text"
                  placeholder="e.g. 10% discount for new customers"
                  value={newDiscount.description}
                  onChange={(e) => setNewDiscount({ ...newDiscount, description: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#282326] hover:bg-[#C8798D] text-white py-2.5 rounded-xl font-bold transition-colors shadow-xs"
              >
                Add Promotional Code
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#282326]/10 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#282326]">
              Active Discount Coupons ({discounts.length})
            </h3>
            <div className="space-y-3">
              {discounts.map((d) => (
                <div key={d.code} className="p-4 rounded-2xl border border-stone-200 bg-[#FAF7F2] flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-white px-2 py-0.5 rounded border border-stone-200 text-[#C8798D]">
                        {d.code}
                      </span>
                      <span className="text-xs font-semibold text-[#282326]">
                        {d.type === 'percentage'
                          ? `${d.value}% Off`
                          : d.type === 'fixed'
                          ? `Rs. ${d.value} Off`
                          : 'Free Shipping'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">{d.description}</p>
                    <span className="text-[10px] text-stone-400">Min Order: Rs. {d.minOrder.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => {
                      storeService.saveDiscountCode({ ...d, active: !d.active });
                      onRefreshData();
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                      d.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {d.active ? 'Active' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Reviews Moderation Tab */}
      {activeTab === 'reviews' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#282326]/10 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#282326]">
                Customer Review Moderation ({reviews.length})
              </h2>
              <p className="text-xs text-stone-500">
                Verify genuine customer feedback before publishing to store.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl border border-stone-200 bg-[#FAF7F2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#282326]">{rev.customerName}</span>
                    <span className="text-stone-400 text-xs">({rev.city})</span>
                    <div className="flex text-[#C5A46D] text-xs">
                      {'★'.repeat(rev.rating)}
                    </div>
                  </div>
                  <p className="text-xs text-[#282326] italic mt-1">"{rev.comment}"</p>
                  <span className="text-[10px] text-stone-400 block mt-1">
                    Product: {rev.productName} · Date: {rev.date}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      storeService.moderateReview(rev.id, !rev.approved);
                      onRefreshData();
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors ${
                      rev.approved
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {rev.approved ? 'Approved' : 'Pending Approval'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Settings & Store Info Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#282326]/10 shadow-xs max-w-3xl space-y-6">
          <div className="pb-3 border-b border-stone-100">
            <h2 className="font-serif text-xl font-bold text-[#282326]">
              Store Information & Announcement Bar
            </h2>
            <p className="text-xs text-stone-500">
              Update physical store location, operating hours, and top promotional banner.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            {/* Announcement Banner */}
            <div className="p-4 bg-[#FCF4F6] rounded-2xl border border-[#F2D2DA] space-y-3">
              <label className="flex items-center gap-2 font-bold text-[#282326]">
                <input
                  type="checkbox"
                  checked={storeForm.announcementActive}
                  onChange={(e) => setStoreForm({ ...storeForm, announcementActive: e.target.checked })}
                  className="accent-[#C8798D]"
                />
                <span>Enable Top Announcement Banner</span>
              </label>
              <div>
                <label className="block font-semibold mb-1 text-stone-600">Announcement Text</label>
                <input
                  type="text"
                  value={storeForm.announcementText}
                  onChange={(e) => setStoreForm({ ...storeForm, announcementText: e.target.value })}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Store Name</label>
                <input
                  type="text"
                  value={storeForm.name}
                  onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Store Address</label>
                <input
                  type="text"
                  value={storeForm.address}
                  onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Phone / Helpline</label>
                <input
                  type="text"
                  value={storeForm.phone}
                  onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">WhatsApp Number (e.g. 923081030680)</label>
                <input
                  type="text"
                  value={storeForm.whatsapp}
                  onChange={(e) => setStoreForm({ ...storeForm, whatsapp: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Opening Hours</label>
              <input
                type="text"
                value={storeForm.openingHours}
                onChange={(e) => setStoreForm({ ...storeForm, openingHours: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block font-semibold mb-1">Free Delivery Min (PKR)</label>
                <input
                  type="number"
                  value={storeForm.freeDeliveryThreshold}
                  onChange={(e) =>
                    setStoreForm({ ...storeForm, freeDeliveryThreshold: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Standard Delivery Fee (PKR)</label>
                <input
                  type="number"
                  value={storeForm.standardDeliveryFee}
                  onChange={(e) =>
                    setStoreForm({ ...storeForm, standardDeliveryFee: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Islamabad Local Fee (PKR)</label>
                <input
                  type="number"
                  value={storeForm.islamabadDeliveryFee}
                  onChange={(e) =>
                    setStoreForm({ ...storeForm, islamabadDeliveryFee: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="bg-[#282326] hover:bg-[#C8798D] text-white py-3 px-6 rounded-xl font-bold transition-colors shadow-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Store Configurations</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
