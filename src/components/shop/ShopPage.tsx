import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SlidersHorizontal, 
  Heart, 
  ShoppingBag, 
  Star, 
  Sparkles, 
  RefreshCw,
  X,
  Crown
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Product, CategoryType, SubcategoryType } from '../../types';

interface ShopPageProps {
  initialCategory?: CategoryType;
  initialSubcategory?: SubcategoryType;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string, colorCode: string, quantity?: number) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory,
  initialSubcategory,
  onSelectProduct,
  onAddToCart
}) => {
  const { products, categoryBanners, wishlist, toggleWishlist, filters, setFilters, resetFilters } = useStore();
  
  const [selectedCat, setSelectedCat] = useState<CategoryType | ''>(initialCategory || '');
  const [selectedSub, setSelectedSub] = useState<SubcategoryType | ''>(initialSubcategory || '');
  
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'discount'>('featured');
  const [bannerLoading, setBannerLoading] = useState(false);

  // Sync props when user clicked nav in header
  useEffect(() => {
    if (initialCategory !== undefined) {
      setSelectedCat(initialCategory);
    }
    if (initialSubcategory !== undefined) {
      setSelectedSub(initialSubcategory);
    }
  }, [initialCategory, initialSubcategory]);

  // When category changes, show the smooth transition loading animation
  useEffect(() => {
    setBannerLoading(true);
    const timer = setTimeout(() => {
      setBannerLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [selectedCat, selectedSub]);

  // Determine active dynamic banner
  const activeBanner = categoryBanners.find(b => {
    if (selectedSub) return b.category.toLowerCase() === selectedSub.toLowerCase();
    if (selectedCat) return b.category.toLowerCase() === selectedCat.toLowerCase();
    return b.category === 'Women'; // default
  }) || {
    category: selectedCat || 'Royal Archive',
    image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
    title: selectedSub ? `${selectedSub.toUpperCase()} MASTERPIECES` : (selectedCat ? `${selectedCat.toUpperCase()} COUTURE` : 'THE ROYAL ARCHIVE'),
    description: 'Impeccable authentic craftsmanship curated for the most discerning connoisseurs of unparalleled luxury.'
  };

  // Extract all available dynamic filter values
  const availableSizes = ['Free Size', 'S', 'M', 'L', 'XL', 'XXL', 'Custom Made'];
  const availableColors = ['Luxury Gold', 'Onyx Black', 'Pearl White', 'Ruby Red', 'Emerald Green', 'Royal Blue', 'Champagne'];

  // Filter products logic
  const filteredProducts = products.filter(product => {
    // Category filtering
    if (selectedCat && selectedCat !== 'Collections' && selectedCat !== 'Offers' && selectedCat !== 'Wholesale') {
      if (product.category.toLowerCase() !== selectedCat.toLowerCase()) return false;
    }
    if (selectedCat === 'Offers' && !product.is_offer_product && product.discount_percentage === 0) return false;
    if (selectedCat === 'Wholesale' && product.category !== 'Wholesale') return false;
    
    // Subcategory filtering
    if (selectedSub && product.subcategory.toLowerCase() !== selectedSub.toLowerCase()) return false;

    // Sidebar Filters
    if (product.offer_price > filters.maxPrice) return false;
    if (filters.onlyOffers && product.discount_percentage === 0) return false;
    if (filters.onlyBestSellers && !product.best_seller) return false;
    if (filters.onlyNewArrivals && !product.new_arrival) return false;
    if (filters.sizes.length > 0 && !product.sizes.some(sz => filters.sizes.includes(sz))) return false;
    if (filters.colors.length > 0 && !product.colorVariants?.some(variant => filters.colors.some(fc => variant.name.toLowerCase().includes(fc.toLowerCase())))) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.offer_price - b.offer_price;
    if (sortBy === 'price-high') return b.offer_price - a.offer_price;
    if (sortBy === 'discount') return b.discount_percentage - a.discount_percentage;
    return 0;
  });

  const toggleSizeFilter = (sz: string) => {
    const existing = filters.sizes;
    if (existing.includes(sz)) {
      setFilters({ sizes: existing.filter(s => s !== sz) });
    } else {
      setFilters({ sizes: [...existing, sz] });
    }
  };

  const toggleColorFilter = (col: string) => {
    const existing = filters.colors;
    if (existing.includes(col)) {
      setFilters({ colors: existing.filter(c => c !== col) });
    } else {
      setFilters({ colors: [...existing, col] });
    }
  };

  const clearAllShopFilters = () => {
    setSelectedCat('');
    setSelectedSub('');
    resetFilters();
  };

  return (
    <div className="bg-[#FCFCFC] text-[#111111] min-h-screen font-sans pb-24">
      
      {/* Category Dynamic Banner with automatic loading animation & smooth transition */}
      <div className="relative w-full h-[40vh] min-h-[340px] bg-[#111111] overflow-hidden">
        <AnimatePresence mode="wait">
          {bannerLoading ? (
            <motion.div 
              key="loading-banner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-[#111] z-20 text-[#D4AF37] space-y-3"
            >
              <RefreshCw className="w-8 h-8 animate-spin text-[#D4AF37]" />
              <span className="text-xs font-cinzel font-bold tracking-widest uppercase">CURATING ROYAL ARCHIVE...</span>
            </motion.div>
          ) : (
            <motion.div
              key={activeBanner.title}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <img 
                src={(activeBanner as any).image_url} 
                alt={activeBanner.title}
                className="w-full h-full object-cover object-center" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Banner Text Overlay */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl text-left"
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] font-black tracking-widest uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{selectedCat || 'THE MASTERPIECE'} CATALOG</span>
            </div>
            
            <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-white tracking-wider mb-3">
              {activeBanner.title}
            </h1>
            
            <p className="font-playfair text-sm sm:text-base text-gray-200 font-light leading-relaxed max-w-xl">
              {activeBanner.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Repertoire Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          
          {/* Breadcrumbs */}
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <span onClick={() => clearAllShopFilters()} className="hover:text-black cursor-pointer">ALL</span>
            {selectedCat && (
              <>
                <span>/</span>
                <span onClick={() => setSelectedSub('')} className="text-[#D4AF37] cursor-pointer">{selectedCat}</span>
              </>
            )}
            {selectedSub && (
              <>
                <span>/</span>
                <span className="text-[#111]">{selectedSub}</span>
              </>
            )}
            <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full font-mono text-[10px]">
              {filteredProducts.length} Creations
            </span>
          </div>

          {/* Sort & Trigger buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-[#111] px-4 py-2 rounded-xl text-xs font-bold"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>FILTERS</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 hidden sm:inline uppercase tracking-wider">Sort Architecture:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-50 border border-gray-200 text-gray-900 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="featured">✨ Featured Couture</option>
                <option value="price-low">💎 Price: Low to High</option>
                <option value="price-high">👑 Price: High to Low</option>
                <option value="discount">🔥 Privilege Discount</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-8 sticky top-[130px]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-cinzel font-bold text-sm text-[#111] tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                <span>ARCHIVE FILTERS</span>
              </h3>
              <button 
                onClick={clearAllShopFilters}
                className="text-[11px] text-[#D4AF37] hover:underline font-extrabold uppercase tracking-widest"
              >
                RESET ALL
              </button>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-xs font-black text-gray-800 mb-3 tracking-widest uppercase">
                MAX PRICE: ₹{filters.maxPrice.toLocaleString('en-IN')}
              </label>
              <input
                type="range"
                min="5000"
                max="150000"
                step="5000"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ maxPrice: Number(e.target.value) })}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1 font-bold">
                <span>₹5,000</span>
                <span>₹1,50,000+</span>
              </div>
            </div>

            {/* Scope / Highlights Switchers */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="text-xs font-black text-gray-800 tracking-widest uppercase">
                CURATED EDITIONS
              </div>
              
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.onlyOffers}
                  onChange={(e) => setFilters({ onlyOffers: e.target.checked })}
                  className="w-4 h-4 text-[#D4AF37] rounded border-gray-300 focus:ring-[#D4AF37]"
                />
                <span className="text-xs text-gray-700 group-hover:text-[#D4AF37] font-bold tracking-wider">
                  🔥 Privilege Offers Only
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.onlyBestSellers}
                  onChange={(e) => setFilters({ onlyBestSellers: e.target.checked })}
                  className="w-4 h-4 text-[#D4AF37] rounded border-gray-300 focus:ring-[#D4AF37]"
                />
                <span className="text-xs text-gray-700 group-hover:text-[#D4AF37] font-bold tracking-wider">
                  👑 Best Sellers Only
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.onlyNewArrivals}
                  onChange={(e) => setFilters({ onlyNewArrivals: e.target.checked })}
                  className="w-4 h-4 text-[#D4AF37] rounded border-gray-300 focus:ring-[#D4AF37]"
                />
                <span className="text-xs text-gray-700 group-hover:text-[#D4AF37] font-bold tracking-wider">
                  ✨ New Arrivals Only
                </span>
              </label>
            </div>

            {/* Size Filter */}
            <div className="pt-4 border-t border-gray-100">
              <div className="text-xs font-black text-gray-800 tracking-widest uppercase mb-3">
                SILHOUETTE SIZES
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map(sz => (
                  <button
                    key={sz}
                    onClick={() => toggleSizeFilter(sz)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                      filters.sizes.includes(sz)
                        ? 'bg-[#111111] text-[#D4AF37] border-[#111111] shadow'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-black'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div className="pt-4 border-t border-gray-100">
              <div className="text-xs font-black text-gray-800 tracking-widest uppercase mb-3">
                EXQUISITE PALETTES
              </div>
              <div className="flex flex-wrap gap-2">
                {availableColors.map(col => (
                  <button
                    key={col}
                    onClick={() => toggleColorFilter(col)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                      filters.colors.includes(col)
                        ? 'bg-[#111111] text-[#D4AF37] border-[#111111] shadow'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-black'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Wholesale Banner Note */}
            <div className="bg-gradient-to-br from-[#161616] to-[#1f1f1f] text-white p-5 rounded-2xl border border-[#D4AF37]/30 text-center space-y-2">
              <Crown className="w-6 h-6 text-[#D4AF37] mx-auto" />
              <h5 className="font-cinzel font-bold text-xs text-[#D4AF37]">WHOLESALE PARTNER?</h5>
              <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                Unlock automated Google Sheets B2B webhook invoices directly.
              </p>
              <button
                onClick={() => setSelectedCat('Wholesale')}
                className="w-full bg-[#D4AF37] text-[#111] hover:bg-white transition py-2 rounded-xl text-xs font-extrabold tracking-widest uppercase cursor-pointer"
              >
                ACCESS B2B
              </button>
            </div>

          </div>

          {/* Right Product Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-3xl border border-gray-200 p-16 text-center space-y-4 shadow-sm"
              >
                <div className="w-16 h-16 rounded-full bg-amber-50 text-[#D4AF37] flex items-center justify-center mx-auto mb-2">
                  <SlidersHorizontal className="w-8 h-8" />
                </div>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#111]">
                  NO MASTERPIECES MATCH YOUR CRITERIA
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Your specific filter combination returned no available silhouettes. Try adjusting your price threshold or unselecting specific color tags.
                </p>
                <button
                  onClick={clearAllShopFilters}
                  className="bg-[#111111] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition px-8 py-3.5 rounded-full font-bold text-xs tracking-widest uppercase shadow cursor-pointer"
                >
                  RESET ALL ARCHIVE FILTERS
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProducts.map((product) => {
                  const isWishlisted = wishlist.includes(product.id);

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ 
                        scale: 1.02, 
                        z: 20, 
                        rotateX: 2, 
                        rotateY: -2,
                        boxShadow: "0 25px 50px -12px rgba(212, 175, 55, 0.25)"
                      }}
                      transition={{ duration: 0.4 }}
                      key={product.id}
                      onClick={() => onSelectProduct(product)}
                      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#D4AF37]/60 transition-colors duration-500 shadow-sm flex flex-col cursor-pointer [perspective:1000px] transform-gpu"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <div className="aspect-[3/4] w-full bg-[#f8f8f8] overflow-hidden relative" style={{ transform: "translateZ(10px)" }}>
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" 
                        />
                        {product.images[1] && (
                          <img 
                            src={product.images[1]} 
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-700" 
                          />
                        )}

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                          {product.discount_percentage > 0 && (
                            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                              -{product.discount_percentage}%
                            </span>
                          )}
                          {product.new_arrival && (
                            <span className="bg-[#111111] text-[#D4AF37] text-[10px] font-extrabold px-2 py-0.5 rounded shadow border border-[#D4AF37]/30">
                              NEW
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 hover:text-red-600 shadow-md flex items-center justify-center transition duration-300 focus:outline-none"
                        >
                          <Heart className={`w-4 h-4 transition ${isWishlisted ? 'fill-red-600 text-red-600 scale-110' : ''}`} />
                        </button>

                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex items-center justify-around translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToCart(product, product.sizes[0] || 'Free Size', product.colorVariants?.[0]?.name || 'Luxury Gold', product.colorVariants?.[0]?.code || '#D4AF37', 1);
                            }}
                            className="bg-[#D4AF37] text-[#111] hover:bg-white transition px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-lg cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>QUICK ADD</span>
                          </button>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-black tracking-widest text-[#D4AF37] mb-1">
                            <span className="uppercase">{product.category} • {product.subcategory}</span>
                            <span className="flex items-center gap-0.5 text-amber-500">
                              <Star className="w-3 h-3 fill-current" />
                              <span>{product.rating || '4.9'}</span>
                            </span>
                          </div>
                          
                          <h4 className="font-bold text-xs text-gray-900 group-hover:text-[#D4AF37] transition line-clamp-2">
                            {product.name}
                          </h4>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-baseline justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-base font-extrabold text-[#111]">
                              ₹{product.offer_price.toLocaleString('en-IN')}
                            </span>
                            {product.mrp_price > product.offer_price && (
                              <span className="text-xs text-gray-400 line-through">
                                ₹{product.mrp_price.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                          
                          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                            IN STOCK
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Sidebar Slideover */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex bg-black/70 backdrop-blur-sm lg:hidden font-sans">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-xs bg-white text-[#111] h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                  <h3 className="font-cinzel font-bold text-base text-[#111] tracking-wider flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-[#D4AF37]" />
                    <span>ARCHIVE FILTERS</span>
                  </h3>
                  <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-gray-500 hover:text-black">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-gray-800 mb-2 tracking-widest uppercase">
                      MAX PRICE: ₹{filters.maxPrice.toLocaleString('en-IN')}
                    </label>
                    <input
                      type="range"
                      min="5000"
                      max="150000"
                      step="5000"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ maxPrice: Number(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none accent-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="text-xs font-black text-gray-800 tracking-widest uppercase">EDITIONS</div>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={filters.onlyOffers}
                        onChange={(e) => setFilters({ onlyOffers: e.target.checked })}
                        className="w-4 h-4 text-[#D4AF37]"
                      />
                      <span className="text-xs font-bold">🔥 Privilege Offers Only</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={filters.onlyBestSellers}
                        onChange={(e) => setFilters({ onlyBestSellers: e.target.checked })}
                        className="w-4 h-4 text-[#D4AF37]"
                      />
                      <span className="text-xs font-bold">👑 Best Sellers Only</span>
                    </label>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="text-xs font-black text-gray-800 tracking-widest uppercase mb-2">SIZES</div>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map(sz => (
                        <button
                          key={sz}
                          onClick={() => toggleSizeFilter(sz)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                            filters.sizes.includes(sz) ? 'bg-[#111] text-[#D4AF37] border-[#111]' : 'bg-gray-50 text-gray-700 border-gray-200'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 space-y-3">
                <button
                  onClick={() => {
                    clearAllShopFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-bold text-xs uppercase"
                >
                  RESET ALL
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full bg-[#111111] text-[#D4AF37] py-3 rounded-xl font-bold text-xs uppercase shadow cursor-pointer"
                >
                  APPLY & SHOW ({filteredProducts.length})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
