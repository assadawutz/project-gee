import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  return (
    <div className="relative min-h-[90vh] flex flex-col justify-center px-12 md:px-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl"
      >
        <h1 className="text-8xl md:text-[10rem] font-black uppercase italic tracking-tighter leading-none mb-6">
          GEE<br />
          <span className="text-[#ccff00]">FITMENT</span>
        </h1>
        <p className="text-2xl text-zinc-500 max-w-xl mb-12 font-medium">
          Industrial precision engineering for high-performance automotive customization.
        </p>
        <button
          onClick={onStart}
          className="group flex items-center gap-4 text-black bg-[#ccff00] px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-white transition-all text-sm"
        >
          Initialize Engine
          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
        </button>
      </motion.div>
      
      <div className="absolute right-0 bottom-24 w-1/3 h-1/2 bg-gradient-to-l from-[#ccff00]/10 to-transparent blur-3xl pointer-events-none" />
    </div>
  );
}
