-- CREATE OFFER CONFIG TABLE
CREATE TABLE IF NOT EXISTS public.offer_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  is_active BOOLEAN DEFAULT TRUE,
  banner_image TEXT,
  title TEXT NOT NULL,
  subtitle TEXT,
  expiry_date TIMESTAMPTZ,
  product_ids TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.offer_config ENABLE ROW LEVEL SECURITY;

-- POLICIES
CREATE POLICY "offer_select" ON public.offer_config FOR SELECT USING (TRUE);
CREATE POLICY "offer_write_admin" ON public.offer_config FOR ALL USING (public.is_admin());
