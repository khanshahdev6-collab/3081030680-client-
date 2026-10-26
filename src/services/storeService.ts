import {
  Product,
  ProductCategory,
  CartItem,
  Order,
  DiscountCode,
  CustomerReview,
  StoreSettings,
  UserAccount,
  CustomerDetails,
} from '../types';
import {
  STORE_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_DISCOUNT_CODES,
  INITIAL_REVIEWS,
  INITIAL_USER,
} from '../data/mockData';

const STORAGE_KEYS = {
  PRODUCTS: 'mj_products',
  ORDERS: 'mj_orders',
  DISCOUNTS: 'mj_discounts',
  REVIEWS: 'mj_reviews',
  SETTINGS: 'mj_settings',
  CART: 'mj_cart',
  WISHLIST: 'mj_wishlist',
  CURRENT_USER: 'mj_current_user',
  SUBSCRIBERS: 'mj_subscribers',
};

class StoreService {
  private getStorage<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private setStorage<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      // safe fallback
    }
  }

  // --- Products ---
  getProducts(): Product[] {
    return this.getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }

  getProductById(id: string): Product | undefined {
    return this.getProducts().find((p) => p.id === id);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.getProducts().find((p) => p.slug === slug);
  }

  saveProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    this.setStorage(STORAGE_KEYS.PRODUCTS, products);
  }

  deleteProduct(id: string): void {
    const products = this.getProducts().filter((p) => p.id !== id);
    this.setStorage(STORAGE_KEYS.PRODUCTS, products);
  }

  // --- Categories ---
  getCategories() {
    return INITIAL_CATEGORIES;
  }

  getCategory(id: ProductCategory) {
    return INITIAL_CATEGORIES.find((c) => c.id === id);
  }

  // --- Cart ---
  getCart(): CartItem[] {
    return this.getStorage<CartItem[]>(STORAGE_KEYS.CART, []);
  }

  saveCart(cart: CartItem[]): void {
    this.setStorage(STORAGE_KEYS.CART, cart);
  }

  addToCart(product: Product, variantId?: string, quantity: number = 1): CartItem[] {
    const cart = this.getCart();
    const selectedVariant = variantId ? product.variants.find((v) => v.id === variantId) : undefined;
    const unitPrice = (product.salePrice ?? product.price) + (selectedVariant?.extraPrice || 0);
    const cartItemId = `${product.id}-${variantId || 'standard'}`;

    const existingIndex = cart.findIndex((item) => item.id === cartItemId);
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: cartItemId,
        productId: product.id,
        product,
        variantId,
        variantName: selectedVariant?.name,
        shadeHex: selectedVariant?.shadeHex,
        quantity,
        price: unitPrice,
      });
    }
    this.saveCart(cart);
    return cart;
  }

  updateCartQuantity(cartItemId: string, quantity: number): CartItem[] {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter((item) => item.id !== cartItemId);
    } else {
      const item = cart.find((i) => i.id === cartItemId);
      if (item) {
        item.quantity = quantity;
      }
    }
    this.saveCart(cart);
    return cart;
  }

  removeFromCart(cartItemId: string): CartItem[] {
    const cart = this.getCart().filter((item) => item.id !== cartItemId);
    this.saveCart(cart);
    return cart;
  }

  clearCart(): void {
    this.saveCart([]);
  }

  // --- Wishlist ---
  getWishlist(): string[] {
    return this.getStorage<string[]>(STORAGE_KEYS.WISHLIST, ['mj-001', 'mj-004']);
  }

  toggleWishlist(productId: string): string[] {
    const wishlist = this.getWishlist();
    const index = wishlist.indexOf(productId);
    if (index >= 0) {
      wishlist.splice(index, 1);
    } else {
      wishlist.push(productId);
    }
    this.setStorage(STORAGE_KEYS.WISHLIST, wishlist);
    return wishlist;
  }

  isInWishlist(productId: string): boolean {
    return this.getWishlist().includes(productId);
  }

  // --- Orders ---
  getOrders(): Order[] {
    const defaultOrders: Order[] = [
      {
        id: 'MJ-9042',
        createdAt: '2026-03-24T14:30:00Z',
        customer: {
          name: 'Zara Qureshi',
          phone: '0308-1030680',
          email: 'zara.qureshi@example.com',
          address: 'House 42, Street 18, Sector F-11/2',
          city: 'Islamabad',
          postalCode: '44000',
          notes: 'Please call before arriving.',
        },
        items: [
          {
            id: 'mj-001-v-02',
            productId: 'mj-001',
            product: INITIAL_PRODUCTS[0],
            variantId: 'v-02',
            variantName: 'Shade 02 - Natural Beige',
            quantity: 1,
            price: 3450,
          },
          {
            id: 'mj-002-v-22',
            productId: 'mj-002',
            product: INITIAL_PRODUCTS[1],
            variantId: 'v-22',
            variantName: 'Chai Nude',
            quantity: 1,
            price: 1550,
          },
        ],
        subtotal: 5000,
        deliveryFee: 0,
        discountAmount: 500,
        discountCode: 'WELCOME10',
        total: 4500,
        paymentMethod: 'cod',
        status: 'Delivered',
        trackingNotes: 'Dispatched via TCS Express. Delivered to customer.',
      },
      {
        id: 'MJ-9088',
        createdAt: '2026-03-26T10:15:00Z',
        customer: {
          name: 'Hina Bilal',
          phone: '0321-5544332',
          email: 'hina.b@example.com',
          address: 'Apartment 4B, Silver Oaks, F-10',
          city: 'Islamabad',
          postalCode: '44000',
        },
        items: [
          {
            id: 'mj-004-v-41',
            productId: 'mj-004',
            product: INITIAL_PRODUCTS[3],
            variantId: 'v-41',
            variantName: '50ml Travel Flacon',
            quantity: 1,
            price: 6850,
          },
        ],
        subtotal: 6850,
        deliveryFee: 0,
        discountAmount: 0,
        total: 6850,
        paymentMethod: 'cod',
        status: 'Processing',
        trackingNotes: 'Packaged in presentation box. Awaiting rider pickup.',
      },
    ];
    return this.getStorage<Order[]>(STORAGE_KEYS.ORDERS, defaultOrders);
  }

  saveOrder(order: Order): void {
    const orders = this.getOrders();
    const existingIndex = orders.findIndex((o) => o.id === order.id);
    if (existingIndex >= 0) {
      orders[existingIndex] = order;
    } else {
      orders.unshift(order);
    }
    this.setStorage(STORAGE_KEYS.ORDERS, orders);
  }

  createOrder(
    customer: CustomerDetails,
    items: CartItem[],
    subtotal: number,
    deliveryFee: number,
    discountAmount: number,
    discountCode: string | undefined,
    paymentMethod: 'cod' | 'bank_transfer'
  ): Order {
    const referenceId = `MJ-${Math.floor(1000 + Math.random() * 9000)}`;
    const total = Math.max(0, subtotal + deliveryFee - discountAmount);

    const newOrder: Order = {
      id: referenceId,
      createdAt: new Date().toISOString(),
      customer,
      items,
      subtotal,
      deliveryFee,
      discountAmount,
      discountCode,
      total,
      paymentMethod,
      status: 'Pending',
      trackingNotes: 'Order received. Makeup Junction store team is preparing fulfillment.',
    };

    this.saveOrder(newOrder);
    this.clearCart();
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: Order['status'], notes?: string): void {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      if (notes) order.trackingNotes = notes;
      this.setStorage(STORAGE_KEYS.ORDERS, orders);
    }
  }

  // --- Discounts ---
  getDiscountCodes(): DiscountCode[] {
    return this.getStorage<DiscountCode[]>(STORAGE_KEYS.DISCOUNTS, INITIAL_DISCOUNT_CODES);
  }

  saveDiscountCode(discount: DiscountCode): void {
    const discounts = this.getDiscountCodes();
    const index = discounts.findIndex((d) => d.code.toUpperCase() === discount.code.toUpperCase());
    if (index >= 0) {
      discounts[index] = discount;
    } else {
      discounts.unshift(discount);
    }
    this.setStorage(STORAGE_KEYS.DISCOUNTS, discounts);
  }

  validateDiscount(code: string, subtotal: number): { valid: boolean; discount?: DiscountCode; message?: string } {
    const discounts = this.getDiscountCodes();
    const matched = discounts.find(
      (d) => d.code.trim().toUpperCase() === code.trim().toUpperCase() && d.active
    );

    if (!matched) {
      return { valid: false, message: 'Invalid or inactive promotional coupon code.' };
    }

    if (subtotal < matched.minOrder) {
      return {
        valid: false,
        message: `This coupon requires a minimum subtotal of Rs. ${matched.minOrder.toLocaleString()}.`,
      };
    }

    return { valid: true, discount: matched };
  }

  // --- Reviews ---
  getReviews(): CustomerReview[] {
    return this.getStorage<CustomerReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }

  getProductReviews(productId: string): CustomerReview[] {
    return this.getReviews().filter((r) => r.productId === productId && r.approved);
  }

  addReview(review: Omit<CustomerReview, 'id' | 'date' | 'approved'>): CustomerReview {
    const reviews = this.getReviews();
    const newReview: CustomerReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      approved: true, // auto-approve verified customer reviews in demo
    };
    reviews.unshift(newReview);
    this.setStorage(STORAGE_KEYS.REVIEWS, reviews);
    return newReview;
  }

  moderateReview(reviewId: string, approved: boolean): void {
    const reviews = this.getReviews();
    const target = reviews.find((r) => r.id === reviewId);
    if (target) {
      target.approved = approved;
      this.setStorage(STORAGE_KEYS.REVIEWS, reviews);
    }
  }

  // --- Store Settings ---
  getSettings(): StoreSettings {
    return this.getStorage<StoreSettings>(STORAGE_KEYS.SETTINGS, STORE_SETTINGS);
  }

  updateSettings(settings: StoreSettings): void {
    this.setStorage(STORAGE_KEYS.SETTINGS, settings);
  }

  // --- Users / Auth ---
  getCurrentUser(): UserAccount {
    return this.getStorage<UserAccount>(STORAGE_KEYS.CURRENT_USER, INITIAL_USER);
  }

  setCurrentUser(user: UserAccount): void {
    this.setStorage(STORAGE_KEYS.CURRENT_USER, user);
  }

  // --- Newsletter ---
  subscribeNewsletter(email: string): boolean {
    const subscribers = this.getStorage<string[]>(STORAGE_KEYS.SUBSCRIBERS, [
      'hira.beauty@gmail.com',
      'mahnoor.style@yahoo.com',
    ]);
    if (!subscribers.includes(email.toLowerCase())) {
      subscribers.push(email.toLowerCase());
      this.setStorage(STORAGE_KEYS.SUBSCRIBERS, subscribers);
      return true;
    }
    return false;
  }

  getSubscribers(): string[] {
    return this.getStorage<string[]>(STORAGE_KEYS.SUBSCRIBERS, [
      'hira.beauty@gmail.com',
      'mahnoor.style@yahoo.com',
    ]);
  }

  // --- WhatsApp Helpers ---
  getWhatsAppProductUrl(product: Product, selectedVariantName?: string): string {
    const settings = this.getSettings();
    const phone = settings.whatsapp;
    const variantText = selectedVariantName ? ` (Selected: ${selectedVariantName})` : '';
    const priceText = (product.salePrice ?? product.price).toLocaleString();
    const msg = `Assalam-o-Alaikum Makeup Junction! I am interested in ordering "${product.name}"${variantText} priced at Rs. ${priceText}. Is this currently in stock at your Iqbal Town, Islamabad store?`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }

  getWhatsAppCartOrderUrl(cart: CartItem[], customer?: CustomerDetails, total?: number): string {
    const settings = this.getSettings();
    const phone = settings.whatsapp;
    let msg = `Assalam-o-Alaikum Makeup Junction!\nI would like to place an order via WhatsApp:\n\n`;

    cart.forEach((item, index) => {
      const v = item.variantName ? ` [${item.variantName}]` : '';
      msg += `${index + 1}. ${item.product.name}${v} x${item.quantity} = Rs. ${(item.price * item.quantity).toLocaleString()}\n`;
    });

    if (total !== undefined) {
      msg += `\n*Estimated Total: Rs. ${total.toLocaleString()}*`;
    }

    if (customer && customer.name) {
      msg += `\n\n*Customer Details:*\nName: ${customer.name}\nPhone: ${customer.phone}\nDelivery Address: ${customer.address}, ${customer.city}`;
    }

    msg += `\n\nPlease confirm availability and dispatch details. JazakAllah!`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }

  getWhatsAppOrderInquiryUrl(order: Order): string {
    const settings = this.getSettings();
    const phone = settings.whatsapp;
    const msg = `Assalam-o-Alaikum Makeup Junction! I would like to check the dispatch status of my order #${order.id} for Rs. ${order.total.toLocaleString()} (Customer: ${order.customer.name}, ${order.customer.city}).`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }
}

export const storeService = new StoreService();
