import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl"
      >
        <span className="text-[#ccff00] text-xs font-black uppercase tracking-[0.3em] mb-4 block">
          Precision Automotive Customization
        </span>
        <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9] text-white mb-8">
          ENGINEERED<br />
          TO PERFORM
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 font-medium max-w-xl mx-auto mb-12">
          Industrial precision fitment, curated for the modern enthusiast.
        </p>
        
        <button
          onClick={onStart}
          className="group flex items-center gap-3 text-black bg-[#ccff00] px-8 py-4 rounded-lg font-black uppercase tracking-widest hover:bg-white transition-all text-xs mx-auto"
        >
          Begin Customization
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
}
