import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Disc,
  Flame,
  CalendarClock,
  Bot,
  ShieldAlert,
  ShoppingBag,
  Sliders,
  Moon,
  Sun,
  Layers,
  HelpCircle,
  FileText,
  User,
  Trash2,
  Sparkles,
  ArrowRight,
  Printer,
} from "lucide-react";
import { Product, UserProfile } from "../types";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkTheme: boolean;
  setDarkTheme: (dark: boolean) => void;
  cart: { product: Product; quantity: number }[];
  clearCart: () => void;
  comparisonList: Product[];
  openComparison: () => void;
  triggerCheckout: () => void;
  onTrackAction: (event: string) => void;
  user: UserProfile | null;
  onLoginClick: () => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  darkTheme,
  setDarkTheme,
  cart,
  clearCart,
  comparisonList,
  openComparison,
  triggerCheckout,
  onTrackAction,
  user,
  onLoginClick,
}: HeaderProps) {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalCartPrice = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const handlePrintEstimate = () => {
    onTrackAction("printEstimate");
    window.print();
  };

  const navigationTabs = [
    { id: "fitment", label: "Fitment Engine", spec: "ค้นหาและกรองสเปก" },
    { id: "virtual", label: "Virtual Fitment", spec: "จำลองบนรถจริง" },
    { id: "bundle", label: "Bundle Builder", spec: "จับคู่เซ็ตล้อพร้อมยาง" },
    { id: "booking", label: "Booking Stage", spec: "จองสิทธิ์ติดตั้งด่วน" },
  ];

  const menuSections = [
    {
      title: "Gee Fitment Selects",
      icon: <Sliders className="w-4 h-4 text-[#ccff00]" />,
      items: [
        {
          name: "Honda Type-R Special",
          action: () => {
            setActiveTab("fitment");
            onTrackAction("fitmentSearches");
          },
        },
        {
          name: "GR Yaris Track Edition",
          action: () => {
            setActiveTab("fitment");
            onTrackAction("fitmentSearches");
          },
        },
        {
          name: "Euro Spec Bolt Setup (BMW)",
          action: () => {
            setActiveTab("fitment");
            onTrackAction("fitmentSearches");
          },
        },
      ],
    },
    {
      title: "Visual Labs",
      icon: <Layers className="w-4 h-4 text-[#ccff00]" />,
      items: [
        {
          name: "TE37 Interactive Fitment",
          action: () => {
            setActiveTab("virtual");
            onTrackAction("virtualTries");
          },
        },
        {
          name: "CE28 Diamond Dark Gunmetal",
          action: () => {
            setActiveTab("virtual");
            onTrackAction("virtualTries");
          },
        },
        {
          name: "Enkei RPF1 Silhouette Match",
          action: () => {
            setActiveTab("virtual");
            onTrackAction("virtualTries");
          },
        },
      ],
    },
    {
      title: "Help & Consultation",
      icon: <Bot className="w-4 h-4 text-[#ccff00]" />,
      items: [
        { name: "Consult Gee AI Advisor", action: () => setActiveTab("ai") },
        {
          name: "Offset & Aspect Ratio Help",
          action: () => setActiveTab("ai"),
        },
        { name: "Track Day Chamber Manual", action: () => setActiveTab("ai") },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full select-none border-b border-zinc-800 bg-zinc-950/95 shadow-2xl backdrop-blur-md">
      <div className="mx-auto flex h-22 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* BRANDING LOGO with custom spin and hover tilt effects */}
        <motion.div
          onClick={() => setActiveTab("fitment")}
          className="flex cursor-pointer items-center space-x-4 outline-none group"
          role="link"
          tabIndex={0}
          aria-label="Gee Fitment System Homepage"
          onKeyDown={(e) => {
            if (e.key === "Enter") setActiveTab("fitment");
          }}
          whileHover="hover"
        >
          <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-[#0a0a0a] p-1 sm:p-1.5 ring-2 ring-[#ccff00] shadow-[0_0_20px_rgba(204,255,0,0.2)] overflow-hidden">
            <motion.div
              variants={{
                hover: {
                  rotate: 360,
                  transition: { duration: 1.2, ease: "easeInOut" },
                },
              }}
              className="relative z-10 flex h-full w-full items-center justify-center"
            >
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Simplified, cleaner iconic wheel */}
                <circle cx="50" cy="50" r="46" stroke="#ccff00" strokeWidth="3" />
                <circle cx="50" cy="50" r="38" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.5" />
                <path d="M50 14 L50 32 M50 86 L50 68 M19 32.5 L34.5 41.5 M81 67.5 L65.5 58.5 M19 67.5 L34.5 58.5 M81 32.5 L65.5 41.5" stroke="#ccff00" strokeWidth="4" strokeLinecap="round" />
                <circle cx="50" cy="50" r="8" fill="#ccff00" />
                <circle cx="50" cy="50" r="3" fill="#0a0a0a" />
              </svg>
            </motion.div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-sans font-black tracking-tighter text-xl sm:text-3xl uppercase italic text-white flex items-center">
                GEE
              </span>
              <motion.span
                initial={{ scale: 0.9 }}
                animate={{ scale: [0.9, 1.05, 0.9] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="rounded-full bg-[#ccff00] px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] font-black uppercase text-[#0a0a0a] tracking-wider"
              >
                PRO
              </motion.span>
            </div>
            <p className="hidden sm:block text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 group-hover:text-[#ccff00] transition-colors">
              Fitment Systems
            </p>
          </div>
        </motion.div>

        {/* DESKTOP NAV BAR with luxury layout animators */}
        <nav className="hidden lg:flex items-center space-x-1.5 bg-zinc-950/80 p-1.5 rounded-2xl border border-zinc-900">
          {navigationTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMegaMenuOpen(false);
                }}
                className="relative px-4 py-2.5 rounded-xl text-left transition-all duration-300 group cursor-pointer"
              >
                {/* Visual Active background slide using spring motion layout projection */}
                {isActive && (
                  <motion.div
                    layoutId="active-nav-glow"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    className="absolute inset-0 bg-[#ccff00] rounded-xl shadow-[0_0_15px_rgba(204,255,0,0.25)]"
                  />
                )}

                <div className="relative z-10">
                  <span
                    className={`block text-xs font-black uppercase tracking-wide transition-colors ${
                      isActive
                        ? "text-black"
                        : "text-zinc-200 group-hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </span>
                  <span
                    className={`block text-[8px] font-bold font-mono transition-colors ${
                      isActive
                        ? "text-zinc-900/80"
                        : "text-zinc-500 group-hover:text-zinc-400"
                    }`}
                  >
                    {tab.spec}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Specs Mega menu drawer trigger */}
          <div className="relative">
            <button
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wide flex items-center space-x-1.5 transition-all cursor-pointer ${
                megaMenuOpen
                  ? "bg-zinc-900 text-[#ccff00]"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
              }`}
              aria-expanded={megaMenuOpen}
              aria-haspopup="true"
            >
              <span>Specs Library</span>
              <span
                className={`text-[9px] transition-transform duration-300 ${megaMenuOpen ? "rotate-180 text-[#ccff00]" : ""}`}
              >
                ▼
              </span>
            </button>

            {/* Spec Mega-Menu Popup with standard layout fading reveals */}
            <AnimatePresence>
              {megaMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 top-14 w-[540px] rounded-2xl border border-zinc-800 bg-[#0c0c0c] p-5 shadow-2 tracking-wide text-white grid grid-cols-3 gap-5 z-50 ring-1 ring-[#ccff00]/10"
                  onMouseLeave={() => setMegaMenuOpen(false)}
                >
                  {menuSections.map((sect, sIdx) => (
                    <div key={sIdx} className="space-y-3">
                      <div className="flex items-center space-x-1.5 pb-2 border-b border-zinc-900">
                        {sect.icon}
                        <h4 className="text-[10px] font-black uppercase tracking-wider text-[#ccff00]">
                          {sect.title}
                        </h4>
                      </div>
                      <ul className="space-y-2">
                        {sect.items.map((item, iIdx) => (
                          <li key={iIdx}>
                            <button
                              onClick={() => {
                                item.action();
                                setMegaMenuOpen(false);
                              }}
                              className="text-left w-full text-[11px] font-bold text-zinc-400 hover:text-white hover:pl-1 transition-all cursor-pointer flex items-center justify-between"
                            >
                              <span>{item.name}</span>
                              <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-[#ccff00]" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* RIGHT BAR - Micro Controllers & Interactive Shopping Cart */}
        <div className="flex items-center space-x-3.5">
          {/* Active Spec Comparer pill trigger */}
          <AnimatePresence>
            {comparisonList.length > 0 && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={openComparison}
                className="bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] px-3.5 py-2 rounded-xl text-xs font-black uppercase flex items-center space-x-2 hover:bg-[#ccff00]/20 cursor-pointer"
                aria-label="Open Spec Comparator"
              >
                <span>เปรียบเทียบ</span>
                <span className="bg-[#ccff00] text-[#0a0a0a] rounded-full px-2 py-0.5 font-black text-[10px] shadow-[0_0_10px_rgba(204,255,0,0.5)]">
                  {comparisonList.length}
                </span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* AI Advisor Shortcut Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("ai")}
            className={`p-2.5 rounded-xl transition-all cursor-pointer relative border ${
              activeTab === "ai"
                ? "bg-[#ccff00] border-[#ccff00] text-black shadow-[0_0_15px_rgba(204,255,0,0.3)]"
                : "bg-[#0a0a0a] border-zinc-800 text-zinc-300 hover:text-white"
            }`}
            title="ปรึกษา จีจี้ AI"
          >
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccff00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ccff00]"></span>
            </span>
          </motion.button>

          {/* Premium Theme Switcher */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkTheme(!darkTheme)}
            className="p-2.5 rounded-xl bg-[#0a0a0a] border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
            aria-label="Toggle system theme"
          >
            {darkTheme ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-400" />
            )}
          </motion.button>

          {/* Admin System state dashboard trigger */}
          {user?.role === "admin" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("admin")}
              className={`p-2.5 rounded-xl transition-all border cursor-pointer ${
                activeTab === "admin"
                  ? "bg-[#ccff00] border-[#ccff00] text-black shadow-[0_0_12px_rgba(204,255,0,0.25)]"
                  : "bg-[#0a0a0a] border-zinc-800 text-zinc-300 hover:text-white"
              }`}
              title="แผงควบคุมหลังบ้าน"
            >
              <ShieldAlert className="w-5 h-5" />
            </motion.button>
          )}

          {/* User Profile & Gee Coins */}
          {user ? (
            <div className="flex items-center space-x-2 bg-zinc-950/80 p-1.5 rounded-xl border border-zinc-900">
              <div className="flex items-center space-x-1.5 px-2 bg-amber-500/10 border border-amber-500/20 rounded-lg py-1">
                <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">
                  Gee Coins
                </span>
                <span className="text-xs font-mono font-black text-[#ccff00]">
                  {user.geeCoins.toLocaleString()}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActiveTab("profile");
                  onTrackAction("viewProfile");
                }}
                className={`p-2 rounded-lg transition-all border cursor-pointer flex items-center space-x-2 ${
                  activeTab === "profile"
                    ? "bg-[#ccff00] border-[#ccff00] text-black shadow-[0_0_12px_rgba(204,255,0,0.25)]"
                    : "bg-[#0a0a0a] border-zinc-800 text-zinc-300 hover:text-white"
                }`}
                title="โปรไฟล์ของคุณ"
              >
                <User className="w-4 h-4" />
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLoginClick}
              className="px-3.5 py-2 rounded-xl bg-[#0a0a0a] border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 cursor-pointer flex items-center space-x-2 text-xs font-bold uppercase tracking-wider"
            >
              <User className="w-4 h-4" />
              <span>เข้าสู่ระบบ</span>
            </motion.button>
          )}

          {/* CART DRAWER DROP REVEAL */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCartOpen(!cartOpen)}
              className="p-3 rounded-xl bg-gradient-to-tr from-[#ccff00] to-lime-400 text-black hover:opacity-90 flex items-center space-x-2 font-black text-xs uppercase tracking-wider cursor-pointer shadow-[0_0_20px_rgba(204,255,0,0.2)]"
              title="รถเข็นสินค้าเด่น"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCartItems > 0 && (
                <span className="bg-black text-[#ccff00] rounded-full px-2 py-0.5 text-[10px] font-black">
                  {totalCartItems}
                </span>
              )}
            </motion.button>

            {/* Cart Dropdown wrapper with Framer Motion AnimatePresence */}
            <AnimatePresence>
              {cartOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-14 w-88 rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-5 shadow-2xl ring-1 ring-black/50 z-50 text-white"
                >
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-[#ccff00]" />
                      <h3 className="font-sans font-black text-xs uppercase tracking-wider text-[#ccff00]">
                        ตะกร้าจัดเซ็ตซิ่ง ({totalCartItems})
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        clearCart();
                        setCartOpen(false);
                      }}
                      className="text-zinc-500 hover:text-rose-450 text-[10px] font-black uppercase flex items-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                      <span>เคลียร์</span>
                    </button>
                  </div>

                  {cart.length === 0 ? (
                    <div className="py-10 text-center space-y-2">
                      <p className="text-zinc-500 text-xs font-bold leading-normal">
                        คุณยังไม่ได้เลือกของแต่งเลยครับพี่!
                      </p>
                      <button
                        onClick={() => {
                          setActiveTab("fitment");
                          setCartOpen(false);
                        }}
                        className="text-[10px] font-black uppercase text-[#ccff00] hover:underline"
                      >
                        เริ่มช้อปปิ้งที่นี่เลย
                      </button>
                    </div>
                  ) : (
                    <>
                      <ul className="max-h-56 overflow-y-auto divide-y divide-zinc-950 my-3 pr-1.5 scrollbar-thin scrollbar-thumb-zinc-900">
                        {cart.map((item, index) => (
                          <li
                            key={index}
                            className="py-3 flex items-center justify-between text-xs hover:bg-zinc-950/40 px-1 rounded-lg"
                          >
                            <div className="flex-1 pr-3">
                              <p className="font-black truncate text-white leading-tight">
                                {item.product.name}
                              </p>
                              <span className="text-zinc-500 text-[10px] font-mono uppercase block mt-1">
                                {item.product.brand} • {item.quantity}{" "}
                                {item.product.type === "wheel" ? "วง" : "เส้น"}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="font-mono font-black text-[#ccff00]">
                                {(
                                  item.product.price * item.quantity
                                ).toLocaleString()}{" "}
                                ฿
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>

                      <div className="border-t border-zinc-900 pt-3.5 flex items-center justify-between text-xs font-bold mb-4">
                        <span className="text-zinc-400 font-extrabold uppercase">
                          ยอดชำระที่บันทึก:
                        </span>
                        <span className="text-lg font-black text-[#ccff00] italic">
                          {totalCartPrice.toLocaleString()} ฿
                        </span>
                      </div>

                      <div className="flex gap-2 mb-3">
                        <button
                          onClick={handlePrintEstimate}
                          className="flex-1 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl font-black text-[10px] uppercase text-center tracking-wider hover:text-white hover:border-zinc-700 transition-all flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>พิมพ์ใบเสนอราคา</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setCartOpen(false);
                          triggerCheckout();
                        }}
                        className="w-full py-3 bg-[#ccff00] text-black rounded-xl font-black text-xs uppercase text-center tracking-wider hover:opacity-90 transition-all flex items-center justify-center space-x-1 cursor-pointer shadow-[0_4px_15px_rgba(204,255,0,0.15)]"
                      >
                        <span>ชำระผ่านระบบจำลอง Stripe</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* MOBILE PREMIUM RESPONSIVE NAV tab slider bar */}
      <div className="flex lg:hidden bg-zinc-900/50 backdrop-blur-lg border-t border-zinc-900 overflow-x-auto select-none py-1 h-14 items-center">
        {navigationTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 min-w-[90px] text-center flex flex-col justify-center items-center py-1 transition-all"
            >
              <div className="relative py-1 px-3.5 rounded-lg">
                {isActive && (
                  <motion.div
                    layoutId="active-mobile-pill"
                    className="absolute inset-0 bg-[#ccff00] rounded-lg"
                  />
                )}
                <span
                  className={`relative z-10 text-[10px] font-black uppercase tracking-wide block transition-colors leading-relaxed ${
                    isActive ? "text-black" : "text-zinc-400"
                  }`}
                >
                  {tab.id === "fitment"
                    ? "Engine"
                    : tab.id === "virtual"
                      ? "Virtual"
                      : tab.id === "bundle"
                        ? "Bundle"
                        : "Booking"}
                </span>
              </div>
            </button>
          );
        })}

        {/* mobile AI advisor tab link extra */}
        <button
          onClick={() => setActiveTab("ai")}
          className="flex-1 min-w-[90px] text-center flex flex-col justify-center items-center py-1"
        >
          <div className="relative py-1 px-3.5 rounded-lg">
            {activeTab === "ai" && (
              <motion.div
                layoutId="active-mobile-pill"
                className="absolute inset-0 bg-[#ccff00] rounded-lg"
              />
            )}
            <span
              className={`relative z-10 text-[10px] font-black uppercase tracking-wide block transition-colors leading-relaxed ${
                activeTab === "ai" ? "text-black" : "text-[#ccff00]"
              }`}
            >
              Gee AI ⚡
            </span>
          </div>
        </button>
      </div>
    </header>
  );
}
