import React, { useState } from "react";
import { UserProfile } from "../types";
import {
  User,
  Package,
  Calendar,
  Clock,
  Disc,
  Shield,
  ShieldCheck,
  Star,
  Award,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

interface UserDashboardProps {
  user: UserProfile;
  onLogout: () => void;
}

export default function UserDashboard({ user, onLogout }: UserDashboardProps) {
  const [reviewingItemId, setReviewingItemId] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("ขอบคุณสำหรับรีวิวครับพี่! ได้รับ 50 Gee Coins เรียบร้อยครับ");
    setReviewingItemId(null);
  };
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tight text-white flex items-center">
            My <span className="text-[#ccff00] ml-2">Garage</span>
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            ยินดีต้อนรับกลับมาครับพี่ {user.name}{" "}
            จัดการรถและประวัติการสั่งซื้อได้ที่นี่เลยครับ
          </p>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 border border-rose-500/50 text-rose-500 rounded-lg text-xs font-black uppercase hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          ออกจากระบบ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl border border-zinc-800 p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-[#ccff00] flex items-center justify-center shadow-[0_0_15px_rgba(204,255,0,0.2)]">
                <User className="w-8 h-8 text-[#ccff00]" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{user.name}</h3>
                <p className="text-xs text-zinc-400">{user.email}</p>
                {user.phone && (
                  <p className="text-xs text-zinc-400 mt-0.5">{user.phone}</p>
                )}
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-bold text-amber-500 uppercase tracking-wider">
                  Gee Coins
                </span>
              </div>
              <span className="text-2xl font-black font-mono text-[#ccff00]">
                {user.geeCoins.toLocaleString()}
              </span>
            </div>

            {/* Membership Progress Bar */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-[#ccff00]" />
                  <span className="text-[10px] font-black uppercase text-zinc-300 tracking-wider">
                    Tier: {user.membershipTier}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-zinc-500">
                  {user.totalSpend.toLocaleString()} / 350,000 ฿
                </span>
              </div>
              
              <div className="relative h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((user.totalSpend / 350000) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#ccff00] to-lime-400 shadow-[0_0_10px_rgba(204,255,0,0.4)]"
                />
              </div>

              <div className="flex items-center justify-between text-[9px] font-bold">
                <span className="text-zinc-500 italic">Next: Platinum Tier</span>
                <span className="text-[#ccff00] flex items-center">
                  <Zap className="w-2.5 h-2.5 mr-1" />
                  ลดเพิ่ม 12% ทันที
                </span>
              </div>
            </div>

            <p className="text-[10px] text-zinc-500 text-center mt-4">
              สะสมแต้ม Gee Coins และยอดใช้จ่ายเพื่อรับส่วนลดระดับ VIP
            </p>
          </div>

          {/* Saved Vehicles */}
          <div className="bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl border border-zinc-800 p-6">
            <h3 className="font-black text-sm uppercase tracking-wider text-white mb-4 flex items-center border-b border-zinc-900 pb-2">
              <Disc className="w-4 h-4 text-[#ccff00] mr-2" />
              รถยนต์คันโปรดของคุณ
            </h3>

            {user.savedVehicles.length > 0 ? (
              <div className="space-y-3">
                {user.savedVehicles.map((v, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 flex items-center space-x-3"
                  >
                    <img
                      src={v.image}
                      alt={v.model}
                      className="w-12 h-12 rounded object-cover border border-zinc-800"
                    />
                    <div>
                      <p className="font-bold text-xs">
                        {v.brand} {v.model}
                      </p>
                      <p className="text-[10px] text-zinc-400">
                        {v.year} • {v.subModel}
                      </p>
                      <p className="text-[10px] text-[#ccff00] font-mono mt-0.5">
                        PCD {v.pcd}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic text-center py-4">
                ยังไม่ได้บันทึกรถคันโปรด
              </p>
            )}
          </div>
        </div>

        {/* History */}
        <div className="md:col-span-2 space-y-6">
          {/* Order History */}
          <div className="bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl border border-zinc-800 p-6">
            <h3 className="font-black text-sm uppercase tracking-wider text-white mb-4 flex items-center border-b border-zinc-900 pb-2">
              <Package className="w-4 h-4 text-[#ccff00] mr-2" />
              ประวัติการสั่งซื้อ (Orders)
            </h3>

            {user.orders.length > 0 ? (
              <div className="space-y-4">
                {user.orders.map((order, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-950 p-4 rounded-xl border border-zinc-900"
                  >
                    <div className="flex justify-between items-center mb-3 border-b border-zinc-900 pb-2">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">
                          Order ID: {order.id}
                        </span>
                        <span className="text-xs text-zinc-300">
                          {new Date(order.createdAt).toLocaleDateString(
                            "th-TH",
                          )}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-1 rounded uppercase font-black tracking-wider ${
                          order.paymentStatus === "Paid"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>

                    <div className="space-y-4 mb-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-300">
                              {item.quantity}x {item.product.name}
                            </span>
                            <span className="font-mono text-zinc-400">
                              {(
                                item.product.price * item.quantity
                              ).toLocaleString()}{" "}
                              ฿
                            </span>
                          </div>
                          <div className="text-right">
                            {reviewingItemId ===
                            `${order.id}-${item.product.id}` ? (
                              <form
                                onSubmit={handleSubmitReview}
                                className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800 mt-2 text-left space-y-3"
                              >
                                <p className="text-[10px] uppercase font-black tracking-widest text-[#ccff00]">
                                  รีวิวสินค้า
                                </p>
                                <div className="flex space-x-1 cursor-pointer">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      onClick={() => setRating(star)}
                                      className={`w-5 h-5 ${rating >= star ? "fill-amber-400 text-amber-400" : "text-zinc-600"}`}
                                    />
                                  ))}
                                </div>
                                <textarea
                                  placeholder="แชร์ความประทับใจของคุณ..."
                                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white outline-none focus:border-[#ccff00] min-h-[60px]"
                                  required
                                ></textarea>
                                <div className="flex space-x-2">
                                  <button
                                    type="submit"
                                    className="px-3 py-1.5 bg-[#ccff00] text-black text-[10px] font-black uppercase rounded-lg"
                                  >
                                    ส่งรีวิวรับ Gee Coins
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setReviewingItemId(null)}
                                    className="px-3 py-1.5 bg-zinc-800 text-white text-[10px] font-black uppercase rounded-lg"
                                  >
                                    ยกเลิก
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <button
                                onClick={() => {
                                  setReviewingItemId(
                                    `${order.id}-${item.product.id}`,
                                  );
                                  setRating(5);
                                }}
                                className="text-[10px] font-bold text-[#ccff00] hover:underline"
                              >
                                + เขียนรีวิว
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-zinc-900">
                      <span className="text-xs font-bold text-zinc-400 uppercase">
                        ยอดรวมทั้งหมด
                      </span>
                      <span className="text-sm font-black text-[#ccff00] font-mono">
                        {order.totalAmount.toLocaleString()} ฿
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic text-center py-8">
                ยังไม่มีประวัติการสั่งซื้อครับพี่
              </p>
            )}
          </div>

          {/* Booking History */}
          <div className="bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl border border-zinc-800 p-6">
            <h3 className="font-black text-sm uppercase tracking-wider text-white mb-4 flex items-center border-b border-zinc-900 pb-2">
              <Calendar className="w-4 h-4 text-[#ccff00] mr-2" />
              คิวเข้ารับบริการ (Bookings)
            </h3>

            {user.bookings.length > 0 ? (
              <div className="space-y-4">
                {user.bookings.map((booking, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 flex justify-between items-center"
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Clock className="w-3.5 h-3.5 text-[#ccff00]" />
                        <span className="text-xs font-bold text-white">
                          {new Date(booking.date).toLocaleDateString("th-TH")} •{" "}
                          {booking.timeSlot}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400">
                        {booking.vehicleInfo}
                      </p>
                      <div className="mt-2 flex gap-1 flex-wrap">
                        {booking.servicesSelected.map((s, i) => (
                          <span
                            key={i}
                            className="text-[9px] bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-800"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-[10px] px-2 py-1 rounded uppercase font-black tracking-wider block mb-1 ${
                          booking.status === "Completed"
                            ? "bg-zinc-800 text-zinc-400"
                            : booking.status === "Confirmed"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {booking.status}
                      </span>
                      <span className="text-xs font-mono font-black text-[#ccff00]">
                        {booking.totalPrice.toLocaleString()} ฿
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic text-center py-8">
                ยังไม่มีคิวจองบริการครับ
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
