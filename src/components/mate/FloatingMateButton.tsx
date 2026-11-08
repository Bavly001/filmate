'use client';

import React from 'react';
import { Bot } from 'lucide-react';
import { useMateStore } from '@/store/useMateStore';

export const FloatingMateButton: React.FC = () => {
  const { openDrawer, isDrawerOpen } = useMateStore();

  if (isDrawerOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 group">
      {/* Animated Ping Ring */}
      <div className="absolute inset-0 rounded-full border-2 border-sunset animate-ping-slow pointer-events-none" />

      {/* Button */}
      <button
        onClick={openDrawer}
        title="Open Mate Assistant"
        className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-sunset via-sunset-hover to-cyber text-white flex items-center justify-center shadow-neon-sunset hover:shadow-neon-glow-lg group-hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        <Bot className="w-8 h-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]" />

        {/* Online Indicator Badge */}
        <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-dark-bg flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        </span>
      </button>
    </div>
  );
};
