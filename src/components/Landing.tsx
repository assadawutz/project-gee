import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  return (
    <div className="relative min-h-[90vh] flex flex-col justify-center px-6 md:px-12 lg:px-24">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl"
      >
        <div className="flex flex-col md:flex-row md:items-end gap-6 mb-12">
          <h1 className="text-[12vw] md:text-[8rem] font-black uppercase italic tracking-tighter leading-[0.85] text-white">
            GEE<br />
            <span className="text-[#ccff00]">FIT</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-500 font-medium max-w-sm pb-4">
            Industrial precision engineering for high-performance automotive customization.
          </p>
        </div>
        
        <button
          onClick={onStart}
          className="group flex items-center gap-4 text-black bg-[#ccff00] px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-white transition-all text-sm"
        >
          Initialize Engine
          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
        </button>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute right-0 bottom-24 w-1/3 h-1/2 bg-gradient-to-l from-[#ccff00]/10 to-transparent blur-3xl pointer-events-none"
      />
    </div>
  );
}
