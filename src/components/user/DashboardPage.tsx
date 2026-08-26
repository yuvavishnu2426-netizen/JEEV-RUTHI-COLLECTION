import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User as UserIcon, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  RotateCcw, 
  LogOut, 
  FileText, 
  Sparkles, 
  CheckCircle, 
  Upload, 
  Truck, 
  Clock, 
  AlertCircle,
  X,
  Plus
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Product, Order } from '../../types';
import { supabase } from '../../lib/supabase';
import { createReturnRequest } from '../../lib/orders';
import { uploadReturnEvidence } from '../../lib/storage';

interface DashboardPageProps {
  onSelectProduct: (product: Product) => void;
  onNavigateHome: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onSelectProduct, onNavigateHome }) => {
  const { user, logoutUser, orders, returns, wishlist, products, toggleWishlist, setReturns } = useStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'addresses' | 'returns'>('orders');

  // Order Tracking Overlay State
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  // Return Request Modal State
  const [returnModalOrder, setReturnModalOrder] = useState<Order | null>(null);
  const [returnItemName, setReturnItemName] = useState<string>('');
  const [returnReason, setReturnReason] = useState<string>('Size/Fit Issue');
  const [returnDescription, setReturnDescription] = useState<string>('');
  
  // Return proof file upload states
  const returnFileInputRef = useRef<HTMLInputElement>(null);
  const [returnImageFile, setReturnImageFile] = useState<File | null>(null);
  const [returnImagePreview, setReturnImagePreview] = useState<string | null>(null);
  const [returnUploading, setReturnUploading] = useState<boolean>(false);
  const [returnUploadError, setReturnUploadError] = useState<string | null>(null);

  // Invoice Download View State
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // New Address State
  const [showAddAddress, setShowAddAddress] = useState<boolean>(false);
  const [addrFullName, setAddrFullName] = useState<string>('');
  const [addrMobile, setAddrMobile] = useState<string>('');
  const [addrEmail, setAddrEmail] = useState<string>('');
  const [addrLine, setAddrLine] = useState<string>('');
  const [addrCity, setAddrCity] = useState<string>('');
  const [addrState, setAddrState] = useState<string>('');
  const [addrPincode, setAddrPincode] = useState<string>('');

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FCFCFC] font-sans p-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 rounded-full bg-gray-100 text-[#D4AF37] flex items-center justify-center mx-auto">
            <UserIcon className="w-8 h-8" />
          </div>
          <h2 className="font-cinzel text-2xl font-bold">AUTHENTICATION REQUIRED</h2>
          <p className="text-xs text-gray-500">You must authorize your identity via Secure Mobile/Email OTP to unlock your private luxury archives.</p>
          <button
            onClick={onNavigateHome}
            className="bg-[#111111] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition px-8 py-3.5 rounded-full font-bold text-xs tracking-widest uppercase shadow"
          >
            RETURN TO FLAGSHIP
          </button>
        </div>
      </div>
    );
  }

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  const handleCreateReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnModalOrder || !user) return;
    if (!returnImageFile) {
      setReturnUploadError('Please upload an evidence image.');
      return;
    }

    setReturnUploading(true);
    setReturnUploadError(null);

    try {
      const returnId = 'RET-' + Date.now().toString().slice(-6);

      // 1. Upload to Supabase Storage
      const { url: uploadUrl, error: uploadErr } = await uploadReturnEvidence(
        user.id,
        returnId,
        returnImageFile
      );

      if (uploadErr || !uploadUrl) {
        setReturnUploadError(`Upload failed: ${uploadErr}`);
        setReturnUploading(false);
        return;
      }

      // 2. Write to Supabase table
      const returnPayload = {
        return_id: returnId,
        order_id: returnModalOrder.id,
        order_display_id: returnModalOrder.order_id,
        user_id: user.id,
        customer_name: user.name,
        customer_email: user.email,
        customer_mobile: user.mobile,
        product_name: returnItemName || returnModalOrder.items[0]?.product.name || 'Premium Item',
        reason: returnReason,
        description: returnDescription,
        image_url: uploadUrl,
      };

      const dbResult = await createReturnRequest(returnPayload);

      // 3. Update local Zustand state
      const mappedNewReturn = {
        id: dbResult.id,
        returnId: returnId,
        order_id: returnModalOrder.order_id,
        productName: returnPayload.product_name,
        customerName: returnPayload.customer_name,
        customerEmail: returnPayload.customer_email,
        customerMobile: returnPayload.customer_mobile,
        reason: returnReason,
        description: returnDescription,
        imageUrl: uploadUrl,
        requestDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: 'Pending' as const,
        adminNote: '',
      };

      setReturns([mappedNewReturn, ...returns]);

      // Reset states
      setReturnModalOrder(null);
      setReturnImageFile(null);
      setReturnImagePreview(null);
      setReturnDescription('');
      
      alert('Return request submitted successfully! Our showroom staff will review it.');
      setActiveTab('returns');
    } catch (err: any) {
      console.error('Failed to create return:', err);
      setReturnUploadError(err.message || 'Failed to submit return request.');
    } finally {
      setReturnUploading(false);
    }
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    // const newA: Address = {
    //   fullName: addrFullName,
    //   mobile: addrMobile,
    //   email: addrEmail,
    //   addressLine: addrLine,
    //   city: addrCity,
    //   state: addrState,
    //   pincode: addrPincode
    // };
    // saveAddress(newA);
    console.log('Save address functionality has been migrated to Supabase endpoints.');
    setShowAddAddress(false);
  };

  return (
    <div className="bg-[#FCFCFC] text-[#111111] min-h-screen font-sans pb-32">
      
      {/* Top Welcome Header */}
      <div className="bg-[#111111] text-white py-14 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FCF6BA] text-[#111] flex items-center justify-center font-cinzel font-black text-2xl shadow-xl border-2 border-white/20">
              {user.name[0]}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold tracking-widest uppercase mb-1">
                <Sparkles className="w-3 h-3" />
                <span>PRIVILEGED CONNOISSEUR</span>
              </div>
              <h1 className="font-cinzel text-2xl sm:text-4xl font-extrabold text-white">
                {user.name}
              </h1>
              <span className="text-xs text-gray-400 font-mono tracking-wider">{user.mobile} • {user.email}</span>
            </div>
          </div>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              logoutUser();
              window.location.reload();
            }}
            className="bg-white/10 hover:bg-red-600/20 text-gray-300 hover:text-red-500 transition px-6 py-3 rounded-full font-bold text-xs flex items-center gap-2 border border-white/10 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>SECURE LOGOUT</span>
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Navigation Sidebar (3 Cols) */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-4 border border-gray-200 shadow-sm space-y-2">
            {[
              { id: 'orders', label: 'MY HEIRLOOM ORDERS', icon: ShoppingBag, count: orders.length },
              { id: 'profile', label: 'CONCIERGE PROFILE', icon: UserIcon },
              { id: 'wishlist', label: 'WISHLIST VAULT', icon: Heart, count: wishlist.length },
              { id: 'addresses', label: 'SAVED SANCTUARIES', icon: MapPin, count: user.savedAddresses.length },
              { id: 'returns', label: 'RETURN & EXCHANGES', icon: RotateCcw, count: returns.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full py-3.5 px-5 rounded-2xl font-bold text-xs tracking-wider uppercase transition flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-[#111111] text-[#D4AF37] shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] ${isActive ? 'bg-[#D4AF37] text-[#111]' : 'bg-gray-200 text-gray-800'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Core Content View Area (9 Cols) */}
          <div className="lg:col-span-9 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm min-h-[500px]">
            
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-cinzel font-bold text-xl text-[#111]">ORDER ARCHIVES</h3>
                    <p className="text-xs text-gray-500 mt-1">Review live delivery status, track packages, or request automated concierge return</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#D4AF37] bg-[#111] px-3 py-1 rounded-full">
                    {orders.length} Verified Secure Entries
                  </span>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-16 text-gray-400 space-y-3">
                    <ShoppingBag className="w-16 h-16 mx-auto text-gray-200" />
                    <h4 className="font-bold text-sm">NO ORDERS PLACED YET</h4>
                    <button onClick={onNavigateHome} className="bg-[#111] text-[#D4AF37] px-6 py-2.5 rounded-full text-xs font-bold uppercase">Explore Catalog</button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-3xl p-6 space-y-6 hover:border-[#D4AF37]/50 transition shadow-2xs">
                        
                        {/* Header */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
                          <div>
                            <span className="font-mono text-lg font-black text-[#111]">{order.order_id}</span>
                          </div>

                          <div>
                            <span className="text-xs text-gray-400 block font-light">Date Secured</span>
                            <span className="font-semibold text-xs text-gray-800">{order.date}</span>
                          </div>

                          <div>
                            <span className="text-xs text-gray-400 block font-light">Total Value</span>
                            <span className="font-mono text-sm font-black text-[#D4AF37]">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                          </div>

                          <div>
                            <span className="text-xs text-gray-400 block font-light">Current Status</span>
                            <span className={`text-xs font-black px-3 py-1 rounded-full inline-block ${
                              order.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                              order.orderStatus === 'Payment Verification Pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                              (order.orderStatus === 'Payment Approved' || order.orderStatus === 'Processing' || order.orderStatus === 'Packed') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              ● {
                                order.orderStatus === 'Payment Verification Pending' ? 'Payment Verification Pending (Check in 1hr)' : 
                                order.orderStatus === 'Payment Approved' ? 'Payment Verification Successful' : 
                                order.orderStatus === 'Processing' ? 'Packaging' : 
                                order.orderStatus === 'Packed' ? 'Packaging' :
                                order.orderStatus
                              }
                            </span>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="flex gap-4 items-center bg-gray-50 p-3 rounded-2xl border border-gray-200/60">
                              <img src={it.product.images[0]} alt={it.product.name} className="w-16 h-20 rounded-xl object-cover" />
                              <div className="flex-1 min-w-0">
                                <h5 className="font-bold text-xs text-gray-900 line-clamp-1">{it.product.name}</h5>
                                <span className="text-xs font-bold text-[#111] block mt-1">₹{it.product.offer_price.toLocaleString('en-IN')} x {it.quantity}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setTrackingOrder(order)}
                              className="bg-[#111111] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider flex items-center gap-1.5 cursor-pointer shadow"
                            >
                              <Truck className="w-4 h-4" />
                              <span>LIVE TRACK ORDER</span>
                            </button>

                            <button
                              onClick={() => setInvoiceOrder(order)}
                              className="bg-gray-100 text-gray-800 hover:bg-gray-200 transition px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider flex items-center gap-1.5 cursor-pointer"
                            >
                              <FileText className="w-4 h-4 text-amber-700" />
                              <span>DOWNLOAD INVOICE</span>
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              setReturnModalOrder(order);
                              setReturnItemName(order.items[0]?.product.name || '');
                            }}
                            className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>REQUEST CONCIERGE RETURN</span>
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-8 max-w-xl">
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="font-cinzel font-bold text-xl text-[#111]">CONCIERGE PROFILE VAULT</h3>
                </div>

                <div className="space-y-5 text-xs font-medium">
                  <div>
                    <label className="block text-gray-500 uppercase tracking-wider mb-1 font-bold">Registered Full Name</label>
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-sm text-[#111]">
                      {user.name}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-500 uppercase tracking-wider mb-1 font-bold">Encrypted Mobile Number</label>
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl font-mono text-xs text-[#111] flex items-center justify-between">
                      <span>{user.mobile}</span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">✔ OTP Verified</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-500 uppercase tracking-wider mb-1 font-bold">Encrypted Email Address</label>
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl font-mono text-xs text-[#111] flex items-center justify-between">
                      <span>{user.email}</span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">✔ SMTP Active</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-500 uppercase tracking-wider mb-1 font-bold">Authentication Standard</label>
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-amber-800 bg-amber-50 font-bold uppercase tracking-widest">
                      {user.authType}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
                  <h3 className="font-cinzel font-bold text-xl text-[#111]">WISHLIST VAULT</h3>
                  <span className="font-mono text-xs font-bold text-gray-500">{wishlist.length} reserved in personal vault</span>
                </div>

                {wishlistedProducts.length === 0 ? (
                  <div className="text-center py-16 text-gray-400 space-y-3">
                    <Heart className="w-16 h-16 mx-auto text-gray-200" />
                    <h4 className="font-bold text-sm">NO MASTERPIECES WISHLISTED</h4>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistedProducts.map((prod) => (
                      <div key={prod.id} className="border border-gray-200 rounded-2xl p-4 flex flex-col justify-between group bg-gray-50">
                        <div className="aspect-[3/4] w-full bg-gray-100 rounded-xl overflow-hidden mb-3 relative">
                          <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                          <button
                            onClick={() => toggleWishlist(prod.id)}
                            className="absolute top-2 right-2 p-2 bg-white rounded-full text-red-600 hover:scale-110 transition shadow cursor-pointer"
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </button>
                        </div>
                        <h5 className="font-bold text-xs text-gray-900 line-clamp-1">{prod.name}</h5>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                          <span className="font-extrabold text-sm text-[#111]">₹{prod.offer_price.toLocaleString('en-IN')}</span>
                          <button
                            onClick={() => onSelectProduct(prod)}
                            className="bg-[#111] text-[#D4AF37] px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SAVED ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
                  <h3 className="font-cinzel font-bold text-xl text-[#111]">SAVED SANCTUARIES</h3>
                  <button
                    onClick={() => setShowAddAddress(true)}
                    className="bg-[#111] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition px-5 py-2.5 rounded-full font-bold text-xs uppercase flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD MANSION SANCTUARY</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.savedAddresses.map((addr, idx) => (
                    <div key={idx} className="bg-gray-50 border-2 border-gray-200 p-6 rounded-3xl space-y-3 relative group hover:border-[#D4AF37] transition">
                      <div className="absolute top-6 right-6 bg-[#111] text-[#D4AF37] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                        Primary Suite
                      </div>
                      <h4 className="font-cinzel font-black text-sm text-[#111]">{addr.fullName}</h4>
                      <div className="space-y-1 text-xs text-gray-600 font-sans">
                        <p>{addr.addressLine}</p>
                        <p>{addr.city}, {addr.state} - <strong className="font-mono text-[#111]">{addr.pincode}</strong></p>
                        <p className="font-mono pt-1 text-gray-400">{addr.mobile} • {addr.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RETURNS TAB (Complete Return Module) */}
            {activeTab === 'returns' && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
                  <h3 className="font-cinzel font-bold text-xl text-[#111]">RETURN & EXCHANGE REQUESTS</h3>
                  <span className="text-xs font-mono font-bold text-[#D4AF37] bg-[#111] px-3 py-1 rounded-full">
                    {returns.length} Active Modules
                  </span>
                </div>

                {returns.length === 0 ? (
                  <div className="text-center py-16 text-gray-400 space-y-3">
                    <RotateCcw className="w-16 h-16 mx-auto text-gray-200" />
                    <h4 className="font-bold text-sm">NO RETURN REQUESTS INITIATED</h4>
                    <p className="text-xs">You can initiate a return or exchange right from your Heirloom Orders tab.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {returns.map((ret) => (
                      <div key={ret.id} className="border-2 border-gray-200 rounded-3xl p-6 space-y-4 bg-gray-50">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-3">
                          <div>
                            <span className="text-[10px] text-gray-400 block tracking-wider uppercase font-bold">Return Reference ID</span>
                            <span className="font-mono text-base font-extrabold text-[#D4AF37]">{ret.returnId}</span>
                          </div>
                          <div>
                            <span className="font-mono text-sm font-bold text-gray-800">{ret.order_id}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 block tracking-wider uppercase font-bold">Request Date</span>
                            <span className="font-semibold text-xs text-gray-700">{ret.requestDate}</span>
                          </div>
                          <div>
                            <span className={`text-xs font-black px-3 py-1 rounded-full inline-block ${
                              ret.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : ret.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              ● Status: {ret.status}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-bold text-sm text-[#111]">{ret.productName}</h5>
                          <p className="text-xs text-gray-600 mt-1"><strong>Reason:</strong> {ret.reason}</p>
                          <p className="text-xs text-gray-500 italic mt-0.5">"{ret.description}"</p>
                        </div>

                        {ret.imageUrl && (
                          <div className="pt-2">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold mb-1">Evidence Image Uploaded:</span>
                            <img src={ret.imageUrl} alt="Return proof" className="w-16 h-16 rounded-xl object-cover border border-gray-300 shadow-sm cursor-pointer hover:opacity-80" onClick={() => window.open(ret.imageUrl, '_blank')} />
                          </div>
                        )}

                        {ret.adminNote && (
                          <div className={`p-3.5 rounded-xl border text-xs mt-3 ${
                            ret.status === 'Rejected'
                              ? 'bg-red-50 border-red-200 text-red-800'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          }`}>
                            <strong>Showroom Feedback:</strong> {ret.adminNote}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Interactive visual pipeline Order Track Modal */}
      <AnimatePresence>
        {trackingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white text-[#111] rounded-3xl shadow-2xl p-8 border border-gray-200"
            >
              <button
                onClick={() => setTrackingOrder(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-black transition p-2 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-8 border-b border-gray-100 pb-6">
                <h3 className="font-cinzel text-2xl font-extrabold text-[#111] mt-1">TRACK ORDER {trackingOrder.order_id}</h3>
                <span className="text-xs text-gray-400 font-mono tracking-wider">Encrypted Tracking Ref: {trackingOrder.trackingNumber}</span>
              </div>

              {/* Graphical Step Pipeline */}
              {trackingOrder.orderStatus === 'Payment Verification Pending' ? (
                <div className="text-center py-10 px-4 space-y-4">
                  <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto text-yellow-600 border border-yellow-200 animate-pulse">
                    <Clock className="w-8 h-8" />
                  </div>
                  <h4 className="font-cinzel font-bold text-lg text-yellow-700">Payment Verification Pending</h4>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    We are currently verifying your payment screenshot. Please check back in 1 hour. Once verified, tracking details will be shown here.
                  </p>
                </div>
              ) : (
                <>
                  <div className="py-8 px-4">
                    <div className="flex items-center justify-between relative">
                      
                      {/* Connecting Line */}
                      <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-200 -translate-y-1/2 z-0" />
                      <div 
                        className="absolute top-1/2 left-0 h-1.5 bg-[#D4AF37] -translate-y-1/2 z-0 transition-all duration-700" 
                        style={{
                          width: trackingOrder.orderStatus === 'Delivered' ? '100%' :
                                 trackingOrder.orderStatus === 'Shipped' ? '66%' :
                                 (trackingOrder.orderStatus === 'Processing' || trackingOrder.orderStatus === 'Packed' || trackingOrder.orderStatus === 'Payment Approved') ? '33%' : '0%'
                        }}
                      />

                      {[
                        { step: 'Placed', label: 'Order Secured', icon: CheckCircle },
                        { step: 'Processing', label: 'Packaging', icon: Clock },
                        { step: 'Shipped', label: 'Shipped', icon: Truck },
                        { step: 'Delivered', label: 'Customer Received', icon: CheckCircle },
                      ].map((st, idx) => {
                        const isReached = trackingOrder.orderStatus === 'Delivered' || 
                                          (trackingOrder.orderStatus === 'Shipped' && idx <= 2) ||
                                          ((trackingOrder.orderStatus === 'Processing' || trackingOrder.orderStatus === 'Packed' || trackingOrder.orderStatus === 'Payment Approved') && idx <= 1) ||
                                          idx === 0;

                        return (
                          <div key={st.step} className="relative z-10 flex flex-col items-center group">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition duration-500 ${
                              isReached ? 'bg-[#111111] text-[#D4AF37] border-2 border-[#D4AF37] scale-110' : 'bg-white text-gray-400 border-2 border-gray-300'
                            }`}>
                              {idx + 1}
                            </div>
                            <span className={`text-[11px] font-extrabold tracking-wider mt-2 max-w-[80px] text-center ${isReached ? 'text-[#111]' : 'text-gray-400'}`}>
                              {st.label}
                            </span>
                          </div>
                        );
                      })}

                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-xs text-gray-700 space-y-3 leading-relaxed">
                    <p><strong>Concierge Delivery Note:</strong> Your precious handloom items are packaging or in transit. {trackingOrder.orderStatus === 'Delivered' ? 'Package has been delivered successfully. Thank you!' : 'Delivery status is updated in real-time.'}</p>
                    
                    {/* Shiprocket Live Tracking Integration */}
                    <div className="bg-[#111111] text-white p-5 rounded-2xl border border-[#D4AF37]/40 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-cinzel">
                          <Truck className="w-4 h-4" />
                          <span>SHIPROCKET COURIER DISPATCH</span>
                        </div>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full font-bold border border-emerald-500/40">
                          Live Sync Active
                        </span>
                      </div>
                      <p className="text-xs text-gray-300">
                        Partner: <strong className="text-white">BlueDart / Delhivery Priority Air</strong> • AWB: <code className="text-[#D4AF37] font-mono">{trackingOrder.trackingNumber || `SR-${trackingOrder.order_id}`}</code>
                      </p>
                      <a
                        href={`https://shiprocket.co/tracking/${trackingOrder.trackingNumber || trackingOrder.order_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-amber-400 text-[#111] font-bold text-xs px-4 py-2.5 rounded-xl uppercase transition tracking-wider shadow cursor-pointer"
                      >
                        <span>Track on Shiprocket Dashboard</span>
                        <Truck className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Return System automated form modal */}
      <AnimatePresence>
        {returnModalOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white text-[#111] rounded-3xl shadow-2xl p-8 border border-gray-200 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-red-600 uppercase font-cinzel block">CONCIERGE MODULE</span>
                  <h3 className="font-cinzel text-xl font-bold text-[#111]">REQUEST RETURN / EXCHANGE</h3>
                </div>
                <button onClick={() => setReturnModalOrder(null)} className="p-1 hover:bg-gray-100 rounded-full cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateReturn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Select Masterpiece Item *</label>
                  <select
                    value={returnItemName}
                    onChange={(e) => setReturnItemName(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  >
                    {returnModalOrder.items.map((it, idx) => (
                      <option key={idx} value={it.product.name}>
                        {it.product.name} ({it.selectedSize}, {it.selectedColor})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Concierge Reason *</label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  >
                    <option value="Size/Fit Issue">Size or Fit Preference Adjustment</option>
                    <option value="Color Discrepancy">Color or Exquisite Palette Verification</option>
                    <option value="Fabric/Fall Defect">Fabric Weave or Fall Picot Adjustment</option>
                    <option value="Different Creation Received">Different Showroom Creation Handed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Detailed Concierge Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide specific details regarding measurement variations or weave alignment so our master artisans can rectify immediately..."
                    value={returnDescription}
                    onChange={(e) => setReturnDescription(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                    Upload Defective/Evidence Image *
                  </label>

                  {!returnImagePreview ? (
                    <div
                      onClick={() => returnFileInputRef.current?.click()}
                      className="border-2 border-dashed border-red-200 rounded-2xl p-6 text-center cursor-pointer hover:border-red-400 hover:bg-red-50/10 transition"
                    >
                      <Upload className="w-8 h-8 text-red-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-gray-700">Click to upload return proof image</p>
                      <p className="text-[11px] text-gray-400 mt-1">JPG, PNG, WEBP — Max 5MB</p>
                      <input
                        ref={returnFileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
                            setReturnUploadError('Only JPG, PNG, or WEBP images are accepted.');
                            return;
                          }
                          if (file.size > 5 * 1024 * 1024) {
                            setReturnUploadError('Image must be under 5MB.');
                            return;
                          }
                          setReturnUploadError(null);
                          setReturnImageFile(file);
                          setReturnImagePreview(URL.createObjectURL(file));
                        }}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden border-2 border-red-300 bg-red-50/10 p-2">
                      <img src={returnImagePreview} alt="Return proof preview" className="w-full max-h-48 object-contain rounded-xl" />
                      <button
                        type="button"
                        onClick={() => {
                          setReturnImageFile(null);
                          setReturnImagePreview(null);
                          setReturnUploadError(null);
                          if (returnFileInputRef.current) returnFileInputRef.current.value = '';
                        }}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition shadow"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {returnUploadError && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {returnUploadError}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 flex gap-3">
                  <button
                    type="submit"
                    disabled={returnUploading}
                    className="w-full bg-[#111111] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition duration-300 py-4 rounded-xl font-cinzel font-bold text-xs tracking-widest uppercase shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    {returnUploading ? 'Uploading Evidence...' : 'SUBMIT RETURN REQUEST'}
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invoice Modal Box */}
      <AnimatePresence>
        {invoiceOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl bg-white text-[#111] rounded-3xl shadow-2xl p-8 sm:p-12 border-2 border-[#D4AF37] overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-start border-b-2 border-[#111] pb-6 mb-6">
                <div>
                  <h2 className="font-cinzel text-2xl font-black tracking-wider text-[#111]">JEEV RUTHI COLLECTION</h2>
                  <p className="text-xs text-gray-500 font-mono mt-1">Official Master Handloom Invoice Slip</p>
                </div>
                <div className="text-right font-mono text-xs">
                  <div className="font-bold text-[#D4AF37] text-sm">{invoiceOrder.order_id}</div>
                  <div className="text-gray-500">{invoiceOrder.date}</div>
                  <div className="text-emerald-700 font-bold mt-1">✔ PAID AUTHENTICATED</div>
                </div>
              </div>

              {/* Bill to */}
              <div className="grid grid-cols-2 gap-6 mb-8 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <div>
                  <span className="font-cinzel font-bold text-gray-400 block uppercase">Billed To Customer:</span>
                  <strong className="text-sm text-[#111] block mt-1">{invoiceOrder.customer.fullName}</strong>
                  <p>{invoiceOrder.customer.addressLine}</p>
                  <p>{invoiceOrder.customer.city}, {invoiceOrder.customer.state} - {invoiceOrder.customer.pincode}</p>
                </div>
                <div className="text-right">
                  <span className="font-cinzel font-bold text-gray-400 block uppercase">Showroom Signature:</span>
                  <p className="mt-1 font-mono">UPI ID: sujithjai007-2@oksbi</p>
                  <p>GSTIN: 07AAACJ2026R1ZK</p>
                </div>
              </div>

              {/* Items table */}
              <table className="w-full text-left border-collapse mb-8 text-xs">
                <thead>
                  <tr className="bg-[#111] text-[#D4AF37] font-cinzel tracking-wider">
                    <th className="p-3 rounded-l-xl">Creation Description</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Showroom Offer</th>
                    <th className="p-3 text-right rounded-r-xl">Amount Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {invoiceOrder.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-3">
                        <strong className="block text-sm text-gray-900">{it.product.name}</strong>
                        <span className="text-[10px] text-gray-500">Size: {it.selectedSize} • Palette: {it.selectedColor}</span>
                      </td>
                      <td className="p-3 font-mono font-bold">{it.quantity}</td>
                      <td className="p-3 font-mono">₹{it.product.offer_price.toLocaleString('en-IN')}</td>
                      <td className="p-3 font-mono font-bold text-right">₹{(it.product.offer_price * it.quantity).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t-2 border-gray-200 pt-4 flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-bold text-gray-500">Authorized by Vercel Certified PDF Workers</span>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm font-black">Grand Total: <strong className="text-xl text-[#D4AF37] font-mono">₹{invoiceOrder.totalAmount.toLocaleString('en-IN')}</strong></div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-4">
                <button
                  onClick={() => window.print()}
                  className="bg-[#111111] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition px-8 py-3.5 rounded-xl font-bold text-xs uppercase shadow cursor-pointer"
                >
                  PRINT / DOWNLOAD INVOICE PDF
                </button>
                <button
                  onClick={() => setInvoiceOrder(null)}
                  className="bg-gray-100 text-gray-800 hover:bg-gray-200 transition px-6 py-3.5 rounded-xl font-bold text-xs uppercase cursor-pointer"
                >
                  DISMISS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add New Address Modal */}
      <AnimatePresence>
        {showAddAddress && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white text-[#111] rounded-3xl shadow-2xl p-8 border border-gray-200 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="font-cinzel text-xl font-bold text-[#111]">SAVE NEW SANCTUARY</h3>
                <button onClick={() => setShowAddAddress(false)} className="p-1 cursor-pointer">✕</button>
              </div>

              <form onSubmit={handleSaveNewAddress} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Full Name *</label>
                  <input type="text" required value={addrFullName} onChange={e => setAddrFullName(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl text-xs" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Mobile *</label>
                    <input type="tel" required value={addrMobile} onChange={e => setAddrMobile(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl text-xs font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Email *</label>
                    <input type="email" required value={addrEmail} onChange={e => setAddrEmail(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl text-xs font-mono" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Street Address & Mansion Suite *</label>
                  <input type="text" required value={addrLine} onChange={e => setAddrLine(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl text-xs" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">City *</label>
                    <input type="text" required value={addrCity} onChange={e => setAddrCity(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">State *</label>
                    <input type="text" required value={addrState} onChange={e => setAddrState(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Pincode *</label>
                    <input type="text" required value={addrPincode} onChange={e => setAddrPincode(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl text-xs font-mono" />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="submit" className="w-full bg-[#111] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition py-3.5 rounded-xl text-xs font-cinzel font-bold tracking-widest uppercase shadow cursor-pointer">
                    AUTHORIZE SAVED ADDRESS
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
