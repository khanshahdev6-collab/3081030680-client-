export type ProductCategory =
  | 'all'
  | 'makeup'
  | 'skincare'
  | 'lipsticks'
  | 'foundations'
  | 'eyes'
  | 'fragrances'
  | 'tools'
  | 'haircare';

export interface ProductVariant {
  id: string;
  name: string;
  shadeHex?: string;
  inStock: boolean;
  extraPrice?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  urduName?: string;
  brand: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  salePrice?: number;
  sku: string;
  stock: number;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  benefits: string[];
  variants: ProductVariant[];
  ingredients?: string;
  howToUse?: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  demoProduct: boolean;
}

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  urduName: string;
  slug: string;
  image: string;
  itemCount: number;
  description: string;
}

export interface CartItem {
  id: string; // unique item id = productId + (variantId || '')
  productId: string;
  product: Product;
  variantId?: string;
  variantName?: string;
  shadeHex?: string;
  quantity: number;
  price: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'cod' | 'bank_transfer';

export interface Order {
  id: string; // e.g. MJ-9042
  createdAt: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  discountCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  trackingNotes?: string;
}

export interface DiscountCode {
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minOrder: number;
  active: boolean;
  expiryDate: string;
  description: string;
}

export interface CustomerReview {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  city: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  date: string;
  approved: boolean;
}

export interface StoreSettings {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  whatsapp: string;
  plusCode: string;
  openingHours: string;
  announcementText: string;
  announcementActive: boolean;
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
  islamabadDeliveryFee: number;
}

export interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  role: 'customer' | 'admin';
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}
