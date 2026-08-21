import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Sparkles, Timer, ArrowRight, Tag } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Product } from '../../types';

interface OffersSectionProps {
  onSelectProduct: (product: Product) => void;
  onNavigateShop: (category?: any) => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({ onSelectProduct, onNavigateShop }) => {
  const { offerConfig, products } = useStore();
  const calculateTimeLeft = () => {
    const difference = +new Date(offerConfig.expiryDate || '2025-12-31') - +new Date();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [currentSlide, setCurrentSlide] = useState(0);

  // Use images from config, fallback to default if empty array
  const slideImages = offerConfig.bannerImages?.length > 0 
    ? offerConfig.bannerImages 
    : [
        'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583391733958-6115915d31d4?q=80&w=1600&auto=format&fit=crop'
      ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, [offerConfig.expiryDate]);

  // Slider effect
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 4000);
    return () => clearInterval(slideInterval);
  }, [slideImages.length]);

  const offerProducts = products.filter(p => offerConfig.productIds.includes(p.id) || p.is_offer_product);

  // 3D Tilt Setup for Offers Banner
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);
  const scale = useTransform(mouseYSpring, [-0.5, 0.5], [1.02, 1.05]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (!offerConfig.isActive) return null;

  return (
    <section className="bg-gradient-to-b from-[#161616] via-[#111111] to-[#1a1a1a] text-white pt-10 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans border-b border-[#2A2A2A]">
      
      {/* Absolute decorative gold glow spheres */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[95rem] mx-auto relative z-10">
        
        {/* Upper Announcement Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-black tracking-widest uppercase shadow-lg shadow-black/50">
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
            <span>EXCLUSIVELY PRIVILEGED SOIRÉE</span>
          </div>

          {/* Admin Countdown Control Timer Box */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2 bg-[#222222]/80 border border-[#D4AF37]/30 px-5 py-3 rounded-2xl shadow-xl">
              <Timer className="w-5 h-5 text-[#D4AF37] animate-pulse" />
              <span className="text-xs font-semibold tracking-widest text-gray-300">OFFER EXPIRING IN:</span>
            </div>

            <div className="flex items-center gap-2 font-mono font-bold">
              <div className="bg-[#D4AF37] text-[#111] px-3.5 py-2 rounded-xl text-lg min-w-[50px] text-center shadow-md">
                {timeLeft.days}
                <span className="block text-[9px] font-sans font-extrabold uppercase tracking-widest text-[#222]">Days</span>
              </div>
              <span className="text-xl text-[#D4AF37]">:</span>
              <div className="bg-[#D4AF37] text-[#111] px-3.5 py-2 rounded-xl text-lg min-w-[50px] text-center shadow-md">
                {String(timeLeft.hours).padStart(2, '0')}
                <span className="block text-[9px] font-sans font-extrabold uppercase tracking-widest text-[#222]">Hours</span>
              </div>
              <span className="text-xl text-[#D4AF37]">:</span>
              <div className="bg-[#D4AF37] text-[#111] px-3.5 py-2 rounded-xl text-lg min-w-[50px] text-center shadow-md">
                {String(timeLeft.minutes).padStart(2, '0')}
                <span className="block text-[9px] font-sans font-extrabold uppercase tracking-widest text-[#222]">Mins</span>
              </div>
              <span className="text-xl text-[#D4AF37]">:</span>
              <div className="bg-[#D4AF37] text-[#111] px-3.5 py-2 rounded-xl text-lg min-w-[50px] text-center shadow-md">
                {String(timeLeft.seconds).padStart(2, '0')}
                <span className="block text-[9px] font-sans font-extrabold uppercase tracking-widest text-[#222]">Secs</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Offer Banner Custom Image Layout with Slider */}
        {offerConfig.bannerImages && offerConfig.bannerImages.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#D4AF37]/30 mb-16 cursor-pointer group bg-[#111] [perspective:1000px] transform-gpu"
            onClick={() => onNavigateShop('Offers')}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
          >
            <div className="grid w-full h-auto" style={{ transform: "translateZ(30px)" }}>
              <AnimatePresence>
                <motion.img 
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2 }}
                  src={slideImages[currentSlide]} 
                  alt={offerConfig.title} 
                  className="col-start-1 row-start-1 w-full h-auto object-contain block transition duration-1000 group-hover:scale-[1.02]"
                />
              </AnimatePresence>
            </div>

            {/* Slider Dots */}
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex gap-2 z-20 drop-shadow-lg">
              {slideImages.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 shadow-xl ${currentSlide === idx ? 'bg-[#D4AF37] w-6 sm:w-8' : 'bg-white/70 hover:bg-white'}`}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Admin Offer Products List */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-white flex items-center gap-2">
              <span>FEATURED SOIRÉE MASTERPIECES</span>
              <Tag className="w-5 h-5 text-[#D4AF37]" />
            </h3>
            <button
              onClick={() => onNavigateShop('Offers')}
              className="text-xs font-bold tracking-widest text-[#D4AF37] hover:text-white transition flex items-center gap-1 group"
            >
              <span>VIEW ALL OFFERS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {offerProducts.slice(0, 4).map((product, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group relative bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#2A2A2A] hover:border-[#D4AF37] transition duration-500 shadow-xl flex flex-col cursor-pointer"
              >
                {/* Product Image Tag */}
                <div className="aspect-[3/4] w-full bg-gray-800 overflow-hidden relative">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                  />
                  {/* Floating Discount Percentage Label */}
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-lg">
                    -{product.discount_percentage}% OFF
                  </div>
                  {/* Premium Hover Overlay Quick Add CTA */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center p-4">
                    <span className="bg-white/95 text-[#111] font-bold text-xs px-6 py-3 rounded-full shadow-2xl tracking-widest transform translate-y-4 group-hover:translate-y-0 transition duration-300">
                      SECURE MASTERPIECE
                    </span>
                  </div>
                </div>

                {/* Product Meta */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] block">
                      {product.category} • {product.subcategory}
                    </span>
                    <h4 className="font-bold text-sm text-white line-clamp-2 mt-1 group-hover:text-[#D4AF37] transition">
                      {product.name}
                    </h4>
                  </div>

                  <div className="pt-3 border-t border-[#2A2A2A] flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-gray-400 block tracking-wider uppercase">Privilege Price</span>
                      <span className="text-lg font-black text-[#D4AF37]">
                        ₹{product.offer_price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    {product.mrp_price > product.offer_price && (
                      <div className="text-right">
                        <span className="text-[10px] text-gray-500 block tracking-wider uppercase">Regular MRP</span>
                        <span className="text-xs text-gray-400 line-through">
                          ₹{product.mrp_price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
};
