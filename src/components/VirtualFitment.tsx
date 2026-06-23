import React, { useState } from 'react';
import { Vehicle, Product } from '../types';
import { mockVehicles, mockProducts } from '../data/mockData';
import { Paintbrush, Sliders, ToggleLeft, Disc, Sparkles, AlertCircle } from 'lucide-react';

interface VirtualFitmentProps {
  initialVehicle?: Vehicle | null;
  initialWheel?: Product | null;
  onAddToCart: (product: Product) => void;
  onTrackAction: (event: string) => void;
}

export default function VirtualFitment({
  initialVehicle,
  initialWheel,
  onAddToCart,
  onTrackAction
}: VirtualFitmentProps) {
  // Setup standard state defaults if not passed from engine
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(initialVehicle || mockVehicles[0]);
  const [selectedWheel, setSelectedWheel] = useState<Product>(initialWheel || mockProducts[0]);

  // Sync state with parent props updates
  React.useEffect(() => {
    if (initialVehicle) {
      setSelectedVehicle(initialVehicle);
    }
  }, [initialVehicle]);

  React.useEffect(() => {
    if (initialWheel) {
      setSelectedWheel(initialWheel);
    }
  }, [initialWheel]);

  // Try-on simulation config states
  const [carColor, setCarColor] = useState<string>('#ff0033'); // Default Sports Red
  const [suspensionGap, setSuspensionGap] = useState<number>(30); // 10px to 60px
  const [wheelSizeScale, setWheelSizeScale] = useState<number>(100); // 85% to 115%
  const [camberAngle, setCamberAngle] = useState<number>(-2); // -10deg to 2deg
  const [tireStretch, setTireStretch] = useState<'normal' | 'aggressive' | 'slick'>('aggressive');
  const [activeTabPanel, setActiveTabPanel] = useState<'body' | 'alignment' | 'wheel'>('body');

  const wheelsList = mockProducts.filter((p) => p.type === 'wheel');

  // Paint color palette presets
  const presets = [
    { name: 'Championship White', hex: '#f7f6f1' },
    { name: 'Spoon Yellow', hex: '#ffcc00' },
    { name: 'Bayside Blue', hex: '#0022ff' },
    { name: 'Pikes Peak Red', hex: '#e60026' },
    { name: 'Carbon Fiber Slate', hex: '#1c1c1c' },
    { name: 'Midnight Purple III', hex: '#3b0066' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Simulation Stage Title & Overview */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0a0a0a]/50 p-6 md:p-8 backdrop-blur-md">
        <h2 className="font-sans font-black tracking-tight text-2xl md:text-3xl uppercase italic text-white flex items-center space-x-2.5">
          <Sparkles className="w-8 h-8 text-[#ccff00]" />
          <span>Virtual Fitment Stance Lab</span>
        </h2>
        <p className="mt-2 text-sm text-zinc-400 font-medium max-w-3xl">
          ทดลองฟิตเมนต์ล้อแม็กซ์เสมือนจริงสำหรับคนใจถึง! ปรับความลึกออฟเซ็ต แคมเบอร์ดึงยางซิ่ง และโหลดเตี้ย จัดฟิตเมนต์ให้หล่อสะกดทุกสายตาบนถนนหลวง ท้าทายระดับด่านทางด่วนได้ทันที!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Interactive Visual Stage - Left Panel */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          
          <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-zinc-950/80 border border-zinc-800 p-6 overflow-hidden flex items-center justify-center select-none shadow-inner">
            
            {/* Grid Pattern overlay for true garage feel */}
            <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="absolute bottom-16 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ccff00]/30 to-transparent"></div>

            {/* Simulated Dynamic Background Lighting Shadow */}
            <div 
              className="absolute h-40 w-40 rounded-full blur-3xl opacity-20 -bottom-10 left-1/3"
              style={{ backgroundColor: carColor }}
            ></div>

            {/* Garage Status Line */}
            <div className="absolute top-4 left-4 font-mono text-[9px] text-zinc-500 flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ccff00] animate-ping"></span>
              <span>RENDER ENGINE: OPENGL CANVAS MODULATION ACTIVE [3.5-FLASH]</span>
            </div>

            {/* STAGE CONTAINER WITH COLLAPSING SHADOWS */}
            <div className="relative w-full max-w-2xl h-full flex flex-col justify-end pb-8">
              
              {/* Vehicle Body Layer + Color Overlay Mask */}
              <div 
                className="relative h-44 w-full transition-transform duration-500 ease-out flex items-center justify-center"
                style={{ 
                  transform: `translateY(${suspensionGap / 2}px)` // Lower body with slider
                }}
              >
                {/* Simulated Tint Overlay container */}
                <div 
                  className="absolute inset-0 z-10 mix-blend-multiply opacity-60 rounded-xl pointer-events-none"
                  style={{ backgroundColor: carColor }}
                ></div>

                {/* Real Silhouetted Car Image */}
                <img 
                  src={selectedVehicle.image} 
                  alt="Virtual Car silhouette container" 
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-contain filter brightness-105 contrast-125 z-0" 
                />

                {/* Stance low suspension status flag */}
                {suspensionGap > 45 && (
                  <span className="absolute -top-4 left-12 animate-bounce bg-[#ccff00] text-[#0a0a0a] font-mono text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                    Hellaflush! เตี้ยจัดปลัดขิก!
                  </span>
                )}
              </div>

              {/* INTEGRATED FLOATING WHEEL NODES (FRONT & REAR) */}
              {/* Wheel alignment offsets and camber angles are mapped via styling on parent container */}
              <div className="absolute bottom-[24px] left-0 right-0 w-full px-12 z-20 flex justify-between pointer-events-none">
                
                {/* Front Wheel */}
                <div 
                  className="relative transition-all duration-300"
                  style={{
                    transform: `translateX(18px) rotate(${camberAngle}deg) scale(${wheelSizeScale / 100})`,
                    perspective: '300px'
                  }}
                >
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-zinc-950 border-4 border-zinc-800 shadow-md flex items-center justify-center overflow-hidden">
                    <img 
                      src={selectedWheel.image} 
                      alt="Front Wheel Preview" 
                      className={`h-full w-full object-cover rounded-full ${tireStretch === 'slick' ? 'border-2 border-[#ccff00]/40' : ''}`} 
                    />
                  </div>
                  {/* Tire Stretch Indicator lines */}
                  <div className="absolute top-0 -left-1 text-[8px] font-mono bg-black/60 text-zinc-400 px-1 rounded uppercase">F</div>
                </div>

                {/* Rear Wheel */}
                <div 
                  className="relative transition-all duration-300"
                  style={{
                    transform: `translateX(-18px) rotate(${camberAngle}deg) scale(${wheelSizeScale / 100})`,
                    perspective: '300px'
                  }}
                >
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-zinc-950 border-4 border-zinc-800 shadow-md flex items-center justify-center overflow-hidden">
                    <img 
                      src={selectedWheel.image} 
                      alt="Rear Wheel Preview" 
                      className="h-full w-full object-cover rounded-full" 
                    />
                  </div>
                  <div className="absolute top-0 -right-1 text-[8px] font-mono bg-black/60 text-zinc-400 px-1 rounded uppercase">R</div>
                </div>

              </div>

            </div>

            {/* Dynamic Status Badges bottom overlay */}
            <div className="absolute bottom-3 right-4 font-mono text-[10px] text-zinc-400 flex items-center space-x-2 bg-black/50 px-3 py-1 rounded-md">
              <Disc className="w-3.5 h-3.5 text-[#ccff00] animate-spin" />
              <span>ล้อ: <strong className="text-white">{selectedWheel.name}</strong></span>
              <span>ปีรถ: <strong className="text-white">{selectedVehicle.year}</strong></span>
            </div>

          </div>

          {/* Quick Specs compatibility alert warning */}
          <div className="rounded-xl bg-orange-950/20 border border-orange-800/30 p-4 text-orange-400 flex items-start space-x-3 text-xs leading-relaxed">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-bold uppercase tracking-wider">Fitment Warning Note (ข้อพึงระวังการจัดซิ่ง):</p>
              <p className="mt-0.5 text-zinc-400 font-medium">
                การโหลดระยะห่างซุ้มล้อและแก้มยางเหลือต่ำกว่า 15 mm และการดันมุม Camber ติดลบมากกว่า -3.0 ดีกรี อาจส่งผลให้สปริงเพลาทำงานหนัก มีโอกาสติดซุ้มเวลากระโดดสะพานหลวง แนะนำให้ติดตั้งซับแท็งก์สตรัทปรับเกลียว Gee Force!
              </p>
            </div>
          </div>

        </div>

        {/* Configuration Parameter Controls - Right Panel */}
        <div className="lg:col-span-4 rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-6 space-y-6">
          
          <div className="border-b border-zinc-800 pb-3">
            <span className="text-[10px] font-black uppercase text-[#ccff00] tracking-widest">Garage Workbench</span>
            <h3 className="font-sans font-black text-lg text-white">โมดิฟายตัวถัง & ฟิตเมนต์</h3>
          </div>

          {/* Quick Nav for parameters tabs */}
          <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-1 rounded-lg border border-zinc-950">
            <button
              onClick={() => setActiveTabPanel('body')}
              className={`py-1 rounded text-xs font-bold uppercase ${activeTabPanel === 'body' ? 'bg-[#ccff00] text-[#0a0a0a]' : 'text-zinc-400'}`}
            >
              สีตัวรถ
            </button>
            <button
              onClick={() => setActiveTabPanel('alignment')}
              className={`py-1 rounded text-xs font-bold uppercase ${activeTabPanel === 'alignment' ? 'bg-[#ccff00] text-[#0a0a0a]' : 'text-zinc-400'}`}
            >
              มุมล้อ/โช้ค
            </button>
            <button
              onClick={() => setActiveTabPanel('wheel')}
              className={`py-1 rounded text-xs font-bold uppercase ${activeTabPanel === 'wheel' ? 'bg-[#ccff00] text-[#0a0a0a]' : 'text-zinc-400'}`}
            >
              เลือกลายล้อ
            </button>
          </div>

          {/* PANEL CONTENT */}
          
          {/* TAB 1: Paint Color preset picker */}
          {activeTabPanel === 'body' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center space-x-1">
                  <Paintbrush className="w-3.5 h-3.5 text-[#ccff00]" />
                  <span>สาดสีตัวรถเสมือนจริง (Paint Color)</span>
                </label>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {presets.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCarColor(color.hex)}
                      className="flex items-center space-x-2 rounded-lg border border-zinc-800 p-2 text-left bg-zinc-950/40 hover:bg-zinc-900 duration-200"
                    >
                      <span className="h-4 w-4 rounded border border-black/30" style={{ backgroundColor: color.hex }}></span>
                      <span className="text-[10px] font-bold text-zinc-300 truncate">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-xs font-bold text-zinc-400">ระบุสีรหัสแต่งซิ่ง (Custom HEX Label):</label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={carColor}
                    onChange={(e) => setCarColor(e.target.value)}
                    className="h-10 w-10 p-0 rounded-md border border-zinc-800 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={carColor}
                    onChange={(e) => setCarColor(e.target.value)}
                    className="flex-1 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1 font-mono text-xs font-bold text-[#ccff00]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Suspension Slam & Alignment Adjust (Camber, Size scaling) */}
          {activeTabPanel === 'alignment' && (
            <div className="space-y-5 animate-fade-in">
              
              {/* Suspension Height */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-zinc-300">ความสูงช่วงล่าง (Suspension Slam/Flush):</span>
                  <span className="font-mono text-[#ccff00] font-bold">{(70 - suspensionGap) / 10} นิ้วสอด</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={suspensionGap}
                  onChange={(e) => {
                    setSuspensionGap(Number(e.target.value));
                    onTrackAction('virtualTries');
                  }}
                  className="w-full accent-[#ccff00] cursor-pointer" 
                />
                <p className="text-[10px] text-zinc-500 font-medium">ขยับความสูงดึงเซ็นโช๊คสตรัทจัดฟิตเมนตาเป๊ะพอดีซุ้มล้อ.</p>
              </div>

              {/* Camber Angle Alignment */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-zinc-300">มุมแคมเบอร์ (VIP Camber Tilt):</span>
                  <span className="font-mono text-[#ccff00] font-bold">{camberAngle.toFixed(1)}° ดีกรี</span>
                </div>
                <input
                  type="range"
                  min="-12"
                  max="2"
                  step="0.5"
                  value={camberAngle}
                  onChange={(e) => setCamberAngle(Number(e.target.value))}
                  className="w-full accent-[#ccff00] cursor-pointer" 
                />
                <p className="text-[10px] text-zinc-500 font-medium">ซิ่งสนามหรือดริฟต์สิบล้อ ปั๊มขอบแคมเบอร์หน้ายางยิงทราย.</p>
              </div>

              {/* Wheel scaling size */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-zinc-300">ขนาดวงล้อขยาย (Visual Scale Size):</span>
                  <span className="font-mono text-[#ccff00] font-bold">{Math.round(18 * (wheelSizeScale / 100))} นิ้ว</span>
                </div>
                <input
                  type="range"
                  min="85"
                  max="115"
                  value={wheelSizeScale}
                  onChange={(e) => setWheelSizeScale(Number(e.target.value))}
                  className="w-full accent-[#ccff00] cursor-pointer" 
                />
              </div>

              {/* Tire Profile options */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300">โปรไฟล์เนื้อแก้มยางซิ่ง:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['normal', 'aggressive', 'slick'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setTireStretch(type)}
                      className={`py-1.5 rounded text-[10px] font-black uppercase text-center border ${
                        tireStretch === type 
                          ? 'bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00]' 
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Custom quick wheel swap selector */}
          {activeTabPanel === 'wheel' && (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 animate-fade-in custom-scrollbar">
              <label className="text-xs font-bold text-zinc-400 block mb-2">สลับลายล้อซิ่ง (Quick Swapper):</label>
              {wheelsList.map((wheel) => (
                <button
                  key={wheel.id}
                  onClick={() => {
                    setSelectedWheel(wheel);
                    onTrackAction('virtualTries');
                  }}
                  className={`w-full flex items-center space-x-3 rounded-lg border p-2 text-left bg-zinc-950/50 hover:bg-zinc-900 transition-colors ${
                    selectedWheel.id === wheel.id ? 'border-[#ccff00]' : 'border-zinc-800'
                  }`}
                >
                  <span className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                    <img src={wheel.image} alt={wheel.name} className="h-full w-full object-cover" />
                  </span>
                  <div className="text-[11px] truncate">
                    <p className="font-bold text-white leading-tight">{wheel.name}</p>
                    <span className="text-zinc-500 font-mono text-[9px]">Offset ET{wheel.offset} • {wheel.color}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-zinc-800 space-y-3">
            
            {/* Quick Vehicle info summary */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-3 font-mono text-[10px] text-zinc-400 space-y-1">
              <div className="text-white text-[11px] font-bold font-sans uppercase mb-1">สตรีทเซ็ตอัปตรงเบอร์:</div>
              <div className="flex justify-between">
                <span>รถเป้าหมาย:</span>
                <strong className="text-white">{selectedVehicle.brand} {selectedVehicle.model}</strong>
              </div>
              <div className="flex justify-between">
                <span>รหัสรูแม็กซ์:</span>
                <strong className="text-[#ccff00]">{selectedVehicle.pcd}</strong>
              </div>
              <div className="flex justify-between">
                <span>ขนาดล้อฟิตติ้ง:</span>
                <strong className="text-zinc-200">{selectedWheel.size}″ x {selectedWheel.width}J Offset +{selectedWheel.offset}</strong>
              </div>
            </div>

            {/* Solid Order CTA Button */}
            <button
              onClick={() => {
                onAddToCart(selectedWheel);
                onTrackAction('stripeCheckoutClicks');
              }}
              className="w-full py-3 bg-[#ccff00] text-[#0a0a0a] rounded-xl font-sans font-black text-xs uppercase tracking-wider text-center hover:bg-lime-400 duration-300"
            >
              ตกลง เอาชุดล้อ {selectedWheel.brand} นี้!
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
