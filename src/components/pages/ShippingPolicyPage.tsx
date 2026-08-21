import React from 'react';
import { Truck, ShieldCheck, Clock, ArrowLeft, Globe } from 'lucide-react';

interface ShippingPolicyPageProps {
  onBack: () => void;
}

export const ShippingPolicyPage: React.FC<ShippingPolicyPageProps> = ({ onBack }) => {
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
            <span className="text-xs font-black tracking-widest text-[#D4AF37] uppercase font-cinzel block">CONCIERGE LOGISTICS</span>
            <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-[#111] mt-1">
              SHIPPING & DELIVERY SANCTUARY
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-[#111] text-[#D4AF37] px-4 py-2 rounded-2xl border border-[#D4AF37]/30 text-xs font-bold font-mono">
            <Truck className="w-4 h-4" />
            <span>Fully Insured Concierge Transport</span>
          </div>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-sm space-y-8 text-xs sm:text-sm leading-relaxed text-gray-700">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-2">
              <Clock className="w-6 h-6 text-[#D4AF37]" />
              <h4 className="font-cinzel font-bold text-sm text-[#111]">EXPRESS DISPATCH</h4>
              <p className="text-xs text-gray-600">
                Masterpiece items currently reserved in our handloom vaults are securely prepared and handed over to our VIP couriers within 24 business hours.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-2">
              <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
              <h4 className="font-cinzel font-bold text-sm text-[#111]">100% TRANSIT INSURANCE</h4>
              <p className="text-xs text-gray-600">
                Every pure silk package is 100% insured against transit damages or loss. You bear zero liability until physical handover occurs.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-2">
              <Globe className="w-6 h-6 text-[#D4AF37]" />
              <h4 className="font-cinzel font-bold text-sm text-[#111]">GLOBAL REACH</h4>
              <p className="text-xs text-gray-600">
                We service over 19,000 elite Indian postal codes and provide priority customs handling for international wholesale partners.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-cinzel font-bold text-base text-[#111]">SHIPPING LEDGER & PRIVILEGE TIMELINES</h3>
            <table className="w-full text-left border-collapse text-xs border border-gray-200 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-100 text-gray-800 font-bold font-cinzel">
                  <th className="p-3.5">Shipping Method</th>
                  <th className="p-3.5">Estimated Deliver Date</th>
                  <th className="p-3.5">Order Threshold</th>
                  <th className="p-3.5 text-right">Fee Ledger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="p-3.5 font-bold">Priority Insured Concierge Courier</td>
                  <td className="p-3.5">3 – 5 Business Days</td>
                  <td className="p-3.5">Orders Under ₹15,000</td>
                  <td className="p-3.5 font-mono text-right font-bold">₹499</td>
                </tr>
                <tr className="bg-emerald-50/40">
                  <td className="p-3.5 font-bold text-emerald-900">Complimentary VIP Royal Shipment</td>
                  <td className="p-3.5 text-emerald-900">2 – 4 Business Days</td>
                  <td className="p-3.5 text-emerald-900 font-bold">Orders Above ₹15,000</td>
                  <td className="p-3.5 font-mono text-right font-black text-emerald-700">FREE</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold">International Wholesale Charter (B2B)</td>
                  <td className="p-3.5">5 – 8 Business Days</td>
                  <td className="p-3.5">Global Escrow Portals</td>
                  <td className="p-3.5 font-mono text-right font-bold">B2B Actuals</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-3 pt-6 border-t border-gray-100">
            <h3 className="font-cinzel font-bold text-base text-[#111]">DOORSTEP VERIFICATION & SECURITY OTP</h3>
            <p>
              To maintain uncompromised authentication standards and safeguard your high-value silhouettes, our authorized delivery executives will request a highly secure delivery verification signature or PINcode upon arrival. Please inspect the custom tamper-evident security tape before accepting your consignment.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
