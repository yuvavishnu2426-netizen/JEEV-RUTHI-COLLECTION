import React from 'react';
import { 
  Crown, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowUpRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { CategoryType, SubcategoryType } from '../../types';

interface FooterProps {
  onNavigate: (page: string, category?: CategoryType, subcategory?: SubcategoryType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#111111] text-gray-300 border-t border-[#222222] font-sans">
      
      {/* Brand Value Added Proposition Strip */}
      <div className="border-b border-[#222222] py-10 bg-gradient-to-r from-[#161616] via-[#111111] to-[#161616]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center p-6 rounded-2xl bg-[#191919]/60 border border-[#2a2a2a] group hover:border-[#D4AF37]/50 transition duration-300">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="text-white font-cinzel font-bold tracking-wider text-base mb-2">IMPECCABLE DELIVERY</h4>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
              Fully insured bespoke premium shipping directly from our royal handloom archives to your doorstep.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 rounded-2xl bg-[#191919]/60 border border-[#2a2a2a] group hover:border-[#D4AF37]/50 transition duration-300">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="text-white font-cinzel font-bold tracking-wider text-base mb-2">SEAMLESS RETURNS</h4>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
              Dedicated 100% automated Return Module. Upload images and receive concierge pickup.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 rounded-2xl bg-[#191919]/60 border border-[#2a2a2a] group hover:border-[#D4AF37]/50 transition duration-300">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-white font-cinzel font-bold tracking-wider text-base mb-2">PURITY ASSURANCE</h4>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
              Every silk weave and gilded motif is certified for authentic real zari purity and heirloom excellence.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          
          {/* Column 1: LOGO ONLY (No Brand Name Text as required) */}
          <div className="lg:col-span-1 flex flex-col items-start justify-between">
            <div>
              <div 
                onClick={() => onNavigate('home')} 
                className="cursor-pointer inline-block group mb-6"
                title="Flagship Logo"
              >
                <img 
                  src="/logo.png" 
                  alt="Jeev Ruthi Collection Logo" 
                  className="h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-105 origin-left" 
                />
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                The ultimate benchmark of unparalleled luxury fashion, handcrafted handloom weaves, and elite children’s ceremonial couture.
              </p>
            </div>
            
            <div className="mt-6 flex items-center gap-3">
              <span className="text-xs font-semibold tracking-widest text-[#D4AF37]">CONNECT:</span>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#222] hover:bg-[#D4AF37] hover:text-white flex items-center justify-center text-xs transition duration-300"
                aria-label="Facebook"
              >
                FB
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#222] hover:bg-[#D4AF37] hover:text-white flex items-center justify-center text-xs transition duration-300"
                aria-label="Instagram"
              >
                IG
              </a>
              <a 
                href="https://wa.me/919876543210?text=Hello%20JEEV%20RUTHI%20COLLECTION,%20I%20would%20like%20to%20inquire%20about%20your%20premium%20collection." 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#222] hover:bg-[#25D366] hover:text-white flex items-center justify-center text-xs transition duration-300"
                aria-label="WhatsApp"
              >
                WA
              </a>
            </div>
          </div>

          {/* Column 2: The Women Archive */}
          <div>
            <h5 className="font-cinzel text-white text-sm font-bold tracking-widest mb-6 border-b border-[#333] pb-2 flex items-center justify-between">
              <span>WOMEN COUTURE</span>
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            </h5>
            <ul className="space-y-3 text-xs">
              <li>
                <button onClick={() => onNavigate('shop', 'Women', 'Sarees')} className="hover:text-[#D4AF37] transition flex items-center gap-1.5">
                  <span>→ Exquisite Silk Sarees</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'Women', 'Kurtis')} className="hover:text-[#D4AF37] transition flex items-center gap-1.5">
                  <span>→ Handcrafted Kurtis</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'Women', 'Salwar Sets')} className="hover:text-[#D4AF37] transition flex items-center gap-1.5">
                  <span>→ Luxury Salwar Sets</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'Women', 'Dresses')} className="hover:text-[#D4AF37] transition flex items-center gap-1.5">
                  <span>→ Met Gala Evening Gowns</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'Women', 'Tops')} className="hover:text-[#D4AF37] transition flex items-center gap-1.5">
                  <span>→ Mulberry Silk Tops</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: The Royal Kids Boutique */}
          <div>
            <h5 className="font-cinzel text-white text-sm font-bold tracking-widest mb-6 border-b border-[#333] pb-2 flex items-center justify-between">
              <span>KIDS BOUTIQUE</span>
              <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
            </h5>
            <ul className="space-y-3 text-xs">
              <li>
                <button onClick={() => onNavigate('shop', 'Kids', 'Shirts')} className="hover:text-[#D4AF37] transition flex items-center gap-1.5">
                  <span>→ Royal Silk Shirts</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'Kids', 'Girls Dresses')} className="hover:text-[#D4AF37] transition flex items-center gap-1.5">
                  <span>→ Layered Fairytale Gowns</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'Kids', 'Sets')} className="hover:text-[#D4AF37] transition flex items-center gap-1.5">
                  <span>→ Sherwani & Brocade Sets</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'Kids', 'Party Wear')} className="hover:text-[#D4AF37] transition flex items-center gap-1.5">
                  <span>→ Exclusive Party Wear</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'Wholesale')} className="hover:text-[#D4AF37] transition flex items-center gap-1.5 font-semibold text-amber-400">
                  <span>→ Wholesale & Boutique Enquiries</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Store Location */}
          <div>
            <h5 className="font-cinzel text-white text-sm font-bold tracking-widest mb-6 border-b border-[#333] pb-2">
              FLAGSHIP SANCTUARY
            </h5>
            <ul className="space-y-4 text-xs">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold">Flagship Showroom:</span>
                  <p className="text-gray-400 mt-0.5 leading-relaxed">
                    Open All Days (10:00 AM – 10:00 PM)
                  </p>
                  <a 
                    href="https://maps.app.goo.gl/QwoTg7hgNXX9gPp96" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-1 text-[#D4AF37] hover:underline font-semibold"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <div>
                  <span className="text-gray-400">+91 98765 43210</span>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <div>
                  <span className="text-gray-400">concierge@jeevruthi.com</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 5: Policies & Legal */}
          <div>
            <h5 className="font-cinzel text-white text-sm font-bold tracking-widest mb-6 border-b border-[#333] pb-2">
              CONCIERGE POLICIES
            </h5>
            <ul className="space-y-3 text-xs">
              <li>
                <button onClick={() => onNavigate('return-policy')} className="hover:text-[#D4AF37] transition flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3 text-[#D4AF37]" />
                  <span>Return & Exchange Policy</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shipping-policy')} className="hover:text-[#D4AF37] transition flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3 text-[#D4AF37]" />
                  <span>Shipping & Delivery Policy</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy-policy')} className="hover:text-[#D4AF37] transition flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3 text-[#D4AF37]" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms-conditions')} className="hover:text-[#D4AF37] transition flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3 text-[#D4AF37]" />
                  <span>Terms & Conditions</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wholesale-portal')} className="hover:text-[#D4AF37] transition flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3 text-[#D4AF37]" />
                  <span>B2B / Google Sheets Webhooks</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Strip */}
        <div className="mt-16 pt-8 border-t border-[#222] flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div>
            © 2026 JEEV RUTHI COLLECTION. All bespoke designs, pure tissue silk weaves, and digital archives are fully protected.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-gray-400 cursor-pointer">SSL 256-Bit Encrypted</span>
            <span className="hover:text-gray-400 cursor-pointer">UPI / Razorpay Certified</span>
            <span className="hover:text-gray-400 cursor-pointer">Vercel 60FPS Enabled</span>
          </div>
        </div>

      </div>

    </footer>
  );
};
