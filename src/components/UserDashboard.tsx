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
  FileText,
  Heart,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";

interface UserDashboardProps {
  user: UserProfile;
  onLogout: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onMoveToCart: (product: Product) => void;
}

export default function UserDashboard({ user, onLogout, wishlist, onRemoveFromWishlist, onMoveToCart }: UserDashboardProps) {
  const [reviewingItemId, setReviewingItemId] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("FIELD REPORT LOGGED SUCCESSFULLY! 50 REWARD CREDITS ISSUED.");
    setReviewingItemId(null);
  };
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-zinc-900 pb-6">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tight text-white flex items-center">
            User <span className="text-[#ff3300] ml-2">Garage</span>
          </h2>
          <p className="text-zinc-500 text-[10px] font-mono mt-2 tracking-widest uppercase">
            AUTHORIZED USER RECOGNIZED. MANAGE VEHICLE PROFILES AND PROCUREMENT HISTORY.
          </p>
        </div>
        <button
          onClick={onLogout}
          className="px-6 py-2.5 border border-zinc-800 text-zinc-400 rounded-lg text-[10px] font-black uppercase hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer tracking-widest"
        >
          Disconnect
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl border border-zinc-800 p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-zinc-950 border-2 border-[#ff3300] flex items-center justify-center shadow-[0_0_15px_rgba(255,51,0,0.15)] relative">
                <User className="w-6 h-6 text-[#ff3300]" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-[#0a0a0a]" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{user.name}</h3>
                <p className="text-xs text-zinc-500 font-mono">{user.email}</p>
                {user.phone && (
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">{user.phone}</p>
                )}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-zinc-400" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  Reward Credits
                </span>
              </div>
              <span className="text-xl font-black font-mono text-white">
                {user.geeCoins.toLocaleString()}
              </span>
            </div>

            {/* Membership Progress Bar */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-[#ff3300]" />
                  <span className="text-[10px] font-black uppercase text-[#ff3300] tracking-widest">
                    Tier: {user.membershipTier}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-zinc-500 font-mono">
                  {user.totalSpend.toLocaleString()} / 350,000 ฿
                </span>
              </div>
              
              <div className="relative h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((user.totalSpend / 350000) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-[#ff3300]"
                />
              </div>

              <div className="flex items-center justify-between text-[9px] font-bold">
                <span className="text-zinc-500 italic">Next: Platinum Tier</span>
                <span className="text-[#ff3300] flex items-center">
                  <Zap className="w-2.5 h-2.5 mr-1" />
                  +12% PROCUREMENT DISCOUNT
                </span>
              </div>
            </div>

            <p className="text-[10px] text-zinc-500 text-center mt-4">
              ACCUMULATE CREDITS TO UNLOCK HIGHER CLEARANCE TIERS
            </p>
          </div>

          {/* Saved Vehicles */}
          <div className="bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl border border-zinc-800 p-6">
            <h3 className="font-black text-sm uppercase tracking-wider text-white mb-4 flex items-center border-b border-zinc-900 pb-2">
              <Disc className="w-4 h-4 text-[#ff3300] mr-2" />
              REGISTERED PLATFORMS
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
                      <p className="text-[10px] text-[#ff3300] font-mono mt-0.5">
                        PCD {v.pcd}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic text-center py-4">
                NO PLATFORMS REGISTERED YET
              </p>
            )}
          </div>
        </div>

        {/* History */}
        <div className="md:col-span-2 space-y-6">
          {/* Order History */}
          <div className="bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl border border-zinc-800 p-6">
            <h3 className="font-black text-sm uppercase tracking-wider text-white mb-4 flex items-center border-b border-zinc-900 pb-2">
              <Package className="w-4 h-4 text-[#ff3300] mr-2" />
              LOGISTICS TRACKING
            </h3>
            
            {/* Visual Timeline Tracker */}
            <div className="relative mb-12 mt-6 px-4">
              {/* Timeline Line */}
              <div className="absolute top-4 left-0 w-full h-0.5 bg-zinc-900 z-0">
                 <div className="h-full bg-[#ff3300] w-1/3 shadow-[0_0_10px_rgba(255,51,0,0.4)]" />
              </div>
              
              <div className="relative z-10 flex justify-between items-center">
                {[
                  { label: 'Processing', date: '20 Oct', icon: Clock },
                  { label: 'Preparing Goods', date: '21 Oct', icon: Package },
                  { label: 'Shipping', date: 'Pending', icon: Zap },
                  { label: 'Delivered', date: 'Pending', icon: ShieldCheck }
                ].map((step, i) => (
                  <div key={step.label} className="flex flex-col items-center group">
                     <div className={`w-9 h-9 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${i <= 1 ? 'bg-[#ff3300] border-[#ff3300] text-black shadow-[0_0_20px_rgba(255,51,0,0.3)]' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}>
                        <step.icon className={`w-4 h-4 ${i === 1 ? 'animate-bounce' : ''}`} />
                     </div>
                     <div className="mt-3 text-center">
                        <span className={`text-[9px] font-black uppercase block tracking-widest ${i <= 1 ? 'text-white' : 'text-zinc-600'}`}>{step.label}</span>
                        <span className="text-[8px] font-bold text-zinc-500 block mt-0.5">{step.date}</span>
                     </div>
                  </div>
                ))}
              </div>
            </div>

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
                                <p className="text-[10px] uppercase font-black tracking-widest text-[#ff3300]">
                                  SUBMIT ENGINEERING FIELD REPORT
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
                                  placeholder="ENTER TELEMETRY / PERFORMANCE NOTES..."
                                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white outline-none focus:border-[#ff3300] min-h-[60px]"
                                  required
                                ></textarea>
                                <div className="flex space-x-2">
                                  <button
                                    type="submit"
                                    className="px-3 py-1.5 bg-[#ff3300] text-black text-[10px] font-black uppercase rounded-lg"
                                  >
                                    SUBMIT LOG (EARN CREDITS)
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setReviewingItemId(null)}
                                    className="px-3 py-1.5 bg-zinc-800 text-white text-[10px] font-black uppercase rounded-lg"
                                  >
                                    ABORT
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
                                className="text-[10px] font-bold text-[#ff3300] hover:underline uppercase"
                              >
                                + ADD FIELD REPORT
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
                      <span className="text-sm font-black text-[#ff3300] font-mono">
                        {order.totalAmount.toLocaleString()} ฿
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic text-center py-8">
                NO PROCUREMENT HISTORY DETECTED
              </p>
            )}
          </div>

          {/* Wishlist Section */}
          <div className="bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl border border-zinc-800 p-6">
            <h3 className="font-black text-sm uppercase tracking-wider text-white mb-4 flex items-center border-b border-zinc-900 pb-2">
              <Heart className="w-4 h-4 text-[#ff3300] mr-2" />
              WISH LIST
            </h3>
            
            {wishlist && wishlist.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 flex flex-col justify-between"
                  >
                    <div className="flex gap-4">
                       <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg border border-zinc-800" />
                       <div>
                         <h4 className="text-xs font-bold text-white uppercase">{item.brand}</h4>
                         <p className="text-xs text-zinc-400">{item.name}</p>
                         <p className="text-[#ff3300] font-mono text-xs mt-1">{item.price.toLocaleString()} ฿</p>
                       </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                       <button
                         onClick={() => {
                           onMoveToCart(item);
                           onRemoveFromWishlist(item);
                         }}
                         className="flex-1 bg-[#ff3300]/10 border border-[#ff3300]/30 hover:bg-[#ff3300] hover:text-black text-[#ff3300] text-[10px] font-black uppercase py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                       >
                         <ShoppingCart className="w-3 h-3" /> Move to Cart
                       </button>
                       <button
                         onClick={() => onRemoveFromWishlist(item)}
                         className="px-3 bg-zinc-900 hover:bg-rose-500/20 hover:text-rose-400 text-zinc-500 border border-zinc-800 hover:border-rose-500/30 text-[10px] rounded-lg transition-colors flex items-center justify-center"
                       >
                         <Trash2 className="w-3 h-3" />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic text-center py-8 font-mono">
                WISHLIST IS CURRENTLY EMPTY
              </p>
            )}
          </div>

            {/* Booking History */}
          <div className="bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl border border-zinc-800 p-6">
            <h3 className="font-black text-sm uppercase tracking-wider text-white mb-4 flex items-center border-b border-zinc-900 pb-2">
              <Calendar className="w-4 h-4 text-[#ff3300] mr-2" />
              SERVICE APPOINTMENTS
            </h3>
            
            <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-2xl mb-6">
               <p className="text-xs text-zinc-400 mb-4 font-mono">SCHEDULE NEXT MAINTENANCE APPOINTMENT (RECOMMENDED EVERY 10,000KM)</p>
               <button className="w-full py-3 bg-[#ff3300] text-black font-black uppercase text-xs rounded-xl tracking-widest hover:bg-[#ff4500] transition-colors">
                 RESERVE SERVICE BAY
               </button>
            </div>

            {user.bookings.length > 0 ? (
              <div className="space-y-4">
                {user.bookings.map((booking, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 flex justify-between items-center"
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Clock className="w-3.5 h-3.5 text-[#ff3300]" />
                        <span className="text-xs font-bold text-white font-mono">
                          {new Date(booking.date).toLocaleDateString("en-US")} •{" "}
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
                      <div className="flex flex-col items-end gap-1 mt-2">
                        <span className="text-xs font-mono font-black text-[#ff3300]">
                          {booking.totalPrice.toLocaleString()} ฿
                        </span>
                        {booking.status === "Completed" && (
                          <button className="text-[9px] font-bold text-zinc-500 hover:text-white flex items-center gap-1 border border-zinc-800 px-2 py-1 rounded">
                             <FileText className="w-3 h-3" />
                             Service Guide PDF
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic text-center py-8">
                NO SERVICE APPOINTMENTS SCHEDULED
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
