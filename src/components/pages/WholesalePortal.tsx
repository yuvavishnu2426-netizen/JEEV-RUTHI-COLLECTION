import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles, ShieldCheck, FileSpreadsheet, ArrowRight, CheckCircle, Truck, Globe } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface WholesalePortalProps {
  onNavigateHome: () => void;
  onNavigateShop: (cat: any) => void;
}

export const WholesalePortal: React.FC<WholesalePortalProps> = ({ onNavigateHome, onNavigateShop }) => {
  const { openSimulation } = useStore();
  
  const [showroomName, setShowroomName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [monthlyVolume, setMonthlyVolume] = useState('50 - 100 Sarees / Sets');
  const [inquiryType, setInquiryType] = useState('Authentic Handloom Pure Tissue Silks');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);

      // Trigger interactive Production integration popup to demonstrate Google sheets B2B ingestion
      const b2bPayload = {
        orderId: 'B2B-JRC-' + Math.floor(1000 + Math.random() * 9000),
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        customer: { fullName: `${showroomName} (${contactPerson})`, mobile: phone, email },
        items: Array(15).fill({ product: { name: inquiryType } }),
        totalAmount: monthlyVolume.includes('100') ? 450000 : 850000,
        paymentMethod: 'B2B Google Sheets Escrow',
        orderStatus: 'Under Partner Audit'
      };

      openSimulation('sheets', `B2B Showroom Ingestion Secured: ${showroomName}`, b2bPayload);
    }, 900);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#111111] text-white py-20 px-4 sm:px-6 lg:px-8 font-sans flex items-center justify-center text-center relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-[#1A1A1A] p-8 sm:p-12 rounded-3xl border-2 border-[#D4AF37] space-y-6 shadow-2xl relative z-10"
        >
          <div className="w-20 h-20 bg-gradient-to-tr from-[#D4AF37] to-[#FCF6BA] rounded-full flex items-center justify-center mx-auto shadow-xl">
            <CheckCircle className="w-10 h-10 text-[#111]" />
          </div>

          <div>
            <span className="text-xs font-black tracking-widest text-[#D4AF37] uppercase font-cinzel">B2B WEBHOOK INGESTION COMMITTED</span>
            <h2 className="font-cinzel text-3xl sm:text-5xl font-black text-white mt-2">
              WELCOME TO THE PRIVILEGED WHOLESALE VAULT
            </h2>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed max-w-lg mx-auto font-light">
            Your elite showroom profile <strong className="text-[#D4AF37]">{showroomName}</strong> has been logged into our MongoDB Escrow server and fully synchronized via OAuth2 to our master B2B Google Sheets dispatch board.
          </p>

          <div className="bg-[#111] p-6 rounded-2xl border border-[#333] text-left space-y-3 text-xs text-gray-300">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Globe className="w-4 h-4 shrink-0" />
              <span>Concierge Concierge Timeline:</span>
            </div>
            <p>✔ Our master handloom archivist will audit your country trade credentials within 12 business hours.</p>
            <p>✔ Comprehensive direct factory quotation catalogs will be pushed over WhatsApp to <span className="text-[#D4AF37] font-mono">{phone}</span>.</p>
          </div>

          <div className="pt-6 border-t border-[#333] flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigateShop('Wholesale')}
              className="bg-[#D4AF37] text-[#111] hover:bg-white transition px-8 py-4 rounded-2xl font-cinzel font-bold text-xs tracking-widest uppercase shadow-xl"
            >
              EXPLORE B2B EXCLUSIVE SILHOUETTES
            </button>
            <button
              onClick={onNavigateHome}
              className="bg-transparent text-gray-300 hover:text-white transition px-8 py-4 rounded-2xl font-sans font-bold text-xs tracking-widest uppercase border border-gray-600 hover:border-white"
            >
              RETURN TO FLAGSHIP
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#FCFCFC] text-[#111111] min-h-screen font-sans pb-32">
      
      {/* Top Banner */}
      <div className="bg-[#111111] text-white py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/15 via-transparent to-transparent pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto space-y-4 relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-black tracking-widest uppercase shadow">
            <Crown className="w-4 h-4 text-[#D4AF37]" />
            <span>DIRECT MASTER WEAVER PARTNERSHIPS</span>
          </div>

          <h1 className="font-cinzel text-3xl sm:text-6xl font-black text-white tracking-wider leading-[1.1]">
            GLOBAL WHOLESALE SANCTUARY
          </h1>

          <p className="font-playfair text-lg sm:text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
            Direct factory production prices on premium authentic Kanchipuram tissue silks, Chanderi ensembles, and elite ceremonial kids attire for premium retail showrooms worldwide.
          </p>
        </motion.div>
      </div>

      {/* Main Form Core */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm text-center space-y-2">
            <FileSpreadsheet className="w-8 h-8 text-[#D4AF37] mx-auto" />
            <h4 className="font-cinzel font-bold text-sm text-[#111]">GOOGLE SHEETS EDI</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Automated multi-currency electronic data interchange pre-populated into your corporate ledger.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm text-center space-y-2">
            <ShieldCheck className="w-8 h-8 text-[#D4AF37] mx-auto" />
            <h4 className="font-cinzel font-bold text-sm text-[#111]">100% REAL ZARI ASSURANCE</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Bespoke master verification certificates accompanying every bulk consignment.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm text-center space-y-2">
            <Truck className="w-8 h-8 text-[#D4AF37] mx-auto" />
            <h4 className="font-cinzel font-bold text-sm text-[#111]">ROYAL CARGO CHARTER</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Climate-controlled secure priority shipping globally directly to your retail showcase.
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-sm space-y-8"
        >
          <div className="border-b border-gray-100 pb-4">
            <span className="text-[10px] font-extrabold tracking-widest text-[#D4AF37] uppercase font-cinzel">B2B INGESTION SANCTUARY</span>
            <h3 className="font-cinzel text-2xl font-bold text-[#111] mt-1">SHOWROOM PARTNER EDI CREDENTIALS</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  Showroom or Retail Show Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sabyasachi & Singhania Luxury Showroom"
                  value={showroomName}
                  onChange={(e) => setShowroomName(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#D4AF37] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  Contact Archon or Trade Director Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Aishwarya Singhania"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#D4AF37] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  Corporate Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="b2b@luxuryshowroom.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#D4AF37] focus:bg-white transition font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  Official Mobile Number (For Live WhatsApp Quotation) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#D4AF37] focus:bg-white transition font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  Target Showroom City
                </label>
                <input
                  type="text"
                  required
                  placeholder="Hyderabad / London / Dubai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#D4AF37] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  Target Country Jurisdiction
                </label>
                <input
                  type="text"
                  required
                  placeholder="India"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#D4AF37] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  Estimated Monthly Consignment Volume *
                </label>
                <select
                  value={monthlyVolume}
                  onChange={(e) => setMonthlyVolume(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#D4AF37] focus:bg-white transition"
                >
                  <option value="15 - 50 Sarees / Masterpieces">15 - 50 Sarees / Masterpieces</option>
                  <option value="50 - 100 Sarees / Sets">50 - 100 Sarees / Sets</option>
                  <option value="100 - 250 Royal Silhouettes">100 - 250 Royal Silhouettes</option>
                  <option value="250+ Flagship Distribution">250+ Flagship Distribution</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  Primary Couture Interest *
                </label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#D4AF37] focus:bg-white transition"
                >
                  <option value="Authentic Handloom Pure Tissue Silks">Authentic Handloom Pure Tissue Silk Sarees</option>
                  <option value="Gota Patti & Padmavati Velvet Lehengas">Gota Patti & Padmavati Velvet Lehengas</option>
                  <option value="Royal Boys Raw Silk Sherwanis & Attire">Royal Boys Raw Silk Sherwanis & Attire</option>
                  <option value="Fairytale Multi-Layered Tulle Kids Gowns">Fairytale Multi-Layered Tulle Kids Gowns</option>
                  <option value="Complete Showroom Portfolio Ingestion">Complete Showroom Portfolio Ingestion</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                Specific Customization Notes or ESCROW Inquiries (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Mention specific customs duties, packing tags, or private brand licensing requests..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-[#D4AF37] focus:bg-white transition"
              />
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Next.js 15+ Automated Webhook Generation</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#111111] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition duration-300 px-10 py-4 rounded-2xl font-cinzel font-black text-xs tracking-widest uppercase shadow-xl flex items-center gap-2 group cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-pulse">DISPATCHING EDI WEBHOOK...</span>
                ) : (
                  <>
                    <span>SUBMIT WHOLESALE EDI & OPEN B2B Lookbook</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition" />
                  </>
                )}
              </button>
            </div>

          </form>

        </motion.div>

      </div>

    </div>
  );
};
