import { supabase } from './supabase';

// ============================================================
// HOMEPAGE BANNERS
// ============================================================

export async function fetchHomepageBanners() {
  const { data, error } = await supabase
    .from('homepage_banners')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function fetchAllBannersAdmin() {
  const { data, error } = await supabase
    .from('homepage_banners')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createHomepageBanner(banner: {
  image_url: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  display_order: number;
  is_active: boolean;
}) {
  const { data, error } = await supabase
    .from('homepage_banners')
    .insert([banner])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateHomepageBanner(id: string, updates: Partial<{
  image_url: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  display_order: number;
  is_active: boolean;
}>) {
  const { data, error } = await supabase
    .from('homepage_banners')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteHomepageBanner(id: string) {
  const { error } = await supabase
    .from('homepage_banners')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================================
// CATEGORY BANNERS
// ============================================================

export async function fetchCategoryBanners() {
  const { data, error } = await supabase
    .from('category_banners')
    .select('*');

  if (error) throw error;
  return data ?? [];
}

export async function updateCategoryBanner(id: string, updates: {
  image_url?: string;
  title?: string;
  description?: string;
}) {
  const { data, error } = await supabase
    .from('category_banners')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================
// OFFER CONFIG
// ============================================================

export async function fetchOfferConfig() {
  const { data, error } = await supabase
    .from('offer_config')
    .select('*')
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data;
}

export async function upsertOfferConfig(config: {
  id?: string;
  is_active: boolean;
  banner_image: string;
  title: string;
  subtitle: string;
  expiry_date: string;
  product_ids: string[];
}) {
  if (config.id) {
    const { data, error } = await supabase
      .from('offer_config')
      .update({ ...config, updated_at: new Date().toISOString() })
      .eq('id', config.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    const { id, ...insertData } = config;
    const { data, error } = await supabase
      .from('offer_config')
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
