'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchLiveTrailers } from '@/services/movieApi';
import { Navbar } from '@/components/common/Navbar';
import { AmbientBackground } from '@/components/common/AmbientBackground';
import { HeroBanner } from '@/components/common/HeroBanner';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { MateDrawer } from '@/components/mate/MateDrawer';
import { FloatingMateButton } from '@/components/mate/FloatingMateButton';
import { TrailerModal } from '@/components/movie/TrailerModal';
import { Film, Heart, Shield, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { data: liveTrailers = [] } = useQuery({
    queryKey: ['liveTrailers'],
    queryFn: fetchLiveTrailers,
    staleTime: 1000 * 60 * 15,
  });

  return (
    <main className="min-h-screen relative overflow-hidden bg-dark-bg text-gray-100 flex flex-col justify-between selection:bg-sunset selection:text-white">
      {/* Dynamic Animated Ambient Background */}
      <AmbientBackground />

      <div className="relative z-10 flex-1">
        {/* Top Navbar */}
        <Navbar />

        {/* Hero Banner with Mate CTA */}
        <HeroBanner />

        {/* Main Cinema Catalog & KinoCheck Live Trailers */}
        <MovieGrid liveTrailers={liveTrailers} />
      </div>

      {/* Modern Neon Dark Footer */}
      <footer className="relative z-10 border-t border-gray-900 bg-dark-surface/80 backdrop-blur-md mt-16 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="text-xl font-black text-white">Fil</span>
              <span className="text-xl font-black text-sunset">Mate</span>
              <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-sunset/15 text-sunset border border-sunset/30">
                v2.0
              </span>
            </div>
            <p className="text-xs text-gray-400 max-w-md">
              Intelligent movie preview, upcoming release catalog, and interactive AI recommendation assistant.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5 text-gray-400">
              <Sparkles className="w-3.5 h-3.5 text-sunset" />
              <span>Electric Sunset Theme</span>
            </span>
            <span className="hidden sm:inline text-gray-700">•</span>
            <span>Zero Freeform Typing</span>
            <span className="hidden sm:inline text-gray-700">•</span>
            <span>Keyless Public Feeds</span>
          </div>
        </div>
      </footer>

      {/* Floating Mate Chat Button */}
      <FloatingMateButton />

      {/* Mate Assistant Slide-Out Drawer */}
      <MateDrawer />

      {/* Video Player Modal for YouTube Trailers */}
      <TrailerModal />
    </main>
  );
}
