'use client';

import React from 'react';
import { Sparkles, Clapperboard, Flame } from 'lucide-react';
import { useMateStore } from '@/store/useMateStore';

export const HeroBanner: React.FC = () => {
  const openDrawer = useMateStore((s) => s.openDrawer);

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-10">
      <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-sunset/30 bg-gradient-to-r from-dark-surface/95 via-dark-card/90 to-dark-surface/95 shadow-2xl shadow-black/80 backdrop-blur-xl">
        {/* Glow orb within card */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sunset/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sunset/15 border border-sunset/40 text-sunset text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Flame className="w-3.5 h-3.5 text-sunset" />
            <span>AI Mood & Cinema Matcher</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Don&apos;t know what to watch <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunset via-gold to-cyber">tonight?</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-300 mb-8 leading-relaxed">
            Tell your friendly Mate how you feel right now. We analyze your mood, viewing company, and age rating to deliver the ultimate film recommendation.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={openDrawer}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-sunset via-sunset-hover to-cyber text-white font-extrabold text-base shadow-neon-sunset hover:shadow-neon-glow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span>Start Mate Quiz</span>
            </button>

            <a
              href="#cinema-catalog"
              className="px-6 py-3.5 rounded-2xl bg-dark-surface/80 border border-gray-700 hover:border-sunset/50 text-gray-300 hover:text-white font-bold text-sm transition-all duration-200 flex items-center gap-2"
            >
              <Clapperboard className="w-4 h-4 text-sunset" />
              <span>Browse 120+ Movies</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
