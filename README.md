# TeesZone Frontend Storefront

Modern e-commerce storefront for **TeesZone** — manufacturer-direct custom apparel and knitwear catalog based in Tiruppur, India.

- **Framework**: Next.js (App Router) & React
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS & Lucide Icons
- **State & Data**: Client/Server fetching connected to TeesZone Fastify API (`http://localhost:4010`)

---

## Key Features & Recent Updates

1. **Curated Product Catalog & Navigation**:
   - Strictly organized multi-level mega navigation covering:
     - **MEN**: Round Neck (180 GSM, 200 GSM Cotton, 200 GSM Spandex, Full Sleeve), Oversize (200 GSM, 240-250 GSM), Polo T-Shirts (100% Cotton, Spandex blend, Mars Poly).
     - **WOMEN**: Round Neck Half Sleeve (180 GSM).
     - **KIDS**: Round Neck Half Sleeve (180 GSM).
     - **HOODIES**: With Zip (325 GSM, 360-370 GSM, 320 GSM Cotton Rich) & Without Zip (320 GSM).
     - **SPECIALTY & FABRICS**: Eco & Biowash (Ecoblend, Biowash 180 GSM), Collar T-Shirts (Single Jersey, Honeycomb, Mars Poly), Heavyweight (220 GSM).
   - Dynamic collection filtering and product detail pages (PDP) with quantity-tiered bulk pricing and fabric highlights.

2. **Responsive Hero Section**:
   - **Desktop View**: Full-bleed background texture with enlarged product podium showcase and responsive metrics.
   - **Mobile View**: Dedicated mobile background framing (`Home_page_hero_section_Bg_mobile_view.png`) with touch-friendly layout and direct inquiry actions.

3. **Performance Optimization**:
   - Ultra-fast page load times under 400ms across all core pages.
   - Zero compilation errors (`tsc --noEmit`).

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env.local` if custom API configurations are required:
```env
NEXT_PUBLIC_API_URL=http://localhost:4010
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the storefront.

---

## Scripts

- `npm run dev` — Starts local development server on port 3000
- `npm run build` — Production build
- `npm run start` — Starts production server
- `npm run lint` — Runs ESLint checks
