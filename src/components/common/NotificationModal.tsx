import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, FileSpreadsheet, MessageSquare, Mail, ExternalLink, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const NotificationModal: React.FC = () => {
  const { liveSimulation, closeSimulation } = useStore();

  if (!liveSimulation.isOpen) return null;

  const { type, title, data } = liveSimulation;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, type: 'spring', damping: 25 }}
          className="relative w-full max-w-2xl bg-white text-[#111] rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
        >
          {/* Modal Header */}
          <div className="bg-[#111111] text-[#D4AF37] px-6 py-4 flex items-center justify-between border-b border-[#222]">
            <div className="flex items-center gap-2">
              {type === 'sheets' && <FileSpreadsheet className="w-5 h-5 text-emerald-400" />}
              {type === 'whatsapp' && <MessageSquare className="w-5 h-5 text-emerald-500" />}
              {type === 'email' && <Mail className="w-5 h-5 text-amber-400" />}
              <span className="font-cinzel font-bold text-sm text-white tracking-wider">
                LIVE PRODUCTION INTEGRATION BOT
              </span>
            </div>
            <button
              onClick={closeSimulation}
              className="text-gray-400 hover:text-white transition p-1"
              title="Close window"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4 bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl">
              <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">{title || 'Integration Success'}</h4>
                <p className="text-xs text-emerald-700">Executed instantly in Next.js 15+ background API workers.</p>
              </div>
            </div>

            {/* Simulated Content */}
            {type === 'sheets' && data && (
              <div className="space-y-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-gray-500 flex items-center justify-between">
                  <span>Google Sheets API Log</span>
                  <span className="text-emerald-600 flex items-center gap-1 font-bold">
                    <span>Sheet: Orders_2026</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
                
                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-100 text-gray-800 border-b border-gray-200 font-bold">
                        <th className="p-2.5">Order ID</th>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Customer Name</th>
                        <th className="p-2.5">Phone</th>
                        <th className="p-2.5">Items</th>
                        <th className="p-2.5">Amount</th>
                        <th className="p-2.5">Payment</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 hover:bg-gray-50 font-mono">
                        <td className="p-2.5 font-bold text-[#D4AF37]">{data.orderId}</td>
                        <td className="p-2.5">{data.date}</td>
                        <td className="p-2.5">{data.customer?.fullName}</td>
                        <td className="p-2.5">{data.customer?.mobile}</td>
                        <td className="p-2.5">{data.items?.length} items</td>
                        <td className="p-2.5">₹{data.totalAmount?.toLocaleString()}</td>
                        <td className="p-2.5">
                          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                            {data.paymentMethod}
                          </span>
                        </td>
                        <td className="p-2.5 text-emerald-600 font-bold">{data.orderStatus}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-700 leading-relaxed border border-gray-200">
                  <span className="font-bold text-gray-900">Payload successfully committed to MongoDB Atlas</span> and synced via secure OAuth2 tokens to Google Sheets. Concierge team and customer notified via WhatsApp Cloud API.
                </div>
              </div>
            )}

            {type === 'whatsapp' && data && (
              <div className="space-y-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-gray-500 flex items-center justify-between">
                  <span>WhatsApp Cloud Notification Simulator</span>
                  <span className="bg-[#25D366] text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                    WhatsApp Verified
                  </span>
                </div>

                <div className="bg-[#EFEAE2] p-4 rounded-2xl border border-gray-300 max-w-lg mx-auto font-sans shadow-inner">
                  <div className="bg-white p-4 rounded-xl shadow-md space-y-2 text-xs text-gray-800">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="font-extrabold text-sm text-[#111]">JEEV RUTHI COLLECTION</span>
                      <span className="text-[10px] text-gray-400">Just now</span>
                    </div>
                    <p className="font-bold text-emerald-700">Dear {data.customerName || data.customer?.fullName || 'Esteemed Connoisseur'},</p>
                    <p className="leading-relaxed">
                      We have received your return/exchange update. Request Reference: <strong className="font-mono text-[#D4AF37]">{data.returnId || 'JRC-REQ'}</strong>.
                    </p>
                    <div className="bg-gray-50 p-2.5 rounded border border-gray-200 space-y-1 font-mono text-[11px]">
                      <div><strong>Reason:</strong> {data.reason || 'Sizing preference'}</div>
                      <div><strong>Status:</strong> {data.status || 'Pending Verification'}</div>
                    </div>
                    <p className="text-[11px] text-gray-500 italic pt-1">
                      Our premium royal courier will coordinate door pickup within 24-48 business hours. Thank you for choosing Jeev Ruthi Collection.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {type === 'email' && data && (
              <div className="space-y-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-gray-500 flex items-center justify-between">
                  <span>Nodemailer Transport Simulator</span>
                  <span className="bg-amber-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                    SMTP Secure
                  </span>
                </div>

                <div className="border border-gray-200 p-6 rounded-xl space-y-4 text-xs font-sans">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <span className="font-bold text-gray-500">From:</span> concierge@jeevruthi.com
                    </div>
                    <div>
                      <span className="font-bold text-gray-500">To:</span> {data.customer?.email || data.customerEmail || 'esteemed.client@domain.com'}
                    </div>
                  </div>
                  <h3 className="font-cinzel text-sm font-bold text-[#111]">
                    ROYAL INVOICE & ORDER CONFIRMATION — {data.orderId}
                  </h3>
                  <p>Warmest greetings from JEEV RUTHI COLLECTION,</p>
                  <p>Your beautiful selections have been secured. Below is your encrypted invoice summary:</p>
                  
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="font-bold text-gray-800 mb-1">Products Securing:</div>
                    {data.items?.map((it: any, idx: number) => (
                      <div key={idx} className="flex justify-between py-1 border-b border-gray-100 last:border-0">
                        <span>{it.quantity}x {it.product?.name} ({it.selectedSize}, {it.selectedColor})</span>
                        <span className="font-bold">₹{(it.product?.offerPrice * it.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 mt-2 border-t border-gray-200 font-extrabold text-sm text-[#111]">
                      <span>Grand Total:</span>
                      <span className="text-[#D4AF37]">₹{data.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="italic text-gray-500 text-[11px]">
                    If you require bespoke tailoring adjustments before dispatch, contact our 24/7 master artisans via WhatsApp.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
            <button
              onClick={closeSimulation}
              className="bg-[#111111] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition px-6 py-2.5 rounded-full font-bold text-xs tracking-wider flex items-center gap-2"
            >
              <span>DISMISS & CONTINUE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
