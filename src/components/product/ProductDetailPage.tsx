import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Share2, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Sparkles, 
  CheckCircle,
  X,
  ChevronLeft,
  Minus,
  Plus
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Product } from '../../types';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, size: string, color: string, colorCode: string, quantity: number) => void;
  onBuyNow: (product: Product, size: string, color: string, colorCode: string, quantity: number) => void;
  onSelectSimilar: (prod: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack,
  onAddToCart,
  onBuyNow,
  onSelectSimilar
}) => {
  const { wishlist, toggleWishlist, products } = useStore();
  
  // Mandatory Fixes State
  // Mandatory Fixes State
  const [mainImage, setMainImage] = useState<string>(product.images[0] || '');
  const getFirstAvailableSize = () => {
    return (product.sizes || []).find(sz => 
      product.size_stocks?.[sz] !== undefined ? product.size_stocks[sz] > 0 : product.stock > 0
    ) || (product.sizes || [])[0] || 'Free Size';
  };
  const [selectedSize, setSelectedSize] = useState<string>(getFirstAvailableSize());
  const [selectedColor, setSelectedColor] = useState<string>(product.colorVariants?.[0]?.name || 'Luxury Gold');
  const [selectedColorCode, setSelectedColorCode] = useState<string>(product.colorVariants?.[0]?.code || '#D4AF37');
  const [quantity, setQuantity] = useState<number>(1);

  // Zoom & Lightbox State
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [fullscreenOpen, setFullscreenOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'spec' | 'shipping'>('desc');

  // When props change, re-initialize selected states properly
  useEffect(() => {
    setMainImage(product.images[0] || '');
    const firstSz = (product.sizes || []).find(sz => 
      product.size_stocks?.[sz] !== undefined ? product.size_stocks[sz] > 0 : product.stock > 0
    ) || (product.sizes || [])[0] || 'Free Size';
    setSelectedSize(firstSz);
    setSelectedColor(product.colorVariants?.[0]?.name || 'Luxury Gold');
    setSelectedColorCode(product.colorVariants?.[0]?.code || '#D4AF37');
    setQuantity(1);
    setZoomScale(1);
  }, [product]);

  const isVideo = (url: string) => url.endsWith('.mp4') || url.endsWith('.webm');
  const selectedSizeStock = product.size_stocks?.[selectedSize] !== undefined
    ? product.size_stocks[selectedSize]
    : ((product.sizes || []).includes(selectedSize) ? product.stock : 0);
  const isOutOfStock = selectedSizeStock <= 0;

  // Adjust quantity if it exceeds selected size's stock
  useEffect(() => {
    if (selectedSizeStock > 0 && quantity > selectedSizeStock) {
      setQuantity(selectedSizeStock);
    } else if (selectedSizeStock <= 0) {
      setQuantity(1);
    }
  }, [selectedSize, selectedSizeStock]);

  const isWishlisted = wishlist.includes(product.id);

  // Thumbnail Click switching
  const handleThumbnailClick = (img: string) => {
    setMainImage(img);
    setZoomScale(1); // reset zoom for new image
  };

  const handleZoomIn = () => setZoomScale(prev => Math.min(prev + 0.4, 2.6));
  const handleZoomOut = () => setZoomScale(prev => Math.max(prev - 0.4, 1));

  // Find similar items in catalog
  const similarProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.subcategory === product.subcategory))
    .slice(0, 4);

  const activeColorVariant = product.colorVariants?.find(cv => cv.name === selectedColor);

  return (
    <div className="bg-[#FCFCFC] text-[#111111] min-h-screen font-sans pb-32">
      
      {/* Top Concise Navigation Bar */}
      <div className="bg-white border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between sticky top-[72px] z-30 shadow-2xs">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-black transition group cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
          <span>BACK TO {product.category.toUpperCase()} REPERTOIRE</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: product.name, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Concierge link copied to your clipboard.');
              }
            }}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition cursor-pointer"
            title="Share with your inner circle"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Production Gallery & Specification Core */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* PRODUCT GALLERY (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              
              {/* IMPORTANT FIX: THUMBNAIL IMAGES (Left Column) */}
              <div className="order-2 md:order-1 md:col-span-2 flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[600px] pb-2 md:pb-0 sm:pr-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleThumbnailClick(img)}
                    className={`relative rounded-xl overflow-hidden aspect-[3/4] w-20 md:w-full bg-gray-100 shrink-0 transition-all border-2 cursor-pointer ${
                      mainImage === img 
                        ? 'border-[#111111] shadow-md ring-2 ring-[#D4AF37]/50 scale-105' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    {isVideo(img) ? (
                       <video src={img} className="w-full h-full object-cover" muted playsInline />
                    ) : (
                       <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>

              {/* LARGE MAIN IMAGE Container */}
              <div className="order-1 md:order-2 md:col-span-10 relative rounded-3xl overflow-hidden bg-[#f4f4f4] aspect-[3/4] sm:aspect-[4/5] shadow-lg border border-gray-200 flex items-center justify-center group">
                <motion.div
                  key={mainImage}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: zoomScale }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full cursor-crosshair flex items-center justify-center overflow-hidden"
                >
                  {isVideo(mainImage) ? (
                    <video
                      src={mainImage}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover object-center transition-transform duration-300"
                    />
                  ) : (
                    <img
                      src={mainImage}
                      alt={product.name}
                      className="w-full h-full object-cover object-top transition-transform duration-300"
                    />
                  )}
                </motion.div>

                {/* Floating Discount Badge */}
                {product.discount_percentage > 0 && (
                  <span className="absolute top-4 left-4 bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-lg">
                    -{product.discount_percentage}% PRIVILEGE
                  </span>
                )}

                {/* Image Controls HUD (Zoom In, Zoom Out, Fullscreen View) */}
                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-gray-200 flex items-center gap-2 text-gray-800 z-10">
                  <button
                    onClick={handleZoomIn}
                    className="p-2 hover:bg-[#D4AF37] hover:text-[#111] transition rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-mono font-bold w-8 text-center">{Math.round(zoomScale * 100)}%</span>
                  <button
                    onClick={handleZoomOut}
                    className="p-2 hover:bg-[#D4AF37] hover:text-[#111] transition rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <div className="w-px h-5 bg-gray-300 mx-1" />
                  <button
                    onClick={() => setFullscreenOpen(true)}
                    className="p-2 hover:bg-[#111] hover:text-[#D4AF37] transition rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer bg-white"
                    title="Open Fullscreen Lightbox"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Concierge Guarantee Triad */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="bg-[#111] text-[#D4AF37] p-4 rounded-2xl text-center space-y-1 shadow-sm border border-[#222]">
                <ShieldCheck className="w-5 h-5 mx-auto" />
                <span className="font-cinzel font-bold text-xs text-white block">100% PURE ZARI</span>
                <span className="text-[10px] text-gray-400">Certified Real Gold Weave</span>
              </div>

              <div className="bg-[#111] text-[#D4AF37] p-4 rounded-2xl text-center space-y-1 shadow-sm border border-[#222]">
                <Truck className="w-5 h-5 mx-auto" />
                <span className="font-cinzel font-bold text-xs text-white block">ROYAL COURIER</span>
                <span className="text-[10px] text-gray-400">Fully Insured Express</span>
              </div>

              <div className="bg-[#111] text-[#D4AF37] p-4 rounded-2xl text-center space-y-1 shadow-sm border border-[#222]">
                <RotateCcw className="w-5 h-5 mx-auto" />
                <span className="font-cinzel font-bold text-xs text-white block">EASY RETURN MODULE</span>
                <span className="text-[10px] text-gray-400">Concierge Door Pickup</span>
              </div>
            </div>

          </div>

          {/* PRODUCT DETAILS & BUYING HUD (Right 5 Cols) */}
          <div className="lg:col-span-5 space-y-8 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
            
            {/* Title and rating */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black tracking-widest uppercase text-[#D4AF37] block font-cinzel">
                  {product.category} • {product.subcategory}
                </span>
                <span className="text-xs font-mono font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                  SKU: {product.sku}
                </span>
              </div>

              <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#111] mt-2 leading-snug">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1 text-[#D4AF37]">
                  {[...Array(Math.floor(product.rating || 5))].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-700">
                  {product.rating || '4.9'} ({product.review_count || 42} Connoisseur Reviews)
                </span>
              </div>
            </div>

            {/* Price section */}
            <div className="p-4 bg-gradient-to-r from-amber-50/50 to-white rounded-2xl border border-amber-200/60 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 block tracking-wider">Showroom Privilege Value</span>
                <div className="flex items-baseline gap-3 mt-0.5">
                  <span className="text-3xl font-black text-[#111]">
                    ₹{product.offer_price.toLocaleString('en-IN')}
                  </span>
                  {product.mrp_price > product.offer_price && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.mrp_price.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Ready to Secure</span>
                </span>
                <span className="text-[10px] text-gray-400 block mt-1">Taxes & Bespoke Finishing Incl.</span>
              </div>
            </div>

            {/* IMPORTANT FIX: SIZE SELECTION MUST WORK */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <label className="text-xs font-black tracking-widest text-[#111] uppercase font-cinzel">
                  SELECT SILHOUETTE SIZE
                </label>
                <span className="text-[11px] font-bold text-[#D4AF37] cursor-pointer hover:underline">
                  Concierge Master Size Guide
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {(product.sizes || []).map((size) => {
                  const sizeStock = product.size_stocks?.[size] !== undefined
                    ? product.size_stocks[size]
                    : ((product.sizes || []).includes(size) ? product.stock : 0);
                  const isSizeOutOfStock = sizeStock <= 0;

                  return (
                    <button
                      key={size}
                      disabled={isSizeOutOfStock}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-3 rounded-2xl text-xs font-bold tracking-wider transition duration-300 border-2 ${
                        isSizeOutOfStock 
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                          : selectedSize === size
                            ? 'bg-[#111111] text-[#D4AF37] border-[#111111] shadow-lg scale-105 cursor-pointer'
                            : 'bg-gray-50 text-gray-800 border-gray-200 hover:border-black cursor-pointer'
                      }`}
                    >
                      {size} {isSizeOutOfStock && '(Out of Stock)'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* IMPORTANT FIX: COLOR SELECTION MUST WORK */}
            <div>
              <label className="block text-xs font-black tracking-widest text-[#111] uppercase font-cinzel mb-2.5">
                SELECT EXQUISITE PALETTE: <span className="text-[#D4AF37] font-sans font-bold">{selectedColor}</span>
              </label>

              <div className="flex flex-wrap gap-3">
                {product.colorVariants?.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedColor(variant.name);
                      setSelectedColorCode(variant.code);
                      if (variant.images.length > 0) {
                        handleThumbnailClick(variant.images[0]);
                      }
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition duration-300 border-2 flex items-center gap-2 cursor-pointer ${
                      selectedColor === variant.name
                        ? 'bg-[#111111] text-[#D4AF37] border-[#111111] shadow-md'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-black'
                    }`}
                  >
                    <span 
                      className="w-3 h-3 rounded-full border border-gray-400 shadow-2xs inline-block"
                      style={{
                        backgroundColor: variant.code
                      }}
                    />
                    <span>{variant.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY SELECTOR */}
            <div>
              <label className="block text-xs font-black tracking-widest text-[#111] uppercase font-cinzel mb-2">
                QUANTITY
              </label>

              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-2xl bg-gray-50 p-1">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="w-10 h-10 rounded-xl bg-white hover:bg-[#D4AF37] hover:text-[#111] flex items-center justify-center font-bold text-base transition shadow-2xs cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-mono font-bold text-base">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => Math.min(selectedSizeStock || 1, prev + 1))}
                    className="w-10 h-10 rounded-xl bg-white hover:bg-[#D4AF37] hover:text-[#111] flex items-center justify-center font-bold text-base transition shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  {selectedSizeStock} pieces reserved in handloom vault ({selectedSize})
                </span>
              </div>
            </div>

            {/* MAIN ACTIONS (Wishlist, Add To Cart, Buy Now) */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              
              <div className="grid grid-cols-12 gap-3">
                <button
                  disabled={isOutOfStock}
                  onClick={() => onAddToCart(product, selectedSize, selectedColor, selectedColorCode, quantity)}
                  className={`col-span-10 transition duration-300 py-4 rounded-2xl font-cinzel font-bold text-xs tracking-widest uppercase shadow-lg flex items-center justify-center gap-2 group ${
                    isOutOfStock 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#111111] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white cursor-pointer'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CONCIERGE BAG'}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`col-span-2 rounded-2xl border-2 flex items-center justify-center transition duration-300 cursor-pointer ${
                    isWishlisted ? 'bg-red-50 border-red-600 text-red-600' : 'border-gray-200 bg-gray-50 text-gray-800 hover:border-red-600 hover:text-red-600'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-600' : ''}`} />
                </button>
              </div>

              <button
                disabled={isOutOfStock}
                onClick={() => onBuyNow(product, selectedSize, selectedColor, selectedColorCode, quantity)}
                className={`w-full transition duration-300 py-4 rounded-2xl font-cinzel font-black text-xs tracking-widest uppercase shadow-xl flex items-center justify-center gap-2 ${
                  isOutOfStock 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#D4AF37] via-[#FCF6BA] to-[#AA771C] text-[#111] hover:opacity-95 cursor-pointer'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#111]" />
                <span>{isOutOfStock ? 'CURRENTLY UNAVAILABLE' : 'SECURE INSTANT BUY NOW (UPI / COD)'}</span>
              </button>

            </div>

            {/* Tabbed Product Details */}
            <div className="pt-6 border-t border-gray-100">
              <div className="flex border-b border-gray-200 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('desc')}
                  className={`pb-3 px-4 transition ${activeTab === 'desc' ? 'border-b-2 border-[#D4AF37] text-[#111]' : 'text-gray-400 hover:text-black'}`}
                >
                  DESCRIPTION
                </button>
                <button
                  onClick={() => setActiveTab('spec')}
                  className={`pb-3 px-4 transition ${activeTab === 'spec' ? 'border-b-2 border-[#D4AF37] text-[#111]' : 'text-gray-400 hover:text-black'}`}
                >
                  SPECIFICATIONS
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-3 px-4 transition ${activeTab === 'shipping' ? 'border-b-2 border-[#D4AF37] text-[#111]' : 'text-gray-400 hover:text-black'}`}
                >
                  SHIPPING & RETURNS
                </button>
              </div>

              <div className="py-4 text-xs text-gray-600 leading-relaxed font-sans">
                {activeTab === 'desc' && (
                  <p className="font-light leading-loose">{product.description}</p>
                )}

                {activeTab === 'spec' && (
                  <div className="space-y-2 font-mono text-[11px]">
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="font-bold">Zari Grade:</span>
                      <span>100% Authentic Handloom Purity</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="font-bold">Weave Origin:</span>
                      <span>Kanchipuram & Padmavati Vaults</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="font-bold">Wash Care:</span>
                      <span>Concierge Dry Clean Only</span>
                    </div>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-2">
                    <p className="font-bold text-gray-800">✔ Premium Doorstep Delivery across India within 3-5 business days.</p>
                    <p>✔ Comprehensive 100% Automated Return Module accessible in Customer Dashboard. Pickup coordinated via insured couriers.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Similar Masterpieces segment */}
        {similarProducts.length > 0 && (
          <div className="mt-28 border-t border-gray-200 pt-16">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-black tracking-widest uppercase text-[#D4AF37] block font-cinzel">ROYAL RECOMMENDATIONS</span>
              <h3 className="font-cinzel text-3xl font-extrabold text-[#111] mt-1">SIMILAR MASTERPIECES</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {similarProducts.map((simProd) => (
                <div
                  key={simProd.id}
                  onClick={() => onSelectSimilar(simProd)}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#D4AF37] transition duration-300 shadow cursor-pointer p-3"
                >
                  <div className="aspect-[3/4] w-full bg-gray-100 rounded-xl overflow-hidden mb-3">
                    <img src={simProd.images[0]} alt={simProd.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                  <span className="text-[10px] font-bold text-[#D4AF37] block">{simProd.category} • {simProd.subcategory}</span>
                  <h5 className="font-bold text-xs text-gray-900 group-hover:text-[#D4AF37] transition line-clamp-1 mt-0.5">{simProd.name}</h5>
                  <div className="font-extrabold text-sm text-[#111] mt-1">₹{simProd.offer_price.toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {fullscreenOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl font-sans p-4">
            <button
              onClick={() => setFullscreenOpen(false)}
              className="absolute top-6 right-6 text-white hover:text-[#D4AF37] transition p-3 rounded-full bg-white/10"
              aria-label="Close lightbox"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="w-full max-w-5xl h-[85vh] flex items-center justify-center relative">
              <img
                src={mainImage}
                alt={product.name}
                className="max-w-full max-h-full object-contain shadow-2xl rounded-2xl border border-white/20"
              />

              {/* Thumbnails on Lightbox bottom */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={`w-14 h-18 rounded-lg overflow-hidden border-2 transition ${mainImage === img ? 'border-[#D4AF37] scale-110' : 'border-white/30 opacity-60'}`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
