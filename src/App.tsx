import React, { useState, useEffect } from 'react';
import { storeService } from './services/storeService';
import {
  Product,
  CartItem,
  Order,
  StoreSettings,
  CustomerReview,
  DiscountCode,
  UserAccount,
  CategoryInfo,
  ProductCategory,
} from './types';
import { Language } from './utils/i18n';

// Components
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchOverlay } from './components/SearchOverlay';
import { ReviewModal } from './components/ReviewModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

// Views
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailsView } from './views/ProductDetailsView';
import { CheckoutView } from './views/CheckoutView';
import { OrderConfirmationView } from './views/OrderConfirmationView';
import { AccountView } from './views/AccountView';
import { ContactView } from './views/ContactView';
import { AboutView } from './views/AboutView';
import { FaqView } from './views/FaqView';
import { PolicyViews } from './views/PolicyViews';
import { AdminView } from './views/AdminView';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParam, setViewParam] = useState<string | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Internationalization
  const [lang, setLang] = useState<Language>('en');

  // Application Data & Persistent States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(storeService.getSettings());
  const [currentUser, setCurrentUser] = useState<UserAccount>(storeService.getCurrentUser());

  // UI Modals & Drawers
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [reviewModalProduct, setReviewModalProduct] = useState<Product | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  // Initial load
  const refreshAllData = () => {
    setProducts(storeService.getProducts());
    setCategories(storeService.getCategories());
    setCart(storeService.getCart());
    setWishlist(storeService.getWishlist());
    setOrders(storeService.getOrders());
    setReviews(storeService.getReviews());
    setDiscounts(storeService.getDiscountCodes());
    setSettings(storeService.getSettings());
    setCurrentUser(storeService.getCurrentUser());
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedProduct]);

  // Navigation router handler
  const handleNavigate = (view: string, param?: string) => {
    setViewParam(param);
    if (view === 'shop' && param) {
      setCurrentView('shop');
    } else if (view === 'wishlist') {
      setCurrentView('account');
    } else {
      setCurrentView(view);
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product, variantId?: string, quantity: number = 1) => {
    const updated = storeService.addToCart(product, variantId, quantity);
    setCart([...updated]);
    setCartDrawerOpen(true);
  };

  const handleUpdateCartQuantity = (cartItemId: string, quantity: number) => {
    const updated = storeService.updateCartQuantity(cartItemId, quantity);
    setCart([...updated]);
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    const updated = storeService.removeFromCart(cartItemId);
    setCart([...updated]);
  };

  const handleBuyNow = (product: Product, variantId?: string, quantity: number = 1) => {
    storeService.addToCart(product, variantId, quantity);
    setCart(storeService.getCart());
    setCurrentView('checkout');
  };

  // Wishlist toggle
  const handleToggleWishlist = (productId: string) => {
    const updated = storeService.toggleWishlist(productId);
    setWishlist([...updated]);
  };

  // Product Selection (Opens PDP)
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-details');
  };

  // Order Placement
  const handleOrderPlaced = (order: Order) => {
    setLastPlacedOrder(order);
    setCart([]);
    refreshAllData();
    setCurrentView('order-confirmation');
  };

  // Review submission
  const handleSubmitReview = (newReview: {
    productId: string;
    productName: string;
    customerName: string;
    city: string;
    rating: number;
    comment: string;
    verifiedPurchase: boolean;
  }) => {
    storeService.addReview(newReview);
    refreshAllData();
  };

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#FFFDF9] text-[#282326] ${
        lang === 'ur' ? 'font-urdu' : 'font-sans'
      }`}
      dir={lang === 'ur' ? 'rtl' : 'ltr'}
    >
      {/* 1. Announcement Bar */}
      <AnnouncementBar
        settings={settings}
        visible={announcementVisible}
        onDismiss={() => setAnnouncementVisible(false)}
        lang={lang}
      />

      {/* 2. Top Bar Navigation Contract */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        cartCount={cartTotalItems}
        wishlistCount={wishlist.length}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenSearch={() => setSearchOverlayOpen(true)}
        lang={lang}
        onToggleLang={() => setLang(lang === 'en' ? 'ur' : 'en')}
        isAdmin={currentView === 'admin'}
      />

      {/* 3. Main Views Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            products={products}
            categories={categories}
            reviews={reviews}
            settings={settings}
            wishlist={wishlist}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToCart={(p) => handleAddToCart(p)}
            onToggleWishlist={handleToggleWishlist}
            onNavigate={handleNavigate}
            onOpenReviewModal={(p) => {
              setReviewModalProduct(p || products[0]);
              setReviewModalOpen(true);
            }}
            lang={lang}
          />
        )}

        {currentView === 'shop' && (
          <ShopView
            products={products}
            initialCategory={viewParam || 'all'}
            wishlist={wishlist}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToCart={(p) => handleAddToCart(p)}
            onToggleWishlist={handleToggleWishlist}
            lang={lang}
          />
        )}

        {currentView === 'product-details' && (
          <ProductDetailsView
            product={selectedProduct || products[0]}
            allProducts={products}
            reviews={reviews}
            settings={settings}
            wishlist={wishlist}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onToggleWishlist={handleToggleWishlist}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            onOpenReviewModal={(p) => {
              setReviewModalProduct(p);
              setReviewModalOpen(true);
            }}
            onNavigate={handleNavigate}
            lang={lang}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            cart={cart}
            settings={settings}
            onOrderPlaced={handleOrderPlaced}
            onNavigate={handleNavigate}
            lang={lang}
          />
        )}

        {currentView === 'order-confirmation' && (
          <OrderConfirmationView
            order={lastPlacedOrder || orders[0]}
            settings={settings}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'account' && (
          <AccountView
            user={currentUser}
            orders={orders}
            allProducts={products}
            wishlist={wishlist}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToCart={(p) => handleAddToCart(p)}
            onToggleWishlist={handleToggleWishlist}
            onUpdateUser={(updated) => setCurrentUser(updated)}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'contact' && (
          <ContactView settings={settings} />
        )}

        {currentView === 'about' && (
          <AboutView settings={settings} onNavigate={handleNavigate} />
        )}

        {currentView === 'faq' && (
          <FaqView settings={settings} onNavigate={handleNavigate} />
        )}

        {(currentView === 'shipping-policy' ||
          currentView === 'refund-policy' ||
          currentView === 'privacy-policy' ||
          currentView === 'terms') && (
          <PolicyViews
            policyType={currentView as any}
            settings={settings}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'admin' && (
          <AdminView
            products={products}
            orders={orders}
            discounts={discounts}
            reviews={reviews}
            settings={settings}
            onRefreshData={refreshAllData}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* 4. Footer */}
      <Footer settings={settings} onNavigate={handleNavigate} lang={lang} />

      {/* 5. Drawers & Floating Modals */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cart={cart}
        settings={settings}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedCheckout={() => {
          setCartDrawerOpen(false);
          setCurrentView('checkout');
        }}
        lang={lang}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
        onViewDetails={(prod) => {
          setQuickViewProduct(null);
          handleSelectProduct(prod);
        }}
        lang={lang}
      />

      <SearchOverlay
        isOpen={searchOverlayOpen}
        onClose={() => setSearchOverlayOpen(false)}
        products={products}
        onSelectProduct={handleSelectProduct}
        onViewAllResults={(query) => {
          setViewParam(query);
          setCurrentView('shop');
        }}
      />

      <ReviewModal
        product={reviewModalProduct}
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSubmitReview={handleSubmitReview}
      />

      {/* 6. Floating WhatsApp Store Contact Widget */}
      <FloatingWhatsApp settings={settings} />
    </div>
  );
}
