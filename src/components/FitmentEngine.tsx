
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  Filter,
  Star,
  Plus,
  Scale,
  Eye,
  CheckCircle2,
  X,
  Sliders,
  Sparkles,
  Info,
  Maximize2,
  ArrowRight,
  Heart,
  Package,
  ShieldCheck,
  Coins,
  BadgePercent,
  FileText
} from "lucide-react";
import { Vehicle, Product } from "../types";
import { mockVehicles, mockProducts } from "../data/mockData";
import VirtualFitment from "./VirtualFitment";
import { wheelMap } from "../data/fitmentConfig";
import civicFeImg from "../assets/images/civic_fe_profile_1782248647242.jpg";
import revoImg from "../assets/images/revo_profile_1782248660310.jpg";
import fortunerImg from "../assets/images/fortuner_profile_1782248748933.jpg";

const SEGMENTS = [
  { id: "sedan", label: "Sedan / Hatchback", image: civicFeImg },
  { id: "pickup", label: "Pickup Truck", image: revoImg },
  { id: "suv", label: "SUV / PPV", image: fortunerImg },
  { id: "all", label: "All Vehicles", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400" },
];

const BRANDS = ["RAYS Engineering", "ENKEI", "Weds", "BBS", "Michelin", "Bridgestone", "BFGoodrich", "YOKOHAMA"];

interface FitmentEngineProps {
  vehicles?: Vehicle[];
  products?: Product[];
  onSelectProductForTryOn?: (v: Vehicle, wheel: Product, tire?: Product) => void;
  onAddToCart?: (p: Product) => void;
  onAddBundleToCart?: (wheel: Product, tire: Product, qty: number, discount: number) => void;
  onAddToComparison?: (p: Product) => void;
  comparisonList?: Product[];
  onTrackAction?: (event: string) => void;
  wishlist?: Product[];
  onToggleWishlist?: (p: Product) => void;
}

export default function FitmentEngine({
  vehicles = mockVehicles,
  products = mockProducts,
  onSelectProductForTryOn,
  onAddToCart,
  onAddBundleToCart,
  onAddToComparison,
  comparisonList = [],
  onTrackAction,
  wishlist = [],
  onToggleWishlist,
}: FitmentEngineProps) {
  // Global States
  const [activeSegment, setActiveSegment] = useState("sedan");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(mockVehicles[0]);
  const [selectedWheel, setSelectedWheel] = useState<Product>(mockProducts.find(p => p.type === 'wheel') || mockProducts[0]);
  const [selectedTire, setSelectedTire] = useState<Product>(mockProducts.find(p => p.type === 'tire') || mockProducts[5]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [activeProductType, setActiveProductType] = useState<"wheel" | "tire" | "bundle">("wheel");
  
  // Interaction States
  const [wheelSize, setWheelSize] = useState(18);
  const [showToast, setShowToast] = useState(false);
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(4);

  // Derived Data
  const wheelsList = products.filter((p) => p.type === 'wheel');
  const tiresList = products.filter((p) => p.type === 'tire');

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => 
      activeSegment === "all" || v.brand.toLowerCase().includes(activeSegment) || v.model.toLowerCase().includes(activeSegment) || activeSegment === "sedan"
    );
  }, [activeSegment, vehicles]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      (activeProductType === 'bundle' || p.type === activeProductType) && 
      (activeBrand ? p.brand.toLowerCase().includes(activeBrand.toLowerCase()) : true) &&
      (searchQuery ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : true)
    );
  }, [activeBrand, searchQuery, products, activeProductType]);

  const wheelTotal = (selectedWheel?.price || 0) * quantity;
  const tireTotal = (selectedTire?.price || 0) * quantity;
  const rawSubTotal = wheelTotal + tireTotal;
  const tenPercentOff = rawSubTotal * 0.10;
  const loyaltyBonus = quantity === 4 ? 2500 : 0;
  const finalDiscount = Math.round(tenPercentOff + loyaltyBonus);
  const finalPayAmount = rawSubTotal - finalDiscount;

  const sizeCompatMsg = selectedWheel?.size === selectedTire?.tireSizeCompat 
    ? { ok: true, text: `ตรงไซส์พอดีเป๊ะ! (ขอบ ${selectedWheel?.size || 'N/A'} เท่ากัน)` }
    : { ok: false, text: `ขนาดขอบล้อกับแก้มยางไม่แมทซ์กันเกรงว่าจะใส่ยากครับพี่! (ล้อขอบ ${selectedWheel?.size || 'N/A'} ยางขอบ ${selectedTire?.tireSizeCompat || 'N/A'})` };

  // Effects
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  if (isSimulationOpen) {
    return (
      <VirtualFitment 
        selectedVehicle={selectedVehicle} 
        selectedWheel={selectedWheel} 
        selectedTire={selectedTire}
        onClose={() => setIsSimulationOpen(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col overflow-hidden">
      {/* 1. TOP HEADER BAR */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-zinc-900 bg-black/80 backdrop-blur-md z-50">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-black tracking-tighter">
            <span className="text-[#ccff00]">WHEEL</span>HAUS
            <span className="mx-2 text-zinc-700">|</span>
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Premium Tire & Wheel Thailand 2025</span>
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-[#ccff00] transition-colors" />
            <input 
              type="text" 
              placeholder="Search specs/bundle..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 bg-zinc-900/50 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-[#ccff00]/50 focus:ring-1 focus:ring-[#ccff00]/20 transition-all"
            />
          </div>
          <button className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors border border-zinc-800">
            <Bell className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </header>

      {/* 2. MAIN CONTENT GRID */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT PANEL: VISUAL PREVIEW */}
        <div className="flex-1 relative flex flex-col bg-[#050505] p-6">
          <div className="flex items-center justify-between mb-4">
             <span className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.2em]">
               {selectedVehicle.brand} {selectedVehicle.model} from {selectedVehicle.year}
             </span>
          </div>

          <div className="flex-1 relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 group">
             <div className="absolute inset-0 z-0">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(204,255,0,0.03),transparent_70%)]"></div>
               <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ccff00]/20 to-transparent blur-sm"></div>
               <div className="absolute bottom-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent blur-md"></div>
             </div>

             <div className="absolute inset-0 z-10 flex items-center justify-center p-12">
                <div className="relative w-full aspect-[16/9]">
                   <div className="absolute bottom-[18%] left-[10%] right-[10%] h-[8%] bg-black/60 blur-3xl rounded-[100%] z-0" />
                   <img 
                    src={selectedVehicle.image} 
                    alt="Preview Car" 
                    className="w-full h-full object-contain filter contrast-[1.05] brightness-110 z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
                   />
                   {(() => {
                      const cfg = wheelMap[selectedVehicle.id] || { frontWheel: { x: 26, y: 67, scale: 22 }, rearWheel: { x: 74, y: 67, scale: 22 } };
                      const scaleFactor = 1 + (wheelSize - 18) * 0.025; 
                      
                      const renderWheel = (pos: { x: number, y: number, scale: number }) => (
                        <div 
                          className="absolute z-20 transition-all duration-700 cubic-bezier(0.23, 1, 0.32, 1)" 
                          style={{ 
                            left: `${pos.x}%`, 
                            top: `${pos.y}%`, 
                            width: `${pos.scale * scaleFactor * 1.15}%`,
                            transform: 'translate(-50%, -50%)'
                          }}
                        >
                           <div className="relative aspect-square">
                              <div className="absolute inset-0 rounded-full bg-[#111] border-[4px] border-zinc-900 shadow-inner overflow-hidden">
                                 <img src={selectedTire.image} className="w-full h-full object-cover opacity-40 rotate-12 scale-110" alt="Tire" />
                              </div>
                              <div className="absolute inset-[10%] rounded-full border-2 border-black/20 shadow-2xl overflow-hidden bg-black">
                                 <img src={selectedWheel.image} className="w-full h-full object-cover filter brightness-[0.9] contrast-[1.15]" alt="Wheel" />
                                 <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-white/10" />
                              </div>
                           </div>
                        </div>
                      );

                      return (
                        <>
                          {renderWheel(cfg.frontWheel)}
                          {renderWheel(cfg.rearWheel)}
                        </>
                      )
                   })()}
                </div>
             </div>

             <button 
               onClick={() => setIsSimulationOpen(true)}
               className="absolute bottom-6 right-6 z-30 h-12 w-12 bg-[#ccff00] text-black rounded-full flex items-center justify-center shadow-lg shadow-[#ccff00]/20 hover:scale-110 transition-transform active:scale-95"
             >
                <Maximize2 className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* RIGHT PANEL: SELECTORS & SUMMARY */}
        <aside className="w-full lg:w-[450px] bg-black border-l border-zinc-900 flex flex-col">
          <div className="flex border-b border-zinc-900">
             {(['wheel', 'tire', 'bundle'] as const).map(type => (
               <button 
                key={type}
                onClick={() => setActiveProductType(type)}
                className={`flex-1 py-5 text-[11px] font-black uppercase tracking-widest transition-all ${activeProductType === type ? 'text-[#ccff00] bg-[#ccff00]/5 border-b-2 border-[#ccff00]' : 'text-zinc-500 hover:text-zinc-300'}`}
               >
                  {type} System
               </button>
             ))}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
            {activeProductType !== 'bundle' && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                     <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-[#ccff00] rounded-full"></span>
                        <span>Car System</span>
                     </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                     {filteredVehicles.map(v => (
                       <button
                        key={v.id}
                        onClick={() => setSelectedVehicle(v)}
                        className={`aspect-[4/3] rounded-2xl border-2 overflow-hidden transition-all relative group flex items-center justify-center p-2 ${
                          selectedVehicle.id === v.id ? "border-[#ccff00] bg-zinc-900 shadow-xl shadow-[#ccff00]/10" : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                        }`}
                       >
                         <img src={v.image} className="w-full h-full object-contain filter contrast-[1.05]" alt={v.model} />
                         <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black to-transparent">
                            <p className="text-[8px] font-black text-white truncate text-center">{v.brand} {v.model}</p>
                         </div>
                       </button>
                     ))}
                  </div>
                </section>
            )}

            <section className="space-y-4">
               {activeProductType !== 'bundle' && (
                   <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
                      {BRANDS.map(brand => (
                        <button
                          key={brand}
                          onClick={() => setActiveBrand(activeBrand === brand ? null : brand)}
                          className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase transition-all flex-shrink-0 ${
                            activeBrand === brand ? "bg-[#ccff00] border-[#ccff00] text-black" : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white"
                          }`}
                        >
                          {brand}
                        </button>
                      ))}
                   </div>
               )}

               <div className="grid grid-cols-2 gap-4">
                  {filteredProducts.map(p => (
                    <div
                      key={p.id}
                      onClick={() => activeProductType === 'wheel' ? setSelectedWheel(p) : activeProductType === 'tire' ? setSelectedTire(p) : null}
                      role="button"
                      className={`group relative rounded-3xl border-2 overflow-hidden transition-all flex flex-col bg-zinc-950 cursor-pointer outline-none ${
                        (activeProductType === 'wheel' ? selectedWheel.id === p.id : selectedTire.id === p.id) ? "border-[#ccff00] shadow-[0_0_40px_rgba(204,255,0,0.15)]" : "border-zinc-800/80 hover:border-zinc-700"
                      }`}
                    >
                       <div className="aspect-square relative overflow-hidden bg-black flex items-center justify-center p-6">
                          <img 
                            src={p.image} 
                            className={`w-full h-full object-contain transition-all duration-700 ${p.id === (activeProductType === 'wheel' ? selectedWheel.id : selectedTire.id) ? "scale-110 rotate-6" : "group-hover:scale-105"}`} 
                            alt={p.name} 
                          />
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />
                       </div>
                       <div className="p-4 text-left">
                          <span className="text-[8px] font-black uppercase text-[#ccff00] block tracking-widest mb-1">{p.brand}</span>
                          <h4 className="text-[11px] font-black uppercase text-white truncate leading-tight">
                            {p.name}
                          </h4>
                          <div className="flex items-center justify-between mt-3">
                             <span className="text-sm font-black text-white">{p.price.toLocaleString()} ฿</span>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </section>
          </div>

          {/* BOTTOM SUMMARY & QUOTE BUTTON */}
          <div className="p-8 bg-zinc-950 border-t border-zinc-900 space-y-6">
             <div className="flex items-center justify-between border-t border-zinc-900 pt-6">
                <div className="flex flex-col">
                   <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Grand Total</span>
                   <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-black italic tracking-tighter text-[#ccff00]">
                        {activeProductType === 'bundle' ? finalPayAmount.toLocaleString() : (selectedWheel.price + selectedTire.price).toLocaleString()}
                      </span>
                      <span className="text-sm font-bold text-zinc-500 uppercase">฿</span>
                   </div>
                </div>
                <button 
                  onClick={() => activeProductType === 'bundle' ? onAddBundleToCart?.(selectedWheel, selectedTire, quantity, finalDiscount) : onAddToCart?.(selectedWheel)}
                  className="px-8 h-16 bg-[#ccff00] hover:bg-lime-400 text-black rounded-2xl flex items-center space-x-3 transition-all transform active:scale-95 shadow-2xl shadow-[#ccff00]/20"
                >
                   <span className="text-xs font-black uppercase tracking-widest">Add to Quote</span>
                   <ArrowRight className="w-5 h-5" />
                </button>
             </div>
          </div>
        </aside>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ccff00; }
      `}} />
    </div>
  );
}
