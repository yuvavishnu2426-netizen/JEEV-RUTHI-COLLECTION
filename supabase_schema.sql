-- ============================================================
-- JEEV RUTHI COLLECTION -- SUPABASE COMPLETE SCHEMA
-- Run this entire file in Supabase SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  mobile TEXT,
  email TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  auth_type TEXT DEFAULT 'otp-mobile',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: addresses
-- ============================================================
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  address_line TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: products
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Women','Kids','Collections','Wholesale','Offers')),
  subcategory TEXT NOT NULL,
  description TEXT,
  mrp_price NUMERIC(12,2) NOT NULL,
  offer_price NUMERIC(12,2) NOT NULL,
  discount_percentage NUMERIC(5,2) DEFAULT 0,
  sizes TEXT[] NOT NULL DEFAULT '{}',
  stock INT DEFAULT 0,
  images TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  best_seller BOOLEAN DEFAULT FALSE,
  new_arrival BOOLEAN DEFAULT FALSE,
  is_offer_product BOOLEAN DEFAULT FALSE,
  rating NUMERIC(3,1) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  shipping_fee NUMERIC DEFAULT 0,
  size_stocks JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: color_variants
-- ============================================================
CREATE TABLE IF NOT EXISTS public.color_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: homepage_banners
-- ============================================================
CREATE TABLE IF NOT EXISTS public.homepage_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  cta_text TEXT DEFAULT 'EXPLORE LUXURY',
  cta_link TEXT DEFAULT '/shop',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: category_banners
-- ============================================================
CREATE TABLE IF NOT EXISTS public.category_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: offer_config
-- ============================================================
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

-- ============================================================
-- TABLE: orders
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_full_name TEXT NOT NULL,
  customer_mobile TEXT NOT NULL,
  customer_email TEXT,
  customer_address_line TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_state TEXT NOT NULL,
  customer_pincode TEXT NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount NUMERIC(12,2) NOT NULL DEFAULT 0,
  shipping_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('UPI','COD','Razorpay')),
  payment_status TEXT NOT NULL DEFAULT 'Pending'
    CHECK (payment_status IN ('Pending','Pending Verification','Payment Approved','Payment Rejected','Paid','Pending COD','Refunded')),
  payment_screenshot_url TEXT,
  upi_transaction_id TEXT,
  order_status TEXT NOT NULL DEFAULT 'Pending Payment'
    CHECK (order_status IN ('Pending Payment','Payment Verification Pending','Payment Approved','Order Confirmed','Processing','Packed','Shipped','Out For Delivery','Delivered','Cancelled')),
  tracking_number TEXT,
  courier_name TEXT,
  order_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: order_items
-- ============================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_sku TEXT,
  product_image TEXT,
  selected_size TEXT,
  selected_color TEXT,
  selected_color_code TEXT,
  quantity INT NOT NULL DEFAULT 1,
  mrp_price NUMERIC(12,2) NOT NULL,
  offer_price NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: order_status_timeline
-- ============================================================
CREATE TABLE IF NOT EXISTS public.order_status_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  updated_by TEXT DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: customer_notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS public.customer_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  order_display_id TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT DEFAULT 'order'
    CHECK (notification_type IN ('order','payment','shipping','delivery','general')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: return_requests
-- ============================================================
CREATE TABLE IF NOT EXISTS public.return_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  return_id TEXT UNIQUE NOT NULL,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_display_id TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_mobile TEXT,
  product_name TEXT NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'Pending'
    CHECK (status IN ('Pending','Approved','Rejected','Refunded')),
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: admin_users
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('superadmin','admin','viewer')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('payment-screenshots','payment-screenshots',FALSE,5242880,ARRAY['image/jpeg','image/jpg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('product-images','product-images',TRUE,10485760,ARRAY['image/jpeg','image/jpg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('banner-images','banner-images',TRUE,10485760,ARRAY['image/jpeg','image/jpg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.color_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND is_active = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- PROFILES
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- ADDRESSES
CREATE POLICY "addresses_all_own" ON public.addresses FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- PRODUCTS
CREATE POLICY "products_select_active" ON public.products FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "products_write_admin" ON public.products FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "products_update_admin" ON public.products FOR UPDATE USING (public.is_admin());
CREATE POLICY "products_delete_admin" ON public.products FOR DELETE USING (public.is_admin());

-- COLOR VARIANTS
CREATE POLICY "color_variants_select" ON public.color_variants FOR SELECT USING (TRUE);
CREATE POLICY "color_variants_write_admin" ON public.color_variants FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "color_variants_update_admin" ON public.color_variants FOR UPDATE USING (public.is_admin());
CREATE POLICY "color_variants_delete_admin" ON public.color_variants FOR DELETE USING (public.is_admin());

-- HOMEPAGE BANNERS
CREATE POLICY "banners_select_active" ON public.homepage_banners FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "banners_write_admin" ON public.homepage_banners FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "banners_update_admin" ON public.homepage_banners FOR UPDATE USING (public.is_admin());
CREATE POLICY "banners_delete_admin" ON public.homepage_banners FOR DELETE USING (public.is_admin());

-- CATEGORY BANNERS
CREATE POLICY "cat_banners_select" ON public.category_banners FOR SELECT USING (TRUE);
CREATE POLICY "cat_banners_write_admin" ON public.category_banners FOR ALL USING (public.is_admin());

-- OFFER CONFIG
CREATE POLICY "offer_select" ON public.offer_config FOR SELECT USING (TRUE);
CREATE POLICY "offer_write_admin" ON public.offer_config FOR ALL USING (public.is_admin());

-- ORDERS
CREATE POLICY "orders_select" ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "orders_insert_own" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_update_own_or_admin" ON public.orders FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

-- ORDER ITEMS
CREATE POLICY "order_items_select" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.is_admin()))
);
CREATE POLICY "order_items_insert" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
  OR public.is_admin()
);

-- ORDER STATUS TIMELINE
CREATE POLICY "timeline_select" ON public.order_status_timeline FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.is_admin()))
);
CREATE POLICY "timeline_insert_admin" ON public.order_status_timeline FOR INSERT WITH CHECK (public.is_admin());

