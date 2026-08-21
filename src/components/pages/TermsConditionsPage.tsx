import React from 'react';
import { Scale, ShieldCheck, ArrowLeft, Crown } from 'lucide-react';

interface TermsConditionsPageProps {
  onBack: () => void;
}

export const TermsConditionsPage: React.FC<TermsConditionsPageProps> = ({ onBack }) => {
  return (
    <div className="bg-[#FCFCFC] text-[#111111] min-h-screen font-sans py-16 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO FLAGSHIP</span>
        </button>

        <div className="border-b border-gray-200 pb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black tracking-widest text-[#D4AF37] uppercase font-cinzel block">THE LEGAL COVENANT</span>
            <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-[#111] mt-1">
              TERMS & CONDITIONS
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-[#111] text-[#D4AF37] px-4 py-2 rounded-2xl border border-[#D4AF37]/30 text-xs font-bold font-mono">
            <Scale className="w-4 h-4" />
            <span>Official Show Covenant — 2026</span>
          </div>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-sm space-y-8 text-xs sm:text-sm leading-relaxed text-gray-700">
          
          <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <Crown className="w-8 h-8 text-[#D4AF37] shrink-0 mt-1" />
            <div>
              <h3 className="font-cinzel font-bold text-base text-[#111]">SOVEREIGN ACCEPTANCE OF TERMS</h3>
              <p className="mt-2 text-xs text-gray-600">
                Welcome to JEEV RUTHI COLLECTION. By accessing our Next.js 15+ premium eCommerce interface, authenticating via OTP, or placing orders via our dynamic UPI QR code (`sujithjai007-2@oksbi`), you irrevocably consent to the terms, rules, and conditions outlined within this digital legal covenant.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-cinzel font-bold text-base text-[#111]">1. ROYAL ARCHIVE & TRADEMARK SOVEREIGNTY</h3>
            <p>
              Every single product photography, lookbook visual, category banner, description, and pure tissue silk weave design featured on this portal is the exclusive intellectual and physical property of JEEV RUTHI COLLECTION. Unauthorized extraction, mirroring, or commercial distribution is punishable under the strictest international copyright statutes.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-cinzel font-bold text-base text-[#111]">2. SHOWROOM PRICING & PRIVILEGE OFFERS</h3>
            <p>
              We pride ourselves on offering uncompromised premium fashion experiences. The prices displayed in our Repertoire are listed in Indian Rupees (INR) and are fully inclusive of all premium packaging and bespoke finishing taxes. Our Master Archivist reserves the right to modify promotional privilege thresholds without prior notification.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-cinzel font-bold text-base text-[#111]">3. PAYMENT BRIDGE & GOOGLE SHEETS ESCROW</h3>
            <p>
              By authorizing orders via Cash On Delivery (COD) or dynamic UPI Quick-Response, you commit to accepting physical parcel delivery upon arrival. Falsified or malicious COD requests will result in an irrevocable ban from our Customer inner circle and immediate reporting to local credit bureaus.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-cinzel font-bold text-base text-[#111]">4. JURISDICTION & SANCTUARY ARBITRATION</h3>
            <p>
              Any legal discrepancies arising from this digital commerce covenant shall be adjudicated exclusively within the official high court jurisdiction of New Delhi, India. Both the brand and the Connoisseur agree to binding executive arbitration prior to formal court intervention.
            </p>
          </div>

          <div className="bg-emerald-50/80 p-6 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <span>Your session remains strictly protected under our 100% Mobile First Design & Vercel SLA frameworks. Thank you for making Jeev Ruthi Collection your home for timeless royal fashion.</span>
          </div>

        </div>

      </div>
    </div>
  );
};
