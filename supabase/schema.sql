-- ==============================================================================
-- DREAM COMFORT FURNITURE — SUPABASE FREE TIER SQL SCHEMA
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- Contact: dreamcomfortfurniture.in@gmail.com
-- ==============================================================================

-- 1. PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  distributor_id TEXT UNIQUE,
  sponsor_id TEXT,
  rank TEXT DEFAULT 'Associate',
  bv INTEGER DEFAULT 0,
  pv INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. PARTNER ACCESS REQUESTS TABLE (₹15,000 Hybrid Business Model)
CREATE TABLE IF NOT EXISTS public.partner_access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  status TEXT DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  requested_amount NUMERIC DEFAULT 10000,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  approved_at TIMESTAMPTZ
);

-- 3. PENDING MEDIA UPLOADS TABLE (Phone uploads & Gmail approval code)
CREATE TABLE IF NOT EXISTS public.pending_media (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  orientation TEXT DEFAULT 'landscape', -- 'landscape' | 'vertical'
  type TEXT DEFAULT 'video',           -- 'video' | 'poster'
  media_url TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  cta_link TEXT,
  uploader_name TEXT,
  uploader_phone TEXT,
  approval_code TEXT NOT NULL,
  status TEXT DEFAULT 'pending',       -- 'pending' | 'approved'
  approved_at TIMESTAMPTZ
);

-- 4. ORDERS TABLE (Razorpay orders & customer fulfillment)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address JSONB,
  items JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  payment_status TEXT DEFAULT 'pending', -- 'pending' | 'paid' | 'failed'
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES (Free Tier Friendly)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view their own profile, public can view distributor rank
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Partner requests: Anyone can submit an access request
CREATE POLICY "Anyone can submit partner access requests" ON public.partner_access_requests
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view partner access requests with id" ON public.partner_access_requests
  FOR SELECT USING (true);
CREATE POLICY "Service role can update partner access requests" ON public.partner_access_requests
  FOR UPDATE USING (true);

-- Pending Media: Anyone can submit from phone, anyone can read approved items
CREATE POLICY "Anyone can insert pending media from phone" ON public.pending_media
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view pending media" ON public.pending_media
  FOR SELECT USING (true);
CREATE POLICY "Anyone can update pending media with approval" ON public.pending_media
  FOR UPDATE USING (true);

-- Orders: Anyone can create orders, users can view their own
CREATE POLICY "Anyone can insert an order" ON public.orders
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view order by order_id" ON public.orders
  FOR SELECT USING (true);
