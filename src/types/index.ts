export type CategoryType = 'Women' | 'Kids' | 'Collections' | 'Wholesale' | 'Offers';

export type WomenSubcategory = 'Sarees' | 'Kurtis' | 'Salwar Sets' | 'Dresses' | 'Tops';
export type KidsSubcategory = 'Shirts' | 'T-Shirts' | 'Sets' | 'Girls Dresses' | 'Party Wear';
export type SubcategoryType = WomenSubcategory | KidsSubcategory | string;

// ============================================================
// COLOR VARIANT — per-colour images
// ============================================================
export interface ColorVariant {
  id: string;
  product_id: string;
  name: string;       // e.g. "Royal Crimson"
  code: string;       // e.g. "#8B0000"
  images: string[];   // images specific to this colour
  display_order: number;
}

// ============================================================
// PRODUCT
// ============================================================
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: CategoryType;
  subcategory: SubcategoryType;
  description: string;
  mrp_price: number;
  offer_price: number;
  discount_percentage: number;
  sizes: string[];
  stock: number;
  images: string[];          // Primary/fallback images
  colorVariants: ColorVariant[]; // Populated client-side after fetch
  featured: boolean;
  best_seller: boolean;
  new_arrival: boolean;
  is_offer_product: boolean;
  rating?: number;
  review_count?: number;
  is_active?: boolean;
  shipping_fee?: number;
  size_stocks?: Record<string, number>;
}

// ============================================================
// CART
// ============================================================
export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  selectedColorCode: string;  // hex for display
  quantity: number;
}

// ============================================================
// ADDRESS
// ============================================================
export interface Address {
  id?: string;
  fullName: string;
  mobile: string;
  email: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

// ============================================================
// ORDER STATUS (10-step lifecycle)
// ============================================================
export type OrderStatusType =
  | 'Pending Payment'
  | 'Payment Verification Pending'
  | 'Payment Approved'
  | 'Order Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out For Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentStatusType =
  | 'Pending'
  | 'Pending Verification'
  | 'Payment Approved'
  | 'Payment Rejected'
  | 'Paid'
  | 'Pending COD'
  | 'Refunded';

export type PaymentMethodType = 'UPI' | 'Razorpay' | 'COD';

// ============================================================
// ORDER TIMELINE ENTRY
// ============================================================
export interface OrderTimelineEntry {
  id: string;
  order_id: string;
  status: OrderStatusType;
  note?: string;
  updated_by: string;
  created_at: string;
}

// ============================================================
// ORDER
// ============================================================
export interface Order {
  id: string;                // UUID from Supabase
  order_id: string;          // e.g. JRC-2026-8819 (display)
  user_id?: string;
  date: string;              // formatted for display
  created_at?: string;

  // Customer snapshot
  customer: Address;

  // Items
  items: CartItem[];

  // Financials
  totalAmount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;

  // Payment
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatusType;
  paymentScreenshotUrl?: string;

  // Status
  orderStatus: OrderStatusType;
  trackingNumber?: string;
  courierName?: string;
  orderNotes?: string;

  // Timeline (loaded separately)
  timeline?: OrderTimelineEntry[];
}

// ============================================================
// USER
// ============================================================
export interface User {
  id: string;             // Supabase auth UUID
  name: string;
  email: string;
  mobile: string;
  isVerified: boolean;
  authType: 'otp-mobile' | 'otp-email' | 'google';
  savedAddresses: Address[];
}

// ============================================================
// BANNERS
// ============================================================
export interface HomepageBanner {
  id: string;
  image_url: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  display_order: number;
  is_active: boolean;
}

export interface CategoryBanner {
  id: string;
  category: string;
  image_url: string;
  title: string;
  description: string;
}

// ============================================================
// OFFER CONFIG
// ============================================================
export interface OfferSectionConfig {
  id?: string;
  isActive: boolean;
  bannerImages: string[];
  title: string;
  subtitle: string;
  expiryDate: string;
  productIds: string[];
}

// ============================================================
// RETURN REQUEST
// ============================================================
export interface ReturnRequest {
  id: string;
  returnId: string;
  order_id: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  reason: string;
  description: string;
  imageUrl?: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Refunded';
  adminNote?: string;
}

// ============================================================
// CUSTOMER NOTIFICATION
// ============================================================
export interface CustomerNotification {
  id: string;
  user_id: string;
  order_id?: string;
  order_display_id?: string;
  title: string;
  message: string;
  notification_type: 'order' | 'payment' | 'shipping' | 'delivery' | 'general';
  is_read: boolean;
  created_at: string;
}

// ============================================================
// REVIEW
// ============================================================
export interface Review {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  productName: string;
  userImage?: string;
}
