import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Vehicle, Product } from '../types';
import { mockVehicles } from '../data/mockData';
import { 
  Sliders, 
  CheckCircle2, 
  Star, 
  Eye, 
  Plus, 
  Scale, 
  ShieldCheck,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Flame,
  Sparkles,
  TrendingUp,
  LayoutGrid,
  Tag,
  X,
  Info,
  Maximize2,
  Filter,
  Cpu,
  Heart
} from 'lucide-react';

interface FitmentEngineProps {
  vehicles?: Vehicle[];
  products: Product[];
  onSelectProductForTryOn: (vehicle: Vehicle, wheel: Product) => void;
  onAddToCart: (product: Product) => void;
  onAddToComparison: (product: Product) => void;
  comparisonList: Product[];
  onTrackAction: (event: string) => void;
  wishlist?: Product[];
  onToggleWishlist?: (product: Product) => void;
}

interface ProductCardProps {
  product: Product;
  isWheel: boolean;
  inComparison: boolean;
  currentVehicle: Vehicle | null;
  onAddToCart: (product: Product) => void;
  onSelectProductForTryOn: (vehicle: Vehicle, wheel: Product) => void;
  onAddToComparison: (product: Product) => void;
  onOpenQuickLook: (product: Product) => void;
  wishlist?: Product[];
  onToggleWishlist?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product: p,
  isWheel,
  inComparison,
  currentVehicle,
  onAddToCart,
  onSelectProductForTryOn,
  onAddToComparison,
  onOpenQuickLook,
  wishlist,
  onToggleWishlist
}) => {
  const isFavorited = wishlist?.some((item) => item.id === p.id) ?? false;
  const [isTechPopoverOpen, setIsTechPopoverOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <motion.div
      layout
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 20 } }
      }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-5 shadow-lg transition-all duration-300 hover:border-[#ccff00]/40 hover:shadow-[0_0_20px_rgba(204,255,0,0.08)]"
    >
      {/* Accent Ribbon for Stock levels */}
      <div className="absolute top-3 right-3 z-10 flex items-center space-x-1.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleWishlist) onToggleWishlist(p);
          }}
          className={`rounded-full transition-colors border p-2 cursor-pointer shadow-lg flex items-center justify-center ${
            isFavorited
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-500 hover:bg-rose-900/40'
              : 'bg-zinc-950/90 border-zinc-800 text-zinc-400 hover:bg-rose-950/20 hover:text-rose-500 hover:border-rose-500/30'
          }`}
          title={isFavorited ? "นำออกจากรายการโปรด" : "บันทึกในรายการโปรด"}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-500' : ''}`} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenQuickLook(p);
          }}
          className="rounded-full bg-zinc-950/90 hover:bg-[#ccff00] hover:text-black transition-colors border border-zinc-800 p-2 text-zinc-350 cursor-pointer shadow-lg flex items-center justify-center"
          title="ดูตัวอย่างสเปกด่วน (Quick Look)"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        {p.stock > 0 ? (
          <span className="rounded-full bg-emerald-950/85 border border-emerald-800 text-emerald-400 px-2 py-0.5 text-[9px] font-extrabold font-mono">
            เหลือ {p.stock} วง/เส้น
          </span>
        ) : (
          <span className="rounded-full bg-rose-950/85 border border-rose-800 text-rose-400 px-2 py-0.5 text-[9px] font-extrabold font-mono">
            หมดสต็อก
          </span>
        )}
      </div>

      {/* Product Layout */}
      <div className="space-y-4">
        {/* Photo Section with Hover-to-Zoom interactive mouse tracking */}
        <div 
          className="relative h-44 w-full rounded-xl bg-zinc-950 overflow-hidden border border-zinc-900 cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setMousePos({ x: 50, y: 50 });
          }}
        >
          <img 
            src={p.image} 
            alt={p.name} 
            referrerPolicy="no-referrer"
            style={{
              transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
              transform: isHovered ? 'scale(1.75)' : 'scale(1.0)',
              transition: isHovered ? 'transform 0.05s ease-out' : 'transform 0.3s ease-out'
            }}
            className="h-full w-full object-cover pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 pointer-events-none">
            <span className="rounded bg-black/70 px-2 py-0.5 text-[9px] uppercase font-bold text-zinc-300 tracking-wider">
              {p.brand}
            </span>
            {isWheel ? (
              <span className="rounded bg-[#ccff00] text-[#0a0a0a] px-1.5 py-0.5 text-[9px] font-black uppercase">
                Forged R{p.size}
              </span>
            ) : (
              <span className="rounded bg-sky-550 text-white px-1.5 py-0.5 text-[9px] font-black uppercase">
                Sports Tyre
              </span>
            )}
          </div>
        </div>

        {/* Core Content */}
        <div>
          <h3 className="font-sans font-black text-lg leading-tight uppercase text-white group-hover:text-[#ccff00] transition-colors">{p.name}</h3>
          <p className="mt-1 text-xs text-zinc-400 line-clamp-2 h-8 font-medium leading-relaxed">{p.description}</p>
        </div>

        {/* High Quality Specification values */}
        <div className="relative rounded-xl bg-zinc-950/60 p-3 border border-zinc-900/80 font-mono text-[11px] text-zinc-400 space-y-1">
          {isWheel ? (
            <>
              <div className="flex justify-between">
                <span>ขนาด (Size/Offset):</span>
                <strong className="text-white font-black">{p.size}″ x {p.width}J ET{p.offset}</strong>
              </div>
              <div className="flex justify-between">
                <span>ค่ารู PCD ตรงรุ่น:</span>
                <strong className="text-[#ccff00]">{p.pcdCompat?.join(', ')}</strong>
              </div>
              <div className="flex justify-between">
                <span>น้ำหนัก (Weight/Net):</span>
                <strong className="text-zinc-200">{p.weight} kg (ระดับเบาพิเศษ)</strong>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <span>สเปกขนาดยาง (Width/Aspect):</span>
                <strong className="text-white font-black">{p.tireWidth}/{p.tireAspect} R{p.tireSizeCompat}</strong>
              </div>
              <div className="flex justify-between">
                <span>ยางคอมปาวด์ (Compound):</span>
                <strong className="text-[#ccff00]">{p.compound}</strong>
              </div>
              <div className="flex justify-between">
                <span>Speed limits (Max):</span>
                <strong className="text-zinc-200">{p.speedRating} (รถแข่งสนามซิ่ง)</strong>
              </div>
            </>
          )}

          {/* Interactive Technical Details Popover Trigger */}
          <div className="pt-2 border-t border-zinc-900 flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsTechPopoverOpen(!isTechPopoverOpen);
              }}
              className="text-[10px] font-sans font-black uppercase text-[#ccff00]/80 hover:text-[#ccff00] flex items-center space-x-1 cursor-pointer"
            >
              <Info className="w-3 h-3" />
              <span>{isTechPopoverOpen ? 'ปิดสเปกละเอียด' : 'เจาะลึกสเปกเทคนิคพิเศษ ⚙️'}</span>
            </button>
          </div>

          {/* Technical Details Popover */}
          <AnimatePresence>
            {isTechPopoverOpen && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-x-0 bottom-full mb-2 bg-[#121212]/95 border border-zinc-800 rounded-xl p-3 shadow-2xl z-20 text-zinc-300 space-y-2 pointer-events-auto backdrop-blur-md"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                  <span className="text-[10px] font-black uppercase text-[#ccff00] flex items-center space-x-1">
                    <Cpu className="w-3 h-3 text-[#ccff00]" />
                    <span>Technical Spec Sheet</span>
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTechPopoverOpen(false);
                    }}
                    className="text-zinc-500 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                {isWheel ? (
                  <div className="space-y-1.5 text-[10px] font-semibold text-left">
                    <p><span className="text-zinc-500">PCD Match:</span> <strong className="text-white font-mono">{p.pcdCompat?.join(', ') || 'N/A'}</strong></p>
                    <p><span className="text-zinc-500">Offset (ET):</span> <strong className="text-[#ccff00] font-mono">ET{p.offset} mm</strong> (หลบคาร์ลิปเปอร์เบรกใหญ่พรีเมียมได้สบาย)</p>
                    <p><span className="text-zinc-500">Center Bore (CB):</span> <strong className="text-white font-mono">{p.cbCompat || 73.1} mm</strong> (ติดตั้ง Hub Ring สำหรับเติมเต็มช่องว่าง)</p>
                    <p><span className="text-zinc-500">Face Profile:</span> <strong className="text-white">Form-Z Ultra Concave Face</strong></p>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-[10px] font-semibold text-left">
                    <p><span className="text-zinc-500">Rim Compatibility:</span> <strong className="text-[#ccff00] font-mono">{p.tireSizeCompat}″ Rims</strong> (เหมาะกับกระทะล้อกว้าง {p.tireWidth ? Math.floor(p.tireWidth / 25.4) - 1.5 : '8.5'}-{p.tireWidth ? Math.floor(p.tireWidth / 25.4) + 0.5 : '9.5'}J)</p>
                    <p><span className="text-zinc-500">Speed Multiplier:</span> <strong className="text-white font-mono">Rating {p.speedRating || 'Y'}</strong> (ทนทานความร้อนสูง ความเร็วแรงแซงโค้ง)</p>
                    <p><span className="text-zinc-500">Compound Type:</span> <strong className="text-white">{p.compound || 'Semi-Slick Formula'}</strong></p>
                    <p><span className="text-zinc-500">Treadwear Index:</span> <strong className="text-white font-mono">TW 200 AA A (แก้มหนาโค้งดีเยี่ยม)</strong></p>
                  </div>
                )}
                
                <div className="text-[8.5px] text-zinc-500 italic border-t border-zinc-900 pt-1 leading-normal text-left">
                  *สเตปการตั้งค่าระดับอุตสาหกรรม การควบคุมด้วยศูนย์ตั้งล้อซิ่งไร้สั่นสะเทือน 100%
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Pricing & Control Hub */}
      <div className="mt-4 pt-3 border-t border-zinc-900">
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500">ราคาแนะนำพิเศษ:</span>
          <span className="text-xl font-black italic tracking-tight text-[#ccff00]">
            {p.price.toLocaleString()} <span className="text-xs font-normal">฿</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Primary Purchase / Add to basket */}
          <button
            onClick={() => onAddToCart(p)}
            disabled={p.stock === 0}
            className="w-full py-2 bg-zinc-900 border border-zinc-800 text-white rounded-lg text-xs font-black uppercase text-center transition-all hover:bg-[#ccff00] hover:text-[#0a0a0a] disabled:opacity-45 hover:border-[#ccff00] flex items-center justify-center space-x-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ใส่ตะกร้า</span>
          </button>

          {/* Virtual Fitting Simulator launch */}
          {isWheel ? (
            <button
              onClick={() => {
                const veh = currentVehicle || mockVehicles[0]; // fallback default JDM
                onSelectProductForTryOn(veh, p);
              }}
              className="w-full py-2 bg-[#ccff00]/10 border border-[#ccff00]/20 text-[#ccff00] rounded-lg text-xs font-black uppercase text-center transition-all hover:bg-[#ccff00]/20 flex items-center justify-center space-x-1 cursor-pointer"
              title="ลองดูว่าล้อนี้ใส่บนรถพี่จะเท่แค่ไหน!"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>ลองใส่รถ</span>
            </button>
          ) : (
            <button
              disabled
              className="w-full py-2 bg-zinc-950 border border-zinc-900 text-zinc-700 rounded-lg text-xs font-medium uppercase text-center flex items-center justify-center cursor-not-allowed"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ขอบ {p.tireSizeCompat}″</span>
            </button>
          )}
        </div>

        {/* Add to Comparison Checklist Drawer */}
        <button
          onClick={() => onAddToComparison(p)}
          className={`mt-2 w-full py-1.5 text-[10px] font-black uppercase tracking-wider rounded border text-center transition-all flex items-center justify-center space-x-1 cursor-pointer ${
            inComparison 
              ? 'bg-amber-950/20 border-amber-800/40 text-amber-400 hover:text-rose-400' 
              : 'bg-zinc-950/40 border-zinc-900 text-zinc-500 hover:text-white hover:border-zinc-700'
          }`}
        >
          <Scale className="w-3 h-3" />
          <span>{inComparison ? 'ถอนตัวเปรียบเทียบ' : 'นำเข้าเปรียบเทียบสเปก'}</span>
        </button>
      </div>
    </motion.div>
  );
}

