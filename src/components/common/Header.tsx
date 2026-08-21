import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Heart, 
  User as UserIcon, 
  Search as SearchIcon, 
  Sparkles, 
  Menu, 
  X, 
  ChevronDown
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { CategoryType, SubcategoryType } from '../../types';

interface HeaderProps {
  onNavigate: (page: string, category?: CategoryType, subcategory?: SubcategoryType) => void;
  currentPage: string;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  currentPage,
  onOpenCart,
  onOpenAuth,
  onOpenSearch
}) => {
  const { cart, wishlist, user } = useStore();
  const [activeDropdown, setActiveDropdown] = useState<'Women' | 'Kids' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Robust dropdown handlers to solve disappearing dropdown issue
  const handleMouseEnter = (menu: 'Women' | 'Kids') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 250); // 250ms grace period so users can comfortably move mouse
  };

  const womenSubcategories = ['Sarees', 'Kurtis', 'Salwar Sets', 'Dresses', 'Tops'];
  const kidsSubcategories = ['Shirts', 'T-Shirts', 'Sets', 'Girls Dresses', 'Party Wear'];

  return (
    <>
      {/* Ultra Premium Top Announcement Bar */}
      <div className="bg-[#111111] text-[#D4AF37] px-4 py-2 text-xs font-medium tracking-widest text-center flex justify-between items-center max-w-7xl mx-auto border-b border-[#222]">
        <div className="hidden md:flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#D4AF37]" />
          <span>OPEN ALL DAYS: 10:00 AM – 10:00 PM</span>
        </div>
        <div className="text-center flex-1">
          <span className="text-white font-bold">FESTIVE PRIVILEGE SALE</span> — UP TO 35% OFF ON AUTHENTIC MASTERPIECES
        </div>
        <div className="hidden md:flex items-center gap-3">
          <a 
            href="https://maps.app.goo.gl/QwoTg7hgNXX9gPp96" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition flex items-center gap-1 underline underline-offset-2 font-semibold"
          >
            Visit Luxury Flagship Store
          </a>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 py-3 border-b border-gray-100' 
          : 'bg-white py-4 border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-800 hover:text-[#D4AF37] focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* BRAND LOGO ONLY (No text, No Tagline as required) */}
          <div 
            onClick={() => onNavigate('home')} 
            className="cursor-pointer flex items-center lg:flex-1 justify-start min-w-[200px] group py-1 pl-4 sm:pl-8 lg:pl-12"
            title="Jeev Ruthi Collection Flagship"
          >
            <img 
              src="/logo.png" 
              alt="Jeev Ruthi Collection Logo" 
              className="h-28 md:h-32 w-auto object-contain transition-transform duration-500 group-hover:scale-110 transform scale-[1.05] origin-left"
            />
          </div>

          {/* Main Navigation Links */}
          <nav className="hidden lg:flex flex-1 justify-center items-center gap-8">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm tracking-widest font-semibold transition py-2 relative ${
                currentPage === 'home' ? 'text-[#D4AF37]' : 'text-gray-900 hover:text-[#D4AF37]'
              }`}
            >
              HOME
              {currentPage === 'home' && (
                <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
              )}
            </button>

            {/* WOMEN DROPDOWN */}
            <div 
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('Women')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => onNavigate('shop', 'Women')}
                className={`text-sm tracking-widest font-semibold flex items-center gap-1 transition ${
                  currentPage === 'shop' || activeDropdown === 'Women' ? 'text-[#D4AF37]' : 'text-gray-900 hover:text-[#D4AF37]'
                }`}
              >
                WOMEN
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'Women' ? 'rotate-180' : ''}`} />
              </button>

              {/* Bug fix: Guaranteed stable mega menu */}
              <AnimatePresence>
                {activeDropdown === 'Women' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-72 bg-white text-[#111111] shadow-2xl rounded-xl border border-gray-100 py-4 px-6 z-50 grid grid-cols-1 gap-2"
                  >
                    <div className="text-[10px] font-bold text-[#D4AF37] tracking-widest mb-1 border-b border-gray-100 pb-1">
                      WOMEN FASHION ARCHIVE
                    </div>
                    {womenSubcategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => {
                          setActiveDropdown(null);
                          onNavigate('shop', 'Women', sub);
                        }}
                        className="text-left py-2 px-3 text-sm font-medium hover:bg-gray-50 hover:text-[#D4AF37] rounded-lg transition flex items-center justify-between group"
                      >
                        <span>{sub}</span>
                        <span className="opacity-0 group-hover:opacity-100 text-[#D4AF37] transition-opacity">→</span>
                      </button>
                    ))}
                    <div className="mt-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setActiveDropdown(null);
                          onNavigate('shop', 'Women');
                        }}
                        className="w-full bg-[#111111] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition py-2 text-xs font-bold tracking-widest rounded-lg text-center"
                      >
                        VIEW ALL WOMEN COUTURE
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* KIDS DROPDOWN */}
            <div 
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter('Kids')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => onNavigate('shop', 'Kids')}
                className={`text-sm tracking-widest font-semibold flex items-center gap-1 transition ${
                  activeDropdown === 'Kids' ? 'text-[#D4AF37]' : 'text-gray-900 hover:text-[#D4AF37]'
                }`}
              >
                KIDS
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'Kids' ? 'rotate-180' : ''}`} />
              </button>

              {/* Stable kids dropdown */}
              <AnimatePresence>
                {activeDropdown === 'Kids' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-72 bg-white text-[#111111] shadow-2xl rounded-xl border border-gray-100 py-4 px-6 z-50 grid grid-cols-1 gap-2"
                  >
                    <div className="text-[10px] font-bold text-[#D4AF37] tracking-widest mb-1 border-b border-gray-100 pb-1">
                      KIDS ROYAL BOUTIQUE
                    </div>
                    {kidsSubcategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => {
                          setActiveDropdown(null);
                          onNavigate('shop', 'Kids', sub);
                        }}
                        className="text-left py-2 px-3 text-sm font-medium hover:bg-gray-50 hover:text-[#D4AF37] rounded-lg transition flex items-center justify-between group"
                      >
                        <span>{sub}</span>
                        <span className="opacity-0 group-hover:opacity-100 text-[#D4AF37] transition-opacity">→</span>
                      </button>
                    ))}
                    <div className="mt-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setActiveDropdown(null);
                          onNavigate('shop', 'Kids');
                        }}
                        className="w-full bg-[#D4AF37] text-white hover:bg-[#111111] hover:text-[#D4AF37] transition py-2 text-xs font-bold tracking-widest rounded-lg text-center"
                      >
                        VIEW ALL KIDS WEAR
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => onNavigate('shop', 'Collections')}
              className={`text-sm tracking-widest font-semibold transition py-2 ${
                currentPage === 'shop' ? '' : 'text-gray-900 hover:text-[#D4AF37]'
              }`}
            >
              COLLECTIONS
            </button>

            <button
              onClick={() => onNavigate('shop', 'Wholesale')}
              className={`text-sm tracking-widest font-semibold transition py-2 ${
                currentPage === 'shop' ? '' : 'text-gray-900 hover:text-[#D4AF37]'
              }`}
            >
              WHOLESALE
            </button>

            <button
              onClick={() => onNavigate('shop', 'Offers')}
              className="text-sm tracking-widest font-bold text-[#D4AF37] hover:text-[#AA771C] transition py-2 flex items-center gap-1 relative group"
            >
              <Sparkles className="w-4 h-4 animate-spin text-[#D4AF37]" style={{ animationDuration: '6s' }} />
              OFFERS
              <span className="absolute -top-3 -right-6 bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full animate-pulse">
                SALE
              </span>
            </button>
          </nav>

          {/* Right Side: 2 Promotional Fashion Images + Small Floating Cards + 3D Hover Animation */}
          <div className="flex items-center gap-6 lg:flex-1 justify-end">
            

            {/* Utility / Action Icons */}
            <div className="flex items-center gap-4">
              
              {/* Search Icon */}
              <button 
                onClick={onOpenSearch}
                className="p-2 text-[#111111] hover:text-[#D4AF37] transition rounded-full hover:bg-gray-100 focus:outline-none relative group"
                title="Search Premium Collection"
              >
                <SearchIcon className="w-5 h-5" />
              </button>

              {/* Wishlist Icon */}
              <button
                onClick={() => onNavigate('dashboard')}
                className="p-2 text-[#111111] hover:text-[#D4AF37] transition rounded-full hover:bg-gray-100 focus:outline-none relative"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#111111] text-[#D4AF37] text-[10px] font-extrabold rounded-full flex items-center justify-center border border-[#D4AF37]">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* User Dashboard / Auth Icon */}
              <button
                onClick={() => {
                  if (user) {
                    onNavigate('dashboard');
                  } else {
                    onOpenAuth();
                  }
                }}
                className="p-2 text-[#111111] hover:text-[#D4AF37] transition rounded-full hover:bg-gray-100 focus:outline-none flex items-center gap-1.5"
                title={user ? 'Customer Dashboard' : 'Login / Register'}
              >
                <UserIcon className="w-5 h-5" />
                <span className="hidden md:inline text-xs font-semibold max-w-[80px] truncate">
                  {user ? user.name.split(' ')[0] : 'Sign In'}
                </span>
              </button>

              {/* Cart Drawer Button */}
              <button
                onClick={onOpenCart}
                className="flex items-center gap-2 bg-[#111111] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition duration-300 px-4 py-2 rounded-full font-semibold text-xs tracking-wider shadow-md group"
                aria-label="Shopping bag"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37] group-hover:text-white transition" />
                  {totalCartItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                      {totalCartItems}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline font-bold">BAG</span>
              </button>

            </div>

          </div>

        </div>

        {/* Mobile Slide-down Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 shadow-xl"
            >
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('home');
                  }}
                  className={`text-left py-3 px-4 font-bold text-sm rounded-xl tracking-widest ${
                    currentPage === 'home' ? 'bg-[#111111] text-[#D4AF37]' : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  HOME
                </button>

                {/* Mobile Women Menu */}
                <div className="py-2 px-4 bg-gray-50 rounded-xl">
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('shop', 'Women');
                    }}
                    className="font-bold text-sm tracking-widest text-[#D4AF37] mb-2 flex items-center justify-between w-full"
                  >
                    <span>WOMEN COUTURE</span>
                    <span>→</span>
                  </button>
                  <div className="grid grid-cols-2 gap-2 pl-2">
                    {womenSubcategories.map(sub => (
                      <button
                        key={sub}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onNavigate('shop', 'Women', sub);
                        }}
                        className="text-left text-xs py-1.5 font-medium text-gray-700 hover:text-[#D4AF37]"
                      >
                        • {sub}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Kids Menu */}
                <div className="py-2 px-4 bg-gray-50 rounded-xl">
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('shop', 'Kids');
                    }}
                    className="font-bold text-sm tracking-widest text-[#D4AF37] mb-2 flex items-center justify-between w-full"
                  >
                    <span>KIDS ROYAL BOUTIQUE</span>
                    <span>→</span>
                  </button>
                  <div className="grid grid-cols-2 gap-2 pl-2">
                    {kidsSubcategories.map(sub => (
                      <button
                        key={sub}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onNavigate('shop', 'Kids', sub);
                        }}
                        className="text-left text-xs py-1.5 font-medium text-gray-700 hover:text-[#D4AF37]"
                      >
                        • {sub}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('shop', 'Collections');
                  }}
                  className="text-left py-3 px-4 font-bold text-sm text-gray-800 hover:bg-gray-100 rounded-xl tracking-widest"
                >
                  COLLECTIONS
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('shop', 'Wholesale');
                  }}
                  className="text-left py-3 px-4 font-bold text-sm text-gray-800 hover:bg-gray-100 rounded-xl tracking-widest"
                >
                  WHOLESALE
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('shop', 'Offers');
                  }}
                  className="text-left py-3 px-4 font-extrabold text-sm text-[#D4AF37] bg-amber-50 rounded-xl tracking-widest flex items-center justify-between"
                >
                  <span>OFFERS & PRIVILEGE SALE</span>
                  <Sparkles className="w-4 h-4" />
                </button>

                <div className="pt-4 mt-2 border-t border-gray-200 flex items-center justify-around">
                  <a 
                    href="https://maps.app.goo.gl/QwoTg7hgNXX9gPp96"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] bg-[#111111] px-3 py-1.5 rounded-full"
                  >
                    <span>Store Map</span>
                  </a>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </header>
    </>
  );
};