-- CUSTOMER NOTIFICATIONS
CREATE POLICY "notif_select_own" ON public.customer_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notif_update_own" ON public.customer_notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notif_insert_admin" ON public.customer_notifications FOR INSERT WITH CHECK (public.is_admin());

-- RETURN REQUESTS
CREATE POLICY "returns_select" ON public.return_requests FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "returns_insert_own" ON public.return_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "returns_update_admin" ON public.return_requests FOR UPDATE USING (public.is_admin());

-- ADMIN USERS
CREATE POLICY "admin_users_select" ON public.admin_users FOR SELECT USING (public.is_admin());

-- ============================================================
-- STORAGE POLICIES
-- ============================================================
CREATE POLICY "payment_screenshots_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'payment-screenshots' AND auth.role() = 'authenticated');

CREATE POLICY "payment_screenshots_select_own" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'payment-screenshots' AND (
      (storage.foldername(name))[1] = auth.uid()::TEXT OR public.is_admin()
    )
  );

CREATE POLICY "product_images_select" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "product_images_upload_admin" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "banner_images_select" ON storage.objects FOR SELECT USING (bucket_id = 'banner-images');
CREATE POLICY "banner_images_upload_admin" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'banner-images' AND public.is_admin());

-- ============================================================
-- TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, mobile, full_name, auth_type, is_verified)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE WHEN NEW.phone IS NOT NULL THEN 'otp-mobile'
         WHEN NEW.email IS NOT NULL THEN 'otp-email'
         ELSE 'google' END,
    TRUE
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, profiles.email),
    mobile = COALESCE(EXCLUDED.mobile, profiles.mobile),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.order_status IS DISTINCT FROM NEW.order_status THEN
    INSERT INTO public.order_status_timeline (order_id, status, updated_by)
    VALUES (NEW.id, NEW.order_status, 'admin');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER order_status_change_log
  AFTER UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.log_order_status_change();

-- ============================================================
-- REALTIME
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_status_timeline;
ALTER PUBLICATION supabase_realtime ADD TABLE public.customer_notifications;

-- ============================================================
-- SEED DATA
-- ============================================================
INSERT INTO public.homepage_banners (image_url, title, subtitle, cta_text, cta_link, display_order, is_active) VALUES
('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1920&auto=format&fit=crop','ROYALTY REIMAGINED','The 2026 Pure Handloom Silk & Gilded Couture Collection','EXPLORE LUXURY','/shop',1,TRUE),
('https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1920&auto=format&fit=crop','ETERNAL ELEGANCE','Exquisite Designer Sarees & Enchanting Kids Gowns','DISCOVER NEW ARRIVALS','/shop',2,TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO public.category_banners (category, image_url, title, description) VALUES
('Women','https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop','THE WOMEN''S MAJESTIC ARCHIVE','Impeccable craftsmanship meets contemporary couture.'),
('Kids','https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1600&auto=format&fit=crop','THE ROYAL KIDS BOUTIQUE','Exquisite comfort tailored for little royalties.'),
('Collections','https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1600&auto=format&fit=crop','GILDED COUTURE 2026','Curated pure silk weaves and crystal-encrusted silhouettes.'),
('Wholesale','https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1600&auto=format&fit=crop','GLOBAL WHOLESALE PARTNERSHIPS','Direct factory pricing for elite retail showrooms.'),
('Offers','https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1600&auto=format&fit=crop','FESTIVE PRIVILEGE OFFERS','Up to 35% savings on handpicked masterpieces.')
ON CONFLICT (category) DO NOTHING;

-- ============================================================
-- AFTER RUNNING THIS SCHEMA:
-- 1. Go to Supabase Dashboard > Authentication > Providers
-- 2. Enable Phone provider and configure Twilio/MessageBird
-- 3. Enable Email provider (already on by default)
-- 4. Create your admin account, then run:
--    INSERT INTO public.admin_users (user_id, email, role)
--    VALUES ('<your-auth-uuid>', '<your-email>', 'superadmin');
-- ============================================================
