import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Trash2, ArrowRight, ShieldCheck, Sparkles, Plus, Minus } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onNavigateCheckout }) => {
  const { cart, removeFromCart, updateCartQuantity } = useStore();

  if (!isOpen) return null;

  let subtotal = 0;
  let totalDiscount = 0;
  let finalTotal = 0;

  cart.forEach(item => {
    const itemMrpTotal = item.product.mrp_price * item.quantity;
    const itemOfferTotal = item.product.offer_price * item.quantity;
    subtotal += itemMrpTotal;
    totalDiscount += (itemMrpTotal - itemOfferTotal);
    finalTotal += itemOfferTotal;
  });

  let shippingFee = finalTotal > 0 ? 50 : 0;
  cart.forEach(item => {
    shippingFee += (item.product.shipping_fee || 0) * item.quantity;
  });
  const amountPayable = finalTotal + shippingFee;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs font-sans">
        
        {/* Clickable Overlay to close */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          className="relative w-full max-w-md bg-white text-[#111] h-full shadow-2xl flex flex-col justify-between border-l border-gray-200 z-10"
        >
          {/* Top Integrated Bar */}
          <div className="bg-[#111111] text-[#D4AF37] px-6 py-5 flex items-center justify-between border-b border-[#222]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <span className="font-cinzel font-bold text-sm tracking-widest text-white uppercase">
                CONCIERGE BAG ({cart.reduce((a, c) => a + c.quantity, 0)})
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition p-1 rounded-full"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items view */}
          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 text-gray-400 space-y-3">
                <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto" />
                <h4 className="font-cinzel font-bold text-base text-gray-800 tracking-wider">YOUR BAG IS EMPTY</h4>
                <p className="text-xs max-w-xs mx-auto leading-relaxed">
                  Indulge in our exquisite collection of pure silk masterpieces and celebratory kids attire.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 bg-[#111111] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition px-8 py-3 rounded-full font-bold text-xs tracking-widest uppercase shadow"
                >
                  DISCOVER CREATIONS
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <motion.div
                  layout
                  key={index}
                  className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200/80 relative group"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-24 rounded-xl object-cover shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start pr-6">
                      <span className="text-[10px] font-black tracking-widest text-[#D4AF37] uppercase block">
                        {item.product.category}
                      </span>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition p-1"
                        title="Remove selection"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h5 className="font-bold text-xs text-gray-900 line-clamp-1 mt-0.5">
                      {item.product.name}
                    </h5>

                    <div className="text-[10px] font-mono font-bold text-gray-500 mt-1 flex gap-2">
                      <span>Size: <strong className="text-black font-sans">{item.selectedSize}</strong></span>
                      <span>Color: <strong className="text-black font-sans">{item.selectedColor}</strong></span>
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200/60">
                      <div className="flex items-center gap-2 border border-gray-300 rounded-lg bg-white px-2 py-0.5">
                        <button
                          onClick={() => updateCartQuantity(index, item.quantity - 1)}
                          className="hover:text-[#D4AF37] font-bold text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-bold w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(index, item.quantity + 1)}
                          className="hover:text-[#D4AF37] font-bold text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-extrabold text-xs text-[#111]">
                          ₹{(item.product.offer_price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Cart Summary Floor */}
          {cart.length > 0 && (
            <div className="bg-gray-50 p-6 border-t border-gray-200 space-y-4">
              
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Repertoire MRP Subtotal:</span>
                  <span className="font-mono font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Showroom Privilege Savings:</span>
                  <span className="font-mono">-₹{totalDiscount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Insured Bespoke Shipping:</span>
                  <span className="font-mono font-bold">
                    {shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${shippingFee}`}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm font-black text-[#111] pt-2 mt-2 border-t border-gray-200">
                  <span>Grand Final Payable:</span>
                  <span className="text-[#D4AF37] font-mono text-base">₹{amountPayable.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="bg-amber-100/50 p-2.5 rounded-xl border border-amber-200/80 text-[10px] font-bold text-amber-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Complimentary Royal Jewelry Box included with this order.</span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onNavigateCheckout();
                }}
                className="w-full bg-[#111111] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition duration-300 py-4 rounded-2xl font-cinzel font-black text-xs tracking-widest uppercase shadow-xl flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>PROCEED TO CONCIERGE CHECKOUT</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition" />
              </button>

              <div className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>SSL 256-Bit Encrypted • Authentic Zari Guarantee</span>
              </div>

            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
