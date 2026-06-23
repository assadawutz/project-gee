import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-[80vh] flex flex-col md:flex-row items-center justify-between p-8 md:p-16 gap-12">
      <div className="flex-1 space-y-8">
        <motion.h1 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter"
        >
          THE <span className="text-[#ccff00]">FITMENT</span><br /> EVOLUTION
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-zinc-400 max-w-lg"
        >
          Industrial precision meets performance aesthetics. Configure, visualize, and secure your setup with our revolutionary engine.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={onStart}
          className="px-8 py-4 bg-[#ccff00] text-black font-black uppercase tracking-widest text-sm rounded-xl hover:bg-lime-400 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(204,255,0,0.3)]"
        >
          Start Configuration <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex-1 flex justify-end"
      >
        <div className="w-64 h-64 md:w-96 md:h-96 rounded-full bg-zinc-900 border-4 border-[#ccff00] flex items-center justify-center relative">
            <div className="absolute inset-4 rounded-full border-2 border-zinc-800 rotate-45"></div>
            <div className="text-9xl font-black text-[#ccff00]">GEE</div>
        </div>
      </motion.div>
    </div>
  );
}
