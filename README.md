# Makeup Junction — Premium Cosmetics E-Commerce Platform

A production-grade, luxury cosmetics e-commerce web application designed and built for **Makeup Junction**, a premier beauty and cosmetics store located in **Iqbal Town, Islamabad, Pakistan**.

---

## 1. Business Profile & Contact Information

- **Business Name:** Makeup Junction
- **Category:** Cosmetics & Beauty Products
- **Physical Address:** 1, Iqbal Town, Islamabad, 43000, Pakistan
- **Phone / Helpline:** +92 308 1030680
- **Official WhatsApp:** +92 308 1030680 (Direct: `https://wa.me/923081030680`)
- **Google Maps Plus Code:** M424+CQ Islamabad, Pakistan
- **Google Maps Directions:** [https://www.google.com/maps/search/?api=1&query=Makeup+Junction%2C+1+Iqbal+Town%2C+Islamabad%2C+Pakistan](https://www.google.com/maps/search/?api=1&query=Makeup+Junction%2C+1+Iqbal+Town%2C+Islamabad%2C+Pakistan)
- **Opening Hours:** 11:00 AM – 11:00 PM Daily
- **Target Audience:** Beauty enthusiasts in Islamabad, Rawalpindi, and across Pakistan
- **Currency:** Pakistani Rupee (PKR / Rs.)
- **Bilingual Support:** English (Primary) and Urdu (اردو)

---

## 2. Features Implemented

### Storefront & Shopping Experience
- **Editorial Luxury Aesthetics:** Designed strictly to luxury beauty benchmarks with warm blush (`#F8E8EC`), rose (`#C8798D`), ivory (`#FFFDF9`), deep charcoal (`#282326`), and champagne gold (`#C5A46D`).
- **Typography:** Playfair Display for luxury headings, Plus Jakarta Sans for clean body text, and Noto Nastaliq Urdu for Urdu localization.
- **Top Bar Contract:** Clean 1-line wordmark, single-line navigation links, quick search trigger, wishlist indicator, language switcher (EN/UR), and shopping bag with live counter.
- **Announcement Bar:** Promotional banner for free delivery and discounts with dismiss state, configurable via the admin panel.
- **8 Beauty Categories:**
  1. Makeup Essentials
  2. Luxury Skincare
  3. Lipsticks & Lip Gloss
  4. Foundations & Concealers
  5. Eye Makeup
  6. Fine Fragrances
  7. Beauty Tools & Brushes
  8. Hair Care & Serums
- **Catalog Filtering & Sorting:** Category filters, brand filters, interactive price range slider (PKR 1,000 to 10,000), in-stock availability toggle, sort by price (low/high), newest, name, and popularity. Grid and list layouts.
- **Quick View Modal:** Fast inspection modal with thumbnail switching, shade swatches, quantity stepper, Add to Bag, Buy Now, and direct WhatsApp inquiry.
- **Product Details Page (PDP):** Contiguous purchase module, multi-image gallery with active thumbnails, shade selector with color swatches, full ingredients disclosure, application directions, and authentic customer review showcase.
- **Slide-out Shopping Bag & Free Shipping Meter:** Dynamic progress bar showing how much to add to qualify for Free Delivery across Pakistan (e.g., above Rs. 3,000). Coupon validation engine supporting percentage (`WELCOME10`), fixed amount (`GLOW500`), and free shipping (`ISLAMABADFREE`).
- **Complete Checkout & Validation:** Form validated with Pakistani mobile number regex (`03xx-xxxxxxx`), city-based delivery fees (Islamabad vs nationwide), and Cash on Delivery (COD) / Direct Bank Transfer payment options.
- **Order Confirmation & Invoicing:** Printable order receipt, unique order reference (#MJ-XXXX), and instant WhatsApp order status confirmation button.
- **Customer Accounts:** Profile details, saved multi-address book, order history with tracking statuses (`Pending`, `Confirmed`, `Processing`, `Shipped`, `Delivered`), and saved wishlist.
- **Verified Customer Reviews:** Authenticated review submission form and star rating system.
- **Search Overlay:** Instant live search across names, brands, categories, and descriptions with trending Islamabad search tags.
- **Floating WhatsApp Widget:** Persistent multi-action concierge launcher for shade advice, store directions, and fast WhatsApp order requests.
- **Complete Information & Policy Pages:**
  - About Us (Boutique story, authenticity commitment, Islamabad showroom)
  - Contact Us (Store address, telephone, map link, message form)
  - Frequently Asked Questions (Accordion addressing COD, shipping times, authenticity, returns)
  - Shipping Policy (Islamabad vs nationwide delivery rules)
  - Returns & Refund Policy (Cosmetics hygiene regulations)
  - Privacy Policy & Data Security
  - Terms and Conditions

### Admin Dashboard & Store Management
- **Metrics Overview:** Real-time revenue in PKR, order counters, pending fulfillment warnings, active products, and subscriber counts.
- **Low Inventory Alert:** Automated warning flags for products with $\le 15$ units.
- **Order Management:** View all orders, filter and update statuses (`Pending`, `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`), view item details, and WhatsApp customer directly.
- **Product Catalog Management:** Add new products, edit price/sale price in PKR, update stock, modify descriptions, and delete products.
- **Discount Code Engine:** Create, toggle, and manage percentage, fixed, or free-shipping promo codes.
- **Review Moderation:** Approve or hold user-submitted reviews.
- **Store Settings & Promo Banner:** Change announcement text, free delivery threshold, and telephone contact.
- **Order Data Export:** 1-click export of customer orders to CSV.

---

## 3. Technology Stack

- **Framework:** React 19 SPA with TypeScript
- **Bundler:** Vite 8
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`) with custom luxury theme tokens
- **Icons:** Lucide React
- **Animations:** Motion
- **Persistence:** Local client storage engine (`storeService`) with persistent schema and state synchronization

---

## 4. Local Development & Build Commands

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Run TypeScript compilation and lint check
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 5. Deployment Instructions

1. **Deploy to Vercel / Netlify / Cloud Run:**
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
2. **Environment Variables:**
   - `VITE_APP_URL`: Production domain URL (e.g. `https://makeupjunction.pk`)
   - `GEMINI_API_KEY`: Injected automatically if AI Studio server endpoints are called

---

## 6. Store Owner Verification & Next Steps

Before public launch:
1. **Catalog Verification:** Current catalog items are labeled demo products with realistic PKR pricing and shades. The owner can add their actual inventory via the Admin Panel.
2. **Payment Gateway Integration:** If the owner wishes to accept credit/debit cards online (beyond Cash on Delivery and Direct Bank Transfer), an approved Pakistani payment gateway (such as PayMob, Safepay, or JazzCash) can be integrated.
3. **Weekly Hours Confirmation:** Physical store hours are listed as 11:00 AM – 11:00 PM daily. Confirm with the owner if Sunday hours vary.
