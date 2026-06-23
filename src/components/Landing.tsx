import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Zap } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center overflow-hidden">
      {/* Cinematic Background Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/50 via-[#0a0a0a] to-[#0a0a0a] z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(204,255,0,0.05),transparent_70%)] z-0" />
        {/* Mock Video Background Placeholder - in production this would be an actual mp4 */}
        <div className="w-full h-full bg-[#050505] opacity-30">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center grayscale scale-110 animate-slow-zoom" />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 max-w-4xl px-6 text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Next-Gen Fitment Engine 3.0</span>
        </div>

        <h1 className="text-6xl md:text-[7rem] font-black uppercase italic tracking-tighter leading-[0.85] text-white mb-8">
          DRIVE<br />
          <span className="text-[#ccff00] drop-shadow-[0_0_30px_rgba(204,255,0,0.3)]">DIFFERENT</span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
          The world's most precise automotive customization workspace. 
          Real-time wheel simulation, industrial engineering data, and curated hardware.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStart}
            className="group relative flex items-center gap-3 text-black bg-[#ccff00] px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all text-xs overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
            <Zap className="w-4 h-4 fill-current" />
            Begin Build
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="px-10 py-5 rounded-2xl border border-zinc-800 text-zinc-400 font-black uppercase tracking-widest text-xs hover:bg-zinc-900 hover:text-white transition-all">
            View Collection
          </button>
        </div>
      </motion.div>

      {/* Stats Bottom Bar */}
      <div className="absolute bottom-12 left-0 w-full z-20 px-6">
        <div className="container mx-auto flex flex-wrap justify-center gap-8 md:gap-24">
          {[
            { label: "Wheel Data", value: "10k+" },
            { label: "Fitment Profiles", value: "250+" },
            { label: "Precision", value: "0.1mm" }
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-black text-white italic tracking-tighter leading-none">{stat.value}</p>
              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