export default function FitmentEngine({
  vehicles = mockVehicles,
  products = [],
  onSelectProductForTryOn,
  onAddToCart,
  onAddToComparison,
  comparisonList,
  onTrackAction
}: FitmentEngineProps) {
  // Filter states
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedSubModel, setSelectedSubModel] = useState<string>('');
  
  // Custom states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'wheel' | 'tire'>('all');
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  
  // Layout States: 'hybrid' | 'carousel' | 'grid' | 'list'
  const [layoutMode, setLayoutMode] = useState<'hybrid' | 'carousel' | 'grid' | 'list'>('hybrid');
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  // Slide-out Filter Drawer states
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>('all'); // 'all' | 'under20k' | '20kto35k' | 'over35k'
  const [selectedWeightClass, setSelectedWeightClass] = useState<string>('all'); // 'all' | 'ultralight' | 'light' | 'regular'

  // Quick Look Overlay State
  const [selectedQuickLookProduct, setSelectedQuickLookProduct] = useState<Product | null>(null);

  // Derive filter choices
  const brands = Array.from(new Set(vehicles.map((v) => v.brand)));
  const filteredModels = vehicles
    .filter((v) => v.brand === selectedBrand)
    .map((v) => v.model)
    .filter((v, i, self) => self.indexOf(v) === i);
    
  const filteredYears = vehicles
    .filter((v) => v.brand === selectedBrand && v.model === selectedModel)
    .map((v) => v.year)
    .filter((v, i, self) => self.indexOf(v) === i);

  const filteredSubModels = vehicles
    .filter((v) => v.brand === selectedBrand && v.model === selectedModel && v.year === selectedYear)
    .map((v) => v.subModel)
    .filter((v, i, self) => self.indexOf(v) === i);

  // Update current active vehicle representation
  useEffect(() => {
    if (selectedBrand && selectedModel && selectedYear && selectedSubModel) {
      const found = vehicles.find(
        (v) =>
          v.brand === selectedBrand &&
          v.model === selectedModel &&
          v.year === selectedYear &&
          v.subModel === selectedSubModel
      );
      if (found) {
        setCurrentVehicle(found);
        onTrackAction('fitmentSearches');
      }
    } else {
      setCurrentVehicle(null);
    }
  }, [selectedBrand, selectedModel, selectedYear, selectedSubModel, vehicles]);

  // Compatibility logic:
  // - If a vehicle is selected, filter wheels by PCD compatibility (e.g. 5x114.3 is compatible with ['5x114.3']), and show proper tire size match.
  // - Include premium slide-out drawer attributes
  const filteredProducts = products.filter((p) => {
    // Search query
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category tabs
    const matchesCategory = activeCategory === 'all' ? true : p.type === activeCategory;

    if (!matchesSearch || !matchesCategory) return false;

    // Vehicle Fitment Match
    if (currentVehicle) {
      if (p.type === 'wheel') {
        const carriesPcd = p.pcdCompat?.includes(currentVehicle.pcd) ?? false;
        if (!carriesPcd) return false;
      }
    }

    // 1. Wheel Finishes Filter
    if (p.type === 'wheel' && selectedFinishes.length > 0) {
      const colorLower = (p.color || '').toLowerCase();
      const matchAnyFinish = selectedFinishes.some(f => {
        if (f === 'bronze') return colorLower.includes('bronze') || colorLower.includes('almite');
        if (f === 'black') return colorLower.includes('black') || colorLower.includes('dark');
        if (f === 'silver') return colorLower.includes('silver') || colorLower.includes('machined') || colorLower.includes('face');
        if (f === 'gunmetal') return colorLower.includes('gunmetal') || colorLower.includes('grey') || colorLower.includes('carbon');
        return colorLower.includes(f.toLowerCase());
      });
      if (!matchAnyFinish) return false;
    }

    // 2. Price ranges (Under 20k, 20k-35k, Over 35k)
    if (selectedPriceTier !== 'all') {
      if (selectedPriceTier === 'under20k' && p.price >= 20000) return false;
      if (selectedPriceTier === '20kto35k' && (p.price < 20000 || p.price > 35000)) return false;
      if (selectedPriceTier === 'over35k' && p.price <= 35000) return false;
    }

    // 3. Weight classes (Under 8.0kg - S-Light, 8.0-9.5kg - Light, Over 9.5kg - Regular)
    if (selectedWeightClass !== 'all') {
      if (p.type === 'wheel') {
        const wt = p.weight || 0;
        if (selectedWeightClass === 'ultralight' && wt >= 8.0) return false;
        if (selectedWeightClass === 'light' && (wt < 8.0 || wt > 9.5)) return false;
        if (selectedWeightClass === 'regular' && wt <= 9.5) return false;
      }
    }

    return true;
  });

  const clearFilters = () => {
    setSelectedBrand('');
    setSelectedModel('');
    setSelectedYear('');
    setSelectedSubModel('');
    setCurrentVehicle(null);
    setSelectedFinishes([]);
    setSelectedPriceTier('all');
    setSelectedWeightClass('all');
  };

  return (
    <div className="space-y-8">
      
      {/* Search Header and Fitment Selection Container */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0a0a0a]/50 p-6 md:p-8 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-[#ccff00]/10 to-transparent blur-2xl"></div>
        
        <div className="max-w-3xl">
          <h2 className="font-sans font-black tracking-tight text-2xl md:text-3xl uppercase italic text-white">
            Gee <span className="text-[#ccff00]">Fitment Engine</span>
          </h2>
          <p className="mt-2 text-sm text-zinc-400 font-medium">
            ระบบตรวจสอบค่าออฟเซ็ตและเบอร์ล้ออัจฉริยะ ค้นหาเฉพาะรุ่นที่สามารถใส่เป๊ะพอดีซุ้มล้อรถของพี่ ไม่ขูดโช้ค ไม่ติดแร็คพวงมาลัย 100%!
          </p>
        </div>

        {/* 4-Level Selector Form */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Brand */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">1. แบรนด์รถยนต์ (Brand)</label>
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setSelectedModel('');
                setSelectedYear('');
                setSelectedSubModel('');
              }}
              className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm font-bold text-white focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] outline-none"
            >
              <option value="">-- เลือกยี่ห้อ --</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Model */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">2. รุ่นรถ (Model)</label>
            <select
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value);
                setSelectedYear('');
                setSelectedSubModel('');
              }}
              disabled={!selectedBrand}
              className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm font-bold text-white focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] outline-none disabled:opacity-40"
            >
              <option value="">-- เลือกรุ่น --</option>
              {filteredModels.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">3. ปีรถ (Year)</label>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSelectedSubModel('');
              }}
              disabled={!selectedModel}
              className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm font-bold text-white focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] outline-none disabled:opacity-40"
            >
              <option value="">-- เลือกปีทอง --</option>
              {filteredYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Submodel */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">4. เครื่องยนต์/ตัวถัง (Sub-model)</label>
            <select
              value={selectedSubModel}
              onChange={(e) => setSelectedSubModel(e.target.value)}
              disabled={!selectedYear}
              className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm font-bold text-white focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] outline-none disabled:opacity-40"
            >
              <option value="">-- เลือกรุ่นย่อย --</option>
              {filteredSubModels.map((sm) => (
                <option key={sm} value={sm}>{sm}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Selected vehicle summary card */}
        {currentVehicle && (
          <div className="mt-6 flex flex-col md:flex-row items-center justify-between rounded-xl bg-[#ccff00]/5 border border-[#ccff00]/20 p-4 md:p-6 text-white animate-fade-in">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-lg bg-zinc-800 overflow-hidden hidden md:block">
                <img src={currentVehicle.image} alt="Vehicle silhouette" className="h-full w-full object-cover" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-sans font-black text-lg uppercase text-white">
                    {currentVehicle.brand} {currentVehicle.model} ({currentVehicle.year})
                  </span>
                  <span className="rounded-md bg-zinc-900 border border-zinc-700 px-2 py-0.5 text-[10px] font-bold text-zinc-300 uppercase">
                    {currentVehicle.subModel}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400 font-mono">
                  <span>PCD ตรงรุ่น: <strong className="text-[#ccff00]">{currentVehicle.pcd}</strong></span>
                  <span>Center Bore: <strong className="text-zinc-200">{currentVehicle.cb} mm</strong></span>
                  <span>เกลียวน็อต: <strong className="text-zinc-200">{currentVehicle.boltPattern}</strong></span>
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-3 w-full md:w-auto justify-end">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-[#ccff00] bg-[#ccff00]/10 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-4 h-4" />
                <span>เปิดโหมดแสดงเฉพาะแม็กตรงสปอร์ต</span>
              </div>
              <button 
                onClick={clearFilters}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 underline cursor-pointer"
              >
                ล้างข้อมูล
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Product list with dynamic filtering tabs */}
      <div className="space-y-6">
        
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 bg-zinc-950/60 p-4 rounded-2xl border border-zinc-900/80">
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Tabs for Category Selector */}
            <div className="flex space-x-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${activeCategory === 'all' ? 'bg-[#ccff00] text-[#0a0a0a]' : 'text-zinc-400 hover:text-white'}`}
              >
                ของแต่งทั้งหมด
              </button>
              <button
                onClick={() => setActiveCategory('wheel')}
                className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${activeCategory === 'wheel' ? 'bg-[#ccff00] text-[#0a0a0a]' : 'text-zinc-400 hover:text-white'}`}
              >
                ล้อแม็กซิ่ง (Rims)
              </button>
              <button
                onClick={() => setActiveCategory('tire')}
                className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${activeCategory === 'tire' ? 'bg-[#ccff00] text-[#0a0a0a]' : 'text-zinc-400 hover:text-white'}`}
              >
                ยางสมรรถนะสูง (Tyres)
              </button>
            </div>

            {/* Layout Selector Panel */}
            <div className="flex items-center space-x-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => setLayoutMode('hybrid')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${layoutMode === 'hybrid' ? 'bg-[#ccff00] text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
                title="ผสมผสานสับเปลี่ยนมุมมองสุดล้ำ"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Hybrid Mix</span>
              </button>
              <button
                onClick={() => setLayoutMode('carousel')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${layoutMode === 'carousel' ? 'bg-[#ccff00] text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
                title="ล้อหมุนพรีเมียมขนาดใหญ่ทีละรายการ"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Carousel</span>
              </button>
              <button
                onClick={() => setLayoutMode('grid')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${layoutMode === 'grid' ? 'bg-[#ccff00] text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
                title="ตารางกริดล้อซิ่งดีไซน์หรู"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setLayoutMode('list')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${layoutMode === 'list' ? 'bg-[#ccff00] text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
                title="สเปกชีตแบบเจาะลึกครบถ้วน"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>

            {/* Premium Slide-out Filter Drawer Trigger */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all bg-zinc-950 border border-zinc-900 hover:border-[#ccff00]/40 text-zinc-300 hover:text-[#ccff00] cursor-pointer"
              title="ตัวกรองคัดแยกขั้นสูง"
            >
              <Sliders className="w-3.5 h-3.5 text-[#ccff00]" />
              <span>ตัวกรองขั้นสูง</span>
              {(selectedFinishes.length > 0 || selectedPriceTier !== 'all' || selectedWeightClass !== 'all') && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccff00] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ccff00]"></span>
                </span>
              )}
            </button>
          </div>

          {/* Instant Search text input */}
          <div className="relative">
            <input
              type="text"
              placeholder="ค้นหาชื่อโมเดลล้อ / ยาง..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full xl:w-64 rounded-xl border border-zinc-800 bg-[#0a0a0a] px-4 py-2.5 text-xs font-semibold text-white focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] outline-none placeholder:text-zinc-600"
            />
          </div>

        </div>

        {/* Active Filters Horizontal Chip Row */}
        {(selectedFinishes.length > 0 || selectedPriceTier !== 'all' || selectedWeightClass !== 'all') && (
          <div className="flex flex-wrap items-center gap-2 bg-zinc-950/20 p-3 rounded-xl border border-zinc-900/60">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#ccff00]/80">ตัวกรองแยกสเปก:</span>
            
            {/* Finishes */}
            {selectedFinishes.map(fn => (
              <span key={fn} className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] rounded-lg text-[10px] font-bold">
                <span className="capitalize">{fn} Finish</span>
                <button 
                  onClick={() => setSelectedFinishes(prev => prev.filter(item => item !== fn))}
                  className="text-zinc-550 hover:text-white hover:bg-zinc-800 rounded p-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}

            {/* Price Tier */}
            {selectedPriceTier !== 'all' && (
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] rounded-lg text-[10px] font-bold">
                <span>ราคา: {selectedPriceTier === 'under20k' ? 'ต่ำกว่า 20K ฿' : selectedPriceTier === '20kto35k' ? '20K - 35K ฿' : 'เกิน 35K ฿'}</span>
                <button 
                  onClick={() => setSelectedPriceTier('all')}
                  className="text-zinc-550 hover:text-white hover:bg-zinc-800 rounded p-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}

            {/* Weight Class */}
            {selectedWeightClass !== 'all' && (
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] rounded-lg text-[10px] font-bold">
                <span>น้ำหนัก: {selectedWeightClass === 'ultralight' ? 'เบาพิเศษ (< 8kg)' : selectedWeightClass === 'light' ? 'เบาพอดี (8-9.5kg)' : 'สปอร์ต (> 9.5kg)'}</span>
                <button 
                  onClick={() => setSelectedWeightClass('all')}
                  className="text-zinc-550 hover:text-white hover:bg-zinc-800 rounded p-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}

            <button 
              onClick={() => {
                setSelectedFinishes([]);
                setSelectedPriceTier('all');
                setSelectedWeightClass('all');
              }}
              className="text-[10px] font-black uppercase text-rose-450 hover:underline ml-auto"
            >
              ล้างตัวกรองพิเศษทั้งหมด
            </button>
          </div>
        )}

        {/* Dynamic Items Listing layouts */}
        
        {/* UPPER SPOTLIGHT CAROUSEL for Hybrid mode */}
        {layoutMode === 'hybrid' && filteredProducts.length > 0 && (
          <div className="relative overflow-hidden rounded-2xl border border-[#ccff00]/20 bg-zinc-950 p-5 md:p-6 mb-6">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ccff00]/40 to-transparent"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-[#ccff00]">
                <Flame className="w-4 h-4 animate-bounce text-[#ccff00]" />
                <span className="text-xs font-black uppercase tracking-widest">แนะนําพิเศษระดับพรีเมียม (Premium Highlights)</span>
              </div>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => setCarouselIndex(prev => prev - 1)}
                  className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setCarouselIndex(prev => prev + 1)}
                  className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {(() => {
              const totalItems = filteredProducts.length;
              const activeCarouselIndex = ((carouselIndex % totalItems) + totalItems) % totalItems;
              const p = filteredProducts[activeCarouselIndex];
              const isWheel = p.type === 'wheel';
              const inComparison = comparisonList.some(item => item.id === p.id);
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Photo slide panel */}
                  <div className="md:col-span-4 relative h-48 md:h-56 rounded-xl bg-zinc-900 overflow-hidden border border-zinc-800/80">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <span className="absolute top-2 left-2 rounded bg-[#ccff00] text-black text-[9px] font-black uppercase px-2 py-0.5">
                      {p.brand} Spotlight
                    </span>
                  </div>

                  {/* Core Content side-car panel */}
                  <div className="md:col-span-8 flex flex-col justify-between h-full space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-sans font-black text-xl text-white uppercase group-hover:text-[#ccff00]">{p.name}</h4>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3.5 h-3.5 fill-[#ccff00] text-[#ccff00]" />
                          <span className="text-xs font-bold text-white">4.9</span>
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-zinc-400 leading-relaxed">{p.description}</p>
                    </div>

                    {/* Specs Panel */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono p-3 bg-zinc-900/60 rounded-xl border border-zinc-900 text-zinc-400">
                      {isWheel ? (
                        <>
                          <div>
                            <span>ขนาดล้อ (Size):</span>
                            <div className="text-white font-bold">{p.size}″ x {p.width}J</div>
                          </div>
                          <div>
                            <span>ค่ารู (PCD):</span>
                            <div className="text-[#ccff00] font-bold">{p.pcdCompat?.join(', ')}</div>
                          </div>
                          <div>
                            <span>ออฟเซ็ต/น้ำหนัก:</span>
                            <div className="text-zinc-250 font-bold">ET{p.offset} / {p.weight}kg</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <span>เบอร์ยาง (Aspect):</span>
                            <div className="text-white font-bold">{p.tireWidth}/{p.tireAspect} R{p.tireSizeCompat}</div>
                          </div>
                          <div>
                            <span>เนื้อเลเวล:</span>
                            <div className="text-[#ccff00] font-bold">{p.compound}</div>
                          </div>
                          <div>
                            <span>ความเร็วขีดจำกัด:</span>
                            <div className="text-zinc-250 font-bold">{p.speedRating} (MAX)</div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                      <div className="text-xs">
                        <span className="text-zinc-500 uppercase font-bold tracking-wider">ราคาชิงพิเศษ: </span>
                        <strong className="text-lg text-[#ccff00] font-black">{p.price.toLocaleString()} ฿</strong>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {/* Try on option */}
                        {isWheel && (
                          <button
                            onClick={() => {
                              const veh = currentVehicle || mockVehicles[0];
                              onSelectProductForTryOn(veh, p);
                            }}
                            className="px-3 py-1.5 bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] rounded-lg text-xs font-black uppercase hover:bg-[#ccff00]/20 flex items-center space-x-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>ลองใส่รถตัวอย่าง</span>
                          </button>
                        )}
                        
                        <button
                          onClick={() => onAddToCart(p)}
                          className="px-4 py-1.5 bg-[#ccff00] text-black rounded-lg text-xs font-black uppercase hover:opacity-90 flex items-center space-x-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>หยิบใส่รถของพี่</span>
                        </button>

                        <button
                          onClick={() => onAddToComparison(p)}
                          className={`p-1.5 rounded border text-center transition-all ${
                            inComparison 
                              ? 'bg-amber-950/20 border-amber-800/40 text-amber-400' 
                              : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'
                          }`}
                          title="เปรียบเทียบสเปก"
                        >
                          <Scale className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* FULLSTAND CAROUSEL SPECTACULAR MODE */}
        {layoutMode === 'carousel' && filteredProducts.length > 0 && (
          <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-[#070707] p-6 md:p-10">
            <div className="absolute -top-10 -left-10 h-36 w-36 bg-[#ccff00]/5 blur-3xl"></div>
            
            {(() => {
              const totalItems = filteredProducts.length;
              const activeIndex = ((carouselIndex % totalItems) + totalItems) % totalItems;
              const p = filteredProducts[activeIndex];
              const isWheel = p.type === 'wheel';
              const inComparison = comparisonList.some(item => item.id === p.id);

              return (
                <div className="space-y-8">
                  {/* Headline item and carousel navigation dots */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-zinc-900 pb-5">
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-widest text-[#ccff00]/70">Spotlight {activeIndex + 1} จากทั้งหมด {totalItems}</span>
                      <h3 className="font-sans font-black text-2xl md:text-3xl uppercase text-white tracking-tight">{p.name}</h3>
                      <p className="text-zinc-500 text-xs font-mono">{p.brand} Performance</p>
                    </div>

                    <div className="flex items-center space-x-3 bg-zinc-950 p-1.5 rounded-xl border border-zinc-900">
                      <button 
                        onClick={() => setCarouselIndex(prev => prev - 1)}
                        className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-[#ccff00] cursor-pointer"
                        title="รายการก่อนหน้า"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-xs font-mono font-bold text-zinc-400 px-2 min-w-[40px] text-center">
                        {activeIndex + 1} / {totalItems}
                      </span>
                      <button 
                        onClick={() => setCarouselIndex(prev => prev + 1)}
                        className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-[#ccff00] cursor-pointer"
                        title="รายการถัดไป"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Main content grid splitter */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    {/* Big photo window */}
                    <div className="lg:col-span-5 relative h-64 md:h-80 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transform hover:scale-105 duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 flex gap-2">
                        <span className="rounded bg-[#ccff00] text-[#0a0a0a] px-3 py-1 text-xs font-black uppercase">
                          {p.brand} Official
                        </span>
                        <span className="rounded bg-zinc-900 border border-zinc-800 px-3 py-1 text-xs font-bold text-zinc-300">
                          {isWheel ? 'Forged Rim' : 'Premium Tire'}
                        </span>
                      </div>
                    </div>

                    {/* Specifications deck */}
                    <div className="lg:col-span-7 space-y-6">
                      <div>
                        <span className="text-xs font-bold text-[#ccff00] uppercase tracking-widest flex items-center space-x-1">
                          <Sparkles className="w-3.5 h-3.5 text-[#ccff00]" />
                          <span>รายละเอียดสินค้าและเทคนิคออฟเซ็ตซิ่ง</span>
                        </span>
                        <p className="mt-2 text-sm text-zinc-300 leading-relaxed font-semibold">
                          {p.description}
                        </p>
                      </div>

                      {/* Technical checklist details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-zinc-900 bg-zinc-950/80 p-5">
                        {isWheel ? (
                          <>
                            <div className="space-y-1">
                              <span className="text-[10px] text-zinc-500 uppercase font-black uppercase block tracking-wider">ขนาดเส้นผ่านศูนย์กลาง (Diameter)</span>
                              <strong className="text-white text-sm font-mono block">{p.size} นิ้ว / หน้า {p.width}J</strong>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] text-zinc-500 uppercase font-black uppercase block tracking-wider">ค่าออฟเซ็ตล้อซิ่ง (OFFSET ET)</span>
                              <strong className="text-[#ccff00] text-sm font-mono block">ET{p.offset} (พอดีซุ้มรถญี่ปุ่น)</strong>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] text-zinc-500 uppercase font-black uppercase block tracking-wider">ค่ารูน็อต (Bolt Pattern PCD)</span>
                              <strong className="text-zinc-200 text-sm font-mono block">{p.pcdCompat?.join(', ')}</strong>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] text-zinc-500 uppercase font-black uppercase block tracking-wider">น้ำหนักสุทธิต่อวง (Net Weight)</span>
                              <strong className="text-[#ccff00] text-sm font-mono block">{p.weight} kg (โคตรเบาแข็งแรงพิเศษ)</strong>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="space-y-1">
                              <span className="text-[10px] text-zinc-500 uppercase font-black uppercase block tracking-wider">สัดส่วนพื้นที่หน้ากว้างยาง (Width/Aspect)</span>
                              <strong className="text-white text-sm font-mono block">{p.tireWidth} / {p.tireAspect}</strong>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] text-zinc-500 uppercase font-black uppercase block tracking-wider">ขนาดขอบจานล้อรองรับ (Rim Diameter)</span>
                              <strong className="text-[#ccff00] text-sm font-mono block">R{p.tireSizeCompat} นิ้ว</strong>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] text-zinc-500 uppercase font-black uppercase block tracking-wider">ชนิดคอมปาวด์ยางซิ่ง (Compound)</span>
                              <strong className="text-zinc-200 text-sm font-mono block">{p.compound} (รีดน้ำดีเยี่ยม ยึดเกาะหนึบสูงสุด)</strong>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] text-zinc-500 uppercase font-black uppercase block tracking-wider">พิกัดความเร็วรองรับ (Speed Index)</span>
                              <strong className="text-[#ccff00] text-sm font-mono block">{p.speedRating} (ซิ่งแรงต้านทานระดับโลก)</strong>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Buy Action buttons console */}
                      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-900 pt-5">
                        <div>
                          <p className="text-[10px] uppercase font-black tracking-widest text-[#ccff00]/60">ราคาสุทธิถอดประกอบ</p>
                          <strong className="text-2xl md:text-3xl font-black italic text-[#ccff00]">{p.price.toLocaleString()} ฿</strong>
                        </div>

                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => onAddToComparison(p)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase border flex items-center space-x-1.5 transition-all ${
                              inComparison 
                                ? 'bg-amber-950/20 border-amber-800/40 text-amber-400' 
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                            }`}
                          >
                            <Scale className="w-4 h-4" />
                            <span>{inComparison ? 'ถอนเปรียบเทียบ' : 'เพิ่มเพื่อเทียบเทียบ'}</span>
                          </button>

                          {isWheel && (
                            <button
                              onClick={() => {
                                const veh = currentVehicle || mockVehicles[0];
                                onSelectProductForTryOn(veh, p);
                              }}
                              className="px-5 py-2.5 bg-[#ccff00]/10 border border-[#ccff00]/20 text-[#ccff00] hover:bg-[#ccff00]/25 rounded-xl text-xs font-black uppercase flex items-center space-x-1.5 cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                              <span>ลองเสมือนจริง</span>
                            </button>
                          )}

                          <button
                            onClick={() => onAddToCart(p)}
                            disabled={p.stock === 0}
                            className="px-6 py-2.5 bg-[#ccff00] text-[#0a0a0a] rounded-xl text-xs font-black uppercase flex items-center space-x-1.5 hover:opacity-90 disabled:opacity-40 cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span>หยิบใส่รถของพี่</span>
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Indicators selector tray */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 pt-4">
                    {filteredProducts.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCarouselIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === activeIndex ? 'w-8 bg-[#ccff00]' : 'w-2 bg-zinc-800 hover:bg-zinc-700'
                        }`}
                      />
                    ))}
                  </div>

                </div>
              );
            })()}
          </div>
        )}

        {/* PRO DETAILS LIST (SPEC TABLE DISPLAY) */}
        {layoutMode === 'list' && filteredProducts.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/50 backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-900 text-left">
                <thead className="bg-[#0b0b0b] text-[10px] uppercase font-black text-zinc-400 tracking-wider">
                  <tr>
                    <th className="px-5 py-4">ยี่ห้อ / สินค้าเด่น</th>
                    <th className="px-5 py-4">ขนาดทางเทคนิค</th>
                    <th className="px-5 py-4">น้ำหนัก/ชนิดเนื้อ</th>
                    <th className="px-5 py-4">ข้อเด่นเด่น/PCD</th>
                    <th className="px-5 py-4">สถานะสต็อก</th>
                    <th className="px-5 py-4 text-right">ราคาจำหน่าย</th>
                    <th className="px-5 py-4 text-center">เมนูด่วน</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/40 text-xs text-zinc-300">
                  {filteredProducts.map((p) => {
                    const isWheel = p.type === 'wheel';
                    const inComparison = comparisonList.some(item => item.id === p.id);
                    
                    return (
                      <tr key={p.id} className="hover:bg-zinc-900/30 transition-colors">
                        {/* Title and image thumbnail */}
                        <td className="px-5 py-3">
                          <div className="flex items-center space-x-3.5">
                            <div className="h-11 w-11 rounded-lg bg-zinc-900 overflow-hidden border border-zinc-800 p-0.5 flex-shrink-0">
                              <img src={p.image} alt={p.name} className="h-full w-full object-cover rounded-md" />
                            </div>
                            <div>
                              <div className="font-bold text-white text-sm tracking-tight">{p.name}</div>
                              <div className="text-[10px] text-zinc-500 font-bold uppercase">{p.brand} ({isWheel ? 'Wheel' : 'Tire'})</div>
                            </div>
                          </div>
                        </td>

                        {/* Specs column */}
                        <td className="px-5 py-3">
                          {isWheel ? (
                            <span className="font-mono text-white font-bold">{p.size}″ x {p.width}J ET{p.offset}</span>
                          ) : (
                            <span className="font-mono text-white font-bold">{p.tireWidth}/{p.tireAspect} R{p.tireSizeCompat}</span>
                          )}
                        </td>

                        {/* Weight/Compound column */}
                        <td className="px-5 py-3 font-mono">
                          {isWheel ? (
                            <span className="text-zinc-400">{p.weight} kg (Lightweight)</span>
                          ) : (
                            <span className="text-zinc-400">{p.compound}</span>
                          )}
                        </td>

                        {/* Special matching bullet */}
                        <td className="px-5 py-3">
                          {isWheel ? (
                            <span className="rounded bg-zinc-900 border border-zinc-800 px-2 py-0.5 font-mono text-[10px] text-amber-400 font-bold">
                              {p.pcdCompat?.join(', ')}
                            </span>
                          ) : (
                            <span className="text-[10px] text-zinc-400 font-bold flex items-center space-x-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
                              <span>Speed: {p.speedRating}</span>
                            </span>
                          )}
                        </td>

                        {/* Stock counts */}
                        <td className="px-5 py-3">
                          {p.stock > 0 ? (
                            <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-2 py-0.5 rounded-full inline-block">
                              คงเหลือ {p.stock} {isWheel ? 'วง' : 'เส้น'}
                            </span>
                          ) : (
                            <span className="text-[10px] font-extrabold text-rose-400 bg-rose-950/40 border border-rose-900/60 px-2 py-0.5 rounded-full inline-block">
                              ของหมดชั่วคราว
                            </span>
                          )}
                        </td>

                        {/* Price count */}
                        <td className="px-5 py-3 text-right font-black italic text-sm text-[#ccff00]">
                          {p.price.toLocaleString()} ฿
                        </td>

                        {/* Action buttons list style */}
                        <td className="px-5 py-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center space-x-1.5">
                            {/* Compare */}
                            <button
                              onClick={() => onAddToComparison(p)}
                              className={`p-1.5 rounded transition-all bg-zinc-900 hover:bg-zinc-800 border ${
                                inComparison ? 'border-amber-500/50 text-amber-400' : 'border-zinc-800 text-zinc-500 hover:text-white'
                              }`}
                              title="เปรียบเทียบด่วน"
                            >
                              <Scale className="w-3.5 h-3.5" />
                            </button>

                            {/* Try-on */}
                            {isWheel && (
                              <button
                                onClick={() => {
                                  const veh = currentVehicle || mockVehicles[0];
                                  onSelectProductForTryOn(veh, p);
                                }}
                                className="p-1.5 bg-[#ccff00]/10 hover:bg-[#ccff00]/25 text-[#ccff00] rounded border border-[#ccff00]/20 cursor-pointer"
                                title="ประกอบจำลองบนตัวถังรถ"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Add item */}
                            <button
                              onClick={() => onAddToCart(p)}
                              disabled={p.stock === 0}
                              className="p-1.5 bg-[#ccff00] text-black disabled:opacity-30 rounded hover:opacity-90 flex items-center justify-center cursor-pointer"
                              title="หยิบใส่รถ"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DEFAULT (CLASSIC GRID) DISPLAY (Used when grid chosen OR below Hybrid's showcase spacer) */}
        {((layoutMode === 'grid') || (layoutMode === 'hybrid')) && filteredProducts.length > 0 && (
          <div className="space-y-4">
            
            {layoutMode === 'hybrid' && (
              <div className="flex items-center space-x-2 border-b border-zinc-900 pb-2 mt-4">
                <Tag className="w-4 h-4 text-zinc-500" />
                <span className="text-xs font-black uppercase text-zinc-500 tracking-wider">คลังอุปกรณ์รถซิ่งทั้งหมดตามเกณฑ์ตัวกรอง</span>
              </div>
            )}

            <motion.div 
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.06
                  }
                }
              }}
              initial="hidden"
              animate="show"
              key={`${selectedBrand}-${selectedModel}-${selectedYear}-${selectedSubModel}-${selectedPriceTier}-${selectedWeightClass}-${selectedFinishes.join(',')}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProducts.map((p) => {
                const isWheel = p.type === 'wheel';
                const inComparison = comparisonList.some(item => item.id === p.id);

                return (
                  <ProductCard
                    key={p.id}
                    product={p}
                    isWheel={isWheel}
                    inComparison={inComparison}
                    currentVehicle={currentVehicle}
                    onAddToCart={onAddToCart}
                    onSelectProductForTryOn={onSelectProductForTryOn}
                    onAddToComparison={onAddToComparison}
                    onOpenQuickLook={(prod) => setSelectedQuickLookProduct(prod)}
                    wishlist={wishlist}
                    onToggleWishlist={onToggleWishlist}
                  />
                );
              })}
            </motion.div>

          </div>
        )}

        {/* Empty state descriptor */}
        {filteredProducts.length === 0 && (
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-12 text-center">
            <Sliders className="mx-auto w-10 h-10 text-zinc-500 animate-bounce" />
            <h4 className="mt-4 font-sans font-bold text-base text-zinc-300">ไม่พบล้อซิ่งแมทซ์หรือยางพารารองรับเกณฑ์ค้นหาของพี่</h4>
            <p className="mt-1 text-xs text-zinc-500 max-w-md mx-auto">ลองเปลี่ยนเกณฑ์ PCD อื่น หรือล้างข้อมูลตัวกรองรถยนต์เพื่อดูลายล้อซิ่งยอดฮิตแถวหน้าของร้านได้เลยครับ!</p>
            <button 
              onClick={clearFilters}
              className="mt-4 px-4 py-1.5 bg-[#ccff00] text-[#0a0a0a] rounded-lg text-xs font-black uppercase hover:opacity-90"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
        )}

      </div>

      {/* 1. Slide-out Filter Drawer (Cabinet Drawer) */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterDrawerOpen(false)}
              className="fixed inset-0 bg-black z-50 backdrop-blur-xs cursor-pointer"
            />
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-[#090909] border-l border-zinc-800 p-6 shadow-2xl z-50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-[#ccff00]" />
                    <span className="font-sans font-black uppercase text-white tracking-wider text-sm">คัดกรองสเปกขั้นสูง (Special Filters)</span>
                  </div>
                  <button 
                    onClick={() => setIsFilterDrawerOpen(false)}
                    className="rounded-lg bg-zinc-905 border border-zinc-800 p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Wheel finish multi-select */}
                  <div className="space-y-3 text-left">
                    <h5 className="text-xs font-black uppercase text-zinc-400 tracking-wider">โทนสีและฟินิชขอบล้อ (Wheel Finishes)</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {['Bronze', 'Black', 'Silver', 'Gunmetal'].map(finish => {
                        const isSelected = selectedFinishes.includes(finish.toLowerCase());
                        return (
                          <button
                            key={finish}
                            onClick={() => {
                              const val = finish.toLowerCase();
                              setSelectedFinishes(prev => 
                                isSelected ? prev.filter(f => f !== val) : [...prev, val]
                              );
                            }}
                            className={`px-3 py-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
                              isSelected 
                                ? 'bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00]' 
                                : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:text-white'
                            }`}
                          >
                            <span>{finish}</span>
                            {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-[#ccff00]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price range selector */}
                  <div className="space-y-3 text-left">
                    <h5 className="text-xs font-black uppercase text-zinc-400 tracking-wider">ช่วงราคาจำหน่ายจำกัดงบ</h5>
                    <div className="space-y-2">
                      {[
                        { label: 'แสดงราคาจัดเต็มทั้งหมด', value: 'all' },
                        { label: 'งบเริ่มต้นเซฟๆ (ต่ำกว่า 20,000 ฿)', value: 'under20k' },
                        { label: 'ระดับกลางลู่วิ่งซิ่ง (20,000 ฿ - 35,000 ฿)', value: '20kto35k' },
                        { label: 'รุ่นใหญ่คาร์บอนตัวแท้ (มากกว่า 35,000 ฿)', value: 'over35k' }
                      ].map(item => {
                        const isSelected = selectedPriceTier === item.value;
                        return (
                          <button
                            key={item.value}
                            onClick={() => setSelectedPriceTier(item.value)}
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
                              isSelected 
                                ? 'bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00]' 
                                : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:text-white'
                            }`}
                          >
                            <span>{item.label}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-[#ccff00] flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Weight specifications */}
                  <div className="space-y-3 text-left">
                    <h5 className="text-xs font-black uppercase text-zinc-400 tracking-wider">ระดับชั้นน้ำหนักล้อ (Weight Class)</h5>
                    <div className="space-y-2">
                      {[
                        { label: 'แสดงน้ำหนักทั้งหมด', value: 'all' },
                        { label: 'ระดับเบาเป็นพิเศษปลิวลม (ต่ำกว่า 8.0 kg)', value: 'ultralight' },
                        { label: 'น้ำหนักขับขี่สนามพรีเมียม (8.0 kg - 9.5 kg)', value: 'light' },
                        { label: 'ทนแรงกระแทกความเร็วสูง (มากกว่า 9.5 kg)', value: 'regular' }
                      ].map(item => {
                        const isSelected = selectedWeightClass === item.value;
                        return (
                          <button
                            key={item.value}
                            onClick={() => setSelectedWeightClass(item.value)}
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
                              isSelected 
                                ? 'bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00]' 
                                : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:text-white'
                            }`}
                          >
                            <span>{item.label}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-[#ccff00] flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-900 pt-4 mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setSelectedFinishes([]);
                    setSelectedPriceTier('all');
                    setSelectedWeightClass('all');
                  }}
                  className="py-3 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 rounded-xl text-zinc-400 hover:text-white text-xs font-black uppercase text-center cursor-pointer"
                >
                  ล้างค่าตัวกรอง
                </button>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="py-3 bg-[#ccff00] text-black hover:opacity-90 rounded-xl text-xs font-black uppercase text-center cursor-pointer"
                >
                  นำไปค้นหาตัวกรอง
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 2. 'Quick Look' Large Model Overlay */}
      <AnimatePresence>
        {selectedQuickLookProduct && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedQuickLookProduct(null)}
              className="fixed inset-0 bg-black/90 z-50 backdrop-blur-xs cursor-pointer"
            />
            {/* Modal Body */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ type: 'spring', damping: 25 }}
                className="relative w-full max-w-3xl bg-[#090909] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
              >
                {/* Close Button top-right */}
                <button
                  onClick={() => setSelectedQuickLookProduct(null)}
                  className="absolute top-4 right-4 z-10 bg-black/80 hover:bg-[#ccff00]/20 border border-zinc-800 hover:border-[#ccff00]/40 p-2 text-zinc-400 hover:text-[#ccff00] rounded-full cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Visual Column */}
                  <div className="relative h-64 md:h-full min-h-[320px] bg-zinc-950 overflow-hidden">
                    <img 
                      src={selectedQuickLookProduct.image} 
                      alt={selectedQuickLookProduct.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover animate-pulse-slow" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    <div className="absolute bottom-5 left-5 right-5 space-y-1.5 text-left">
                      <span className="px-2.5 py-1 rounded bg-[#ccff00] text-black font-black uppercase text-[10px] tracking-wider">
                        {selectedQuickLookProduct.type === 'wheel' ? 'Custom Forged Wheel' : 'Sports Compound Tire'}
                      </span>
                      <h4 className="text-xl font-black text-white">{selectedQuickLookProduct.brand} Premium Series</h4>
                    </div>
                  </div>

                  {/* Highlights Details Column */}
                  <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
                    <div className="space-y-4 text-left">
                      <div>
                        <div className="text-xs uppercase font-extrabold text-[#ccff00] tracking-widest">{selectedQuickLookProduct.brand} Rims & Co</div>
                        <h3 className="text-2xl font-black uppercase tracking-tight text-white leading-tight mt-1">{selectedQuickLookProduct.name}</h3>
                      </div>

                      <p className="text-xs text-zinc-400 leading-relaxed font-semibold">
                        {selectedQuickLookProduct.description}
                      </p>

                      {/* Performance Highlights listing */}
                      <div className="space-y-2.5">
                        <span className="text-[10px] uppercase font-black text-zinc-500 tracking-wider">ไฮไลต์ประสิทธิภาพหลัก (Special Highlights)</span>
                        <ul className="space-y-1.5 text-xs text-zinc-300">
                          <li className="flex items-start space-x-2">
                            <span className="text-[#ccff00] mt-0.5">•</span>
                            <span><strong>Forging แกร่งผ่านความร้อนสูง 10k ตัน</strong>: แหนบเหล็กชิ้นเดียวลดปริมาตรรีโมเลกุล แข็งแรงเบาสุดขั้ว</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-[#ccff00] mt-0.5">•</span>
                            <span><strong>ช่องเบรกระบายพลังงานความร้อนสูง</strong>: อากาศไหลผ่านตัวเรือนเพื่อยืดอายุการซิ่งในสนามให้ปลอดภัย</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-[#ccff00] mt-0.5">•</span>
                            <span><strong>สารเคลือบ Nano-Finish สะกดสายตา</strong>: ต้านทานฝุ่นรอยและหินขูดเบยสนามสนามแข่งอย่างหายห่วง</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="border-t border-zinc-900 pt-6 flex flex-col space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-black uppercase text-zinc-500 tracking-widest">ราคาครบเครื่องแนะนำ</span>
                        <span className="text-2xl font-sans font-black italic text-[#ccff00]">{selectedQuickLookProduct.price.toLocaleString()} ฿</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <button
                          onClick={() => {
                            onAddToCart(selectedQuickLookProduct);
                            setSelectedQuickLookProduct(null);
                          }}
                          className="w-full py-3 bg-[#ccff00] text-black hover:opacity-90 rounded-xl text-xs font-black uppercase tracking-wide cursor-pointer flex items-center justify-center space-x-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>ใส่ตะกร้าช็อป</span>
                        </button>
                        <button
                          onClick={() => setSelectedQuickLookProduct(null)}
                          className="w-full py-3 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-black uppercase tracking-wide cursor-pointer"
                        >
                          ปิดหน้าต่าง
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
