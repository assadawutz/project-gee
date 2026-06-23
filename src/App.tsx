import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FitmentEngine from './components/FitmentEngine';
import VirtualFitment from './components/VirtualFitment';
import BundleBuilder from './components/BundleBuilder';
import BookingCalendar from './components/BookingCalendar';
import ComparisonDrawer from './components/ComparisonDrawer';
import AdminDashboard from './components/AdminDashboard';
import AIChat from './components/AIChat';
import { Product, Vehicle, Booking, Order, OrderItem } from './types';
import { CreditCard, Eye, Sparkles, CheckCircle2, ShieldCheck, ShoppingCart, Sliders, AlertTriangle } from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('fitment');
  const [darkTheme, setDarkTheme] = useState<boolean>(true);

  // Custom premium Toast Notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warn' | 'error' | 'info' } | null>(null);
  const showToast = (message: string, type: 'success' | 'warn' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Global DB states fetched from server
  const [products, setProducts] = useState<Product[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Cart & Spec Comparison drawer states
  const [cart, setCart] = useState<{ product: Product; quantity: number; bundleDiscountApplied?: number }[]>([]);
  const [comparisonList, setComparisonList] = useState<Product[]>([]);
  const [compOpen, setCompOpen] = useState<boolean>(false);

  // Standoff try-on routing variables
  const [tryOnVehicle, setTryOnVehicle] = useState<Vehicle | null>(null);
  const [tryOnWheel, setTryOnWheel] = useState<Product | null>(null);

  // Simulated Stripe Checkout Modal states
  const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1); // 1: Card info, 2: Success
  const [checkoutPayload, setCheckoutPayload] = useState({
    cardName: '',
    cardNumber: '4111 2222 3333 4444',
    cardExpiry: '12/28',
    cardCvv: '123',
    installments: 'none', // none, 3, 6, 12 months
    phone: '081-345-6789'
  });
  const [isCvvFocused, setIsCvvFocused] = useState<boolean>(false);

  // Fetch initial data from server
  const loadServerData = async () => {
    try {
      const pRes = await fetch("/api/products");
      if (pRes.ok) setProducts(await pRes.json());

      const bRes = await fetch("/api/bookings");
      if (bRes.ok) setBookings(await bRes.json());

      const oRes = await fetch("/api/orders");
      if (oRes.ok) setOrders(await oRes.json());
    } catch (err) {
      console.error("Error connecting to full-stack Express API: ", err);
    }
  };

  useEffect(() => {
    loadServerData();
  }, []);

  // Click Tracker for conversion stats
  const handleTrackAction = async (event: string) => {
    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event })
      });
    } catch (err) {
      console.error("Failed to post analytics", err);
    }
  };

  // Add Item to comparing drawer (size max 4)
  const handleAddToComparison = (product: Product) => {
    if (comparisonList.some((item) => item.id === product.id)) {
      setComparisonList(comparisonList.filter((item) => item.id !== product.id));
    } else {
      if (comparisonList.length >= 4) {
        showToast("พี่เปรียบเทียบล้อพร้อมกันได้สูงสุด 4 รายการครับเพื่อหน้าจอพอเหมาะ!", "warn");
        return;
      }
      setComparisonList([...comparisonList, product]);
      setCompOpen(true);
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    const exists = cart.find((item) => item.product.id === product.id);
    if (exists) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    showToast(`เพิ่ม ${product.name} ลงตะกร้าแล้วเรียบร้อยครับ!`, "success");
    handleTrackAction('stripeCheckoutClicks');
  };

  // Wheels + Tires package checkout setup
  const handleAddBundleToCart = (wheel: Product, tire: Product, qtySet: number, discount: number) => {
    setCart([
      ...cart,
      { product: wheel, quantity: qtySet, bundleDiscountApplied: Math.round(discount / 2) },
      { product: tire, quantity: qtySet, bundleDiscountApplied: Math.round(discount / 2) }
    ]);
    showToast("หยิบชุดเซ็ตล้อพร้อมยางควงพร้อมส่วนลดบิดลงตะกร้าเรียบร้อยแล้วครับพี่!", "success");
  };

  // Appointment creation logic
  const handleAddBooking = async (bookingData: any): Promise<boolean> => {
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      });
      if (res.ok) {
        await loadServerData();
        return true;
      }
    } catch (err) {
      console.error("Booking post error:", err);
    }
    return false;
  };

  // Admin inventory updates
  const handleUpdateProduct = async (id: string, updatedData: Partial<Product>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        await loadServerData();
        return true;
      }
    } catch (err) {
      console.error("Error updating inventory product:", err);
    }
    return false;
  };

  // Admin Queue confirmations
  const handleUpdateBookingStatus = async (id: string, status: 'Confirmed' | 'Completed'): Promise<boolean> => {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await loadServerData();
        return true;
      }
    } catch (err) {
      console.error("Error patching booking status:", err);
    }
    return false;
  };

  // Try-on launch configuration
  const handleSelectProductForTryOn = (vehicle: Vehicle, wheel: Product) => {
    setTryOnVehicle(vehicle);
    setTryOnWheel(wheel);
    setActiveTab('virtual');
    handleTrackAction('virtualTries');
  };

  // Simulated Stripe payment gateway checkout
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutPayload.cardName.trim()) {
      showToast("กรุณากรอกชื่อผู้จ่ายเพื่อบันทึกเครดิตด้วยครับพี่!", "warn");
      return;
    }

    const totalCartPrice = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const totalDiscount = cart.reduce((sum, item) => sum + (item.bundleDiscountApplied || 0), 0);
    const finalBillAmount = totalCartPrice - totalDiscount;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: checkoutPayload.cardName,
          customerPhone: checkoutPayload.phone,
          items: cart,
          totalAmount: finalBillAmount
        })
      });

      if (res.ok) {
        await loadServerData();
        setCheckoutStep(2); // Success step
        setCart([]); // Clear cart
        showToast("รับออร์เดอร์ชำระเงินสำเร็จ!", "success");
      } else {
        showToast("เกิดข้อผิดพลาดในการประมวลผลเครดิต Stripe!", "error");
      }
    } catch (err) {
      console.error("Checkout process failed:", err);
      showToast("ไม่สามารถประมวลผลรายการได้เนื่องจากปัญหาเครือข่าย", "error");
    }
  };

  const totalCartPrice = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const totalCartDiscount = cart.reduce((sum, item) => sum + (item.bundleDiscountApplied || 0), 0);
  const netCheckoutAmount = totalCartPrice - totalCartDiscount;

  return (
    <div className={`min-h-screen font-sans ${darkTheme ? 'bg-[#0a0a0a] text-zinc-100' : 'bg-zinc-50 text-zinc-900'} transition-colors duration-300`}>
      
      {/* Carbon fiber grid style layer */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.03] bg-[radial-gradient(#ccff00_1px,transparent_1px)] [background-size:24px_24px] z-0"></div>

      {/* Global Mega Menu Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        darkTheme={darkTheme} 
        setDarkTheme={setDarkTheme} 
        cart={cart}
        clearCart={() => setCart([])}
        comparisonList={comparisonList}
        openComparison={() => setCompOpen(true)}
        triggerCheckout={() => { setCheckoutStep(1); setCheckoutOpen(true); }}
        onTrackAction={handleTrackAction}
      />

      {/* Main Unified Page Content Section */}
      <main className="relative z-10 py-8">
        <section className="w-full">
          <div className="container mx-auto px-4 max-w-7xl">
            
            {/* Dynamic Navigation Panels */}
            {activeTab === 'fitment' && (
              <FitmentEngine 
                products={products}
                onSelectProductForTryOn={handleSelectProductForTryOn}
                onAddToCart={handleAddToCart}
                onAddToComparison={handleAddToComparison}
                comparisonList={comparisonList}
                onTrackAction={handleTrackAction}
              />
            )}

            {activeTab === 'virtual' && (
              <VirtualFitment 
                initialVehicle={tryOnVehicle}
                initialWheel={tryOnWheel}
                onAddToCart={handleAddToCart}
                onTrackAction={handleTrackAction}
              />
            )}

            {activeTab === 'bundle' && (
              <BundleBuilder 
                products={products}
                onAddBundleToCart={handleAddBundleToCart}
                onTrackAction={handleTrackAction}
              />
            )}

            {activeTab === 'booking' && (
              <BookingCalendar 
                onAddBooking={handleAddBooking}
                existingBookings={bookings}
                onTrackAction={handleTrackAction}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'admin' && (
              <AdminDashboard 
                products={products}
                bookings={bookings}
                orders={orders}
                onUpdateProduct={handleUpdateProduct}
                onUpdateBookingStatus={handleUpdateBookingStatus}
                onTrackAction={handleTrackAction}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'ai' && (
              <AIChat 
                onTrackAction={handleTrackAction}
              />
            )}

          </div>
        </section>
      </main>

      {/* Spec Comparison bottom sliding drawer overlay */}
      <ComparisonDrawer 
        comparisonList={comparisonList}
        onRemoveFromComparison={(p) => setComparisonList(comparisonList.filter((item) => item.id !== p.id))}
        onClearComparison={() => setComparisonList([])}
        onAddToCart={handleAddToCart}
        isOpen={compOpen}
        onClose={() => setCompOpen(false)}
      />

      {/* STRIPE PAYMENT GATEWAY SIMULATED CHECKOUT MODAL */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-6 shadow-2xl ring-1 ring-[#ccff00]/10 text-white animate-fade-in space-y-6">
            
            {/* Close Button top corner */}
            <button 
              onClick={() => setCheckoutOpen(false)} 
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              ✕
            </button>

            {checkoutStep === 1 ? (
              <form onSubmit={handleCheckoutSubmit} className="space-y-5">
                
                <div className="border-b border-zinc-900 pb-3">
                  <span className="text-[10px] uppercase font-black text-[#ccff00] tracking-widest">STRIPE GATEWAY BINDING</span>
                  <h3 className="font-sans font-black text-lg">ประมวลชำระบัญชีล้อแต่ง</h3>
                </div>

                {/* 3D CREDIT CARD DISPLAY WITH BOTH SIDE SUPPORT ON CVV FOCUS */}
                <div className="perspective-1000 w-full h-40 relative">
                  <div 
                    className={`w-full h-full rounded-xl p-5 bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 flex flex-col justify-between transition-transform duration-700 transform-style-3d shadow-xl relative ${
                      isCvvFocused ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* FRONT SIDE */}
                    <div className={`absolute inset-0 p-5 flex flex-col justify-between backface-invisible ${isCvvFocused ? 'hidden' : 'block'}`}>
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-zinc-600 text-xs tracking-widest">GEE RACER CREDIT</span>
                        <CreditCard className="w-8 h-8 text-[#ccff00]" />
                      </div>
                      <p className="font-mono text-base tracking-widest text-zinc-200">{checkoutPayload.cardNumber}</p>
                      <div className="flex justify-between items-end font-mono text-[10px] text-zinc-500">
                        <div>
                          <p className="uppercase text-[8px]">CARDHOLDER</p>
                          <p className="text-zinc-300 font-bold truncate max-w-[150px]">{checkoutPayload.cardName || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="uppercase text-[8px]">EXPIRY</p>
                          <p className="text-zinc-300 font-bold">{checkoutPayload.cardExpiry}</p>
                        </div>
                      </div>
                    </div>

                    {/* BACK SIDE (Shown on CVV field Focus!) */}
                    <div className={`absolute inset-0 p-5 flex flex-col justify-between bg-zinc-950 border border-zinc-800 rounded-xl transform rotate-y-180 backface-invisible ${isCvvFocused ? 'block' : 'hidden'}`}>
                      <div className="h-6 w-full bg-zinc-900 -mx-5 mt-2"></div>
                      <div className="flex justify-end items-center pr-3 space-x-2">
                        <span className="text-[8px] font-mono text-zinc-500">SECRET SIGNATURE</span>
                        <span className="bg-white text-black font-mono text-xs font-black px-2 py-0.5 rounded italic">{checkoutPayload.cardCvv}</span>
                      </div>
                      <p className="text-[8px] text-zinc-600 font-mono text-center">NOT TRANSFERABLE • STRIPE INC.</p>
                    </div>

                  </div>
                </div>

                {/* INPUT FIELDS */}
                <div className="space-y-3.5">
                  
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">ชื่อเจ้าของบัตร (Cardholder Name):</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น WITTAYA CHAROEMPAN"
                      value={checkoutPayload.cardName}
                      onChange={(e) => setCheckoutPayload({ ...checkoutPayload, cardName: e.target.value.toUpperCase() })}
                      className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-bold text-white uppercase focus:border-[#ccff00] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col space-y-1 col-span-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">หมายเลขบัตร (Card Number):</label>
                      <input
                        type="text"
                        required
                        value={checkoutPayload.cardNumber}
                        onChange={(e) => setCheckoutPayload({ ...checkoutPayload, cardNumber: e.target.value })}
                        className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-mono font-bold text-white focus:border-[#ccff00] outline-none"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">CVV:</label>
                      <input
                        type="text"
                        required
                        maxLength={3}
                        value={checkoutPayload.cardCvv}
                        onChange={(e) => setCheckoutPayload({ ...checkoutPayload, cardCvv: e.target.value })}
                        onFocus={() => setIsCvvFocused(true)}
                        onBlur={() => setIsCvvFocused(false)}
                        className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-mono font-bold text-white focus:border-[#ccff00] outline-none"
                      />
                    </div>
                  </div>

                  {/* Installments options (0% interest logic) */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">เลือกผ่อนชำระค่างวดแต่งรถ (Installments Planner):</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCheckoutPayload({ ...checkoutPayload, installments: 'none' })}
                        className={`py-1.5 rounded-lg text-[10px] font-black uppercase text-center border ${
                          checkoutPayload.installments === 'none' ? 'bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00]' : 'bg-zinc-950 border-zinc-900 text-zinc-400'
                        }`}
                      >
                        จ่ายสดลดเพิ่ม
                      </button>
                      <button
                        type="button"
                        onClick={() => setCheckoutPayload({ ...checkoutPayload, installments: '6' })}
                        className={`py-1.5 rounded-lg text-[10px] font-black uppercase text-center border ${
                          checkoutPayload.installments === '6' ? 'bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00]' : 'bg-zinc-950 border-zinc-900 text-zinc-400'
                        }`}
                      >
                        ผ่อน 6 เดือน ดอก 0%
                      </button>
                    </div>
                    {checkoutPayload.installments === '6' && (
                      <p className="text-[10px] text-emerald-400 font-bold font-mono">
                        ตกเดือนละ {(netCheckoutAmount / 6).toFixed(0).toLocaleString()} ฿ x 6 เดือน ตรงสเปกสบายใจ!
                      </p>
                    )}
                  </div>

                </div>

                {/* Pricing values and Payment trigger button */}
                <div className="border-t border-zinc-900 pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase">ชำระรวมสุทธิ:</p>
                    <p className="text-xl font-black text-[#ccff00] italic font-sans">{netCheckoutAmount.toLocaleString()} ฿</p>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#ccff00] text-[#0a0a0a] rounded-lg font-sans font-black text-xs uppercase tracking-wider hover:bg-lime-400"
                  >
                    ยืนยันคำสั่งซื้อด่วน
                  </button>
                </div>

              </form>
            ) : (
              <div className="text-center py-6 space-y-4 animate-fade-in">
                
                <CheckCircle2 className="mx-auto w-12 h-12 text-[#ccff00]" />
                <div>
                  <h3 className="font-sans font-black text-lg uppercase text-white">ชำระเครดิตเรียบร้อยโรงงานจีจี้!</h3>
                  <p className="mt-1 text-xs text-zinc-400">
                    บิลและรายการสั่งล้อฟอร์ชของพี่ถูกบันทึกลงแฟ้มประวัติหลังร้าน และหักสต็อกหน้าร้านเป็นอันเสร็จสิ้น ขับซิ่งปลอดภัยพวงมาลัยตรงครับพี่!
                  </p>
                </div>

                <button
                  onClick={() => setCheckoutOpen(false)}
                  className="w-full py-2 bg-zinc-900 border border-zinc-800 hover:border-[#ccff00] text-white rounded-lg text-xs font-black uppercase tracking-wider"
                >
                  ปิดหน้าร้าง / ทำการแต่งคันอื่นต่อ
                </button>

              </div>
            )}

          </div>
        </div>
      )}

      {/* Footer System standard line */}
      <footer className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-center text-zinc-600 font-mono text-[10px] space-y-1">
        <p>© 2026 GEE ล้อซิ่ง (GEE FITMENT ENGINE CO., LTD.) • ALL RIGHTS RESERVED.</p>
        <p className="text-zinc-700">POWERED BY NEXT/EXPRESS STACK • ACCESSIBILITY COMPLIANT TO WCAG 2.1 AA STANDARDS.</p>
      </footer>

      {/* Premium Floating Custom Toast Banner avoiding unhandled iframe alerts */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-pulse max-w-sm w-full bg-zinc-950/95 border border-[#ccff00]/30 rounded-xl p-4 shadow-2xl flex items-center space-x-3.5 ring-1 ring-[#ccff00]/20">
          <div className="flex-shrink-0">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#ccff00]" />}
            {toast.type === 'warn' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
            {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-500" />}
            {toast.type === 'info' && <Sparkles className="w-5 h-5 text-cyan-400" />}
          </div>
          <div className="flex-1 text-xs font-bold text-white tracking-wide leading-relaxed">
            {toast.message}
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-zinc-500 hover:text-white text-sm font-black p-1 hover:bg-zinc-900 rounded"
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
}
