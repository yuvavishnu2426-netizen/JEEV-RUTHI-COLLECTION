import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Heart, 
  ShoppingBag, 
  Star, 
  MapPin, 
  Clock, 
  Sparkles, 
  Crown, 
  CheckCircle,
  Eye,
  ExternalLink,
  Award
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Product } from '../../types';
import { CUSTOMER_REVIEWS } from '../../data/initialData';

interface HomeShowcaseSectionsProps {
  onSelectProduct: (product: Product) => void;
  onNavigateShop: (category: string, subcategory?: string) => void;
  onAddToCart: (product: Product, size: string, color: string, colorCode: string, quantity?: number) => void;
}

export const HomeShowcaseSections: React.FC<HomeShowcaseSectionsProps> = ({
  onSelectProduct,
  onNavigateShop,
  onAddToCart
}) => {
  const { products, wishlist, toggleWishlist } = useStore();
  const [quickAddModal, setQuickAddModal] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Section 3: NEW ARRIVALS
  const newArrivalProducts = products.filter(p => p.new_arrival);

  // Section 5: BEST SELLERS
  const bestSellerProducts = products.filter(p => p.best_seller);

  // Section 8: PREMIUM COLLECTIONS
  const premiumProducts = products.filter(p => p.mrp_price >= 20000 || p.category === 'Wholesale');

  const openQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSize(product.sizes[0] || 'Free Size');
    setSelectedColor(product.colorVariants?.[0]?.name || 'Luxury Gold');
    setQuickAddModal(product);
  };

  const executeQuickAdd = () => {
    if (!quickAddModal) return;
    const colorCode = quickAddModal.colorVariants?.find(c => c.name === selectedColor)?.code || '#D4AF37';
    onAddToCart(quickAddModal, selectedSize, selectedColor, colorCode, 1);
    setQuickAddModal(null);
  };

  // Generic Reusable Ultra-Premium Product Card
  const renderProductCard = (product: Product) => {
    const isWishlisted = wishlist.includes(product.id);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ 
          scale: 1.02, 
          z: 20, 
          rotateX: 2, 
          rotateY: -2,
          boxShadow: "0 25px 50px -12px rgba(212, 175, 55, 0.25)"
        }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        key={product.id}
        onClick={() => onSelectProduct(product)}
        className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#D4AF37]/60 transition-colors duration-500 shadow-sm flex flex-col cursor-pointer [perspective:1000px] transform-gpu"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Product Gallery Thumbnail Container */}
        <div className="aspect-[3/4] w-full bg-[#f8f8f8] overflow-hidden relative" style={{ transform: "translateZ(10px)" }}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
          />

          {/* Secondary Image Switch on Hover */}
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            />
          )}

          {/* Top Status Badges */}
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

          {/* Top Right Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 hover:text-red-600 shadow-md flex items-center justify-center transition duration-300 focus:outline-none"
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 transition ${isWishlisted ? 'fill-red-600 text-red-600 scale-110' : ''}`} />
          </button>

          {/* Bottom Hover Action Bar */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex items-center justify-around translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={(e) => openQuickAdd(product, e)}
              className="bg-[#D4AF37] text-[#111] hover:bg-white transition px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-lg"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>QUICK ADD</span>
            </button>
            <button
              onClick={() => onSelectProduct(product)}
              className="bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>DETAILS</span>
            </button>
          </div>
        </div>

        {/* Product Details info */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[10px] font-extrabold tracking-widest text-[#D4AF37] mb-1">
              <span className="uppercase">{product.category} • {product.subcategory}</span>
              <span className="flex items-center gap-0.5 text-amber-500">
                <Star className="w-3 h-3 fill-current" />
                <span>{product.rating || '4.9'}</span>
              </span>
            </div>
            
            <h4 className="font-bold text-xs text-gray-900 group-hover:text-[#D4AF37] transition line-clamp-2 leading-relaxed font-sans">
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
  };

  return (
    <>
      {/* Section 3: NEW ARRIVALS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 border-b border-gray-200 pb-4">
          <div>
            <div className="text-xs font-black tracking-widest text-[#D4AF37] uppercase mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>THE LATEST MASTERPIECES</span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[#111111]">
              NEW ARRIVALS
            </h2>
          </div>
          <button
            onClick={() => onNavigateShop('Women')}
            className="mt-4 md:mt-0 text-xs font-bold tracking-widest text-[#111] hover:text-[#D4AF37] transition flex items-center gap-1 group"
          >
            <span>DISCOVER ALL NEW ARRIVALS</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {newArrivalProducts.slice(0, 4).map(renderProductCard)}
        </div>
      </section>

      {/* Section 4: FEATURED COLLECTIONS (Editorial Luxury Banner Grids) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#111111] text-white font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold tracking-widest text-[#D4AF37] mb-2">
              <Crown className="w-4 h-4" />
              <span>EDITORIAL ARCHIVE</span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-5xl font-extrabold tracking-wider text-white">
              FEATURED COLLECTIONS
            </h2>
            <p className="text-gray-400 text-sm mt-3 font-light">
              Curated royal silhouettes created specifically for wedding banquets, festive rituals, and elite ceremonial milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured Box 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              onClick={() => onNavigateShop('Women', 'Sarees')}
              className="relative rounded-3xl overflow-hidden group aspect-[3/4] cursor-pointer shadow-2xl border border-[#222] hover:border-[#D4AF37]/50 transition duration-500"
            >
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop"
                alt="Pure Tissue Silks"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-8">
                <span className="text-[10px] font-black tracking-widest text-[#D4AF37] mb-1">HANDLOOM EXCELLENCE</span>
                <h3 className="font-cinzel text-2xl font-extrabold text-white mb-2">
                  THE PURE TISSUE SILK SOIRÉE
                </h3>
                <p className="text-xs text-gray-300 mb-6 line-clamp-2 leading-relaxed font-light">
                  Authentic 24K pure gold zari brocade sarees crafted by generational Kanchipuram master weavers.
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#D4AF37] group-hover:text-white transition tracking-widest">
                  <span>EXPLORE SAREES</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </motion.div>

            {/* Featured Box 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={() => onNavigateShop('Kids')}
              className="relative rounded-3xl overflow-hidden group aspect-[3/4] cursor-pointer shadow-2xl border border-[#222] hover:border-[#D4AF37]/50 transition duration-500"
            >
              <img
                src="https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop"
                alt="Royal Kids Couture"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-8">
                <span className="text-[10px] font-black tracking-widest text-[#D4AF37] mb-1">MINIATURE ROYALTY</span>
                <h3 className="font-cinzel text-2xl font-extrabold text-white mb-2">
                  THE GILDED KIDS BOUTIQUE
                </h3>
                <p className="text-xs text-gray-300 mb-6 line-clamp-2 leading-relaxed font-light">
                  Enchanting multi-layered tulle ball gowns and rich banarasi brocade sherwanis for little princes and princesses.
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#D4AF37] group-hover:text-white transition tracking-widest">
                  <span>EXPLORE KIDS FASHION</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </motion.div>

            {/* Featured Box 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              onClick={() => onNavigateShop('Women', 'Kurtis')}
              className="relative rounded-3xl overflow-hidden group aspect-[3/4] cursor-pointer shadow-2xl border border-[#222] hover:border-[#D4AF37]/50 transition duration-500"
            >
              <img
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop"
                alt="Opulent Anarkalis"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-8">
                <span className="text-[10px] font-black tracking-widest text-[#D4AF37] mb-1">IMPERIAL EMBROIDERY</span>
                <h3 className="font-cinzel text-2xl font-extrabold text-white mb-2">
                  GOTA PATTI ANARKALI SETS
                </h3>
                <p className="text-xs text-gray-300 mb-6 line-clamp-2 leading-relaxed font-light">
                  Regal Chanderi silk silhouettes adorned with opulent Jaipur gota patti handwork and delicate pearl details.
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#D4AF37] group-hover:text-white transition tracking-widest">
                  <span>EXPLORE KURTIS</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Section 5: BEST SELLERS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FCFCFC] font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6 border-b border-gray-200 pb-4">
            <div>
              <div className="text-xs font-black tracking-widest text-[#D4AF37] uppercase mb-1 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#D4AF37]" />
                <span>THE CONNOISSEUR FAVORITES</span>
              </div>
              <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[#111111]">
                BEST SELLERS
              </h2>
            </div>
            <button
              onClick={() => onNavigateShop('Women')}
              className="mt-4 md:mt-0 text-xs font-bold tracking-widest text-[#111] hover:text-[#D4AF37] transition flex items-center gap-1 group"
            >
              <span>VIEW ALL BEST SELLERS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellerProducts.slice(0, 4).map(renderProductCard)}
          </div>
        </motion.div>
      </section>

      {/* Section 6: WOMEN COLLECTIONS (Categories Showcase) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8F8F8] font-sans border-t border-b border-gray-200">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[#111]">
              WOMEN FASHION SEGMENTS
            </h2>
            <p className="text-gray-600 text-xs mt-2 font-medium tracking-wider">
              Explore our comprehensive repertoire of breathtaking silhouettes
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
            {[
              { name: 'Sarees', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop' },
              { name: 'Kurtis', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop' },
              { name: 'Salwar Sets', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop' },
              { name: 'Dresses', img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&auto=format&fit=crop' },
              { name: 'Tops', img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600&auto=format&fit=crop' },
            ].map((cat, idx) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                key={cat.name}
                onClick={() => onNavigateShop('Women', cat.name as any)}
                className="group relative rounded-2xl overflow-hidden bg-white shadow aspect-[4/5] cursor-pointer border border-gray-200 hover:border-[#D4AF37] transition duration-500"
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex items-end p-4">
                  <div className="w-full text-center">
                    <span className="text-white font-cinzel font-bold text-sm tracking-wider group-hover:text-[#D4AF37] transition block">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-[#D4AF37] font-semibold tracking-widest opacity-0 group-hover:opacity-100 transition">
                      DISCOVER →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section 7: KIDS COLLECTIONS (Categories Showcase) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[#111]">
              KIDS ROYAL BOUTIQUE
            </h2>
            <p className="text-gray-600 text-xs mt-2 font-medium tracking-wider">
              Enchanting ceremonial selections crafted with organic gentle fabrics
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
            {[
              { name: 'Shirts', img: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=600&auto=format&fit=crop' },
              { name: 'Girls Dresses', img: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=600&auto=format&fit=crop' },
              { name: 'Sets', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=600&auto=format&fit=crop' },
              { name: 'Party Wear', img: 'https://images.unsplash.com/photo-1595454223600-91fb4148c369?q=80&w=600&auto=format&fit=crop' },
              { name: 'T-Shirts', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=600&auto=format&fit=crop' },
            ].map((cat, idx) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                key={cat.name}
                onClick={() => onNavigateShop('Kids', cat.name as any)}
                className="group relative rounded-2xl overflow-hidden bg-gray-100 shadow aspect-[4/5] cursor-pointer border border-gray-200 hover:border-[#D4AF37] transition duration-500"
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex items-end p-4">
                  <div className="w-full text-center">
                    <span className="text-white font-cinzel font-bold text-sm tracking-wider group-hover:text-[#D4AF37] transition block">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-[#D4AF37] font-semibold tracking-widest opacity-0 group-hover:opacity-100 transition">
                      DISCOVER →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section 8: PREMIUM COLLECTIONS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#111111] font-sans relative overflow-hidden border-t-4 border-[#D4AF37]">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto relative z-10"
        >
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 border-b border-[#333] pb-4">
            <div>
              <div className="text-xs font-black tracking-widest text-[#D4AF37] uppercase mb-1 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-[#D4AF37]" />
                <span>THE CROWN JEWEL ARCHIVE</span>
              </div>
              <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-white">
                PREMIUM COLLECTIONS
              </h2>
            </div>
            <button
              onClick={() => onNavigateShop('Wholesale')}
              className="mt-4 md:mt-0 text-xs font-bold tracking-widest text-[#D4AF37] hover:text-white transition flex items-center gap-1 group"
            >
              <span>VIEW ALL BESPOKE LUXURY</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {premiumProducts.slice(0, 3).map((product) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group relative bg-[#1F1F1F] rounded-3xl overflow-hidden border-2 border-[#D4AF37]/40 hover:border-[#D4AF37] transition duration-500 shadow-2xl flex flex-col cursor-pointer"
              >
                <div className="aspect-[4/5] w-full bg-black overflow-hidden relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-[#111111] text-[#D4AF37] text-xs font-cinzel font-black px-3 py-1 rounded-full border border-[#D4AF37] shadow-xl">
                    SHOWROOM EXCLUSIVE
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] block">
                      {product.subcategory} • 100% Purity Certified
                    </span>
                    <h4 className="font-bold text-base text-white mt-1 group-hover:text-[#D4AF37] transition leading-snug">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-400 line-clamp-2 mt-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#333] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-light">Privilege Price</span>
                      <span className="text-2xl font-black text-[#D4AF37]">
                        ₹{product.offer_price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product, 'Custom Made', 'Imperial Gold', '#D4AF37', 1);
                      }}
                      className="bg-[#D4AF37] text-[#111] hover:bg-white transition px-6 py-2.5 rounded-full font-bold text-xs tracking-wider shadow-lg"
                    >
                      SECURE CTA
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section 9: CUSTOMER REVIEWS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-black tracking-widest text-[#D4AF37] mb-2">
            <Star className="w-4 h-4 fill-current" />
            <span>HEIRLOOM TESTIMONIALS</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-[#111]">
            CUSTOMER REVIEWS
          </h2>
          <p className="text-gray-600 text-sm mt-3 font-medium">
            Discover what our elite clientele across India and premium wholesale partners experience
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 flex flex-col justify-between relative group hover:border-[#D4AF37] transition duration-300"
            >
              <div className="absolute top-6 right-8 text-4xl font-serif text-[#D4AF37]/20 group-hover:text-[#D4AF37]/40 transition font-black">
                “
              </div>

              <div className="space-y-4 relative z-10">
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-[#D4AF37]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-gray-800 leading-relaxed font-sans italic">
                  "{rev.comment}"
                </p>

                <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100/80">
                  <span className="text-[11px] font-bold text-gray-900 block truncate">
                    Creation: {rev.productName}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shrink-0 border-2 border-[#D4AF37]/50">
                  {rev.userImage ? (
                    <img src={rev.userImage} alt={rev.customerName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#111] text-[#D4AF37] flex items-center justify-center font-bold text-sm font-cinzel">
                      {rev.customerName[0]}
                    </div>
                  )}
                </div>

                <div>
                  <h5 className="font-bold text-xs text-gray-900 flex items-center gap-1">
                    <span>{rev.customerName}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                  </h5>
                  <span className="text-[10px] text-gray-400 tracking-wider font-light">Verified Client • {rev.date}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Section 10: STORE LOCATION (Embed fully interactive real location) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#111111] text-white font-sans relative overflow-hidden border-t border-[#333]">
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Store Location Details info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-black tracking-widest uppercase">
              <MapPin className="w-4 h-4 animate-bounce" />
              <span>FLAGSHIP BOUTIQUE SANCTUARY</span>
            </div>

            <h2 className="font-cinzel text-3xl sm:text-5xl font-extrabold tracking-wider text-white">
              VISIT OUR LUXURY STORE
            </h2>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-light">
              Immerse yourself in the breathtaking reality of pure handloom silks and try on our exquisite children’s ceremonial couture with personalized styling assistance by our royal couturiers.
            </p>

            <div className="space-y-4 pt-2 border-t border-[#2a2a2a]">
              
              <div className="flex items-start gap-3 bg-[#191919] p-4 rounded-2xl border border-[#2a2a2a]">
                <Clock className="w-6 h-6 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-xs text-white uppercase tracking-wider font-cinzel">Store Timings</h5>
                  <p className="text-xs text-[#D4AF37] font-black tracking-widest mt-1">10:00 AM – 10:00 PM</p>
                  <p className="text-xs text-emerald-400 font-extrabold mt-0.5">✔ Open All Days (Monday to Sunday)</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#191919] p-4 rounded-2xl border border-[#2a2a2a]">
                <MapPin className="w-6 h-6 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-xs text-white uppercase tracking-wider font-cinzel">Store Address & Navigation</h5>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    JEEV RUTHI COLLECTION, Luxury Handloom Flagship Sanctuary, New Delhi
                  </p>
                  <a
                    href="https://maps.app.goo.gl/QwoTg7hgNXX9gPp96"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 bg-[#D4AF37] text-[#111] hover:bg-white transition px-6 py-2.5 rounded-full font-bold text-xs tracking-widest shadow-lg"
                  >
                    <span>GET INSTANT DIRECTIONS</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </div>

          </motion.div>

          {/* Embedded Google Maps Real Working Interactive Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/50 h-[450px] sm:h-[550px] relative bg-gray-900"
          >
            {/* Embedded map iframe */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.223019815049!2d77.165511!3d28.563062!2m3!1f0!2f0!3f0!3m2!1f1024!2f768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDMzJzQ3LjAiTiA3N8KwMDknNTUuOCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              title="JEEV RUTHI COLLECTION Store Location"
              className="w-full h-full object-cover filter contrast-105"
            />

            {/* Float badge */}
            <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37] px-4 py-2 rounded-2xl text-xs font-bold tracking-wider shadow-2xl flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE SHOWROOM SANCTUARY</span>
            </div>
          </motion.div>

        </div>

      </section>

      {/* Quick Add Modal */}
      <AnimatePresence>
        {quickAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 text-[#111] p-6 sm:p-8"
            >
              <button
                onClick={() => setQuickAddModal(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black transition p-2 rounded-full hover:bg-gray-100"
              >
                ✕
              </button>

              <div className="flex gap-4 items-center mb-6 border-b border-gray-100 pb-4">
                <img src={quickAddModal.images[0]} alt={quickAddModal.name} className="w-20 h-24 rounded-xl object-cover" />
                <div>
                  <span className="text-[10px] font-black uppercase text-[#D4AF37] tracking-widest">{quickAddModal.category}</span>
                  <h3 className="font-bold text-sm text-gray-900 mt-1">{quickAddModal.name}</h3>
                  <div className="text-base font-extrabold text-[#111] mt-1">₹{quickAddModal.offer_price.toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Select Size</label>
                  <div className="flex flex-wrap gap-2">
                    {quickAddModal.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                          selectedSize === size ? 'bg-[#111] text-[#D4AF37] border-[#111]' : 'bg-gray-50 text-gray-800 border-gray-200 hover:border-black'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black tracking-widest text-[#111] uppercase font-cinzel mb-2">Color Palette</label>
                  <div className="flex flex-wrap gap-2">
                    {quickAddModal.colorVariants?.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedColor(variant.name)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition border cursor-pointer ${
                          selectedColor === variant.name ? 'bg-[#111] text-[#D4AF37] border-[#111]' : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex gap-4">
                <button
                  onClick={executeQuickAdd}
                  className="w-full bg-[#D4AF37] text-[#111] hover:bg-[#111] hover:text-[#D4AF37] transition duration-300 py-3.5 rounded-2xl font-bold text-xs tracking-widest uppercase shadow-lg cursor-pointer"
                >
                  CONFIRM ADD TO BAG
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
