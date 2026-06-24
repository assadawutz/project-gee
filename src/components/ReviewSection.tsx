import React, { useState } from 'react';
import { ProductReview } from '../types';
import { Star, User, MessageSquare } from 'lucide-react';

interface ReviewSectionProps {
  productId: string;
  reviews: ProductReview[];
  onAddReview: (productId: string, review: Omit<ProductReview, 'id' | 'date'>) => void;
}

export default function ReviewSection({ productId, reviews, onAddReview }: ReviewSectionProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !userName.trim()) return;

    onAddReview(productId, {
      userId: 'u_guest_' + Date.now(), // Generate a mock user ID
      userName,
      rating,
      comment
    });

    setComment('');
    setRating(5);
    setUserName('');
  };

  const averageRating = reviews.length 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : '0.0';

  return (
    <div className="bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl border border-zinc-800 p-6 space-y-6 mt-6">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
        <div>
          <h3 className="font-sans font-black text-white text-lg uppercase flex items-center">
            <MessageSquare className="w-5 h-5 text-[#ff3300] mr-2" />
            FIELD REVIEWS
          </h3>
          <p className="text-[10px] text-zinc-500 font-mono mt-1">COMMUNITY PERFORMANCE DATA</p>
        </div>
        <div className="flex items-center space-x-3 bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-900">
          <div className="text-right">
            <span className="text-2xl font-black text-white">{averageRating}</span>
            <span className="text-zinc-500 text-xs"> / 5.0</span>
          </div>
          <div className="flex text-[#ff3300]">
             {Array.from({ length: 5 }).map((_, i) => (
               <Star key={i} className={`w-4 h-4 ${i < Math.round(Number(averageRating)) ? 'fill-[#ff3300]' : 'text-zinc-700'}`} />
             ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {reviews.length > 0 ? reviews.map((review) => (
            <div
              key={review.id}
              className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 flex space-x-4 animate-fade-in"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                 <User className="w-5 h-5 text-zinc-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{review.userName}</span>
                    {review.status === 'pending' && (
                      <span className="text-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">Pending</span>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-500">{review.date}</span>
                </div>
                <div className="flex space-x-0.5 mb-2 text-[#ff3300]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-[#ff3300]' : 'text-zinc-700'}`} />
                  ))}
                </div>
                <p className="text-xs text-zinc-400 italic">"{review.comment}"</p>
              </div>
            </div>
          )) : (
            <p className="text-xs text-zinc-500 italic font-mono py-8 text-center border border-zinc-900 border-dashed rounded-xl">NO FIELD REPORTS LOGGED FOR THIS ITEM YET</p>
          )}
        </div>

        <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-900 h-fit">
          <h4 className="text-xs font-black uppercase text-white mb-4 border-b border-zinc-900 pb-2">Submit Field Report</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Clearance Level (Rating)</label>
              <div className="flex space-x-1 cursor-pointer text-[#ff3300]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => setRating(star)}
                    className={`w-6 h-6 transition-all ${rating >= star ? "fill-[#ff3300] hover:scale-110" : "text-zinc-700 hover:text-zinc-500 hover:scale-110"}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Operator Alias</label>
              <input
                type="text"
                placeholder="Callsign..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-2 text-xs text-white outline-none focus:border-[#ff3300]"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Telemetry Notes</label>
              <textarea
                placeholder="Share your fitment experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-2 text-xs text-white outline-none focus:border-[#ff3300] min-h-[80px]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#ff3300] text-black text-[10px] font-black uppercase rounded-lg tracking-widest hover:bg-[#ff4500] transition-colors"
            >
              Log Report
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
