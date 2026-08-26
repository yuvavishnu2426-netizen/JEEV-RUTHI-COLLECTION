import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, ShieldCheck, QrCode, CreditCard, Banknote,
  ArrowRight, ShoppingBag, Sparkles, Lock, Upload, X,
  AlertCircle, RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../../store/useStore';
import { Address, PaymentMethodType } from '../../types';
import { createOrder, updateOrderPaymentScreenshot } from '../../lib/orders';
import { uploadPaymentScreenshot } from '../../lib/storage';
import { createShiprocketOrder } from '../../lib/shiprocket';

interface CheckoutPageProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onNavigateHome,
  onNavigateDashboard,
}) => {
  const { cart, clearCart, user, addOrder } = useStore();

  const [fullName, setFullName] = useState(user?.name || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [email, setEmail] = useState(user?.email || '');
  const [addressLine, setAddressLine] = useState(user?.savedAddresses[0]?.addressLine || '');
  const [city, setCity] = useState(user?.savedAddresses[0]?.city || '');
  const [state, setState] = useState(user?.savedAddresses[0]?.state || '');
  const [pincode, setPincode] = useState(user?.savedAddresses[0]?.pincode || '');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('UPI');

  // Order state
  const [isPlaced, setIsPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Screenshot upload state
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotUploading, setScreenshotUploading] = useState(false);
  const [screenshotUploaded, setScreenshotUploaded] = useState(false);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (cart.length === 0 && !isPlaced) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FCFCFC] font-sans p-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 rounded-full bg-gray-100 text-[#D4AF37] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-cinzel text-2xl font-bold">YOUR BAG IS EMPTY</h2>
          <p className="text-xs text-gray-500">Add items to your bag before proceeding to checkout.</p>
          <button
            onClick={onNavigateHome}
            className="bg-[#111111] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition px-8 py-3.5 rounded-full font-bold text-xs tracking-widest uppercase shadow"
          >
            RETURN TO REPERTOIRE
          </button>
        </div>
      </div>
    );
  }

  // ── Price calculations ───────────────────────────────────────
  let subtotal = 0;
  let totalDiscount = 0;
  let finalTotal = 0;

  cart.forEach(item => {
    const mrpSum = item.product.mrp_price * item.quantity;
    const offerSum = item.product.offer_price * item.quantity;
    subtotal += mrpSum;
    totalDiscount += (mrpSum - offerSum);
    finalTotal += offerSum;
  });

  let shippingFee = finalTotal > 0 ? 50 : 0;
  cart.forEach(item => {
    shippingFee += (item.product.shipping_fee || 0) * item.quantity;
  });
  const amountPayable = finalTotal + shippingFee;

  // ── UPI QR Code ──────────────────────────────────────────────
  const upiId = 'sujithjai007-2@oksbi';
  const upiName = 'JEEV RUTHI COLLECTION';
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${amountPayable}&cu=INR&tn=JRC_Order`;
  const qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(upiUri)}&size=280&margin=2`;

  // ── Screenshot Upload ────────────────────────────────────────
  const handleScreenshotSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      setScreenshotError('Only JPG, PNG, or WEBP images are accepted.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setScreenshotError('Image must be under 5MB.');
      return;
    }

    setScreenshotError(null);
    setScreenshotFile(file);
    setScreenshotPreview(URL.createObjectURL(file));
    setScreenshotUploaded(false);
  };

  const handleRemoveScreenshot = () => {
    setScreenshotFile(null);
    setScreenshotPreview(null);
    setScreenshotUploaded(false);
    setScreenshotError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Place Order ──────────────────────────────────────────────
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('Please sign in to place an order.');
      return;
    }

    if (paymentMethod === 'UPI' && !screenshotFile) {
      setError('Please upload your payment screenshot to confirm the UPI transaction.');
      return;
    }

    setLoading(true);

    try {
      const orderId = `JRC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Upload screenshot first if UPI
      let screenshotUrl: string | undefined;
      if (paymentMethod === 'UPI' && screenshotFile) {
        setScreenshotUploading(true);
        const { url, error: uploadErr } = await uploadPaymentScreenshot(
          user.id,
          orderId,
          screenshotFile
        );
        setScreenshotUploading(false);

        if (uploadErr || !url) {
          setError(`Screenshot upload failed: ${uploadErr}`);
          setLoading(false);
          return;
        }
        screenshotUrl = url;
        setScreenshotUploaded(true);
      }

      const customer: Address = {
        fullName, mobile, email, addressLine, city, state, pincode,
      };

      const orderPayload = {
        user_id: user.id,
        order_id: orderId,
        customer_full_name: fullName,
        customer_mobile: mobile,
        customer_email: email,
        customer_address_line: addressLine,
        customer_city: city,
        customer_state: state,
        customer_pincode: pincode,
        subtotal,
        discount: totalDiscount,
        shipping_fee: shippingFee,
        total_amount: amountPayable,
        payment_method: paymentMethod,
        payment_status: (
          paymentMethod === 'COD' ? 'Pending COD' :
          paymentMethod === 'UPI' ? 'Pending Verification' : 'Pending'
        ) as any,
        order_status: (
          paymentMethod === 'COD' ? 'Order Confirmed' : 'Payment Verification Pending'
        ) as any,
        order_notes: orderNotes || undefined,
        items: cart.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          product_sku: item.product.sku || '',
          product_image: item.product.images[0] || '',
          selected_size: item.selectedSize,
          selected_color: item.selectedColor,
          selected_color_code: item.selectedColorCode || '',
          quantity: item.quantity,
          mrp_price: item.product.mrp_price,
          offer_price: item.product.offer_price,
        })),
      };

      const dbOrder = await createOrder(orderPayload);

      // Trigger automatic Shiprocket Logistics Sync
      createShiprocketOrder({
        order_id: orderId,
        order_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        billing_customer_name: fullName,
        billing_address: addressLine,
        billing_city: city,
        billing_pincode: pincode,
        billing_state: state,
        billing_email: email,
        billing_phone: mobile,
        payment_method: paymentMethod === 'COD' ? 'COD' : 'Prepaid',
        sub_total: amountPayable,
        order_items: cart.map(item => ({
          name: item.product.name,
          sku: item.product.sku || item.product.id,
          units: item.quantity,
          selling_price: item.product.offer_price,
        }))
      }).catch(srErr => console.warn('Shiprocket auto-sync info:', srErr));

      // If screenshot uploaded, attach URL to order
      if (screenshotUrl && dbOrder) {
        await updateOrderPaymentScreenshot(dbOrder.id, screenshotUrl);
      }

      // Update local store
      addOrder({
        id: dbOrder.id,
        order_id: orderId,
        user_id: user.id,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        customer,
        items: [...cart],
        totalAmount: amountPayable,
        subtotal,
        discount: totalDiscount,
        shippingFee,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'Pending COD' : 'Pending Verification',
        paymentScreenshotUrl: screenshotUrl,
        orderStatus: paymentMethod === 'COD' ? 'Order Confirmed' : 'Payment Verification Pending',
        orderNotes: orderNotes || undefined,
      });

      clearCart();
      setPlacedOrderId(orderId);
      setIsPlaced(true);

      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#111111', '#BF953F', '#FFFFFF'],
      });

    } catch (err: any) {
      console.error('Order placement failed:', err);
      setError(err?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success Screen ───────────────────────────────────────────
  if (isPlaced) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-[#111111] text-white font-sans py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl w-full bg-[#1A1A1A] rounded-3xl p-8 sm:p-12 border-2 border-[#D4AF37] shadow-2xl relative z-10 text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-tr from-[#D4AF37] to-[#FCF6BA] rounded-full flex items-center justify-center mx-auto shadow-xl shadow-amber-900/30 animate-bounce">
            <CheckCircle className="w-10 h-10 text-[#111]" />
          </div>

          <div>
            <span className="text-xs font-black tracking-widest text-[#D4AF37] uppercase font-cinzel">
              ORDER PLACED SUCCESSFULLY
            </span>
            <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-white mt-2">
              ORDER SECURED
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm mt-1 font-mono">
              Reference: <strong className="text-[#D4AF37] text-base">{placedOrderId}</strong>
            </p>
          </div>

          <div className="bg-[#111111] p-6 rounded-2xl border border-[#333] text-left space-y-3 text-xs leading-relaxed font-sans">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Order Status:</span>
            </div>
            {paymentMethod === 'UPI' ? (
              <>
                <p className="text-yellow-300">⏳ <strong>Order Successful But Payment Verification Pending</strong> — Admin is reviewing your payment screenshot. Please check back in 1 hour.</p>
                <p className="text-gray-400 text-[11px]">You will be notified once your payment is verified and the order is confirmed.</p>
              </>
            ) : (
              <p className="text-emerald-400">✔ <strong>Order Confirmed</strong> — COD order accepted. Pay at delivery.</p>
            )}
          </div>

          <div className="pt-6 border-t border-[#333] flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onNavigateDashboard}
              className="bg-[#D4AF37] text-[#111] hover:bg-white transition px-8 py-4 rounded-2xl font-cinzel font-bold text-xs tracking-widest uppercase shadow-xl cursor-pointer"
            >
              TRACK ORDER
            </button>
            <button
              onClick={onNavigateHome}
              className="bg-transparent text-gray-300 hover:text-white transition px-8 py-4 rounded-2xl font-sans font-bold text-xs tracking-widest uppercase border border-gray-600 hover:border-white cursor-pointer"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── Checkout Form ────────────────────────────────────────────
  return (
    <div className="bg-[#FCFCFC] text-[#111111] min-h-screen font-sans py-12 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#111111] text-[#D4AF37] text-[10px] font-black tracking-widest uppercase mb-3 shadow">
            <Lock className="w-3.5 h-3.5" />
            <span>SECURE CHECKOUT</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-[#111]">CHECKOUT</h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* ── LEFT: FORM ───────────────────────────────── */}
          <div className="lg:col-span-7 space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-sm">

            {/* Delivery Details */}
            <div>
              <h3 className="font-cinzel font-bold text-base text-[#111] tracking-wider flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
                <span className="w-6 h-6 rounded-full bg-[#111] text-[#D4AF37] flex items-center justify-center font-bold text-xs">1</span>
                <span>DELIVERY DETAILS</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Full Name *</label>
                  <input type="text" required placeholder="e.g. Priya Sharma" value={fullName} onChange={e => setFullName(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-white transition" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Mobile *</label>
                  <input type="tel" required placeholder="+91 98765 43210" value={mobile} onChange={e => setMobile(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-mono focus:outline-none focus:border-[#D4AF37] focus:bg-white transition" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Email *</label>
                  <input type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-mono focus:outline-none focus:border-[#D4AF37] focus:bg-white transition" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Address *</label>
                  <input type="text" required placeholder="House No, Street, Area" value={addressLine} onChange={e => setAddressLine(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-white transition" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">City *</label>
                  <input type="text" required placeholder="City" value={city} onChange={e => setCity(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-white transition" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">State *</label>
                  <input type="text" required placeholder="State" value={state} onChange={e => setState(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-white transition" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Pincode *</label>
                  <input type="text" required placeholder="110001" value={pincode} onChange={e => setPincode(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-mono focus:outline-none focus:border-[#D4AF37] focus:bg-white transition" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="font-cinzel font-bold text-base text-[#111] tracking-wider flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
                <span className="w-6 h-6 rounded-full bg-[#111] text-[#D4AF37] flex items-center justify-center font-bold text-xs">2</span>
                <span>PAYMENT METHOD</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {([
                  { value: 'UPI', label: 'UPI / QR Pay', icon: <QrCode className="w-5 h-5" />, desc: 'Scan & Pay via any UPI app' },
                  { value: 'COD', label: 'Cash on Delivery', icon: <Banknote className="w-5 h-5" />, desc: 'Pay when order arrives' },
                  { value: 'Razorpay', label: 'Card / Net Banking', icon: <CreditCard className="w-5 h-5" />, desc: 'Secure online payment' },
                ] as const).map(({ value, label, icon, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPaymentMethod(value)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      paymentMethod === value
                        ? 'border-[#D4AF37] bg-amber-50 shadow-md'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <div className={`mb-2 ${paymentMethod === value ? 'text-[#D4AF37]' : 'text-gray-500'}`}>
                      {icon}
                    </div>
                    <div className="font-bold text-xs text-[#111]">{label}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* UPI QR Section */}
            <AnimatePresence>
              {paymentMethod === 'UPI' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-[#D4AF37]/30 rounded-2xl p-6 space-y-5"
                >
                  <h4 className="font-cinzel font-bold text-sm text-[#111] flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-[#D4AF37]" />
                    SCAN & PAY — ₹{amountPayable.toLocaleString('en-IN')}
                  </h4>

                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="bg-white p-3 rounded-2xl shadow-md border border-amber-200 shrink-0">
                      <img src={qrCodeUrl} alt="UPI QR Code" className="w-40 h-40 object-contain" />
                    </div>
                    <div className="space-y-2 text-xs">
                      <p className="font-bold text-[#111]">UPI ID:</p>
                      <p className="font-mono bg-white border border-amber-200 rounded-xl px-3 py-2 text-[#D4AF37] font-bold">{upiId}</p>
                      <p className="text-gray-600 mt-2">
                        1. Open any UPI app (GPay, PhonePe, Paytm)<br/>
                        2. Scan the QR code or use UPI ID above<br/>
                        3. Pay exactly ₹{amountPayable.toLocaleString('en-IN')}<br/>
                        4. Take a screenshot of the success screen<br/>
                        5. Upload the screenshot below
                      </p>
                    </div>
                  </div>

                  {/* Screenshot Upload */}
                  <div>
                    <label className="block text-xs font-bold text-[#111] mb-2 uppercase tracking-wider">
                      Upload Payment Screenshot *
                    </label>

                    {!screenshotPreview ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-amber-300 rounded-2xl p-6 text-center cursor-pointer hover:border-[#D4AF37] hover:bg-amber-50/50 transition"
                      >
                        <Upload className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                        <p className="text-xs font-bold text-gray-700">Click to upload screenshot</p>
                        <p className="text-[11px] text-gray-400 mt-1">JPG, PNG, WEBP — Max 5MB</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleScreenshotSelect}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-300 bg-emerald-50">
                        <img src={screenshotPreview} alt="Payment screenshot" className="w-full max-h-48 object-contain" />
                        <button
                          type="button"
                          onClick={handleRemoveScreenshot}
                          className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition shadow"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {screenshotUploaded && (
                          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                            <CheckCircle className="w-3 h-3" /> Uploaded
                          </div>
                        )}
                      </div>
                    )}

                    {screenshotError && (
                      <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {screenshotError}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Order Notes */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Order Notes (Optional)</label>
              <textarea
                rows={3}
                placeholder="Any special instructions..."
                value={orderNotes}
                onChange={e => setOrderNotes(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-white transition resize-none"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl p-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || screenshotUploading}
              className="w-full bg-[#111111] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition duration-300 py-4 rounded-2xl font-cinzel font-bold text-sm tracking-widest shadow-lg flex items-center justify-center gap-3 group cursor-pointer disabled:opacity-60"
            >
              {loading || screenshotUploading ? (
                <><RefreshCw className="w-5 h-5 animate-spin" /><span>{screenshotUploading ? 'UPLOADING SCREENSHOT...' : 'PLACING ORDER...'}</span></>
              ) : (
                <><ShieldCheck className="w-5 h-5" /><span>CONFIRM & PLACE ORDER</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" /></>
              )}
            </button>
          </div>

          {/* ── RIGHT: ORDER SUMMARY ─────────────────────── */}
          <div className="lg:col-span-5 space-y-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm sticky top-6">
            <h3 className="font-cinzel font-bold text-base text-[#111] tracking-wider border-b border-gray-100 pb-4">
              ORDER SUMMARY ({cart.length} {cart.length === 1 ? 'ITEM' : 'ITEMS'})
            </h3>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {cart.map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#111] leading-tight line-clamp-2">{item.product.name}</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {item.selectedSize && (
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                          Size: {item.selectedSize}
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                          {item.selectedColorCode && (
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-gray-300"
                              style={{ backgroundColor: item.selectedColorCode }}
                            />
                          )}
                          {item.selectedColor}
                        </span>
                      )}
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                        Qty: {item.quantity}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-[#111] mt-1">
                      ₹{(item.product.offer_price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal (MRP)</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount</span>
                <span>−₹{totalDiscount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className={shippingFee === 0 ? 'text-emerald-600 font-bold' : ''}>
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-[#111] font-extrabold text-base border-t border-gray-100 pt-3 mt-2">
                <span>Total Payable</span>
                <span className="text-[#D4AF37]">₹{amountPayable.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-4">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Secured by Supabase. Orders stored in encrypted database.</span>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
