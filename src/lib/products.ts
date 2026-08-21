import { supabase } from './supabase';

// ============================================================
// PRODUCTS
// ============================================================

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchAllProductsAdmin() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchColorVariants(productId: string) {
  const { data, error } = await supabase
    .from('color_variants')
    .select('*')
    .eq('product_id', productId)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function fetchAllColorVariants() {
  const { data, error } = await supabase
    .from('color_variants')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createProduct(product: {
  id: string;
  name: string;
  sku: string;
  category: string;
  subcategory: string;
  description: string;
  mrp_price: number;
  offer_price: number;
  discount_percentage: number;
  sizes: string[];
  stock: number;
  images: string[];
  featured: boolean;
  best_seller: boolean;
  new_arrival: boolean;
  is_offer_product: boolean;
}) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, updates: Partial<{
  name: string;
  sku: string;
  category: string;
  subcategory: string;
  description: string;
  mrp_price: number;
  offer_price: number;
  discount_percentage: number;
  sizes: string[];
  stock: number;
  images: string[];
  featured: boolean;
  best_seller: boolean;
  new_arrival: boolean;
  is_offer_product: boolean;
  is_active: boolean;
}>) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string) {
  // Delete color variants first to prevent foreign key errors
  await supabase
    .from('color_variants')
    .delete()
    .eq('product_id', id);

  // Hard delete product
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================================
// COLOR VARIANTS CRUD
// ============================================================

export async function createColorVariant(variant: {
  product_id: string;
  name: string;
  code: string;
  images: string[];
  display_order: number;
}) {
  const { data, error } = await supabase
    .from('color_variants')
    .insert([variant])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateColorVariant(id: string, updates: {
  name?: string;
  code?: string;
  images?: string[];
  display_order?: number;
}) {
  const { data, error } = await supabase
    .from('color_variants')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteColorVariant(id: string) {
  const { error } = await supabase
    .from('color_variants')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
