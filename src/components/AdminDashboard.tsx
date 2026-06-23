import React, { useState, useEffect } from 'react';
import { Product, Booking, Order } from '../types';
import { ShieldCheck, Layers, CalendarClock, TrendingUp, DollarSign, ShoppingCart, RefreshCw, Check, CheckSquare } from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  bookings: Booking[];
  orders: Order[];
  onUpdateProduct: (id: string, updatedData: Partial<Product>) => Promise<boolean>;
  onUpdateBookingStatus: (id: string, status: 'Confirmed' | 'Completed') => Promise<boolean>;
  onTrackAction: (event: string) => void;
  onShowToast?: (message: string, type?: 'success' | 'warn' | 'error' | 'info') => void;
}

export default function AdminDashboard({
  products = [],
  bookings = [],
  orders = [],
  onUpdateProduct,
  onUpdateBookingStatus,
  onTrackAction,
  onShowToast
}: AdminDashboardProps) {
  
  // Dashboard states
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [activeSegment, setActiveSegment] = useState<'overview' | 'inventory' | 'bookings' | 'orders'>('overview');
  const [loading, setLoading] = useState(false);

  // Edit stock states
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
      }
    } catch (err) {
      console.error("Could not fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [products, bookings, orders]);

  // Handle product edit dispatch
  const handleSaveProductEdit = async (productId: string) => {
    const success = await onUpdateProduct(productId, { price: editPrice, stock: editStock });
    if (success) {
      setEditingProductId(null);
      fetchAnalytics();
      if (onShowToast) {
        onShowToast("อัปเดตข้อมูลและจำนวนสต็อกสินค้าเรียบร้อยครับ!", "success");
      }
    } else {
      if (onShowToast) {
        onShowToast("ไม่สามารถอัปเดตสต็อกสินค้าได้ครับพี่!", "error");
      }
    }
  };

  // Status transitions
  const handleBookingPatch = async (bookingId: string, nextStatus: 'Confirmed' | 'Completed') => {
    const success = await onUpdateBookingStatus(bookingId, nextStatus);
    if (success) {
      fetchAnalytics();
    }
  };

  const totalRevenue = analyticsData?.revenue || orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-6">
      
      {/* Overview Card */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0a0a0a]/50 p-6 md:p-8 backdrop-blur-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-sans font-black tracking-tight text-2xl md:text-3xl uppercase italic text-white flex items-center space-x-2.5">
            <ShieldCheck className="w-8 h-8 text-[#ccff00]" />
            <span>Gee Live Management Portal</span>
          </h2>
          <p className="mt-1 text-sm text-zinc-400 font-medium">
            ระบบจัดสรรยอดสต็อก ปรับแต่งราคาตั้งลำซิ่ง และสกรีนคิวนายห้างโรงงานหลังร้านจีจี้ล้อซิ่งอัจฉริยะ!
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="flex items-center space-x-1.5 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-bold text-zinc-300 hover:text-white hover:border-[#ccff00] cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>รีโหลดข้อมูลสด</span>
        </button>
      </div>

      {/* Visual Analytics Quick Stats - 4 Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Revenue */}
        <div className="rounded-xl border border-zinc-900 bg-gradient-to-tr from-zinc-950 to-[#0c0c0c] p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[10px] uppercase font-black tracking-wider">มูลค่าคำสั่งซื้อรวม</span>
            <DollarSign className="w-4 h-4 text-[#ccff00]" />
          </div>
          <p className="text-2xl font-black italic tracking-tight text-[#ccff00]">{totalRevenue.toLocaleString()} ฿</p>
          <p className="text-[10px] text-zinc-400 font-mono">จากระบบชำระเงินตัดสตรีท (Stripe Real)</p>
        </div>

        {/* Clicks */}
        <div className="rounded-xl border border-zinc-900 bg-gradient-to-tr from-zinc-950 to-[#0c0c0c] p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[10px] uppercase font-black tracking-wider">ลองล้อเสมือนจริง</span>
            <Layers className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-black italic tracking-tight text-white">{analyticsData?.metrics?.virtualTries || 89} ครั้ง</p>
          <p className="text-[10px] text-zinc-400 font-mono">การจัดฟิตเมนต์แบบ Stance Simulator</p>
        </div>

        {/* Bookings */}
        <div className="rounded-xl border border-zinc-900 bg-gradient-to-tr from-zinc-950 to-[#0c0c0c] p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[10px] uppercase font-black tracking-wider">คิวงานลงชื่อวันนี้</span>
            <CalendarClock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black italic tracking-tight text-white">{bookings.length} คิวงาน</p>
          <p className="text-[10px] text-zinc-400 font-mono">สถานการณ์ต่ออู่บริการ: แน่นขนัด</p>
        </div>

        {/* Conversions */}
        <div className="rounded-xl border border-zinc-900 bg-gradient-to-tr from-zinc-950 to-[#0c0c0c] p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[10px] uppercase font-black tracking-wider">อัตราการปิดดีลสำเร็จ</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black italic tracking-tight text-emerald-400">12.4%</p>
          <p className="text-[10px] text-emerald-500 font-mono">เฉลี่ยของแต่งจัดเซตร่วม (Combo Sets)</p>
        </div>

      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex space-x-1 border-b border-zinc-800 pb-px">
        <button
          onClick={() => setActiveSegment('overview')}
          className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
            activeSegment === 'overview' ? 'border-[#ccff00] text-[#ccff00]' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          รายงานวิเคราะห์ขาย (Analytics Graph)
        </button>

        <button
          onClick={() => setActiveSegment('inventory')}
          className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
            activeSegment === 'inventory' ? 'border-[#ccff00] text-[#ccff00]' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          สต็อกและบอร์ดราคา (Inventory)
        </button>

        <button
          onClick={() => setActiveSegment('bookings')}
          className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
            activeSegment === 'bookings' ? 'border-[#ccff00] text-[#ccff00]' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          คัดกรองคิวติดตั้ง ({bookings.length})
        </button>

        <button
          onClick={() => setActiveSegment('orders')}
          className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
            activeSegment === 'orders' ? 'border-[#ccff00] text-[#ccff00]' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          ประวัติตัดบิล ({orders.length})
        </button>
      </div>

      {/* SECTION CONTENT BLOCKS */}

      {/* BLOCK 1: Clean responsive SVG click conversion analytics */}
      {activeSegment === 'overview' && (
        <div className="rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-sans font-black text-white text-sm uppercase">รายงานเปรียบเทียบพฤติกรรมการคลิกคัดสรร</h3>
              <p className="text-[10px] text-zinc-500">กราฟิกสถิติมูลค่ายอดฟิตเมนต์และ AI Chat ของผู้ใช้บนแพลตฟอร์ม</p>
            </div>
            <span className="rounded-md bg-[#ccff00]/10 text-[#ccff00] px-2 py-0.5 text-[9px] font-black uppercase border border-[#ccff00]/20 font-mono">LIVE FEED</span>
          </div>

          {/* Polished custom SVG diagram chart */}
          <div className="relative w-full h-64 bg-zinc-950 rounded-xl border border-zinc-900 p-4 flex flex-col justify-between">
            <svg className="w-full h-48 overflow-visible" viewBox="0 0 400 150">
              {/* grid paths */}
              <line x1="0" y1="20" x2="400" y2="20" stroke="#1c1c1c" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="0" y1="60" x2="400" y2="60" stroke="#1c1c1c" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="0" y1="100" x2="400" y2="100" stroke="#1c1c1c" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="0" y1="140" x2="400" y2="140" stroke="#1c1c1c" strokeWidth="0.5" />

              {/* Data curve line representing conversion points */}
              {/* Point 1: Fitment, Point 2: TryOn, Point 3: Bundles, Point 4: Stripe Checkout, Point 5: AIChat */}
              <path 
                d="M 20 120 L 100 60 L 180 85 L 260 135 L 340 70" 
                fill="none" 
                stroke="#ccff00" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                className="animate-pulse"
              />

              {/* Glowing circles overlay */}
              <circle cx="20" cy="120" r="4" fill="#0d0d0d" stroke="#ccff00" strokeWidth="2" />
              <circle cx="100" cy="60" r="4" fill="#0d0d0d" stroke="#ccff00" strokeWidth="2" />
              <circle cx="180" cy="85" r="4" fill="#0d0d0d" stroke="#ccff00" strokeWidth="2" />
              <circle cx="260" cy="135" r="4" fill="#0d0d0d" stroke="#ccff00" strokeWidth="2" />
              <circle cx="340" cy="70" r="4" fill="#0d0d0d" stroke="#ccff00" strokeWidth="2" />

              {/* Chart labels inline */}
              <text x="20" y="145" fill="#555" fontSize="7" fontStyle="bold" textAnchor="middle">FITMENT</text>
              <text x="100" y="145" fill="#555" fontSize="7" fontStyle="bold" textAnchor="middle">VIRTUAL TRY</text>
              <text x="180" y="145" fill="#555" fontSize="7" fontStyle="bold" textAnchor="middle">BUNDLE BUILD</text>
              <text x="260" y="145" fill="#555" fontSize="7" fontStyle="bold" textAnchor="middle">STRIPE PAY</text>
              <text x="340" y="145" fill="#555" fontSize="7" fontStyle="bold" textAnchor="middle">AI CHAT</text>
            </svg>

            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 border-t border-zinc-900 pt-2 px-1">
              <span>แกนตั้ง: ดัชนีความหนาแน่นของผู้เข้าชม</span>
              <span>แกนนอน: ฟีเจอร์หลักในการแต่งซิ่ง</span>
            </div>
          </div>

        </div>
      )}

      {/* BLOCK 2: Editable Inventory stock levels */}
      {activeSegment === 'inventory' && (
        <div className="rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-6 space-y-4">
          <div>
            <h3 className="font-sans font-black text-white text-sm uppercase">คลังสินค้าเบรกและล้อแม็ก</h3>
            <p className="text-[10px] text-zinc-500">ปรับเปลี่ยนสต็อกและราคารวมหน้าร้านตรงเบอร์สำหรับลูกค้า</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#050505] text-zinc-500 uppercase font-black tracking-wider">
                <tr>
                  <th className="p-3">ลายสินค้า</th>
                  <th className="p-3">แบรนด์</th>
                  <th className="p-3">ราคาดั้งเดิม (THB)</th>
                  <th className="p-3">ยอดสต็อกหน้าร้าน</th>
                  <th className="p-3 text-right">ปรับปรุง</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {products.map((p) => {
                  const isEditing = editingProductId === p.id;
                  
                  return (
                    <tr key={p.id} className="hover:bg-zinc-950/40">
                      <td className="p-3 font-sans font-bold text-white flex items-center space-x-2">
                        <img src={p.image} className="w-6 h-6 rounded-full object-cover border border-zinc-800" />
                        <span className="truncate max-w-[150px]">{p.name}</span>
                      </td>
                      <td className="p-3 text-zinc-400 font-sans">{p.brand}</td>
                      <td className="p-3">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                            className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 w-24 text-white text-xs font-bold font-mono text-[#ccff00]"
                          />
                        ) : (
                          <span className="text-white font-bold">{p.price.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="p-3">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(Number(e.target.value))}
                            className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 w-16 text-white text-xs font-bold font-mono"
                          />
                        ) : (
                          <span className={`${p.stock > 5 ? 'text-zinc-300' : 'text-rose-400 font-black'}`}>{p.stock}</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {isEditing ? (
                          <div className="flex space-x-1.5 justify-end">
                            <button
                              onClick={() => handleSaveProductEdit(p.id)}
                              className="bg-[#ccff00] text-[#0a0a0a] p-1 rounded hover:opacity-90"
                              title="บันทึกราคา"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingProductId(null)}
                              className="bg-zinc-900 border border-zinc-800 text-zinc-400 p-1 rounded hover:text-white"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingProductId(p.id);
                              setEditPrice(p.price);
                              setEditStock(p.stock);
                            }}
                            className="text-xs text-[#ccff00] font-bold hover:underline"
                          >
                            แก้ไขด่วน
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* BLOCK 3: Active installation booking verification queues */}
      {activeSegment === 'bookings' && (
        <div className="rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-6 space-y-4">
          <div>
            <h3 className="font-sans font-black text-white text-sm uppercase">คัดกรองจัดสรรคิวติดตั้งหน้าร้าน</h3>
            <p className="text-[10px] text-zinc-500">ตอบรับ อัปเดตยืนยัน หรือประเมินงานเสร็จสิ้นสำหรับลูกค้าที่ขับรถเข้าอู่</p>
          </div>

          <div className="space-y-3">
            {bookings.map((b) => (
              <div 
                key={b.id} 
                className="rounded-xl border border-zinc-900 bg-zinc-950 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs font-mono"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-sans font-black text-sm text-white">{b.customerName}</span>
                    <span className="text-zinc-500">({b.customerPhone})</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      b.status === 'Confirmed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  <p className="mt-1 font-bold text-zinc-400 font-sans uppercase">รถ: <strong className="text-zinc-200">{b.vehicleInfo}</strong></p>
                  <p className="text-[10px] text-zinc-600 mt-1">
                    บริการ: <strong className="text-zinc-400">{b.servicesSelected?.join(', ')}</strong>
                  </p>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                  <div className="text-right text-xs pr-2 border-r border-zinc-900">
                    <p className="text-zinc-500">นัดหมาย: <strong>{b.date} • {b.timeSlot}</strong></p>
                    <p className="font-black text-[#ccff00] italic">{b.totalPrice.toLocaleString()} ฿</p>
                  </div>

                  {b.status === 'Pending' && (
                    <button
                      onClick={() => handleBookingPatch(b.id, 'Confirmed')}
                      className="px-3 py-1.5 bg-[#ccff00] text-[#0a0a0a] rounded font-bold uppercase text-[10px] hover:bg-lime-400 cursor-pointer"
                    >
                      อนุมัติคิว (Confirm)
                    </button>
                  )}

                  {b.status === 'Confirmed' && (
                    <button
                      onClick={() => handleBookingPatch(b.id, 'Completed')}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded font-bold uppercase text-[10px] hover:bg-emerald-500 cursor-pointer"
                    >
                      จบงานแต่ง (Complete)
                    </button>
                  )}

                  {b.status === 'Completed' && (
                    <span className="text-zinc-600 font-bold uppercase text-[9px]">เสร็จสิ้นอย่างดี</span>
                  )}

                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* BLOCK 4: Orders History logs */}
      {activeSegment === 'orders' && (
        <div className="rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-6 space-y-4">
          <div>
            <h3 className="font-sans font-black text-white text-sm uppercase">แฟ้มประวัติบิลซิ่ง</h3>
            <p className="text-[10px] text-zinc-500">ตรวจสอบข้อมูลการเงิน สั่งเซตยาง+ล้อแม็กซ์ และส่วนลด bundle</p>
          </div>

          <div className="space-y-3">
            {orders.map((o) => (
              <div 
                key={o.id} 
                className="rounded-xl border border-zinc-900 bg-zinc-950 p-4 text-xs font-mono space-y-2.5 hover:border-zinc-800"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-[#ccff00]">BILL-ID: #{o.id}</span>
                  <span className="text-zinc-500">{new Date(o.createdAt).toLocaleString()}</span>
                </div>

                <div className="text-[11px] text-zinc-400 uppercase font-sans font-semibold">
                  ลูกค้า: <strong className="text-white">{o.customerName}</strong> ({o.customerPhone})
                </div>

                {/* Items in bill */}
                <ul className="divide-y divide-zinc-900 border-t border-b border-zinc-900 py-1.5">
                  {o.items?.map((item: any, idx: number) => (
                    <li key={idx} className="flex justify-between py-1 text-[11px]">
                      <span>{item.product.name} x {item.quantity}</span>
                      <strong className="text-zinc-200">{(item.product.price * item.quantity).toLocaleString()} ฿</strong>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-between items-baseline text-xs font-bold">
                  <span className="text-zinc-500">ยอดชำระสำเร็จ:</span>
                  <span className="text-[#ccff00] font-black text-sm italic">{o.totalAmount.toLocaleString()} ฿</span>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
