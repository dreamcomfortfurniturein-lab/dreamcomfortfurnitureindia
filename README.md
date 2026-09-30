# DreamComfortFurnitureIndia

A starter online store: product catalog, cart, and Razorpay checkout, built with Next.js + Tailwind. Open this folder in VS Code to continue building it.

## 1. Run it locally

```bash
cd dreamcomfortfurnitureindia
npm install
cp .env.example .env.local   # then fill in your Razorpay keys
npm run dev
```

Open http://localhost:3000.

## 2. Add your products

Edit `data/products.json`. Each product looks like:

```json
{
  "slug": "walnut-sheesham-sofa-3-seater",
  "name": "Walnut Sheesham 3-Seater Sofa",
  "category": "Living Room",
  "material": "Sheesham wood, cotton upholstery",
  "price": 34999,
  "mrp": 42999,
  "stock": 6,
  "description": "...",
  "images": ["/products/sofa-3seater-1.jpg"]
}
```

- `slug` must be unique — it becomes the product's URL (`/products/<slug>`).
- Drop the actual photo files into `public/products/` with matching filenames.
- For 100+ products, keep them all in this one JSON file — it's fine at that size. If you outgrow it later, that's the point where you'd move to a small database (e.g. free tier of Supabase or Postgres) instead of hand-editing JSON.

## 3. Set up real payments (Razorpay)

1. Create an account at https://razorpay.com and complete KYC (PAN, bank account, business proof) — required before you can accept live payments.
2. Get your API keys from Dashboard → Settings → API Keys. Start with **test mode** keys.
3. Put them in `.env.local` (never commit this file — it's already in `.gitignore`).
4. Test a full checkout using Razorpay's test card numbers (in their docs) before switching to live keys.
5. Switch to live keys only once you've tested the full flow end-to-end.

## 4. Deploy it

The easiest path for a Next.js app: push this folder to a GitHub repo, then deploy on [Vercel](https://vercel.com) (free tier is enough to start). Add your `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `NEXT_PUBLIC_RAZORPAY_KEY_ID` as environment variables in the Vercel project settings — don't put real keys in the code.

You'll also want a custom domain (e.g. dreamcomfortfurnitureindia.com) pointed at the Vercel deployment.

## 5. Selling on Amazon and Flipkart

You register directly with each marketplace — this app doesn't do it for you, but here's what to have ready:

**Before you register anywhere:** you'll need **GST registration**. Unlike offline retail, GST is mandatory for e-commerce sellers in India from the very first sale — there's no turnover exemption. Apply for a GSTIN first (free on the government GST portal, ~1 week); everything else follows from that.

**Amazon.in (Seller Central, sell.amazon.in):**
- Needed: PAN, GSTIN, active bank account, mobile number, email, and a pickup address in the same state as your GST registration.
- Registration itself is free; Amazon charges a referral fee per sale plus optional monthly fees on the Professional plan.
- Expect identity/KYC verification (photo ID, sometimes a video call) and GST document review (up to ~72 hours).
- Furniture is generally an open category, but check for any category-specific approval requirements in Seller Central once you start.

**Flipkart (Seller Hub, seller.flipkart.com):**
- Same core documents: GSTIN, PAN, bank account with a cancelled cheque, pickup address, signature.
- Registration is free; an 8-step onboarding flow most sellers finish in one sitting, with GST verification in ~24–72 hours.
- You can choose self-ship or Flipkart's own fulfilment (Ekart/FBF) — FBF requires listing warehouse states as additional places of business on your GST registration.

**General tips:**
- Use the same product photos and descriptions you're building for your own site — reuse that work across all three channels.
- Marketplace commissions typically run 15–30%+ of order value once fees, shipping and GST on fees are included — price accordingly, or your own site (with just Razorpay's ~2% fee) will be far more profitable per order.
- Fees, category rules and required documents change periodically on both platforms — always confirm the current fee card and document checklist inside Seller Central / Seller Hub before you commit to pricing.

## Project structure

```
app/
  page.tsx                 → homepage
  products/page.tsx        → full catalog
  products/[slug]/page.tsx → single product page
  cart/page.tsx            → cart
  checkout/page.tsx        → checkout + Razorpay
  api/create-order/route.ts→ server-side order creation (keeps your secret key safe)
data/products.json         → all product data
public/products/           → product photos
lib/cart-context.tsx       → cart state (persisted in the browser)
```
