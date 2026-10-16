# TeesZone Frontend Storefront

Modern, high-performance e-commerce storefront for **TeesZone** — manufacturer-direct blank and custom apparel catalog based in Tiruppur, India.

- **Framework**: Next.js 15+ (App Router) & React 19
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS & Lucide React
- **Payments**: Razorpay Standard Checkout & WhatsApp Wholesale Desk
- **State & Data**: Client/Server hydration connected to TeesZone Fastify API (`http://localhost:4010`)

---

## Core Features & Functionalities

### 1. User-Isolated Product Likes / Wishlist (`/wishlist`)
- Product likes are strictly isolated per registered account (`teeszone-wishlist-u-<id>`).
- Seamlessly synchronizes with backend MySQL via `/api/likes/toggle`.
- User 1's liked products only display for User 1; User 2's liked products only display for User 2.
- Guest sessions store local likes under `teeszone-wishlist-guest` and merge upon login.

### 2. Curated Product Catalog & Navigation (`/products`, `/collections/*`)
- Structured multi-level mega navigation covering:
  - **MEN**: Round Neck (180 GSM, 200 GSM Cotton, 200 GSM Spandex, Full Sleeve), Oversize (200 GSM, 240-250 GSM), Polo T-Shirts (100% Cotton, Spandex blend, Mars Poly).
  - **WOMEN**: Round Neck Half Sleeve (180 GSM).
  - **KIDS**: Round Neck Half Sleeve (180 GSM).
  - **HOODIES**: With Zip (325 GSM, 360-370 GSM, 320 GSM Cotton Rich) & Without Zip (320 GSM).
  - **SPECIALTY & FABRICS**: Eco & Biowash (Ecoblend, Biowash 180 GSM), Collar T-Shirts (Single Jersey, Honeycomb, Mars Poly), Heavyweight (220 GSM).
- Uniform product card dimensions across all catalog grids.
- Color variant thumbnail carousel with smooth left/right arrow navigation for 7+ shades.

### 3. Product Details Page (PDP)
- Real-time color switcher, size selector, quantity pricing tiers, and custom printing/embroidery add-ons.
- Star ratings and customer reviews with live "Orders Delivered" counter aligned below reviews.

### 4. Dynamic CMS-Driven Homepage (`/`)
- Integrates with backend `/api/home-content`:
  - **Hero Split**: Live headlines, subtext, CTA, and responsive desktop/mobile hero banners.
  - **Shop By Range**: Customizable product category grid.
  - **The Fabric Library**: Showcase of cotton, poly blends, and sustainable knits.
  - **The TeesZone Process**: 4-step manufacturing and wholesale workflow.

### 5. Customer Account & Order Tracking (`/account/*`)
- Account Dashboard (`/account`) with links to profile management, delivery addresses (`/account/addresses`), security credentials (`/account/security`), wishlist, and cart.
- Orders & Wholesale Tracking (`/account/orders`) with direct WhatsApp factory desk link.

---

## E-Commerce Security

- **Zero Secret Leakage**: No database passwords, JWT secrets, AWS secrets, or Razorpay secret keys are bundled in client assets.
- Only safe, public environment variables (such as `NEXT_PUBLIC_RAZORPAY_KEY_ID` and `NEXT_PUBLIC_API_URL`) are accessible to the browser.
- Verified 100% pass across all security audits.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env.local` for local development:
```env
NEXT_PUBLIC_API_URL=http://localhost:4010/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_To4JuFBba3Cd0n
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the storefront.

---

## Available Scripts

- `npm run dev` — Starts local development server on port 3000
- `npm run build` — Production build with TypeScript validation
- `npm run start` — Starts production Next.js server
- `npm run lint` — Runs ESLint checks
