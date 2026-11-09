'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchLiveTrailers, fetchTop10BoxOffice, fetchCatalogMovies } from '@/services/movieApi';
import { Navbar } from '@/components/common/Navbar';
import { AmbientBackground } from '@/components/common/AmbientBackground';
import { HeroBanner } from '@/components/common/HeroBanner';
import { NumberedMovieCard } from '@/components/movie/NumberedMovieCard';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { MateDrawer } from '@/components/mate/MateDrawer';
import { FloatingMateButton } from '@/components/mate/FloatingMateButton';
import { TrailerModal } from '@/components/movie/TrailerModal';
import { Flame, Sparkles, Film, ShieldCheck, ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { data: liveTrailers = [] } = useQuery({
    queryKey: ['liveTrailers'],
    queryFn: fetchLiveTrailers,
    staleTime: 1000 * 60 * 15,
  });

  const { data: top10Movies = [] } = useQuery({
    queryKey: ['top10BoxOffice'],
    queryFn: fetchTop10BoxOffice,
    staleTime: 1000 * 60 * 30,
  });

  const { data: catalogMovies = [] } = useQuery({
    queryKey: ['catalogMovies'],
    queryFn: () => fetchCatalogMovies({ page: 0 }),
    staleTime: 1000 * 60 * 30,
  });

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#07080B] text-white flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-300">
      {/* Dynamic Animated Ambient Background */}
      <AmbientBackground />

      <div className="relative z-10 flex-1">
        {/* Dynamic Glassmorphic Luxury Header */}
        <Navbar />

        {/* Full-bleed Cinematic Showcase Hero */}
        <HeroBanner />

        {/* WatchIT / Netflix Inspired Numbered Top 10 Shelf */}
        {top10Movies.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Flame className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Top 10 in Box Office & Cinema
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Highest rated and most watched premieres this week
                  </p>
                </div>
              </div>

              <Link
                href="/movies?sort=trending"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>View Full Ranking</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Horizontal Scroll Carousel */}
            <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto pb-6 pt-2 no-scrollbar scroll-smooth">
              {top10Movies.map((movie, index) => (
                <div key={movie.id} className="flex-shrink-0">
                  <NumberedMovieCard movie={movie} rank={index + 1} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Main Cinema Catalog with Live Filters & KinoCheck Premiere Trailers */}
        <section id="catalog" className="scroll-mt-20">
          <MovieGrid movies={catalogMovies} liveTrailers={liveTrailers} />
        </section>

        {/* Luxury Modern Experience Callout */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
          <div className="rounded-3xl p-8 sm:p-12 border border-amber-500/20 bg-gradient-to-b from-[#10121B] to-[#0B0D13] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Filmate Standard</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Modern Luxury Cinema Streaming{' '}
                <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500 bg-clip-text text-transparent">
                  Without Distractions
                </span>
              </h2>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                Experience high-definition official 4K trailers directly synchronized from KinoCheck,
                an open catalog backed by TVMaze, and a personal AI companion ready to find your next
                favorite title at a touch.
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/movies"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center gap-2 active:scale-95 transition-all"
                >
                  <Film className="w-4 h-4 fill-black text-black" />
                  <span>Browse Entire Library</span>
                </Link>

                <Link
                  href="/about"
                  className="px-6 py-3 rounded-xl bg-[#07080B] border border-amber-500/30 hover:border-amber-400 text-zinc-300 hover:text-white font-bold text-sm transition-colors"
                >
                  <span>Learn More About Filmate</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Midnight Gold Luxury Footer */}
      <footer className="relative z-10 border-t border-amber-500/10 bg-[#07080B] py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="text-xl font-black text-white tracking-wider">FILM</span>
              <span className="text-xl font-black bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent tracking-wider">
                ATE
              </span>
              <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                PRO CINEMA
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-md">
              Cinematic streaming exploration inspired by WatchIT, Yango Play, and Netflix. 100% live
              public feeds with zero mock datasets.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
            <Link href="/about" className="hover:text-amber-400 transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-amber-400 transition-colors">
              Contact Concierge
            </Link>
            <Link href="/movies" className="hover:text-amber-400 transition-colors">
              All Movies
            </Link>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-500">© 2026 Filmate. All rights reserved. Crafted in Midnight Gold.</span>
          </div>
        </div>
      </footer>

      {/* Floating Mate Assistant Orb (Messenger style) */}
      <FloatingMateButton />

      {/* Side Messenger Popup Chat Drawer */}
      <MateDrawer />

      {/* Luxury Trailer Modal */}
      <TrailerModal />
    </main>
  );
}
