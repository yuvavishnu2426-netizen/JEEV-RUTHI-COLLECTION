import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Crown } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface HeroBannerProps {
  onNavigateShop: (category?: any) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onNavigateShop }) => {
  const { homepageBanners } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 7 seconds
  useEffect(() => {
    if (homepageBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % homepageBanners.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [homepageBanners]);

  const currentBanner = homepageBanners[currentIndex] || homepageBanners[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % homepageBanners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + homepageBanners.length) % homepageBanners.length);
  };

  // 3D Parallax Tilt Effect setup
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);
  const imgScale = useTransform(mouseYSpring, [-0.5, 0.5], [1.02, 1.08]);
  const translateX = useTransform(mouseXSpring, [-0.5, 0.5], ["-2%", "2%"]);

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

  if (homepageBanners.length === 0) return null;

  return (
    <section 
      className="relative w-full h-[85vh] min-h-[600px] bg-[#111111] overflow-hidden font-sans [perspective:1000px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      
      {/* Background Image Carousel Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          className="absolute inset-0"
        >
          <motion.img
            src={currentBanner.image_url}
            alt={currentBanner.title}
            className="w-full h-full object-cover object-center"
            style={{ scale: imgScale, x: translateX }}
          />
          {/* Opulent high-end luxury dark gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Main Foreground Hero Content */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center pb-12 z-10">
        
        <motion.div
          key={`text-${currentBanner.id}`}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-2xl text-left origin-left"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
          {/* Subtitle Emblem */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-black tracking-widest uppercase mb-6 shadow-xl"
            style={{ transform: "translateZ(30px)" }}
          >
            <Crown className="w-4 h-4 text-[#D4AF37]" />
            <span>PREMIUM LUXURY COUTURE — 2026</span>
          </motion.div>

          <motion.h1 
            className="font-cinzel text-4xl sm:text-7xl font-black text-white tracking-wider mb-6 leading-[1.05] drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
            style={{ transform: "translateZ(50px)" }}
          >
            {currentBanner.title}
          </motion.h1>

          <motion.p 
            className="font-playfair text-xl sm:text-2xl text-gray-200 font-light mb-10 leading-relaxed max-w-xl drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)]"
            style={{ transform: "translateZ(40px)" }}
          >
            {currentBanner.subtitle}
          </motion.p>

          <motion.div 
            className="flex flex-wrap items-center gap-6"
            style={{ transform: "translateZ(60px)" }}
          >
            <button
              onClick={() => onNavigateShop('Women')}
              className="bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-[#111111] hover:from-white hover:to-white hover:text-black transition duration-500 px-10 py-4 rounded-full font-sans font-extrabold text-xs tracking-widest uppercase shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] flex items-center gap-3 group cursor-pointer"
            >
              <span>{currentBanner.cta_text}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition" />
            </button>

            <button
              onClick={() => onNavigateShop('Kids')}
              className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/30 transition duration-300 px-8 py-4 rounded-full font-sans font-bold text-xs tracking-widest uppercase cursor-pointer flex items-center gap-2 shadow-lg"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>EXPLORE KIDS GALA</span>
            </button>
          </motion.div>
        </motion.div>

      </div>

      {/* Interactive Slider Indicators & Manual Controls */}
      {homepageBanners.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between z-20">
          
          {/* Dot Indicators */}
          <div className="flex items-center gap-3">
            {homepageBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-500 rounded-full h-1.5 ${
                  currentIndex === idx 
                    ? 'w-10 bg-[#D4AF37]' 
                    : 'w-3 bg-white/40 hover:bg-white'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Nav Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full bg-black/50 hover:bg-[#D4AF37] hover:text-[#111] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition duration-300 cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-black/50 hover:bg-[#D4AF37] hover:text-[#111] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition duration-300 cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

        </div>
      )}

      {/* Decorative Gold Leaf Trim Bottom Strip */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA771C] z-30" />

    </section>
  );
};
