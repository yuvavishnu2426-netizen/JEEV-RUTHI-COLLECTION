import React from 'react';
import { RotateCcw, ShieldCheck, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';

interface ReturnPolicyPageProps {
  onBack: () => void;
  onNavigateDashboard: () => void;
}

export const ReturnPolicyPage: React.FC<ReturnPolicyPageProps> = ({ onBack, onNavigateDashboard }) => {
  return (
    <div className="bg-[#FCFCFC] text-[#111111] min-h-screen font-sans py-16 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO FLAGSHIP</span>
        </button>

        <div className="border-b border-gray-200 pb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black tracking-widest text-[#D4AF37] uppercase font-cinzel block">CONCIERGE POLICIES</span>
            <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-[#111] mt-1">
              RETURN & EXCHANGE POLICY
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-2 rounded-2xl border border-emerald-200 text-xs font-bold font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Automated Concierge Module</span>
          </div>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-sm space-y-8 text-xs sm:text-sm leading-relaxed text-gray-700">
          
          <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-200/80">
            <RotateCcw className="w-8 h-8 text-[#D4AF37] shrink-0 mt-1" />
            <div>
              <h3 className="font-cinzel font-bold text-base text-[#111]">THE 7-DAY HEIRLOOM PRIVILEGE WINDOW</h3>
              <p className="mt-2 text-xs text-gray-600">
                At JEEV RUTHI COLLECTION, every pure silk masterpiece and children’s ceremonial garment is meticulously inspected prior to dispatch. If your bespoke requirements have sizing or palette discrepancies, we provide an uncompromised 7-Day return and exchange privilege from the exact timestamp of parcel delivery.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-cinzel font-bold text-base text-[#111]">HOW TO INITIATE OUR AUTOMATED RETURN MODULE</h3>
            <p>
              You do not need to draft manual emails or await manual telephone confirmations. You can authorize an exchange directly from your private account:
            </p>
            <ol className="space-y-3 list-decimal pl-5 text-gray-600">
              <li>Navigate to your <strong>Customer Dashboard</strong> by clicking the monogram logo in the upper header.</li>
              <li>Select your active order within the <strong>My Heirloom Orders</strong> menu.</li>
              <li>Click the red <span className="font-bold text-red-600">Request Concierge Return</span> link associated with your specific creation.</li>
              <li>Select your exact physical reason (e.g. <em>Size or Fit Preference Adjustment</em>), upload photographic evidence, and submit.</li>
              <li>Our master return radar will instantly inspect and dispatch an insured royal courier for doorstep pickup within 24-48 hours.</li>
            </ol>
            <div className="pt-2">
              <button
                onClick={onNavigateDashboard}
                className="bg-[#111111] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2"
              >
                <span>OPEN RETURN MODULE NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-gray-100">
            <h3 className="font-cinzel font-bold text-base text-[#111]">ELIGIBILITY CRITERIA & VAULT CONDITIONS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs">Original authentic gold real zari purity seal must remain completely intact and unaltered.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs">Creations must remain completely unworn, unwashed, and free of any ceremonial fragrances.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs">Custom bespoke tailored lehengas modified to non-standard showroom dimensions are subject to artisan store credit.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs">Exquisite premium jewelry boxes included as complimentary privilege must accompany the return.</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/70 p-6 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <strong>Refund Ingestion Timeline:</strong> Once the master handloom archivist receives the returned silhouette and validates its genuine zari signature, refunds are fully committed back to your original UPI or NetBanking escrow ledger within 3-5 business days.
          </div>

        </div>

      </div>
    </div>
  );
};
