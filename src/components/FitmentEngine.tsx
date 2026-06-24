
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
  FileText,
  Download
} from "lucide-react";
import { Vehicle, Product } from "../types";
import { mockVehicles, mockProducts } from "../data/mockData";
import VirtualFitment from "./VirtualFitment";
import ReviewSection from "./ReviewSection";
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
  onUpdateProduct?: (p: Product) => void;
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
  onUpdateProduct,
}: FitmentEngineProps) {
  // Global States
  const [activeSegment, setActiveSegment] = useState("sedan");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(mockVehicles[0]);
  const [selectedWheel, setSelectedWheel] = useState<Product>(mockProducts.find(p => p.type === 'wheel') || mockProducts[0]);
  const [selectedTire, setSelectedTire] = useState<Product>(mockProducts.find(p => p.type === 'tire') || mockProducts[5]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [activeProductType, setActiveProductType] = useState<"wheel" | "tire" | "bundle">("wheel");
  const [activeSuspensionPreset, setActiveSuspensionPreset] = useState<"stock" | "lowered" | "stanced">("stock");
  const [showToast, setShowToast] = useState(false);

  // Interaction States
  const [wheelSize, setWheelSize] = useState(18);
  const [rideHeight, setRideHeight] = useState(0); 
  const [camber, setCamber] = useState(0); 
  const [offset, setOffset] = useState(0);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  const applySuspensionPreset = (preset: "stock" | "lowered" | "stanced") => {
    setActiveSuspensionPreset(preset);
    if (preset === "stock") {
      setRideHeight(0);
      setCamber(0);
    } else if (preset === "lowered") {
      setRideHeight(1.5);
      setCamber(-1.5);
    } else if (preset === "stanced") {
      setRideHeight(3.5);
      setCamber(-4.5);
    }
  };
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
            <span className="text-[#ff3300]">WHEEL</span>HAUS
            <span className="mx-2 text-zinc-700">|</span>
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Premium Tire & Wheel Thailand 2025</span>
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-[#ff3300] transition-colors" />
            <input 
              type="text" 
              placeholder="Search specs/bundle..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 bg-zinc-900/50 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-[#ff3300]/50 focus:ring-1 focus:ring-[#ff3300]/20 transition-all"
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
               {selectedVehicle.brand} {selectedVehicle.model} {selectedVehicle.subModel}
             </span>
             <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800">
                   <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Wheel Size</span>
                   <span className="text-[10px] font-black text-[#ff3300]">{wheelSize}"</span>
                </div>
             </div>
          </div>

          <div className="flex-1 relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 group flex items-center justify-center">
             {/* Background Layers */}
             <div className="absolute inset-0 z-0">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,51,0,0.03),transparent_70%)]"></div>
               <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff3300]/20 to-transparent blur-sm"></div>
               <div className="absolute bottom-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent blur-md"></div>
             </div>

             {/* RENDER ENGINE (Layered 2D) */}
             <div className="relative w-full max-w-4xl mx-auto p-4 flex items-center justify-center">
                {/* The core container that wraps the car exactly */}
                <div className="relative inline-block w-full">
                   {/* Shadow Layer */}
                   <div className="absolute bottom-[10%] left-[5%] right-[5%] h-[15%] bg-black/60 blur-3xl rounded-[100%] z-0" />
                   
                   {/* Car Layer (Base) */}
                   <img 
                    src={selectedVehicle.image} 
                    alt="Preview Car" 
                    className="w-full h-auto relative z-10 filter contrast-[1.05] brightness-110 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
                   />

                   {/* Wheel & Tire Layers (Anchored to Vehicle) */}
                   {(() => {
                      const fit = selectedVehicle.fitment || { 
                        front: { x: 26.5, y: 67.5, scale: 22.5 }, 
                        rear: { x: 74.2, y: 67.5, scale: 22.5 } 
                      };
                      
                      // Calculate scale relative to wheel size (18 is base)
                      const sizeScale = 1 + (wheelSize - 18) * 0.015; 
                      
                      const renderWheel = (pos: { x: number, y: number, scale: number }, type: "front" | "rear") => (
                        <div 
                          key={type}
                          className="absolute z-20 transition-all duration-700 cubic-bezier(0.23, 1, 0.32, 1)" 
                          style={{ 
                            left: `${pos.x}%`, 
                            top: `${pos.y + rideHeight}%`, // Add ride height offset
                            width: `${pos.scale * sizeScale}%`,
                            transform: `translate(-50%, -50%) rotate(${camber}deg)`,
                            marginLeft: type === 'front' ? `${offset}px` : `${offset * 0.8}px` // Mock offset/poke
                          }}
                        >
                            <div className="relative aspect-square group">
                              {/* Brake Rotor / Hub Layer */}
                              <div className="absolute inset-[15%] rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 shadow-inner z-0 opacity-80" />
                              
                              {/* Tire (Behind Wheel) */}
                              <div className="absolute inset-0 rounded-full bg-[#111] border-[4px] border-zinc-900 shadow-inner overflow-hidden z-10">
                                 <img src={selectedTire.image} className="w-full h-full object-cover opacity-60 rotate-12 scale-110" alt="Tire" />
                              </div>
                              
                              {/* Wheel (Centered) */}
                              <div className="absolute inset-[10%] rounded-full border-2 border-black/20 shadow-2xl overflow-hidden bg-black group-hover:scale-[1.02] transition-transform z-20">
                                 <img src={selectedWheel.image} className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.1] grayscale-[0.1]" alt="Wheel" />
                                 
                                 {/* Center Cap / Hub Hole Shadow */}
                                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-black/80 rounded-full blur-[2px] z-30 shadow-inner" />
                                 
                                 <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/5" />
                              </div>
                           </div>
                        </div>
                      );

                      return (
                        <>
                          {renderWheel(fit.front, "front")}
                          {renderWheel(fit.rear, "rear")}
                        </>
                      )
                   })()}
                </div>
             </div>

             {/* SUSPENSION CONTROLS (Floating Overlay) */}
             <div className="absolute bottom-6 left-6 z-30 w-72 space-y-3">
                <div className="bg-black/60 backdrop-blur-xl border border-zinc-800 p-5 rounded-2xl">
                   <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black uppercase text-white tracking-widest">Suspension Tune</span>
                      <Sliders className="w-3.5 h-3.5 text-[#ff3300]" />
                   </div>
                   
                   <div className="flex gap-1 mb-4 p-1 bg-zinc-900/50 rounded-lg">
                      {(['stock', 'lowered', 'stanced'] as const).map(p => (
                        <button 
                          key={p}
                          onClick={() => applySuspensionPreset(p)}
                          className={`flex-1 py-1.5 text-[8px] font-black uppercase rounded-md transition-all ${activeSuspensionPreset === p ? 'bg-[#ff3300] text-black shadow-[0_0_15px_rgba(255,51,0,0.3)]' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                          {p}
                        </button>
                      ))}
                   </div>

                   <div className="space-y-4">
                      <div className="space-y-2">
                         <div className="flex justify-between text-[8px] font-black uppercase text-zinc-500">
                            <span>Ride Height</span>
                            <span className="text-[#ff3300]">{rideHeight}mm</span>
                         </div>
                         <input 
                           type="range" min="-5" max="5" step="0.1" value={rideHeight}
                           onChange={(e) => setRideHeight(Number(e.target.value))}
                           className="w-full accent-[#ff3300] h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer"
                         />
                      </div>

                      <div className="space-y-2">
                         <div className="flex justify-between text-[8px] font-black uppercase text-zinc-500">
                            <span>Negative Camber</span>
                            <span className="text-[#ff3300]">{camber}°</span>
                         </div>
                         <input 
                           type="range" min="-10" max="0" step="0.5" value={camber}
                           onChange={(e) => setCamber(Number(e.target.value))}
                           className="w-full accent-[#ff3300] h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer"
                         />
                      </div>
                   </div>
                </div>
             </div>

             <button 
               onClick={() => setIsSimulationOpen(true)}
               className="absolute bottom-6 right-6 z-30 h-14 w-14 bg-[#ff3300] text-black rounded-2xl flex items-center justify-center shadow-2xl shadow-[#ff3300]/20 hover:scale-110 transition-all active:scale-95 group"
             >
                <Maximize2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
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
                className={`flex-1 py-5 text-[11px] font-black uppercase tracking-widest transition-all ${activeProductType === type ? 'text-[#ff3300] bg-[#ff3300]/5 border-b-2 border-[#ff3300]' : 'text-zinc-500 hover:text-zinc-300'}`}
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
                        <span className="w-1.5 h-1.5 bg-[#ff3300] rounded-full animate-pulse"></span>
                        <span>Vehicle Selection</span>
                     </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     {vehicles.map(v => (
                       <button
                        key={v.id}
                        onClick={() => setSelectedVehicle(v)}
                        className={`aspect-[16/10] rounded-2xl border-2 overflow-hidden transition-all relative group flex items-center justify-center p-3 ${
                          selectedVehicle.id === v.id ? "border-[#ff3300] bg-zinc-900 shadow-xl shadow-[#ff3300]/10" : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                        }`}
                       >
                         <img src={v.image} className="w-full h-full object-contain filter contrast-[1.05]" alt={v.model} />
                         <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black to-transparent">
                            <p className="text-[9px] font-black text-white truncate text-center leading-none uppercase tracking-tighter">{v.brand} {v.model}</p>
                         </div>
                       </button>
                     ))}
                  </div>
                </section>
            )}

            <section className="space-y-6">
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-[#ff3300] rounded-full"></span>
                        <span>Catalog Search</span>
                     </h3>
                  </div>

                  <div className="relative group">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#ff3300] transition-colors" />
                     <input 
                       type="text" 
                       placeholder={`Search ${activeProductType}s...`}
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-white placeholder:text-zinc-700 outline-none focus:border-[#ff3300]/50 transition-all"
                     />
                     {searchQuery && (
                       <button 
                         onClick={() => setSearchQuery("")}
                         className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white"
                       >
                         <X className="w-3 h-3" />
                       </button>
                     )}
                  </div>
               </div>

               {activeProductType !== 'bundle' && (
                   <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
                      {BRANDS.map(brand => (
                        <button
                          key={brand}
                          onClick={() => setActiveBrand(activeBrand === brand ? null : brand)}
                          className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase transition-all flex-shrink-0 ${
                            activeBrand === brand ? "bg-[#ff3300] border-[#ff3300] text-black" : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white"
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
                      className={`group relative rounded-[2rem] border-2 overflow-hidden transition-all flex flex-col bg-zinc-950 cursor-pointer outline-none ${
                        (activeProductType === 'wheel' ? selectedWheel.id === p.id : selectedTire.id === p.id) ? "border-[#ff3300] shadow-[0_0_40px_rgba(255,51,0,0.15)]" : "border-zinc-800/80 hover:border-zinc-700"
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
                       <div className="p-5 text-left relative">
                          <div className="absolute top-4 right-4 flex flex-col gap-2">
                            <button 
                              className={`p-1.5 rounded-lg transition-all ${wishlist?.some(item => item.id === p.id) ? 'bg-[#ff3300] text-black' : 'bg-zinc-900/80 hover:bg-[#ff3300] hover:text-black text-zinc-400'}`}
                              title="Toggle Wishlist"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleWishlist?.(p);
                              }}
                            >
                               <Heart className={`w-3 h-3 ${wishlist?.some(item => item.id === p.id) ? 'fill-current' : ''}`} />
                            </button>
                            <button 
                              className="p-1.5 bg-zinc-900/80 text-zinc-400 rounded-lg hover:bg-zinc-800 transition-all"
                              title="Subscribe to Price Drop"
                              onClick={(e) => {
                                e.stopPropagation();
                                alert("เราจะส่งอีเมลแจ้งเตือนให้ทันทีที่ราคาลดลงครับพี่!");
                              }}
                            >
                               <Bell className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-[8px] font-black uppercase text-[#ff3300] block tracking-widest mb-1">{p.brand}</span>
                          <h4 className="text-[11px] font-black uppercase text-white leading-tight mb-1 pr-6">
                            {p.name}
                          </h4>
                          <div className="flex items-center gap-1 mb-4 text-zinc-500">
                             <Star className="w-3 h-3 text-[#ff3300] fill-[#ff3300]" />
                             <span className="text-[9px] font-bold font-mono">{p.rating || "4.8"}</span>
                             <span className="text-[9px]">({p.reviewCount || Math.floor(Math.random() * 50 + 10)} reviews)</span>
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewProduct(p);
                            }}
                            className="w-full py-1.5 mb-4 text-[9px] uppercase font-bold text-zinc-400 border border-zinc-800 rounded-lg hover:border-[#ff3300] hover:text-white transition-colors"
                          >
                            View Details & Reviews
                          </button>

                          <div className="flex items-center justify-between">
                             <span className="text-sm font-black text-white italic tracking-tighter">{p.price.toLocaleString()} ฿</span>
                             <div className="h-6 w-6 bg-zinc-900 rounded-lg flex items-center justify-center group-hover:bg-[#ff3300] transition-colors">
                                <Plus className="w-3.5 h-3.5 text-zinc-500 group-hover:text-black transition-colors" />
                             </div>
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
                      <span className="text-3xl font-black italic tracking-tighter text-[#ff3300]">
                        {activeProductType === 'bundle' ? finalPayAmount.toLocaleString() : (selectedWheel.price + selectedTire.price).toLocaleString()}
                      </span>
                      <span className="text-sm font-bold text-zinc-500 uppercase">฿</span>
                   </div>
                </div>
                 <div className="flex gap-4 items-center">
                    <button 
                      onClick={() => alert("Build configuration saved to your local registry!")}
                      className="h-16 px-6 bg-zinc-900 border border-zinc-800 text-white rounded-2xl flex items-center justify-center hover:border-[#ff3300] transition-all group"
                    >
                      <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                    </button>
                    
                    <button 
                      onClick={() => activeProductType === 'bundle' ? onAddBundleToCart?.(selectedWheel, selectedTire, quantity, finalDiscount) : onAddToCart?.(selectedWheel)}
                      className="flex-1 h-16 bg-[#ff3300] hover:bg-[#ff4500] text-black rounded-2xl flex items-center justify-center space-x-3 transition-all transform active:scale-95 shadow-2xl shadow-[#ff3300]/20"
                    >
                       <span className="text-xs font-black uppercase tracking-[0.2em]">Add to Quote</span>
                       <ArrowRight className="w-5 h-5" />
                    </button>
                 </div>
             </div>
          </div>
        </aside>
      </main>

      {/* Product Detail Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#0a0a0a]/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl max-h-full overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8 custom-scrollbar shadow-2xl">
            <button
              onClick={() => setViewProduct(null)}
              className="absolute top-4 right-4 p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors z-10"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center p-8 relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,51,0,0.05),transparent_60%)]" />
                <img src={viewProduct.image} alt={viewProduct.name} className="w-full h-auto object-contain max-h-[300px] z-10 drop-shadow-2xl" />
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#ff3300] tracking-widest">{viewProduct.brand}</span>
                  <h2 className="text-2xl font-black uppercase text-white tracking-tight">{viewProduct.name}</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-black text-[#ff3300] italic">{viewProduct.price.toLocaleString()} ฿</span>
                  {viewProduct.stock < 5 ? (
                    <span className="text-[9px] font-bold text-rose-400 uppercase border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 rounded">Low Stock: {viewProduct.stock} left</span>
                  ) : (
                    <span className="text-[9px] font-bold text-emerald-400 uppercase border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded">In Stock: {viewProduct.stock}</span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-mono">{viewProduct.description || 'High-performance automotive component designed for extreme stress conditions.'}</p>
                
                {/* Specs */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-mono">
                  {viewProduct.size && <div className="bg-zinc-900 p-2 rounded text-zinc-300">Size: <span className="text-white font-bold">{viewProduct.size}"</span></div>}
                  {viewProduct.width && <div className="bg-zinc-900 p-2 rounded text-zinc-300">Width: <span className="text-white font-bold">{viewProduct.width}J</span></div>}
                  {viewProduct.offset !== undefined && <div className="bg-zinc-900 p-2 rounded text-zinc-300">Offset: <span className="text-white font-bold">+{viewProduct.offset}</span></div>}
                  {viewProduct.pcdCompat && <div className="bg-zinc-900 p-2 rounded text-zinc-300">PCD: <span className="text-white font-bold">{viewProduct.pcdCompat.join(', ')}</span></div>}
                  {viewProduct.color && <div className="bg-zinc-900 p-2 rounded text-zinc-300">Color: <span className="text-white font-bold">{viewProduct.color}</span></div>}
                  {viewProduct.weight && <div className="bg-zinc-900 p-2 rounded text-zinc-300">Weight: <span className="text-white font-bold">{viewProduct.weight} kg</span></div>}
                </div>
              </div>
            </div>

            <ReviewSection 
              productId={viewProduct.id} 
              reviews={viewProduct.reviews || []}
              onAddReview={(pid, review) => {
                const newReview = { ...review, id: `r_${Date.now()}`, date: new Date().toLocaleDateString('en-US'), status: 'pending' as const };
                const updatedProduct = {
                  ...viewProduct,
                  reviews: [...(viewProduct.reviews || []), newReview]
                };
                setViewProduct(updatedProduct);
                if (onUpdateProduct) {
                  onUpdateProduct(updatedProduct);
                }
              }} 
            />
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ff3300; }
      `}} />
    </div>
  );
}
