import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Settings,
  RotateCcw,
  Maximize2,
  Download,
  Share2,
  Camera,
  Car as CarIcon,
  Disc,
  ArrowRight,
  Info,
  ChevronRight,
  MousePointer2,
} from "lucide-react";
import { Vehicle, Product } from "../types";
import { wheelMap } from "../data/fitmentConfig";

interface VirtualFitmentProps {
  selectedVehicle: Vehicle;
  selectedWheel: Product;
  selectedTire: Product;
  onClose: () => void;
}

export default function VirtualFitment({
  selectedVehicle,
  selectedWheel,
  selectedTire,
  onClose,
}: VirtualFitmentProps) {
  // Config
  const config = wheelMap[selectedVehicle.id] || {
    frontWheel: { x: 25, y: 65, scale: 22 },
    rearWheel: { x: 75, y: 65, scale: 22 },
    shadowY: 85,
  };

  // States
  const [suspensionGap, setSuspensionGap] = useState(35); // 0 (slammed) to 70 (stock)
  const [camberAngle, setCamberAngle] = useState(0); // -12 to 5 degrees
  const [wheelSizeScale, setWheelSizeScale] = useState(100); // 80% to 130%
  const [tireStretch, setTireStretch] = useState(5); // 0 to 20
  const [sidewallHeight, setSidewallHeight] = useState(40); // 25 to 60
  const [carColor, setCarColor] = useState("#4a4a4a"); // Initial neutral gray
  const [activeTab, setActiveTab] = useState<"stance" | "color" | "photo">("stance");

  // Interaction States
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [frontPos, setFrontPos] = useState(config.frontWheel);
  const [rearPos, setRearPos] = useState(config.rearWheel);

  useEffect(() => {
    setFrontPos(config.frontWheel);
    setRearPos(config.rearWheel);
  }, [selectedVehicle, config]);

  const handleCapture = () => {
    console.log("Photo saved to gallery! (Simulation)");
  };

  const renderWheelCombo = (pos: { x: number, y: number, scale: number }, side: 'front' | 'rear') => {
    if (!selectedTire || !selectedWheel) return null;
    
    // Tire scale is wheel scale + sidewall
    const tireScaleFactor = (wheelSizeScale / 100) * (1 + sidewallHeight / 300);
    const tireWidthFactor = 1 + tireStretch / 200;

    return (
      <motion.div
        className="absolute z-30"
        style={{
          left: `${pos.x}%`,
          top: `${pos.y + (suspensionGap / 8)}%`,
          width: `${pos.scale * tireScaleFactor}%`,
          transform: `translate(-50%, -50%) rotate(${camberAngle}deg)`,
          perspective: '1000px'
        }}
      >
        <div className="relative group">
          {/* Ground Shadow */}
          <div className="absolute -bottom-[5%] left-[5%] right-[5%] h-[15%] bg-black/80 blur-2xl rounded-full scale-x-125 opacity-80" />
          
          {/* Tire Layer */}
          <div 
            className="absolute inset-0 rounded-full bg-[#111] overflow-hidden border-[6px] border-zinc-900 shadow-inner"
            style={{ 
              transform: `scale(${tireWidthFactor})`,
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.9)'
            }}
          >
            <img 
              src={selectedTire.image} 
              className="w-full h-full object-cover opacity-60 mix-blend-overlay rotate-45" 
              alt="Tire Tread" 
            />
            {/* Sidewall Text/Details */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
               <span className="text-[6px] font-mono font-bold text-white uppercase tracking-[0.5em]">
                 {selectedTire.brand} // {selectedTire.name} // 235/{sidewallHeight} R{selectedWheel.size}
               </span>
            </div>
          </div>

          {/* Wheel Layer (Centered inside Tire) */}
          <div 
            className="relative aspect-square rounded-full border-[3px] border-zinc-800/50 shadow-2xl overflow-hidden bg-black flex items-center justify-center transition-transform duration-300"
            style={{ transform: `scale(${1 / (1 + sidewallHeight / 350)})` }}
          >
            <img 
              src={selectedWheel.image} 
              className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.15]" 
              style={{ transform: `rotateY(${-camberAngle * 2}deg)` }}
              alt="Wheel" 
            />
            {/* Wheel Lighting Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-white/10" />
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-full bg-[#0a0a0a] overflow-hidden">
      {/* 1. Main Visualizer Stage (Left/Center) */}
      <div className="relative flex-1 bg-[#050505] overflow-hidden flex flex-col">
        {/* Background Layer (Industrial/Neon) */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/20 to-black"></div>
          {/* Neon Accents */}
          <div className="absolute top-1/4 left-0 w-full h-[1px] bg-[#ccff00]/10 blur-sm"></div>
          <div className="absolute bottom-1/4 left-0 w-full h-[1px] bg-purple-500/10 blur-md"></div>
          {/* Floor */}
          <div className="absolute bottom-0 left-0 w-full h-[25%] bg-[#080808] border-t border-zinc-800/30">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(204,255,0,0.05),transparent_70%)]"></div>
          </div>
        </div>

        {/* HUD Elements */}
        <div className="absolute top-6 left-6 z-40 flex flex-col space-y-1">
          <h2 className="text-white font-black text-2xl uppercase tracking-tighter italic">
            Fitment<span className="text-[#ccff00]">Engine</span> v2.0
          </h2>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse"></span>
            <span className="text-[10px] text-zinc-500 font-mono uppercase font-bold tracking-widest">
              Live Rendering Active // {selectedVehicle.brand} {selectedVehicle.model}
            </span>
          </div>
        </div>

        <div className="absolute top-6 right-6 z-40 flex space-x-3">
          <button
            onClick={onClose}
            className="h-10 px-4 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 text-white text-[11px] font-black uppercase rounded-xl hover:bg-zinc-800 transition-all flex items-center space-x-2"
          >
            <span>Exit Session</span>
          </button>
        </div>

        {/* RENDER STAGE */}
        <div className="relative flex-1 flex items-center justify-center p-4 lg:p-12">
          <div className="relative w-full max-w-5xl aspect-[16/9]">
            
            {/* 1. Ground Shadows Layer */}
            <div 
              className="absolute z-10 blur-2xl opacity-40 transition-all duration-700 pointer-events-none"
              style={{
                left: '10%',
                right: '10%',
                top: `${config.shadowY}%`,
                height: '8%',
                backgroundColor: carColor,
                borderRadius: '100%',
              }}
            />
            <div 
              className="absolute z-10 bg-black/60 blur-xl opacity-80 pointer-events-none"
              style={{
                left: '5%',
                right: '5%',
                top: `${config.shadowY + 1}%`,
                height: '6%',
                borderRadius: '100%',
              }}
            />

            {/* 2. Car Body Layer */}
            <motion.div 
              className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
              style={{ transform: `translateY(${suspensionGap / 4}px)` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Car Color Tint Layer */}
                <div 
                  className="absolute inset-0 z-10 mix-blend-multiply opacity-50 pointer-events-none transition-colors duration-1000"
                  style={{ 
                    backgroundColor: carColor,
                    maskImage: `url(${selectedVehicle.image})`,
                    WebkitMaskImage: `url(${selectedVehicle.image})`,
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center'
                  }}
                />
                <img 
                  src={selectedVehicle.image} 
                  alt="Car" 
                  className="w-full h-full object-contain filter drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)] brightness-105 contrast-110" 
                />
              </div>
            </motion.div>

            {/* 3. Wheels & Tires Layer */}
            {renderWheelCombo(frontPos, 'front')}
            {renderWheelCombo(rearPos, 'rear')}

            {/* Calibration Overlay */}
            {isCalibrating && (
              <div className="absolute inset-0 z-50 pointer-events-none">
                 <div className="absolute inset-0 border-2 border-dashed border-[#ccff00]/30 animate-pulse"></div>
              </div>
            )}
          </div>
        </div>

        {/* Visualizer Bottom Status Bar */}
        <div className="h-14 bg-black/60 border-t border-zinc-800/50 flex items-center justify-between px-8 backdrop-blur-xl z-40">
          <div className="flex items-center space-x-6">
             <div className="flex items-center space-x-2">
                <span className="text-zinc-500 font-mono text-[9px] uppercase font-bold tracking-widest">Ground Clearance</span>
                <span className="text-[#ccff00] font-mono text-[10px] font-black italic">{(70 - suspensionGap).toFixed(0)}mm</span>
             </div>
             <div className="flex items-center space-x-2">
                <span className="text-zinc-500 font-mono text-[9px] uppercase font-bold tracking-widest">Setup</span>
                <span className="text-white font-mono text-[10px] font-black italic">{selectedWheel.size}″ {selectedWheel.brand} + {selectedTire.brand}</span>
             </div>
          </div>
          <div className="flex items-center space-x-2">
             <div className="h-2 w-32 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-[#ccff00]" style={{ width: '92%' }}></div>
             </div>
             <span className="text-zinc-500 font-mono text-[9px] uppercase font-bold tracking-widest">SYNC OK</span>
          </div>
        </div>
      </div>

      {/* 2. Control Sidebar (Right) */}
      <div className="w-full lg:w-[380px] bg-zinc-950 border-l border-zinc-900 flex flex-col z-50">
        {/* Header Tab */}
        <div className="grid grid-cols-3 h-16 border-b border-zinc-900">
          <button 
            onClick={() => setActiveTab('stance')}
            className={`flex flex-col items-center justify-center space-y-1 transition-all ${activeTab === 'stance' ? 'bg-[#ccff00]/5 text-[#ccff00]' : 'text-zinc-500 hover:text-white'}`}
          >
            <Settings className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Stance</span>
          </button>
          <button 
             onClick={() => setActiveTab('color')}
             className={`flex flex-col items-center justify-center space-y-1 transition-all ${activeTab === 'color' ? 'bg-[#ccff00]/5 text-[#ccff00]' : 'text-zinc-500 hover:text-white'}`}
          >
            <Disc className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Paint</span>
          </button>
          <button 
             onClick={() => setActiveTab('photo')}
             className={`flex flex-col items-center justify-center space-y-1 transition-all ${activeTab === 'photo' ? 'bg-[#ccff00]/5 text-[#ccff00]' : 'text-zinc-500 hover:text-white'}`}
          >
            <Camera className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Export</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Real Details Section */}
          <section className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-5 space-y-5">
             <div className="flex items-start justify-between">
                <div>
                   <span className="text-[10px] font-black text-[#ccff00] uppercase tracking-widest block mb-1">Active Setup</span>
                   <h3 className="text-white text-lg font-black leading-tight uppercase italic">{selectedWheel.brand} {selectedWheel.name}</h3>
                   <p className="text-[11px] text-zinc-500 font-medium mt-1">{selectedWheel.description}</p>
                </div>
                <div className="h-10 w-10 bg-black rounded-xl border border-zinc-800 flex items-center justify-center p-2">
                   <img src={selectedWheel.image} className="w-full h-full object-contain" alt="Brand Logo" />
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 p-3 rounded-2xl border border-zinc-800/50">
                   <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Wheel Spec</span>
                   <div className="flex items-baseline space-x-1">
                      <span className="text-sm font-black text-white italic">{selectedWheel.size}x{selectedWheel.width}J</span>
                      <span className="text-[9px] font-bold text-zinc-400">ET+{selectedWheel.offset}</span>
                   </div>
                </div>
                <div className="bg-black/40 p-3 rounded-2xl border border-zinc-800/50">
                   <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Tire Spec</span>
                   <div className="flex items-baseline space-x-1">
                      <span className="text-sm font-black text-white italic">225/{sidewallHeight} R{selectedWheel.size}</span>
                   </div>
                </div>
             </div>
          </section>

          {activeTab === 'stance' && (
            <>
              {/* Suspension Control */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-zinc-900 rounded-lg border border-zinc-800">
                      <Settings className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                    <span className="text-[11px] font-black uppercase text-zinc-300">Suspension & Alignment</span>
                  </div>
                </div>
                
                <div className="space-y-6 bg-zinc-900/30 p-5 rounded-2xl border border-zinc-800/50">
                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        <span>Low / Slam</span>
                        <span>Stock</span>
                      </div>
                      <input 
                        type="range" min="0" max="70" value={suspensionGap}
                        onChange={(e) => setSuspensionGap(Number(e.target.value))}
                        className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#ccff00]"
                      />
                   </div>

                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        <span>Neg Camber</span>
                        <span>{camberAngle.toFixed(1)}°</span>
                      </div>
                      <input 
                        type="range" min="-12" max="5" step="0.5" value={camberAngle}
                        onChange={(e) => setCamberAngle(Number(e.target.value))}
                        className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#ccff00]"
                      />
                   </div>
                </div>
              </div>

              {/* Tire Specs Control */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-zinc-900 rounded-lg border border-zinc-800">
                      <Disc className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                    <span className="text-[11px] font-black uppercase text-zinc-300">Tire Fitment (Stretching)</span>
                  </div>
                </div>
                
                <div className="space-y-6 bg-zinc-900/30 p-5 rounded-2xl border border-zinc-800/50">
                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        <span>Sidewall</span>
                        <span>{sidewallHeight} Series</span>
                      </div>
                      <input 
                        type="range" min="25" max="60" step="5" value={sidewallHeight}
                        onChange={(e) => setSidewallHeight(Number(e.target.value))}
                        className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#ccff00]"
                      />
                   </div>

                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        <span>Stretch</span>
                        <span>Level {tireStretch}</span>
                      </div>
                      <input 
                        type="range" min="0" max="20" value={tireStretch}
                        onChange={(e) => setTireStretch(Number(e.target.value))}
                        className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#ccff00]"
                      />
                   </div>
                </div>
              </div>

              {/* Wheel Size Control */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-zinc-900 rounded-lg border border-zinc-800">
                      <Maximize2 className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                    <span className="text-[11px] font-black uppercase text-zinc-300">Wheel Visual Scale</span>
                  </div>
                </div>
                
                <div className="bg-zinc-900/30 p-5 rounded-2xl border border-zinc-800/50 flex items-center space-x-4">
                   <input 
                    type="range" min="80" max="130" value={wheelSizeScale}
                    onChange={(e) => setWheelSizeScale(Number(e.target.value))}
                    className="flex-1 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#ccff00]"
                  />
                  <button 
                    onClick={() => setWheelSizeScale(100)}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-zinc-400" />
                  </button>
                </div>
              </div>

              {/* Manual Calibration */}
              <div className="pt-4 border-t border-zinc-900/50">
                 <button 
                   onClick={() => setIsCalibrating(!isCalibrating)}
                   className={`w-full py-4 rounded-2xl border-2 transition-all flex items-center justify-center space-x-3 ${isCalibrating ? 'bg-[#ccff00] border-[#ccff00] text-black shadow-[0_0_30px_rgba(204,255,0,0.3)]' : 'bg-transparent border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}
                 >
                    <MousePointer2 className="w-4 h-4" />
                    <span className="text-[11px] font-black uppercase tracking-widest">{isCalibrating ? 'Finish Calibration' : 'Fine-Tune Alignment'}</span>
                 </button>
                 {isCalibrating && (
                   <p className="mt-3 text-[9px] text-zinc-500 text-center uppercase tracking-widest font-bold">Drag components on stage to match exact wheel centers</p>
                 )}
              </div>
            </>
          )}

          {activeTab === 'color' && (
             <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-zinc-900 rounded-lg border border-zinc-800">
                    <Disc className="w-3.5 h-3.5 text-zinc-400" />
                  </div>
                  <span className="text-[11px] font-black uppercase text-zinc-300">Vehicle Paint Finish</span>
                </div>

                <div className="grid grid-cols-4 gap-3">
                   {['#ffffff', '#1a1a1a', '#4a4a4a', '#8b0000', '#00008b', '#006400', '#ff8c00', '#ccff00'].map(color => (
                     <button
                        key={color}
                        onClick={() => setCarColor(color)}
                        className={`aspect-square rounded-2xl border-4 transition-all ${carColor === color ? 'border-[#ccff00] scale-110 shadow-lg' : 'border-zinc-900 hover:border-zinc-700'}`}
                        style={{ backgroundColor: color }}
                     />
                   ))}
                </div>

                <div className="p-5 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
                   <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest block mb-3">Custom Hex Input</span>
                   <div className="flex space-x-3">
                      <div className="flex-1 h-12 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center px-4">
                         <span className="text-zinc-600 mr-2">#</span>
                         <input 
                           type="text" value={carColor.replace('#', '')}
                           onChange={(e) => setCarColor(`#${e.target.value}`)}
                           className="bg-transparent border-none outline-none text-white font-mono text-sm w-full"
                         />
                      </div>
                      <div className="w-12 h-12 rounded-xl border border-zinc-800" style={{ backgroundColor: carColor }}></div>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'photo' && (
             <div className="space-y-6">
                <div className="p-8 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 flex flex-col items-center text-center space-y-4">
                   <div className="h-16 w-16 bg-[#ccff00]/10 rounded-full flex items-center justify-center">
                      <Camera className="w-8 h-8 text-[#ccff00]" />
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-white text-lg font-black uppercase tracking-tight">Render Scene</h4>
                      <p className="text-[11px] text-zinc-500 font-medium">Export high-fidelity fitment preview (4K Upscaled)</p>
                   </div>
                   <button 
                     onClick={handleCapture}
                     className="w-full py-4 bg-[#ccff00] text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-lime-400 transition-all flex items-center justify-center space-x-2"
                   >
                     <Download className="w-4 h-4" />
                     <span>Save to Media</span>
                   </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <button className="py-4 bg-zinc-900 hover:bg-zinc-800 rounded-2xl border border-zinc-800 text-white text-[11px] font-black uppercase tracking-widest flex items-center justify-center space-x-2">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                   </button>
                   <button className="py-4 bg-zinc-900 hover:bg-zinc-800 rounded-2xl border border-zinc-800 text-white text-[11px] font-black uppercase tracking-widest flex items-center justify-center space-x-2">
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset</span>
                   </button>
                </div>
             </div>
          )}
        </div>

        {/* Footer Summary */}
        <div className="p-6 border-t border-zinc-900 bg-black">
           <div className="flex items-center justify-between mb-4">
              <div>
                 <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest block">Estimated Total Quote</span>
                 <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-black italic text-white tracking-tighter">{(selectedWheel.price * 4 + selectedTire.price * 4 + 2500).toLocaleString()}</span>
                    <span className="text-sm font-bold text-[#ccff00] uppercase">฿</span>
                 </div>
              </div>
              <div className="text-right">
                 <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest block">Installation Included</span>
                 <span className="text-[11px] text-zinc-400 font-bold uppercase">+ Alignment</span>
              </div>
           </div>
           <button className="w-full py-4 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center space-x-2">
              <span>Checkout Configuration</span>
              <ArrowRight className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
}
