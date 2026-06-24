import React, { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import Landing from "./components/Landing";
import FitmentEngine from "./components/FitmentEngine";
import VirtualFitment from "./components/VirtualFitment";
import BookingCalendar from "./components/BookingCalendar";
import ComparisonDrawer from "./components/ComparisonDrawer";
import AdminDashboard from "./components/AdminDashboard";
import AIChat from "./components/AIChat";
import UserDashboard from "./components/UserDashboard";
import {
  Product,
  Vehicle,
  Booking,
  Order,
  OrderItem,
  UserProfile,
} from "./types";
import { mockVehicles, mockProducts } from "./data/mockData";
import {
  CreditCard,
  Eye,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ShoppingCart,
  Sliders,
  AlertTriangle,
  Heart,
  Bell,
  Mail,
  User,
  QrCode,
  Smartphone,
  Download,
  Package,
} from "lucide-react";

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>("landing");
  const [wizardStep, setWizardStep] = useState<"fitment" | "virtual" | "bundle">("fitment");
  const [darkTheme, setDarkTheme] = useState<boolean>(true);

  // User Auth Mock State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleMockLogin = (role: "user" | "admin") => {
    setUser({
      id: "u_" + Date.now(),
      email: role === "admin" ? "admin@gee.com" : "assadawut.sarakul@gmail.com",
      name: role === "admin" ? "GEE Admin" : "Assadawut S.",
      role: role,
      geeCoins: 4500,
      totalSpend: 155000,
      membershipTier: "Gold",
      wishlist: [],
      savedVehicles: [
        {
          id: "v_civic_fl5",
          brand: "Honda",
          model: "Civic Type R",
          year: "2023",
          subModel: "FL5 (2.0 Turbo VTEC)",
          pcd: "5x120",
          cb: "64.1",
          boltPattern: "M14x1.5",
          image: "/src/assets/images/civic_fl5_profile_1782224461816.jpg",
        },
      ],
      orders: [
        {
          id: "ORD-89240",
          customerName: "Assadawut S.",
          customerPhone: "081-234-5678",
          items: [
            {
              product: products.find((p) => p.id === "w_te37_saga") || {
                id: "w_te37_saga",
                name: "Volk Racing TE37 Saga S-Plus",
                price: 32000,
                type: "wheel",
                brand: "Rays",
                stock: 12,
                image: "",
                description: "",
              },
              quantity: 4,
            },
          ],
          totalAmount: 128000,
          paymentStatus: "Paid",
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        },
      ],
      bookings: [
        {
          id: "BK-1002",
          customerName: "Assadawut S.",
          customerPhone: "081-234-5678",
          vehicleInfo: "Honda Civic Type R (FL5)",
          date: new Date(Date.now() + 86400000 * 2).toISOString(),
          timeSlot: "10:30 - 12:00",
          servicesSelected: [
            "4-Wheel Mounting & Static Balancing (ติดตั้ง+ถ่วงล้อ 4 วง)",
          ],
          totalPrice: 1200,
          status: "Confirmed",
        },
      ],
    });
    setIsLoginModalOpen(false);
    showToast("เข้าสู่ระบบสำเร็จ ยินดีต้อนรับครับพี่!", "success");
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab("fitment");
    showToast("ออกจากระบบสำเร็จ ไว้เจอกันใหม่ครับพี่", "info");
  };

  // Favorites/Wishlist state persisted to local storage
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gee_wishlist");
      try {
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Out of stock subscription states
  const [backInStockProduct, setBackInStockProduct] = useState<Product | null>(
    null,
  );
  const [subscriptionEmail, setSubscriptionEmail] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("gee_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const handleToggleWishlist = (product: Product) => {
    if (wishlist.some((item) => item.id === product.id)) {
      setWishlist(wishlist.filter((item) => item.id !== product.id));
      showToast(`นำ ${product.name} ออกจากวิชลิสต์โปรดของพี่แล้วครับ`, "info");
    } else {
      setWishlist([...wishlist, product]);
      showToast(
        `บันทึก ${product.name} ลงในรายการโปรดเรียบร้อยครับ!`,
        "success",
      );
    }
    handleTrackAction("wishlistToggles");
  };

  // Custom premium Toast Notification state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "warn" | "error" | "info";
  } | null>(null);
  const showToast = (
    message: string,
    type: "success" | "warn" | "error" | "info" = "info",
  ) => {
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
  const [cart, setCart] = useState<
    { product: Product; quantity: number; bundleDiscountApplied?: number }[]
  >([]);
  const [comparisonList, setComparisonList] = useState<Product[]>([]);
  const [compOpen, setCompOpen] = useState<boolean>(false);

  // Standoff try-on routing variables
  const [tryOnVehicle, setTryOnVehicle] = useState<Vehicle | null>(null);
  const [tryOnWheel, setTryOnWheel] = useState<Product | null>(null);
  const [tryOnTire, setTryOnTire] = useState<Product | null>(null);

  const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1); // 1: Shipping, 2: Payment, 3: Success
  const [paymentMethod, setPaymentMethod] = useState<"card" | "qr">("card");
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [checkoutPayload, setCheckoutPayload] = useState({
    cardName: "",
    cardNumber: "4111 2222 3333 4444",
    cardExpiry: "12/28",
    cardCvv: "123",
    installments: "none", // none, 3, 6, 12 months
    phone: "081-345-6789",
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
        body: JSON.stringify({ event }),
      });
    } catch (err) {
      console.error("Failed to post analytics", err);
    }
  };

  // Add Item to comparing drawer (size max 4)
  const handleAddToComparison = (product: Product) => {
    if (comparisonList.some((item) => item.id === product.id)) {
      setComparisonList(
        comparisonList.filter((item) => item.id !== product.id),
      );
    } else {
      if (comparisonList.length >= 4) {
        showToast(
          "พี่เปรียบเทียบล้อพร้อมกันได้สูงสุด 4 รายการครับเพื่อหน้าจอพอเหมาะ!",
          "warn",
        );
        return;
      }
      setComparisonList([...comparisonList, product]);
      setCompOpen(true);
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) {
      setBackInStockProduct(product);
      showToast(
        `สินค้า ${product.name} หมดชั่วคราวครับ เปิดฟอร์มลงชื่อรับการแจ้งเตือนเมื่อของเข้าเรียบร้อยครับ!`,
        "warn",
      );
      return;
    }
    const exists = cart.find((item) => item.product.id === product.id);
    if (exists) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    showToast(`เพิ่ม ${product.name} ลงตะกร้าแล้วเรียบร้อยครับ!`, "success");
    handleTrackAction("stripeCheckoutClicks");
  };

  // Wheels + Tires package checkout setup
  const handleAddBundleToCart = (
    wheel: Product,
    tire: Product,
    qtySet: number,
    discount: number,
  ) => {
    setCart([
      ...cart,
      {
        product: wheel,
        quantity: qtySet,
        bundleDiscountApplied: Math.round(discount / 2),
      },
      {
        product: tire,
        quantity: qtySet,
        bundleDiscountApplied: Math.round(discount / 2),
      },
    ]);
    showToast(
      "หยิบชุดเซ็ตล้อพร้อมยางควงพร้อมส่วนลดบิดลงตะกร้าเรียบร้อยแล้วครับพี่!",
      "success",
    );
  };

  // Appointment creation logic
  const handleAddBooking = async (bookingData: any): Promise<boolean> => {
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
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
  const handleUpdateProduct = async (
    id: string,
    updatedData: Partial<Product>,
  ): Promise<boolean> => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
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
  const handleUpdateBookingStatus = async (
    id: string,
    status: "Confirmed" | "Completed",
  ): Promise<boolean> => {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
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
  const handleSelectProductForTryOn = (
    vehicle: Vehicle,
    wheel: Product,
    tire?: Product,
  ) => {
    setTryOnVehicle(vehicle);
    setTryOnWheel(wheel);
    if (tire) setTryOnTire(tire);
    setActiveTab("virtual");
    handleTrackAction("virtualTries");
  };

  // Back in stock alerts subscribe handler
  const handleSubscribeBackInStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriptionEmail || !backInStockProduct) return;

    // Read previous alerts
    const savedAlerts = localStorage.getItem("gee_back_in_stock_alerts");
    let alerts = [];
    try {
      alerts = savedAlerts ? JSON.parse(savedAlerts) : [];
    } catch (err) {
      alerts = [];
    }

    // Check if duplicate
    const isDuplicate = alerts.some(
      (a: any) =>
        a.email === subscriptionEmail && a.productId === backInStockProduct.id,
    );
    if (!isDuplicate) {
      alerts.push({
        id: "alert_" + Date.now(),
        email: subscriptionEmail,
        productId: backInStockProduct.id,
        productName: backInStockProduct.name,
        productBrand: backInStockProduct.brand,
        productImage: backInStockProduct.image,
        timestamp:
          new Date().toLocaleDateString("th-TH") +
          " " +
          new Date().toLocaleTimeString("th-TH"),
      });
      localStorage.setItem("gee_back_in_stock_alerts", JSON.stringify(alerts));
    }

    showToast(
      `ลงทะเบียนรับการแจ้งเตือน ${backInStockProduct.name} สำเร็จ! เราจะส่งเมลหาเมื่อสต็อกมีในหลังร้านครับ`,
      "success",
    );
    setBackInStockProduct(null);
    setSubscriptionEmail("");
  };

  // Simulated Stripe payment gateway checkout
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutPayload.cardName.trim()) {
      showToast("กรุณากรอกชื่อผู้จ่ายเพื่อบันทึกเครดิตด้วยครับพี่!", "warn");
      return;
    }

    const totalCartPrice = cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
    const totalDiscount = cart.reduce(
      (sum, item) => sum + (item.bundleDiscountApplied || 0),
      0,
    );
    const finalBillAmount = totalCartPrice - totalDiscount;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: checkoutPayload.cardName,
          customerPhone: checkoutPayload.phone,
          items: cart,
          totalAmount: finalBillAmount,
        }),
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

  const totalCartPrice = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
  const totalCartDiscount = cart.reduce(
    (sum, item) => sum + (item.bundleDiscountApplied || 0),
    0,
  );
  const netCheckoutAmount = totalCartPrice - totalCartDiscount;

  return (
    <div
      className={`min-h-screen font-sans bg-carbon ${darkTheme ? "dark text-zinc-100" : "light bg-zinc-50 text-zinc-900"} transition-colors duration-300`}
    >
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLoginClick={() => setIsLoginModalOpen(true)}
      />

      {/* Main Unified Page Content Section */}
      <main className="relative z-10 py-8">
        <section className="w-full">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Dynamic Navigation Panels */}
            {activeTab === "profile" && user && (
              <UserDashboard 
                user={user} 
                onLogout={handleLogout} 
                wishlist={wishlist}
                onRemoveFromWishlist={handleToggleWishlist}
                onMoveToCart={handleAddToCart}
              />
            )}

            {activeTab === "landing" && (
              <Landing onStart={() => {
                setActiveTab("wizard");
                setWizardStep("fitment");
              }} />
            )}

            {activeTab === "wizard" && (
              <>
                {/* Wizard Navigation */}
                <div className="flex space-x-2 mb-8 justify-center">
                  {(["fitment", "virtual"] as const).map(step => (
                     <button 
                       key={step} 
                       onClick={() => setWizardStep(step)} 
                       className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${wizardStep === step ? 'bg-[#ff3300] text-black shadow-[0_0_20px_rgba(255,51,0,0.3)]' : 'bg-zinc-900 text-zinc-500 hover:text-white'}`}
                     >
                       {step === "fitment" ? "1. Fitment Logic" : "2. Virtual Preview"}
                     </button>
                  ))}
                </div>

                {wizardStep === "fitment" && (
                  <FitmentEngine
                    products={products}
                    onSelectProductForTryOn={(v, w, t) => {
                      handleSelectProductForTryOn(v, w, t);
                      setWizardStep("virtual");
                    }}
                    onAddToCart={handleAddToCart}
                    onAddBundleToCart={handleAddBundleToCart}
                    onAddToComparison={handleAddToComparison}
                    comparisonList={comparisonList}
                    onTrackAction={handleTrackAction}
                    wishlist={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                    onUpdateProduct={(updatedProduct) => {
                      handleUpdateProduct(updatedProduct.id, { reviews: updatedProduct.reviews });
                    }}
                  />
                )}

                {wizardStep === "virtual" && (
                  <VirtualFitment
                    selectedVehicle={tryOnVehicle || mockVehicles[0]}
                    selectedWheel={tryOnWheel || mockProducts[0]}
                    selectedTire={tryOnTire || mockProducts.find(p => p.type === 'tire') || mockProducts[0]}
                    onClose={() => setWizardStep("fitment")}
                  />
                )}
              </>
            )}

            {activeTab === "booking" && (
              <BookingCalendar
                onAddBooking={handleAddBooking}
                existingBookings={bookings}
                onTrackAction={handleTrackAction}
                onShowToast={showToast}
              />
            )}

            {activeTab === "admin" && user?.role === "admin" && (
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

            {activeTab === "ai" && <AIChat onTrackAction={handleTrackAction} />}
          </div>
        </section>
      </main>

      {/* Spec Comparison bottom sliding drawer overlay */}
      <ComparisonDrawer
        comparisonList={comparisonList}
        onRemoveFromComparison={(p) =>
          setComparisonList(comparisonList.filter((item) => item.id !== p.id))
        }
        onClearComparison={() => setComparisonList([])}
        onAddToCart={handleAddToCart}
        isOpen={compOpen}
        onClose={() => setCompOpen(false)}
      />

      {/* STRIPE PAYMENT GATEWAY SIMULATED CHECKOUT MODAL */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-6 shadow-2xl ring-1 ring-[#ff3300]/10 text-white animate-fade-in space-y-6">
            {/* Close Button top corner */}
            <button
              onClick={() => setCheckoutOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-sans font-black text-xl uppercase italic text-white leading-none">
                  Secure <span className="text-[#ff3300]">Checkout</span>
                </h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                  Powered by Stripe Gateway // GEE CO.
                </p>
              </div>
            </div>

            {/* Multi-Step Flow Tracker */}
            {checkoutStep < 3 && (
              <div className="flex items-center justify-between px-2 mb-8">
                {[
                  { step: 1, label: "Shipping", icon: Package },
                  { step: 2, label: "Payment", icon: CreditCard },
                ].map((s) => (
                  <div key={s.step} className="flex flex-col items-center flex-1 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-500 border-2 ${checkoutStep >= s.step ? 'bg-[#ff3300] border-[#ff3300] text-black shadow-[0_0_15px_rgba(255,51,0,0.4)]' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}>
                      <s.icon className="w-3.5 h-3.5" />
                    </div>
                    <span className={`text-[8px] font-black uppercase mt-2 tracking-widest ${checkoutStep >= s.step ? 'text-[#ff3300]' : 'text-zinc-600'}`}>
                      {s.label}
                    </span>
                    {s.step === 1 && (
                      <div className={`absolute top-4 left-[60%] w-[80%] h-0.5 z-0 ${checkoutStep > 1 ? 'bg-[#ff3300]' : 'bg-zinc-900'}`} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {checkoutStep === 1 ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Full Name</label>
                      <input 
                        type="text" value={shippingInfo.name} onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-[#ff3300]/50"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Phone</label>
                      <input 
                        type="text" value={shippingInfo.phone} onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-[#ff3300]/50"
                        placeholder="081-XXX-XXXX"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Email Address</label>
                    <input 
                      type="email" value={shippingInfo.email} onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-[#ff3300]/50"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Shipping Address</label>
                    <textarea 
                      value={shippingInfo.address} onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-[#ff3300]/50 min-h-[80px]"
                      placeholder="123 Moo 4, Bangkok, Thailand..."
                    />
                  </div>
                </div>

                <div className="bg-zinc-900/50 rounded-2xl p-5 border border-zinc-800 space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-zinc-400">Order Summary</h4>
                  <div className="space-y-2">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px]">
                        <span className="text-zinc-500 font-bold">{item.quantity}x {item.product.name}</span>
                        <span className="text-white font-black italic">{(item.product.price * item.quantity).toLocaleString()} ฿</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-sm">
                      <span className="text-[#ff3300] font-black uppercase italic">Total</span>
                      <span className="text-[#ff3300] font-black italic">{netCheckoutAmount.toLocaleString()} ฿</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setCheckoutStep(2)}
                  className="w-full py-4 bg-[#ff3300] text-black rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-[#ff4500] transition-all shadow-xl shadow-[#ff3300]/10"
                >
                  Continue to Payment
                </button>
              </div>
            ) : checkoutStep === 2 ? (
              <div className="space-y-6">
                {/* Payment Method Tabs */}
                <div className="flex space-x-2">
                   <button 
                    onClick={() => setPaymentMethod("card")}
                    className={`flex-1 py-3 rounded-xl border flex items-center justify-center space-x-2 transition-all ${paymentMethod === "card" ? "bg-[#ff3300]/10 border-[#ff3300] text-[#ff3300]" : "bg-zinc-950 border-zinc-900 text-zinc-500"}`}
                   >
                      <CreditCard className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Card</span>
                   </button>
                   <button 
                    onClick={() => setPaymentMethod("qr")}
                    className={`flex-1 py-3 rounded-xl border flex items-center justify-center space-x-2 transition-all ${paymentMethod === "qr" ? "bg-[#ff3300]/10 border-[#ff3300] text-[#ff3300]" : "bg-zinc-950 border-zinc-900 text-zinc-500"}`}
                   >
                      <QrCode className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">PromptPay</span>
                   </button>
                </div>

                {paymentMethod === "card" ? (
                  <form onSubmit={handleCheckoutSubmit} className="space-y-5">
                    {/* 3D CREDIT CARD DISPLAY */}
                    <div className="perspective-1000 w-full h-40 relative">
                      <div className={`w-full h-full rounded-xl p-5 bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 flex flex-col justify-between transition-transform duration-700 transform-style-3d shadow-xl relative ${isCvvFocused ? "rotate-y-180" : ""}`}>
                        {/* FRONT SIDE */}
                        <div className={`absolute inset-0 p-5 flex flex-col justify-between backface-invisible ${isCvvFocused ? "hidden" : "block"}`}>
                          <div className="flex justify-between items-start">
                            <span className="font-mono text-zinc-600 text-xs tracking-widest">GEE RACER CREDIT</span>
                            <CreditCard className="w-8 h-8 text-[#ff3300]" />
                          </div>
                          <p className="font-mono text-base tracking-widest text-zinc-200">{checkoutPayload.cardNumber}</p>
                          <div className="flex justify-between items-end font-mono text-[10px] text-zinc-500">
                            <div>
                              <p className="uppercase text-[8px]">CARDHOLDER</p>
                              <p className="text-zinc-300 font-bold truncate max-w-[150px]">{checkoutPayload.cardName || "N/A"}</p>
                            </div>
                            <div>
                              <p className="uppercase text-[8px]">EXPIRY</p>
                              <p className="text-zinc-300 font-bold">{checkoutPayload.cardExpiry}</p>
                            </div>
                          </div>
                        </div>
                        {/* BACK SIDE */}
                        <div className={`absolute inset-0 p-5 flex flex-col justify-between bg-zinc-950 border border-zinc-800 rounded-xl transform rotate-y-180 backface-invisible ${isCvvFocused ? "block" : "hidden"}`}>
                          <div className="h-6 w-full bg-zinc-900 -mx-5 mt-2"></div>
                          <div className="flex justify-end items-center pr-3 space-x-2">
                            <span className="text-[8px] font-mono text-zinc-500">SECRET SIGNATURE</span>
                            <span className="bg-white text-black font-mono text-xs font-black px-2 py-0.5 rounded italic">{checkoutPayload.cardCvv}</span>
                          </div>
                          <p className="text-[8px] text-zinc-600 font-mono text-center">NOT TRANSFERABLE • STRIPE INC.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Cardholder Name</label>
                        <input
                          type="text" required placeholder="WITTAYA CHAROEMPAN" value={checkoutPayload.cardName}
                          onChange={(e) => setCheckoutPayload({...checkoutPayload, cardName: e.target.value.toUpperCase()})}
                          className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-bold text-white uppercase focus:border-[#ff3300] outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col space-y-1 col-span-2">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase">Card Number</label>
                          <input
                            type="text" required value={checkoutPayload.cardNumber}
                            onChange={(e) => setCheckoutPayload({...checkoutPayload, cardNumber: e.target.value})}
                            className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-mono font-bold text-white focus:border-[#ff3300] outline-none"
                          />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase">CVV</label>
                          <input
                            type="text" required maxLength={3} value={checkoutPayload.cardCvv}
                            onChange={(e) => setCheckoutPayload({...checkoutPayload, cardCvv: e.target.value})}
                            onFocus={() => setIsCvvFocused(true)} onBlur={() => setIsCvvFocused(false)}
                            className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-mono font-bold text-white focus:border-[#ff3300] outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="w-full py-4 bg-[#ff3300] text-black rounded-xl font-black uppercase text-xs tracking-widest hover:bg-[#ff4500] transition-all">
                      Confirm Payment
                    </button>
                  </form>
                ) : (
                  <div className="space-y-6 py-4 flex flex-col items-center">
                     <div className="p-6 bg-white rounded-2xl shadow-xl shadow-[#ff3300]/10 border-4 border-zinc-900">
                        <QrCode className="w-48 h-48 text-black" />
                        <div className="mt-4 flex items-center justify-center space-x-2 text-black">
                           <Smartphone className="w-4 h-4" />
                           <span className="text-[10px] font-black uppercase tracking-widest">Scan to Pay</span>
                        </div>
                     </div>
                     <button onClick={() => { showToast("Payment Successful!", "success"); setCheckoutStep(3); }}
                        className="w-full py-4 bg-[#ff3300] text-black rounded-xl font-black uppercase text-xs tracking-widest hover:bg-[#ff4500] transition-all"
                      >
                        I HAVE PAID
                      </button>
                  </div>
                )}
                <button onClick={() => setCheckoutStep(1)} className="w-full text-[10px] font-black uppercase text-zinc-600 hover:text-white transition-colors">Back to Shipping</button>
              </div>
            ) : (
              <div className="text-center py-10 space-y-6 animate-fade-in">
                <div className="w-20 h-20 bg-[#ff3300] rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-[#ff3300]/20 rotate-12">
                  <CheckCircle2 className="w-10 h-10 text-black" />
                </div>
                <div>
                  <h3 className="font-sans font-black text-2xl uppercase italic text-white">Order Confirmed</h3>
                  <p className="mt-2 text-xs text-zinc-400 max-w-[280px] mx-auto leading-relaxed">
                    Your build has been registered. Our engineering team is preparing your hardware for shipment.
                  </p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 inline-block">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Order ID:</span>
                  <span className="text-[#ff3300] font-black ml-2 font-mono">#GEE-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <button onClick={() => setCheckoutOpen(false)} className="w-full py-4 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all">
                  Return to Workspace
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Back in stock subscription alerts modal */}
      {backInStockProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-6 shadow-2xl text-white space-y-4 text-left">
            <button
              onClick={() => setBackInStockProduct(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              ✕
            </button>
            <div className="text-center font-sans">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-500/10 mb-3 border border-amber-500/30">
                <Bell className="w-6 h-6 text-[#ff3300]" />
              </div>
              <span className="text-[10px] uppercase font-black text-[#ff3300] tracking-widest">
                OUT OF STOCK TRACKER
              </span>
              <h3 className="font-sans font-black text-lg">
                INVENTORY ALERT REGISTRATION
              </h3>
              <p className="text-xs text-zinc-400 mt-1 uppercase font-mono leading-relaxed">
                REGISTER TO RECEIVE NOTIFICATIONS WHEN PROCUREMENT STOCK REPLENISHES FOR:{" "}
                <strong>
                  {backInStockProduct.brand} {backInStockProduct.name}
                </strong>
              </p>
            </div>

            <div className="flex items-center space-x-3 bg-zinc-950 p-3 rounded-xl border border-zinc-900">
              <img
                src={backInStockProduct.image}
                alt={backInStockProduct.name}
                className="w-12 h-12 rounded object-cover border border-zinc-800"
              />
              <div className="text-xs">
                <p className="font-bold text-white leading-snug">
                  {backInStockProduct.name}
                </p>
                <p className="text-[#ff3300] font-mono mt-0.5">
                  {backInStockProduct.price.toLocaleString()} ฿
                </p>
              </div>
            </div>

            <form onSubmit={handleSubscribeBackInStock} className="space-y-3">
              <div className="flex flex-col space-y-1">
                <label className="text-[9px] font-black uppercase text-zinc-500">
                  NOTIFICATION EMAIL:
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-550">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="e.g. comms@domain.com"
                    value={subscriptionEmail}
                    onChange={(e) => setSubscriptionEmail(e.target.value)}
                    className="w-full pl-9 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-semibold text-white focus:border-[#ff3300] outline-none placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#ff3300] text-[#0a0a0a] rounded-lg text-xs font-black uppercase tracking-wider hover:opacity-95 transition-opacity"
              >
                ENABLE STOCK ALERT
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-6 shadow-2xl text-white space-y-4 text-left">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              ✕
            </button>
            <div className="text-center font-sans mb-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#ff3300]/10 mb-3 border border-[#ff3300]/30">
                <User className="w-6 h-6 text-[#ff3300]" />
              </div>
              <h3 className="font-sans font-black text-xl uppercase italic">
                Gee <span className="text-[#ff3300]">Account</span>
              </h3>
              <p className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 mt-2 leading-relaxed">
                AUTHENTICATE TO ACCESS TELEMETRY, LOGISTICS TRACKING, AND SECURE BAY RESERVATIONS
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleMockLogin("user");
              }}
              className="space-y-4"
            >
              <div className="flex flex-col space-y-1">
                <label className="text-[9px] font-black uppercase text-zinc-500">
                  Email Address:
                </label>
                <input
                  type="email"
                  defaultValue="assadawut.sarakul@gmail.com"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-semibold text-white focus:border-[#ff3300] outline-none"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-[9px] font-black uppercase text-zinc-500">
                  Password:
                </label>
                <input
                  type="password"
                  defaultValue="password"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-semibold text-white focus:border-[#ff3300] outline-none"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#ff3300] text-[#0a0a0a] rounded-lg text-xs font-black uppercase tracking-wider hover:opacity-95 transition-opacity"
                >
                  เข้าสู่ระบบ
                </button>
                <button
                  type="button"
                  onClick={() => handleMockLogin("admin")}
                  className="w-full py-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-lg text-xs font-black uppercase tracking-wider hover:bg-zinc-800 transition-opacity"
                >
                  Admin Login
                </button>
              </div>

              <div className="text-center mt-3 text-[10px] text-zinc-500">
                <p>หรือเข้าสู่ระบบด้วยบัญชี Google ของคุณ</p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer System standard line */}
      <footer className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-center text-zinc-600 font-mono text-[10px] space-y-2">
        <p className="font-bold text-zinc-400">
          จีจี้ ล้อซิ่ง พุทธมณฑลสาย 2 (ถนนบางแวก)
        </p>
        <p>
          ที่อยู่: 557 หมู่ 5 ถ.บางแวก แขวงบางไผ่ เขตบางแค กรุงเทพมหานคร 10160
        </p>
        <p>เบอร์โทรศัพท์: 087-664-7617, 095-437-3871</p>
        <p className="text-[#ff3300]">
          นโยบายการจัดส่ง: มีบริการจัดส่งด่วนทั่วไทยสำหรับลูกค้าต่างจังหวัด
        </p>
        <p>
          © 2026 GEE ล้อซิ่ง (GEE FITMENT ENGINE CO., LTD.) • ALL RIGHTS
          RESERVED.
        </p>
        <p className="text-zinc-700">
          POWERED BY NEXT/EXPRESS STACK • ACCESSIBILITY COMPLIANT TO WCAG 2.1 AA
          STANDARDS.
        </p>
      </footer>

      {/* Premium Floating Custom Toast Banner avoiding unhandled iframe alerts */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-pulse max-w-sm w-full bg-zinc-950/95 border border-[#ff3300]/30 rounded-xl p-4 shadow-2xl flex items-center space-x-3.5 ring-1 ring-[#ff3300]/20">
          <div className="flex-shrink-0">
            {toast.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-[#ff3300]" />
            )}
            {toast.type === "warn" && (
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            )}
            {toast.type === "error" && (
              <AlertTriangle className="w-5 h-5 text-red-500" />
            )}
            {toast.type === "info" && (
              <Sparkles className="w-5 h-5 text-cyan-400" />
            )}
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

      <PrintEstimate cart={cart} />
    </div>
  );
}

function PrintEstimate({ cart }: { cart: any[] }) {
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const installationFee = 1200; // Mock installation fee

  return (
    <div className="print-container hidden print:block">
      <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase">
            GEE ล้อซิ่ง (GEE FITMENT ENGINE CO., LTD.)
          </h1>
          <p className="text-sm">
            557 หมู่ 5 ถ.บางแวก แขวงบางไผ่ เขตบางแค กรุงเทพมหานคร 10160
          </p>
          <p className="text-sm">โทร: 087-664-7617, 095-437-3871</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold uppercase text-zinc-600">
            Estimate / ใบเสนอราคา
          </h2>
          <p className="text-sm">
            วันที่: {new Date().toLocaleDateString("th-TH")}
          </p>
          <p className="text-sm">
            เลขที่: EST-{Math.floor(Math.random() * 100000)}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4 border-b border-zinc-300 pb-1">
          รายการสินค้า / Products
        </h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-zinc-200">
              <th className="py-2">ลำดับ</th>
              <th className="py-2">รายการ</th>
              <th className="py-2 text-center">ราคา/หน่วย</th>
              <th className="py-2 text-center">จำนวน</th>
              <th className="py-2 text-right">รวม</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, idx) => (
              <tr key={idx} className="border-b border-zinc-100">
                <td className="py-2">{idx + 1}</td>
                <td className="py-2">
                  <span className="font-bold">{item.product.name}</span>
                  <br />
                  <span className="text-xs text-zinc-500">
                    {item.product.brand} - {item.product.type}
                  </span>
                </td>
                <td className="py-2 text-center">
                  {item.product.price.toLocaleString()} ฿
                </td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-right">
                  {(item.product.price * item.quantity).toLocaleString()} ฿
                </td>
              </tr>
            ))}
            <tr className="border-b border-zinc-100">
              <td className="py-2">{cart.length + 1}</td>
              <td className="py-2 font-bold">
                ค่าแรงติดตั้งและถ่วงล้อมาตรฐาน GEE (Installation Service)
              </td>
              <td className="py-2 text-center">
                {installationFee.toLocaleString()} ฿
              </td>
              <td className="py-2 text-center">1</td>
              <td className="py-2 text-right">
                {installationFee.toLocaleString()} ฿
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between border-b border-zinc-300 pb-1">
            <span className="font-bold">ยอดรวมก่อนภาษี:</span>
            <span>{(totalPrice + installationFee).toLocaleString()} ฿</span>
          </div>
          <div className="flex justify-between border-b border-zinc-300 pb-1">
            <span className="font-bold">ภาษีมูลค่าเพิ่ม (7%):</span>
            <span>
              {Math.round((totalPrice + installationFee) * 0.07).toLocaleString()}{" "}
              ฿
            </span>
          </div>
          <div className="flex justify-between text-xl font-black bg-zinc-100 p-2">
            <span>ยอดสุทธิ:</span>
            <span>
              {Math.round((totalPrice + installationFee) * 1.07).toLocaleString()}{" "}
              ฿
            </span>
          </div>
        </div>
      </div>

      <div className="mt-16 text-xs text-zinc-500 italic">
        <p>* ใบเสนอราคานี้มีอายุ 15 วัน นับจากวันที่ออกเอกสาร</p>
        <p>* ราคานี้รวมค่าติดตั้งเบื้องต้นแล้ว (ยกเว้นรายการดัดแปลงพิเศษ)</p>
      </div>
    </div>
  );
}
