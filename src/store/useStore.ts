import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Session } from '@supabase/supabase-js';
import {
  Product,
  CartItem,
  Order,
  ReturnRequest,
  User,
  HomepageBanner,
  CategoryBanner,
  OfferSectionConfig,
  CategoryType,
  SubcategoryType,
  CustomerNotification,
  ColorVariant,
} from '../types';
import { INITIAL_PRODUCTS, DEFAULT_HOMEPAGE_BANNERS, DEFAULT_CATEGORY_BANNERS } from '../data/initialData';

interface ShopFilters {
  category: CategoryType | '';
  subcategory: SubcategoryType | '';
  searchQuery: string;
  maxPrice: number;
  sizes: string[];
  colors: string[];
  onlyOffers: boolean;
  onlyBestSellers: boolean;
  onlyNewArrivals: boolean;
}

interface LiveSimulationState {
  isOpen: boolean;
  type?: 'email' | 'sheets' | 'wholesale' | 'whatsapp';
  title?: string;
  data?: any;
}

interface StoreState {
  // ── Auth / Session ──────────────────────────────
  session: Session | null;
  user: User | null;
  isAdminAuth: boolean;

  // ── Product Catalog ─────────────────────────────
  products: Product[];
  colorVariants: ColorVariant[];

  // ── CMS Data ────────────────────────────────────
  homepageBanners: HomepageBanner[];
  categoryBanners: CategoryBanner[];
  offerConfig: OfferSectionConfig;

  // ── Cart & Wishlist ─────────────────────────────
  cart: CartItem[];
  wishlist: string[];

  // ── Orders & Returns ────────────────────────────
  orders: Order[];
  returns: ReturnRequest[];

  // ── Notifications ───────────────────────────────
  customerNotifications: CustomerNotification[];

  // ── UI ──────────────────────────────────────────
  liveSimulation: LiveSimulationState;
  filters: ShopFilters;

  // ── Actions: Auth ───────────────────────────────
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setIsAdminAuth: (v: boolean) => void;
  logoutUser: () => void;

  // ── Actions: Products ───────────────────────────
  setProducts: (products: Product[]) => void;
  setColorVariants: (variants: ColorVariant[]) => void;
  getColorVariantsForProduct: (productId: string) => ColorVariant[];

  // ── Actions: Banners & Config ───────────────────
  setHomepageBanners: (banners: HomepageBanner[]) => void;
  setCategoryBanners: (banners: CategoryBanner[]) => void;
  setOfferConfig: (config: OfferSectionConfig) => void;

  // ── Actions: Cart ───────────────────────────────
  addToCart: (product: Product, size: string, color: string, colorCode: string, quantity?: number) => void;
  removeFromCart: (index: number) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;

  // ── Actions: Wishlist ───────────────────────────
  toggleWishlist: (productId: string) => void;

  // ── Actions: Orders ─────────────────────────────
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrderInStore: (orderId: string, updates: Partial<Order>) => void;

  // ── Actions: Returns ────────────────────────────
  setReturns: (returns: ReturnRequest[]) => void;

  // ── Actions: Notifications ──────────────────────
  setCustomerNotifications: (notifs: CustomerNotification[]) => void;
  addCustomerNotification: (notif: CustomerNotification) => void;
  markNotificationRead: (notifId: string) => void;

  // ── Actions: Filters ────────────────────────────
  setFilters: (filters: Partial<ShopFilters>) => void;
  resetFilters: () => void;

  // ── Actions: UI ─────────────────────────────────
  openSimulation: (type: LiveSimulationState['type'], title: string, data: any) => void;
  closeSimulation: () => void;
}

const DEFAULT_FILTERS: ShopFilters = {
  category: '',
  subcategory: '',
  searchQuery: '',
  maxPrice: 150000,
  sizes: [],
  colors: [],
  onlyOffers: false,
  onlyBestSellers: false,
  onlyNewArrivals: false,
};

