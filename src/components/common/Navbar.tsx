'use client';

import React from 'react';
import { Film, Sparkles, Search, Clapperboard, Compass } from 'lucide-react';
import { useMateStore } from '@/store/useMateStore';
import { useMovieStore } from '@/store/useMovieStore';

export const Navbar: React.FC = () => {
  const openDrawer = useMateStore((s) => s.openDrawer);
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useMovieStore();

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3.5 backdrop-blur-xl bg-dark-bg/80 border-b border-sunset/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => {
            setSelectedCategory('all');
            setSearchQuery('');
          }}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sunset via-sunset-hover to-cyber flex items-center justify-center shadow-neon-sunset group-hover:scale-105 transition-transform duration-300">
            <Film className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white flex items-center">
            Fil<span className="text-sunset drop-shadow-[0_0_12px_rgba(255,107,43,0.7)] ml-0.5">Mate</span>
          </span>
        </div>

        {/* Quick Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-300">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`transition-colors flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'text-sunset font-bold drop-shadow-[0_0_8px_rgba(255,107,43,0.6)]'
                : 'hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            Trending
          </button>
          <button
            onClick={() => setSelectedCategory('cinema')}
            className={`transition-colors flex items-center gap-1.5 ${
              selectedCategory === 'cinema'
                ? 'text-sunset font-bold drop-shadow-[0_0_8px_rgba(255,107,43,0.6)]'
                : 'hover:text-white'
            }`}
          >
            <Clapperboard className="w-4 h-4" />
            In Cinema
          </button>
          <button
            onClick={() => setSelectedCategory('upcoming')}
            className={`transition-colors flex items-center gap-1.5 ${
              selectedCategory === 'upcoming'
                ? 'text-sunset font-bold drop-shadow-[0_0_8px_rgba(255,107,43,0.6)]'
                : 'hover:text-white'
            }`}
          >
            Upcoming
          </button>
        </nav>

        {/* Search & Mate Trigger Button */}
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block w-48 lg:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-dark-surface/90 border border-gray-800 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-sunset focus:ring-1 focus:ring-sunset transition-all"
            />
          </div>

          <button
            onClick={openDrawer}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sunset to-cyber text-white font-bold text-sm shadow-neon-sunset hover:shadow-neon-glow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin-slow" />
            <span>Talk to Mate</span>
          </button>
        </div>
      </div>
    </header>
  );
};
