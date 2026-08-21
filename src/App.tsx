import { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import { Product, CategoryType, SubcategoryType } from './types';

// Supabase auth & data
import { supabase } from './lib/supabase';
import { checkIsAdmin, getUserProfile } from './lib/auth';
import { fetchProducts, fetchAllColorVariants } from './lib/products';
import { fetchHomepageBanners, fetchCategoryBanners, fetchOfferConfig } from './lib/banners';
import { fetchUserOrders, fetchUserNotifications, subscribeToUserNotifications, fetchAllOrdersAdmin, fetchUserReturns, fetchAllReturnsAdmin } from './lib/orders';

// Modals & Common
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/common/AuthModal';
import { SearchModal } from './components/common/SearchModal';
import { NotificationModal } from './components/common/NotificationModal';
import { SchemaMarkup } from './components/common/SchemaMarkup';
import { SplashScreen } from './components/common/SplashScreen';
import { ParticleOverlay } from './components/common/ParticleOverlay';

// Homepage Core
import { OffersSection } from './components/home/OffersSection';
import { HeroBanner } from './components/home/HeroBanner';
import { HomeShowcaseSections } from './components/home/HomeShowcaseSections';

// Commerce Segments
import { ShopPage } from './components/shop/ShopPage';
import { ProductDetailPage } from './components/product/ProductDetailPage';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutPage } from './components/cart/CheckoutPage';

// User & Admin Dashboards
import { DashboardPage } from './components/user/DashboardPage';
import { AdminPanel } from './components/admin/AdminPanel';

// Content Portals
import { WholesalePortal } from './components/pages/WholesalePortal';
import { ReturnPolicyPage } from './components/pages/ReturnPolicyPage';
import { ShippingPolicyPage } from './components/pages/ShippingPolicyPage';
import { PrivacyPolicyPage } from './components/pages/PrivacyPolicyPage';
import { TermsConditionsPage } from './components/pages/TermsConditionsPage';

