import React from 'react';
import { Product } from '../types';
import { Scale, X, ShoppingCart, Sliders } from 'lucide-react';

interface ComparisonDrawerProps {
  comparisonList: Product[];
  onRemoveFromComparison: (product: Product) => void;
  onClearComparison: () => void;
  onAddToCart: (product: Product) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function ComparisonDrawer({
  comparisonList = [],
  onRemoveFromComparison,
  onClearComparison,
  onAddToCart,
  isOpen,
  onClose
}: ComparisonDrawerProps) {
  if (!isOpen || comparisonList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 overflow-hidden bg-[#0d0d0d]/95 border-t border-zinc-800 shadow-2xl backdrop-blur-xl animate-slide-up select-none">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Header bar and Close button */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          
          <div className="flex items-center space-x-2.5">
            <Scale className="w-5 h-5 text-[#ccff00]" />
            <h3 className="font-sans font-black text-sm uppercase text-white tracking-wider">
              แผงเปรียบเทียบสเปกออฟเซ็ต ({comparisonList.length}/4)
            </h3>
            <span className="text-[10px] text-zinc-500 font-bold uppercase hidden sm:inline">• เปรียบเทียบได้สูงสุด 4 รายการ</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onClearComparison}
              className="text-xs font-bold text-rose-400 hover:text-white transition-colors"
            >
              เคลียร์ทั้งหมด
            </button>
            <button
              onClick={onClose}
              className="rounded-full bg-zinc-900 p-1 text-zinc-400 hover:text-white border border-zinc-800 cursor-pointer"
              aria-label="ปิดกล่องเปรียบเทียบ"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Dense Comparison Grid */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 overflow-x-auto">
          {comparisonList.slice(0, 4).map((p) => {
            const isWheel = p.type === 'wheel';
            
            return (
              <div 
                key={p.id}
                className="relative rounded-xl border border-zinc-800 bg-[#070707] p-3 space-y-3.5 flex flex-col justify-between"
              >
                
                {/* Delete specific column */}
                <button
                  onClick={() => onRemoveFromComparison(p)}
                  className="absolute top-2 right-2 text-zinc-500 hover:text-rose-400 z-10"
                  title="ถอนตัวเลือกล้อแม็กซ์"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Micro preview */}
                <div className="space-y-2">
                  <div className="h-20 w-fit rounded-lg overflow-hidden border border-zinc-900/60 mx-auto">
                    <img src={p.image} alt={p.name} className="h-full object-cover shrink-0" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs truncate text-center text-white">{p.name}</h4>
                    <span className="block text-[9px] text-[#ccff00] uppercase font-bold text-center font-mono tracking-widest">{p.brand}</span>
                  </div>
                </div>

                {/* Technical Specifications Comparison metrics list */}
                <div className="rounded-lg bg-zinc-950 p-2 font-mono text-[10px] text-zinc-500 space-y-1">
                  
                  <div className="flex justify-between border-b border-zinc-900 pb-1 text-white font-bold">
                    <span>ประเภท:</span>
                    <span>{isWheel ? 'ล้อแม็กซ์ (Wheel)' : 'ยางซิ่ง (Tyre)'}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>ราคาต่อวง/เส้น:</span>
                    <strong className="text-zinc-200">{p.price.toLocaleString()} ฿</strong>
                  </div>

                  {isWheel ? (
                    <>
                      <div className="flex justify-between">
                        <span>ขอบวงล้อ (Size):</span>
                        <strong className="text-[#ccff00]">{p.size}″ J</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>กว้าง (Width):</span>
                        <strong className="text-zinc-300">{p.width}J</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>ออฟเซ็ต (Offset):</span>
                        <strong className="text-zinc-300">ET{p.offset}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>เจาะรูดุม (PCD):</span>
                        <strong className="text-zinc-300">{p.pcdCompat?.[0]}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>สีแม็กซ์ (Color):</span>
                        <strong className="text-zinc-400 truncate max-w-[60px]">{p.color}</strong>
                      </div>
                      <div className="flex justify-between text-emerald-400 font-extrabold pb-0.5">
                        <span>น้ำหนัก (Weight):</span>
                        <span>{p.weight} kg</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span>ขนาดยืนยาง (Width):</span>
                        <strong className="text-[#ccff00]">{p.tireWidth} mm</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>สเปกแก้ม (Aspect):</span>
                        <strong className="text-zinc-300">{p.tireAspect}%</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>สปอร์ตขอบล้อ:</span>
                        <strong className="text-zinc-300">R{p.tireSizeCompat}″</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>ดัชนีเร็วแก๊งค์:</span>
                        <strong className="text-zinc-300">{p.speedRating}</strong>
                      </div>
                      <div className="flex justify-between text-sky-400 font-bold">
                        <span>เนื้อยาง (Compound):</span>
                        <span className="truncate max-w-[60px]">{p.compound}</span>
                      </div>
                      <div className="h-5"></div>
                    </>
                  )}

                </div>

                {/* Instant Checkout and order triggers in Comparison box */}
                <button
                  onClick={() => onAddToCart(p)}
                  disabled={p.stock === 0}
                  className="w-full py-1.5 bg-[#ccff00] text-[#0a0a0a] rounded-lg text-[10px] font-black uppercase text-center flex items-center justify-center space-x-1 cursor-pointer hover:bg-lime-400 font-sans disabled:opacity-40"
                >
                  <ShoppingCart className="w-3 h-3" />
                  <span>สั่งซื้อขอบล้อนี้</span>
                </button>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
