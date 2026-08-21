import React from 'react';
import { Lock, ShieldCheck, ArrowLeft, CheckCircle } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack }) => {
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
            <span className="text-xs font-black tracking-widest text-[#D4AF37] uppercase font-cinzel block">LEGAL COUTURE</span>
            <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-[#111] mt-1">
              PRIVILEGED PRIVACY POLICY
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-[#111] text-[#D4AF37] px-4 py-2 rounded-2xl border border-[#D4AF37]/30 text-xs font-bold font-mono">
            <Lock className="w-4 h-4" />
            <span>SSL 256-Bit Encrypted Vault</span>
          </div>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-sm space-y-8 text-xs sm:text-sm leading-relaxed text-gray-700">
          
          <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <ShieldCheck className="w-8 h-8 text-[#D4AF37] shrink-0 mt-1" />
            <div>
              <h3 className="font-cinzel font-bold text-base text-[#111]">THE CROWN SANCTUARY OATH</h3>
              <p className="mt-2 text-xs text-gray-600">
                At JEEV RUTHI COLLECTION, your private identity, shipping sanctuary credentials, and bespoke buying preferences are guarded with absolute confidentiality. We treat your digital data with the precise reverence we accord to our rarest royal pure silk weaves.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-cinzel font-bold text-base text-[#111]">DATA INGESTION & ENCRYPTED WEBHOOKS</h3>
            <p>
              When you interact with our Next.js 15+ high-end eCommerce UI, we ingest specific structured vectors to fulfill your premium orders flawlessly:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-1">
                <span className="font-bold text-gray-900 block font-cinzel">CONCIERGE CREDENTIALS</span>
                <p className="text-xs text-gray-600">Full name, mansion address, mobile number, and encrypted SMTP emails secured during checkout.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-1">
                <span className="font-bold text-gray-900 block font-cinzel">PAYMENT ARCHITECTURE</span>
                <p className="text-xs text-gray-600">Dynamic UPI tokens (`sujithjai007-2@oksbi`) and Razorpay OAuth signatures tokenized safely.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-cinzel font-bold text-base text-[#111]">THIRD-PARTY INTEGRATION OATH</h3>
            <p>
              We absolutely do not monetize or distribute your personal vectors to external ad networks. We execute strict data sharing exclusively with essential production webhook services:
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                <span><strong>MongoDB Atlas:</strong> Encrypted active database clusters holding order entries and return modules.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                <span><strong>Google Sheets B2B Bots:</strong> Encrypted internal multi-channel ledger tracking authorized orders.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                <span><strong>WhatsApp Cloud API:</strong> Live notifications and VIP quotation slips pre-filled instantly.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#111] text-gray-300 p-6 rounded-2xl text-xs space-y-2 border border-[#333]">
            <span className="text-white font-cinzel font-bold block">YOUR PRIVILEGED DATA RIGHTS</span>
            <p>
              You maintain full sovereign ownership over your account data. You can exercise your right to complete vault erasure at any time by speaking to our Master Concierge on WhatsApp or clicking the Secure Logout module.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