export function App() {
  const {
    addToCart,
    setSession,
    setUser,
    logoutUser,
    setProducts,
    setColorVariants,
    setHomepageBanners,
    setCategoryBanners,
    setOfferConfig,
    setOrders,
    setCustomerNotifications,
    addCustomerNotification,
    setReturns,
    user,
  } = useStore();

  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | undefined>(undefined);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubcategoryType | undefined>(undefined);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);

  // ── Browser URL Routing ──────────────────────────────────────────
  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setCurrentPage('admin');
    }
  }, []);

  // ── Supabase Auth Listener & Bootstrap ──────────────────────────
  useEffect(() => {
    // Load public product catalog & banners immediately (no auth required)
    loadPublicData();

    // Listen to auth state changes
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session);

          if (session?.user) {
            // Load user profile
            const profile = await getUserProfile(session.user.id);
            
            setUser({
              id: session.user.id,
              name: profile?.full_name || session.user.email?.split('@')[0] || 'Customer',
              email: profile?.email || session.user.email || '',
              mobile: profile?.mobile || session.user.phone || '',
              isVerified: profile?.is_verified ?? true,
              authType: profile?.auth_type || 'otp-mobile',
              savedAddresses: [],
            });

            // Check admin status (for data loading)
            const isAdmin = await checkIsAdmin();
            
            // Load user-specific data
            await loadUserData(session.user.id, isAdmin);
          } else if (event === 'SIGNED_OUT') {
            logoutUser();
          }
        }
      );

      return () => subscription?.unsubscribe();
    } catch (err) {
      console.warn('Supabase auth listener initialization skipped/errored:', err);
    }
  }, []);

  // ── Load notification realtime subscription when user logs in ───
  useEffect(() => {
    if (!user?.id) return;

    let channel: any = null;
    try {
      channel = subscribeToUserNotifications(user.id, (payload) => {
        if (payload.new) {
          addCustomerNotification(payload.new as any);
        }
      });
    } catch (err) {
      console.warn('Realtime notifications subscription skipped/errored:', err);
    }

    return () => {
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (_) {}
      }
    };
  }, [user?.id]);

  async function loadPublicData() {
    try {
      const [products, colorVariants, banners, catBanners, offerCfg] = await Promise.all([
        fetchProducts(),
        fetchAllColorVariants(),
        fetchHomepageBanners(),
        fetchCategoryBanners(),
        fetchOfferConfig(),
      ]);

      // Map DB snake_case to our Product type
      const mappedProducts = products.map((p: any) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        category: p.category,
        subcategory: p.subcategory,
        description: p.description,
        mrp_price: p.mrp_price,
        offer_price: p.offer_price,
        discount_percentage: p.discount_percentage,
        sizes: p.sizes ?? [],
        stock: p.stock,
        shipping_fee: p.shipping_fee ?? 0,
        size_stocks: p.size_stocks ?? {},
        images: p.images ?? [],
        colorVariants: colorVariants
          .filter((cv: any) => cv.product_id === p.id)
          .map((cv: any) => ({
            id: cv.id,
            product_id: cv.product_id,
            name: cv.name,
            code: cv.code,
            images: cv.images ?? [],
            display_order: cv.display_order,
          })),
        featured: p.featured,
        best_seller: p.best_seller,
        new_arrival: p.new_arrival,
        is_offer_product: p.is_offer_product,
        rating: p.rating,
        review_count: p.review_count,
        is_active: p.is_active,
      }));

      if (mappedProducts && mappedProducts.length > 0) {
        setProducts(mappedProducts);
      }
      if (colorVariants && colorVariants.length > 0) {
        setColorVariants(colorVariants);
      }

      // Sync local cart items with fresh mapped products to update prices/shipping fees
      const currentCart = useStore.getState().cart;
      if (currentCart && currentCart.length > 0) {
        const updatedCart = currentCart.map(item => {
          const freshProd = mappedProducts.find(p => p.id === item.product.id);
          if (freshProd) {
            return { ...item, product: freshProd };
          }
          return item;
        });
        useStore.setState({ cart: updatedCart });
      }

      if (banners && banners.length > 0) {
        setHomepageBanners(banners.map((b: any) => ({
          id: b.id,
          image_url: b.image_url,
          title: b.title,
          subtitle: b.subtitle,
          cta_text: b.cta_text,
          cta_link: b.cta_link,
          display_order: b.display_order,
          is_active: b.is_active,
        })));
      }

      if (catBanners && catBanners.length > 0) {
        setCategoryBanners(catBanners.map((b: any) => ({
          id: b.id,
          category: b.category,
          image_url: b.image_url,
          title: b.title,
          description: b.description,
        })));
      }

      if (offerCfg) {
        setOfferConfig({
          id: offerCfg.id,
          isActive: offerCfg.is_active,
          bannerImages: offerCfg.banner_image ? offerCfg.banner_image.split('\n').map((s: string) => s.trim()).filter((s: string) => s) : [],
          title: offerCfg.title,
          subtitle: offerCfg.subtitle,
          expiryDate: offerCfg.expiry_date,
          productIds: offerCfg.product_ids ?? [],
        });
      }
    } catch (err) {
      console.error('Failed to load public data:', err);
      // Falls back to INITIAL_PRODUCTS from store
    } finally {
      // Enforce a minimum 2 second splash screen duration for the 3D effect
      setTimeout(() => setIsAppLoading(false), 2000);
    }
  }

  async function loadUserData(userId: string, isAdmin = false) {
    try {
      const [orders, notifications, dbReturns] = await Promise.all([
        isAdmin ? fetchAllOrdersAdmin() : fetchUserOrders(userId),
        fetchUserNotifications(userId),
        isAdmin ? fetchAllReturnsAdmin() : fetchUserReturns(userId),
      ]);

      // Map orders from DB format
      const mappedOrders = orders.map((o: any) => ({
        id: o.id,
        order_id: o.order_id,
        user_id: o.user_id,
        date: new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        created_at: o.created_at,
        customer: {
          fullName: o.customer_full_name,
          mobile: o.customer_mobile,
          email: o.customer_email,
          addressLine: o.customer_address_line,
          city: o.customer_city,
          state: o.customer_state,
          pincode: o.customer_pincode,
        },
        items: (o.order_items ?? []).map((item: any) => ({
          product: {
            id: item.product_id,
            name: item.product_name,
            sku: item.product_sku,
            images: item.product_image ? [item.product_image] : [],
            mrp_price: item.mrp_price,
            offer_price: item.offer_price,
            colorVariants: [],
          } as any,
          selectedSize: item.selected_size,
          selectedColor: item.selected_color,
          selectedColorCode: item.selected_color_code || '#000',
          quantity: item.quantity,
        })),
        totalAmount: o.total_amount,
        subtotal: o.subtotal,
        discount: o.discount,
        shippingFee: o.shipping_fee,
        paymentMethod: o.payment_method,
        paymentStatus: o.payment_status,
        paymentScreenshotUrl: o.payment_screenshot_url,
        orderStatus: o.order_status,
        trackingNumber: o.tracking_number,
        courierName: o.courier_name,
        orderNotes: o.order_notes,
      }));

      // Map returns from DB format to store format
      const mappedReturns = dbReturns.map((r: any) => ({
        id: r.id,
        returnId: r.return_id,
        order_id: r.order_display_id || r.order_id,
        productName: r.product_name,
        customerName: r.customer_name,
        customerEmail: r.customer_email,
        customerMobile: r.customer_mobile,
        reason: r.reason,
        description: r.description,
        imageUrl: r.image_url,
        requestDate: new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: r.status,
        adminNote: r.admin_note,
      }));

      setOrders(mappedOrders);
      setCustomerNotifications(notifications);
      setReturns(mappedReturns);
    } catch (err) {
      console.error('Failed to load user data:', err);
    }
  }

  // ── Navigation ──────────────────────────────────────────────────
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedCategory, selectedSubcategory, activeProduct]);

  const handleNavigate = (page: string, category?: any, subcategory?: any) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setCurrentPage(page);
    setActiveProduct(null);
  };

  const handleSelectProduct = (prod: any) => {
    setActiveProduct(prod);
    setCurrentPage('product-detail');
  };

  const handleQuickAddToCart = (prod: any, size: string, color: string, colorCode: string, quantity = 1) => {
    addToCart(prod, size, color, colorCode, quantity);
    setCartDrawerOpen(true);
  };

  const handleBuyNow = (prod: any, size: string, color: string, colorCode: string, quantity = 1) => {
    addToCart(prod, size, color, colorCode, quantity);
    setCurrentPage('checkout');
  };

  return (
    <>
      <SplashScreen isLoading={isAppLoading} />
      <ParticleOverlay />
      <div className="bg-[#FCFCFC] text-[#111111] min-h-screen flex flex-col justify-between antialiased selection:bg-[#D4AF37] selection:text-white font-sans overflow-x-hidden relative">

      <SchemaMarkup />
      <NotificationModal />

      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      <main className="flex-1">

        {currentPage === 'home' && !activeProduct && (
          <div className="w-full">
            <OffersSection
              onSelectProduct={handleSelectProduct}
              onNavigateShop={(cat) => handleNavigate('shop', cat)}
            />
            <HeroBanner
              onNavigateShop={(cat) => handleNavigate('shop', cat)}
            />
            <HomeShowcaseSections
              onSelectProduct={handleSelectProduct}
              onNavigateShop={(cat, sub) => handleNavigate('shop', cat, sub)}
              onAddToCart={handleQuickAddToCart}
            />
          </div>
        )}

        {currentPage === 'shop' && !activeProduct && (
          <ShopPage
            initialCategory={selectedCategory}
            initialSubcategory={selectedSubcategory}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleQuickAddToCart}
          />
        )}

        {currentPage === 'product-detail' && activeProduct && (
          <ProductDetailPage
            product={activeProduct}
            onBack={() => {
              if (selectedCategory) {
                setCurrentPage('shop');
              } else {
                setCurrentPage('home');
              }
              setActiveProduct(null);
            }}
            onAddToCart={handleQuickAddToCart}
            onBuyNow={handleBuyNow}
            onSelectSimilar={handleSelectProduct}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            onNavigateHome={() => handleNavigate('home')}
            onNavigateDashboard={() => handleNavigate('dashboard')}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage
            onSelectProduct={handleSelectProduct}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPanel />
        )}

        {currentPage === 'wholesale-portal' && (
          <WholesalePortal
            onNavigateHome={() => handleNavigate('home')}
            onNavigateShop={(cat) => handleNavigate('shop', cat)}
          />
        )}

        {currentPage === 'return-policy' && (
          <ReturnPolicyPage
            onBack={() => handleNavigate('home')}
            onNavigateDashboard={() => handleNavigate('dashboard')}
          />
        )}

        {currentPage === 'shipping-policy' && (
          <ShippingPolicyPage onBack={() => handleNavigate('home')} />
        )}

        {currentPage === 'privacy-policy' && (
          <PrivacyPolicyPage onBack={() => handleNavigate('home')} />
        )}

        {currentPage === 'terms-conditions' && (
          <TermsConditionsPage onBack={() => handleNavigate('home')} />
        )}

      </main>

      <Footer onNavigate={handleNavigate} />

      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        onNavigateCheckout={() => handleNavigate('checkout')}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectProduct={handleSelectProduct}
      />

    </div>
    </>
  );
}

export default App;
