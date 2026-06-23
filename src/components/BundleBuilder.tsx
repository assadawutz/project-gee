import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { mockProducts } from '../data/mockData';
import { Sparkles, HelpCircle, Package, ArrowRight, ShieldCheck, CheckSquare, Coins, BadgePercent, FileText } from 'lucide-react';

interface BundleBuilderProps {
  products: Product[];
  onAddBundleToCart: (wheel: Product, tire: Product, quantitySet: number, discount: number) => void;
  onTrackAction: (event: string) => void;
}

export default function BundleBuilder({
  products = mockProducts,
  onAddBundleToCart,
  onTrackAction
}: BundleBuilderProps) {
  const wheelsList = products.filter((p) => p.type === 'wheel');
  const tiresList = products.filter((p) => p.type === 'tire');

  const [selectedWheel, setSelectedWheel] = useState<Product>(wheelsList[0]);
  const [selectedTire, setSelectedTire] = useState<Product>(tiresList[0]);
  
  // Set configurations (typically cars require standard 4 wheels + 4 tires)
  const [quantity, setQuantity] = useState<number>(4); // e.g. set of 4 wheels

  // Discounts logic:
  // - Wheels + Tires bundle gets 10% standard discount.
  // - If buying standard set of 4, append a flat 2,500 THB JDM loyalty coupon discount!
  const wheelTotal = selectedWheel.price * quantity;
  const tireTotal = selectedTire.price * quantity;
  const rawSubTotal = wheelTotal + tireTotal;

  // Calculate savings
  const tenPercentOff = rawSubTotal * 0.10;
  const loyaltyBonus = quantity === 4 ? 2500 : 0;
  const finalDiscount = Math.round(tenPercentOff + loyaltyBonus);
  const finalPayAmount = rawSubTotal - finalDiscount;

  // Compatibility Checks
  const sizeCompatMsg = selectedWheel.size === selectedTire.tireSizeCompat 
    ? { ok: true, text: `ตรงไซส์พอดีเป๊ะ! (ขอบ ${selectedWheel.size} เท่ากัน)` }
    : { ok: false, text: `ขนาดขอบล้อกับแก้มยางไม่แมทซ์กันเกรงว่าจะใส่ยากครับพี่! (ล้อขอบ ${selectedWheel.size} ยางขอบ ${selectedTire.tireSizeCompat})` };

  const handleAddBundle = () => {
    onAddBundleToCart(selectedWheel, selectedTire, quantity, finalDiscount);
    onTrackAction('bundleBuilds');
  };

  const exportToPDFInvoice = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF('p', 'mm', 'a4');

      // Styles & Palette
      const primaryColor = '#111111';
      const accentColor = '#ddff00';

      // 1. Sleek Dark Header Banner
      doc.setFillColor(17, 17, 17);
      doc.rect(0, 0, 210, 38, 'F');

      // Brand Title
      doc.setTextColor(221, 255, 0); // Neon Lime
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('GEE BUNDLE SAVER', 15, 16);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text('CO., LTD. - BANGKOK RACING GARAGE', 15, 22);
      doc.text('HIGH-PERFORMANCE WHEEL & TIRE COMBINATION QUOTE', 15, 27);

      // Metajet Info (Right side)
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(8);
      doc.text('DOCUMENT NO: GEE-BUN-2026-4411', 140, 15);
      const currentTime = new Date().toLocaleString();
      doc.text(`ISSUED DATE: ${currentTime}`, 140, 20);
      doc.text('VALUATION: OFFICIAL BUNDLE ESTIMATE', 140, 25);
      doc.text('STATUS: COMBO DISCOUNT VERIFIED', 140, 30);

      // Neon Split Line
      doc.setDrawColor(221, 255, 0);
      doc.setLineWidth(1);
      doc.line(0, 38, 210, 38);

      // SECTION 1: CUSTOM BUNDLE SUMMARY
      doc.setTextColor(17, 17, 17);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('1. SELECTED WHEEL & TIRE SUMMARY', 15, 52);

      // Background info card
      doc.setFillColor(245, 245, 247);
      doc.rect(15, 56, 180, 52, 'F');
      doc.setDrawColor(220, 220, 225);
      doc.setLineWidth(0.3);
      doc.rect(15, 56, 180, 52);

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(50, 50, 50);

      doc.text('Selected Wheel (ล้อแม็กซ์):', 20, 64);
      doc.setFont('Helvetica', 'bold');
      doc.text(`${selectedWheel.brand} ${selectedWheel.name} (R${selectedWheel.size})`, 75, 64);
      
      doc.setFont('Helvetica', 'normal');
      doc.text('Selected Tire (ยางซิ่ง):', 20, 71);
      doc.setFont('Helvetica', 'bold');
      doc.text(`${selectedTire.brand} ${selectedTire.name} (Spec fit: ${selectedTire.tireWidth}/${selectedTire.tireAspect} R${selectedTire.tireSizeCompat})`, 75, 71);

      doc.setFont('Helvetica', 'normal');
      doc.text('Combination Compatibility:', 20, 78);
      doc.setFont('Helvetica', 'bold');
      doc.text(sizeCompatMsg.ok ? 'COMPATIBLE (ติดตั้งเข้าคู่สำเร็จ 100%)' : 'WARNING (ขอบยางล้อไม่สอดคล้อง)', 75, 78);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(50, 50, 50);

      doc.text('Bundle Quantity (จำนวน):', 20, 85);
      doc.setFont('Helvetica', 'bold');
      doc.text(`${quantity} wheels and ${quantity} tires`, 75, 85);

      doc.setFont('Helvetica', 'normal');
      doc.text('Target Hub Bolt Pattern:', 20, 92);
      doc.setFont('Helvetica', 'bold');
      doc.text(`JDM Standard Match Hub CB ${selectedWheel.cbCompat || '73.1'}`, 75, 92);

      doc.setFont('Helvetica', 'normal');
      doc.text('Guarantee / Warranty:', 20, 99);
      doc.setFont('Helvetica', 'bold');
      doc.text('GEE RACING 3-YEAR COMPONENT WARRANTY', 75, 99);

      // SECTION 2: COST ESTIMATE CALCULATIONS
      doc.setTextColor(17, 17, 17);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('2. COST ESTIMATE CALCULATIONS & DISCOUNT PLAN', 15, 122);

      doc.setFillColor(248, 250, 252);
      doc.rect(15, 126, 180, 54, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(15, 126, 180, 54);

      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.setFont('Helvetica', 'bold');
      doc.text('BILLING DESCRIPTION', 20, 134);
      doc.text('SPECIFICATIONS & VALUE', 75, 134);
      doc.text('QTY', 145, 134);
      doc.text('UNIT PRICE', 165, 134);

      doc.setDrawColor(226, 232, 240);
      doc.line(15, 138, 195, 138);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 30, 30);

      // Wheels
      doc.text(`${selectedWheel.brand} Wheels Set`, 20, 144);
      doc.text(`Width ${selectedWheel.width}J Offset +${selectedWheel.offset} JDM Spec`, 75, 144);
      doc.text(`x ${quantity}`, 145, 144);
      doc.text(`${selectedWheel.price.toLocaleString()} THB`, 165, 144);

      // Tires
      doc.text(`${selectedTire.brand} Performance Tires`, 20, 151);
      doc.text(`Speed Compound rating: ${selectedTire.speedRating || 'Y'}`, 75, 151);
      doc.text(`x ${quantity}`, 145, 151);
      doc.text(`${selectedTire.price.toLocaleString()} THB`, 165, 151);

      // Mounting & Installation
      doc.text('Mounting & Wheel Balancing', 20, 158);
      doc.text('Wheel-alignment diagnostics set', 75, 158);
      doc.text('1 Set', 145, 158);
      doc.text('Free gift', 165, 158);

      doc.line(15, 163, 195, 163);

      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(80, 80, 80);
      doc.text(`Pre-discount Subtotal:`, 110, 168);
      doc.text(`${rawSubTotal.toLocaleString()} THB`, 165, 168);

      doc.setTextColor(220, 50, 50);
      doc.text(`Combo Discount (10%):`, 110, 172);
      doc.text(`- ${tenPercentOff.toLocaleString()} THB`, 165, 172);

      if (loyaltyBonus > 0) {
        doc.text(`Loyalty Set Bonus:`, 110, 176);
        doc.text(`- ${loyaltyBonus.toLocaleString()} THB`, 165, 176);
      }

      // Dark Box Total Highlight
      doc.setFillColor(17, 17, 17);
      doc.rect(110, 182, 85, 10, 'F');
      doc.setTextColor(221, 255, 0);
      doc.setFontSize(10);
      doc.text(`NET COMBO PRICE:`, 113, 188.5);
      doc.text(`${finalPayAmount.toLocaleString()} THB`, 155, 188.5);

      // Footnotes
      doc.setTextColor(110, 110, 115);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(`* Optional Installment Plan: (ดอกเบี้ย 0% x 6เดือน) = ตกเพียงเดือนละ ${(finalPayAmount / 6).toFixed(0).toLocaleString()} THB / เดือน เท่านั้น`, 15, 195);

      // Layout divider and terms
      doc.setDrawColor(220, 220, 225);
      doc.setLineWidth(0.3);
      doc.line(15, 230, 195, 230);

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      doc.text('TERMS & CONDITIONS (เงื่อนไขและข้อตกลง):', 15, 236);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('1. Pre-sale quotes are matching standard car sizes. Valid for immediate fit-check at showroom.', 15, 240);
      doc.text('2. Combo includes free metal valve stem cores, lifetime nitrogen top-up at our Bangkok workshop.', 15, 243);
      doc.text('3. GEE RACER guarantee covers 100% paint chipping & forging integrity under professional street.', 15, 246);

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('GEE GARAGE REPRESENTATIVE', 140, 236);
      doc.line(140, 248, 190, 248);
      doc.setFont('Helvetica', 'normal');
      doc.text('Authorized Signature & Official Stamp', 140, 251);

      doc.save(`GEE_COMBO_QUOTE_${selectedWheel.brand}_${selectedWheel.name}.pdf`);
      onTrackAction('pdfQuoteExports');
    } catch (e) {
      console.error("PDF combination quote export failed: ", e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title Section */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0a0a0a]/50 p-6 md:p-8 backdrop-blur-md">
        <span className="rounded-full bg-[#ccff00] text-[#0a0a0a] px-3 py-1 text-xs font-black uppercase tracking-wider inline-block">
          SUPER BUNDLE SAVER
        </span>
        <h2 className="mt-3 font-sans font-black tracking-tight text-2xl md:text-3xl uppercase italic text-white">
          Gee <span className="text-[#ccff00]">Bundle Builder & Discount Calculator</span>
        </h2>
        <p className="mt-2 text-sm text-zinc-400 font-medium">
          ระบบคำนวณราคาพิเศษเมื่อจับคู่ซื้อ ล้อแม็ก + ยางสมรรถนะสูง! ยิ่งจัดเซ็ตใหญ่ ยิ่งคืนเบิ้ลโบนัสส่วนลดสูงสุดถึง 12% ทันทีที่จองจิ้ม!
        </p>
      </div>

      {/* Main double selector layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Selector panels */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* WHEELS SELECTOR PANEL */}
            <div className="rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-5 space-y-4">
              <div className="flex items-center space-x-2 border-b border-zinc-900 pb-2.5">
                <Package className="w-5 h-5 text-[#ccff00]" />
                <h3 className="font-sans font-black text-sm uppercase text-white">1. เลือกล้อฟอร์จที่ชอบ (Wheel)</h3>
              </div>
              
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {wheelsList.map((wheel) => (
                  <button
                    key={wheel.id}
                    onClick={() => setSelectedWheel(wheel)}
                    className={`w-full flex items-center p-2.5 rounded-xl border text-left bg-zinc-950/40 hover:bg-zinc-950 duration-200 transition-colors ${
                      selectedWheel.id === wheel.id ? 'border-[#ccff00]' : 'border-zinc-900'
                    }`}
                  >
                    <span className="h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden">
                      <img src={wheel.image} alt={wheel.name} className="h-full w-full object-cover" />
                    </span>
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="font-black text-xs text-white truncate">{wheel.name}</p>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        ขอบ {wheel.size}J × กว้าง {wheel.width} | {wheel.price.toLocaleString()} ฿
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Wheel Microcard preview */}
              <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 text-xs">
                <span className="text-[9px] uppercase font-black text-[#ccff00]">ล้อแม็กซ์ที่เลือกปัจจุบัน:</span>
                <p className="font-bold text-white mt-0.5">{selectedWheel.name}</p>
                <div className="mt-1 flex justify-between text-[11px] font-mono text-zinc-400">
                  <span>ราคาดั้งเดิม:</span>
                  <span className="text-[#ccff00] font-black">{(selectedWheel.price).toLocaleString()} ฿ / วง</span>
                </div>
              </div>

            </div>

            {/* TIRES SELECTOR PANEL */}
            <div className="rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-5 space-y-4">
              <div className="flex items-center space-x-2 border-b border-zinc-900 pb-2.5">
                <Sparkles className="w-5 h-5 text-sky-400" />
                <h3 className="font-sans font-black text-sm uppercase text-white">2. เลือกยางซิ่งที่ใช่ (Tyre)</h3>
              </div>
              
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {tiresList.map((tire) => (
                  <button
                    key={tire.id}
                    onClick={() => setSelectedTire(tire)}
                    className={`w-full flex items-center p-2.5 rounded-xl border text-left bg-zinc-950/40 hover:bg-zinc-950 duration-200 transition-colors ${
                      selectedTire.id === tire.id ? 'border-[#ccff00]' : 'border-zinc-900'
                    }`}
                  >
                    <span className="h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden">
                      <img src={tire.image} alt={tire.name} className="h-full w-full object-cover" />
                    </span>
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="font-black text-xs text-white truncate">{tire.name}</p>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        ขอบ {tire.tireSizeCompat}″ | หน้ากว้าง {tire.tireWidth} | {tire.price.toLocaleString()} ฿
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Tire Microcard preview */}
              <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 text-xs">
                <span className="text-[9px] uppercase font-black text-sky-400">ยางสปอร์ตที่เลือกปัจจุบัน:</span>
                <p className="font-bold text-white mt-0.5">{selectedTire.name}</p>
                <div className="mt-1 flex justify-between text-[11px] font-mono text-zinc-400">
                  <span>ราคาดั้งเดิม:</span>
                  <span className="text-sky-400 font-black">{(selectedTire.price).toLocaleString()} ฿ / เส้น</span>
                </div>
              </div>

            </div>

          </div>

          {/* COMPATIBILITY ASSESSMENT BANNER */}
          <div className={`p-4 rounded-xl border ${sizeCompatMsg.ok ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-400' : 'bg-rose-950/20 border-rose-800/40 text-rose-400'} flex items-center space-x-3 text-xs`}>
            <ShieldCheck className="w-5 h-5 flex-shrink-0 animate-pulse" />
            <div>
              <p className="font-black uppercase tracking-wider">เช็คฟิตติ้งแมทซ์ล้อ+ยาง:</p>
              <p className="mt-0.5 text-zinc-300 font-semibold">{sizeCompatMsg.text}</p>
            </div>
          </div>

        </div>

        {/* Right Column: Checkout savings & config controls */}
        <div className="lg:col-span-4 rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-6 space-y-6 flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <span className="text-[10px] font-black uppercase text-[#ccff00] tracking-widest">Pricing Panel</span>
              <h3 className="font-sans font-black text-lg text-white">คำนวณราคาจัดชุดเซต</h3>
            </div>

            {/* Set Quantity Slider selector */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-zinc-300">จำนวนจัดแต่งล้อ + ยาง (Quantity):</span>
                <span className="font-mono text-[#ccff00] font-black">{quantity} วง+เส้น</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 4, 8].map((qty) => (
                  <button
                    key={qty}
                    onClick={() => setQuantity(qty)}
                    className={`py-1.5 rounded-lg text-xs font-black uppercase border transition-all ${
                      quantity === qty 
                        ? 'bg-[#ccff00] text-[#0a0a0a] border-[#ccff00]' 
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {qty === 4 ? 'ครบเซ็ต (4)' : `× ${qty}`}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-zinc-500 font-medium">จัดชุด ครบเซ็ต (4 วง) รับโบนัสคูปองส่วนลดพิเศษเพิ่มขึ้นทันที!</p>
            </div>

            {/* Calculations math values */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-4 font-mono text-xs text-zinc-400 space-y-2">
              <div className="flex justify-between border-b border-zinc-900 pb-2 text-white">
                <span>สรุปสเปกจัดเซต:</span>
                <span className="font-sans font-black uppercase text-[#ccff00]">R18 Track Set</span>
              </div>
              <div className="flex justify-between">
                <span>ราคารวมล้อแม็ก:</span>
                <span className="text-zinc-200">{(selectedWheel.price * quantity).toLocaleString()} ฿</span>
              </div>
              <div className="flex justify-between">
                <span>ราคารวมยางซิ่ง:</span>
                <span className="text-zinc-200">{(selectedTire.price * quantity).toLocaleString()} ฿</span>
              </div>
              <div className="flex justify-between text-[#ccff00]">
                <span>ราคารวมปกติ:</span>
                <span className="font-bold">{(rawSubTotal).toLocaleString()} ฿</span>
              </div>

              {/* Bonus / Coupon items showcase */}
              <div className="border-t border-zinc-900 pt-2 space-y-1 text-emerald-400">
                <div className="flex justify-between text-[11px]">
                  <span className="flex items-center"><BadgePercent className="w-3.5 h-3.5 mr-1" /> ล้อ+ยางลด Combo 10%:</span>
                  <span>- {tenPercentOff.toLocaleString()} ฿</span>
                </div>
                {loyaltyBonus > 0 && (
                  <div className="flex justify-between text-[11px]">
                    <span className="flex items-center"><Coins className="w-3.5 h-3.5 mr-1" /> ครบชุด 4 ล้อลดเพิ่ม:</span>
                    <span>- {loyaltyBonus.toLocaleString()} ฿</span>
                  </div>
                )}
                <div className="flex justify-between font-bold border-t border-zinc-900 pt-1 text-emerald-400">
                  <span>ประหยัดได้ทั้งสิ้น:</span>
                  <span>- {(finalDiscount).toLocaleString()} ฿</span>
                </div>
              </div>

            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-zinc-800">
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase font-bold text-zinc-400">ราคาสุทธิทั้งเซต:</span>
              <span className="text-2xl font-black italic tracking-tight text-[#ccff00]">
                {finalPayAmount.toLocaleString()} <span className="text-xs font-normal">฿</span>
              </span>
            </div>

            {/* Add Bundle and continue */}
            <button
              onClick={handleAddBundle}
              disabled={!sizeCompatMsg.ok}
              className="w-full py-3 bg-[#ccff00] text-[#0a0a0a] rounded-xl font-sans font-black text-xs uppercase tracking-wider text-center hover:bg-lime-400 disabled:opacity-40 disabled:cursor-not-allowed duration-300 cursor-pointer"
            >
              หยิบชุดเซตลงตะกร้าทันที!
            </button>

            {/* Custom Interactive PDF Exporter for combination quote */}
            <button
              onClick={exportToPDFInvoice}
              className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl text-xs font-black uppercase text-center transition-all hover:border-[#ccff00] hover:text-[#ccff00] flex items-center justify-center space-x-2 cursor-pointer"
              title="ส่งออกเอกสารใบเสนอราคาเซตโปรโมชั่นล้อบวกยางคุณภาพสูง (PDF Quote)"
            >
              <FileText className="w-3.5 h-3.5 text-[#ccff00]" />
              <span>ส่งออกใบเสนอราคาเซต PDF (EN/TH)</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
