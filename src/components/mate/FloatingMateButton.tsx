'use client';

import React from 'react';
import { Sparkles, Bot } from 'lucide-react';
import { useMateStore } from '@/store/useMateStore';

export const FloatingMateButton: React.FC = () => {
  const { openDrawer, isDrawerOpen } = useMateStore();

  if (isDrawerOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 group select-none">
      {/* Subtle gold ping ring */}
      <div className="absolute inset-0 rounded-full border border-amber-500/50 animate-ping pointer-events-none opacity-40" />

      {/* Compact luxury floating orb */}
      <button
        onClick={openDrawer}
        aria-label="Open Mate Assistant"
        title="Open Mate Assistant"
        className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-400 text-black flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:shadow-[0_0_30px_rgba(245,158,11,0.8)] group-hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        <Sparkles className="w-5 h-5 fill-black" />

        {/* Online Indicator Badge */}
        <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#07080B] flex items-center justify-center">
          <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
        </span>
      </button>

      {/* Floating tooltip label */}
      <div className="absolute right-14 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap px-3 py-1 rounded-lg bg-[#0B0D13]/90 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-lg backdrop-blur-md">
        Ask Mate AI
      </div>
    </div>
  );
};