const DEFAULT_OFFER_CONFIG: OfferSectionConfig = {
  isActive: true,
  bannerImages: [
    'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583391733958-6115915d31d4?q=80&w=1600&auto=format&fit=crop'
  ],
  title: 'LIMITED EDITION GOLD PRIVILEGE SALE',
  subtitle: 'Experience Uncompromised Luxury - Up to 30% Off Authentic Kanchipuram Weaves & Designer Kurtis',
  expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  productIds: [],
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // ── Initial State ────────────────────────────────────────────
      session: null,
      user: null,
      isAdminAuth: false,

      // Products start from local initialData; replaced by Supabase on load
      products: INITIAL_PRODUCTS,
      colorVariants: [],

      homepageBanners: DEFAULT_HOMEPAGE_BANNERS,
      categoryBanners: DEFAULT_CATEGORY_BANNERS,
      offerConfig: DEFAULT_OFFER_CONFIG,

      cart: [],
      wishlist: [],
      orders: [],
      returns: [],
      customerNotifications: [],

      liveSimulation: { isOpen: false },
      filters: DEFAULT_FILTERS,

      // ── Auth Actions ─────────────────────────────────────────────
      setSession: (session) => set({ session }),

      setUser: (user) => set({ user }),

      setIsAdminAuth: (v) => set({ isAdminAuth: v }),

      logoutUser: () => set({
        session: null,
        user: null,
        isAdminAuth: false,
        cart: [],
        wishlist: [],
        orders: [],
        returns: [],
        customerNotifications: [],
      }),

      // ── Product Actions ──────────────────────────────────────────
      setProducts: (products) => set({ products }),

      setColorVariants: (variants) => set({ colorVariants: variants }),

      getColorVariantsForProduct: (productId) => {
        return get().colorVariants.filter(v => v.product_id === productId);
      },

      // ── CMS Actions ──────────────────────────────────────────────
      setHomepageBanners: (banners) => set({ homepageBanners: banners }),
      setCategoryBanners: (banners) => set({ categoryBanners: banners }),
      setOfferConfig: (config) => set({ offerConfig: config }),

      // ── Cart Actions ─────────────────────────────────────────────
      addToCart: (product, size, color, colorCode, quantity = 1) => set((state) => {
        const existingIndex = state.cart.findIndex(
          item =>
            item.product.id === product.id &&
            item.selectedSize === size &&
            item.selectedColor === color
        );

        if (existingIndex > -1) {
          const newCart = [...state.cart];
          newCart[existingIndex].quantity += quantity;
          return { cart: newCart };
        }

        return {
          cart: [...state.cart, {
            product,
            selectedSize: size,
            selectedColor: color,
            selectedColorCode: colorCode,
            quantity,
          }],
        };
      }),

      removeFromCart: (index) => set((state) => ({
        cart: state.cart.filter((_, i) => i !== index),
      })),

      updateCartQuantity: (index, quantity) => set((state) => {
        if (quantity <= 0) {
          return { cart: state.cart.filter((_, i) => i !== index) };
        }
        const newCart = [...state.cart];
        newCart[index].quantity = quantity;
        return { cart: newCart };
      }),

      clearCart: () => set({ cart: [] }),

      // ── Wishlist Actions ─────────────────────────────────────────
      toggleWishlist: (productId) => set((state) => {
        const exists = state.wishlist.includes(productId);
        return {
          wishlist: exists
            ? state.wishlist.filter(id => id !== productId)
            : [...state.wishlist, productId],
        };
      }),

      // ── Order Actions ────────────────────────────────────────────
      setOrders: (orders) => set({ orders }),

      addOrder: (order) => set((state) => ({
        orders: [order, ...state.orders],
      })),

      updateOrderInStore: (orderId, updates) => set((state) => ({
        orders: state.orders.map(o =>
          o.order_id === orderId ? { ...o, ...updates } : o
        ),
      })),

      // ── Return Actions ───────────────────────────────────────────
      setReturns: (returns) => set({ returns }),

      // ── Notification Actions ─────────────────────────────────────
      setCustomerNotifications: (notifs) => set({ customerNotifications: notifs }),

      addCustomerNotification: (notif) => set((state) => ({
        customerNotifications: [notif, ...state.customerNotifications],
      })),

      markNotificationRead: (notifId) => set((state) => ({
        customerNotifications: state.customerNotifications.map(n =>
          n.id === notifId ? { ...n, is_read: true } : n
        ),
      })),

      // ── Filter Actions ───────────────────────────────────────────
      setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters },
      })),

      resetFilters: () => set({ filters: DEFAULT_FILTERS }),

      // ── Simulation Actions ───────────────────────────────────────
      openSimulation: (type, title, data) => set({
        liveSimulation: { isOpen: true, type, title, data },
      }),

      closeSimulation: () => set({
        liveSimulation: { isOpen: false },
      }),
    }),
    {
      name: 'jrc-store-v3',
      partialize: (state) => ({
        // Only persist non-sensitive, UI-relevant state
        cart: state.cart,
        wishlist: state.wishlist,
        filters: state.filters,
        isAdminAuth: state.isAdminAuth,
        // Do NOT persist: session, user, orders, notifications
        // These are always fetched fresh from Supabase on mount
      }),
    }
  )
);
