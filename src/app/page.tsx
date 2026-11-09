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

        {/* WatchIT / Gold-cinema Inspired NOW Playing & Numbered Top 10 Shelf */}
        {top10Movies.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(229,137,10,0.3)]">
                  <Flame className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-widest text-amber-500">
                      Gold Cinema • NOW Playing
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Top 10 in Box Office & Cinema
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Highest rated and most watched premieres this week
                  </p>
                </div>
              </div>

              <Link
                href="/movies?sort=trending"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#161822] border border-amber-500/30 hover:border-amber-400 text-xs font-bold text-amber-400 hover:text-amber-300 transition-all shadow-[0_0_12px_rgba(229,137,10,0.15)]"
              >
                <span>More Movies</span>
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

        {/* Gold Cinema Services & VIP Experience (from Gold-cinema) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
          <div className="rounded-3xl p-6 sm:p-10 border border-amber-500/30 bg-[#0E1017]/90 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gold Cinema Standards</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  Our Exclusive Cinema Services
                </h2>
                <p className="text-zinc-300 text-sm leading-relaxed max-w-xl">
                  Inspired by Gold Cinema luxury halls: experience VIP acoustic comfort,
                  private screening lounges, and smart AI reservation notifications.
                </p>

                {/* 4 Pillars from Gold-cinema */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
                  <div className="p-4 rounded-2xl bg-[#141722] border border-amber-500/20 text-center hover:border-amber-400/60 hover:shadow-[0_0_15px_rgba(229,137,10,0.3)] transition-all">
                    <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-2 font-bold text-sm">
                      VIP
                    </div>
                    <h3 className="text-xs font-bold text-white">VIP Halls</h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Plush leather recliners</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#141722] border border-amber-500/20 text-center hover:border-amber-400/60 hover:shadow-[0_0_15px_rgba(229,137,10,0.3)] transition-all">
                    <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-2 font-bold text-sm">
                      ATMOS
                    </div>
                    <h3 className="text-xs font-bold text-white">Special Sound</h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Spatial audio system</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#141722] border border-amber-500/20 text-center hover:border-amber-400/60 hover:shadow-[0_0_15px_rgba(229,137,10,0.3)] transition-all">
                    <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-2 font-bold text-sm">
                      ROOM
                    </div>
                    <h3 className="text-xs font-bold text-white">Special Rooms</h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Private screenings</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#141722] border border-amber-500/20 text-center hover:border-amber-400/60 hover:shadow-[0_0_15px_rgba(229,137,10,0.3)] transition-all">
                    <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-2 font-bold text-sm">
                      MATE
                    </div>
                    <h3 className="text-xs font-bold text-white">Notification AI</h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Live cinema alerts</p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
                <Link
                  href="/movies"
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm text-center shadow-[0_0_20px_rgba(229,137,10,0.4)] hover:shadow-[0_0_30px_rgba(229,137,10,0.7)] transition-all"
                >
                  Explore More Movies
                </Link>
                <Link
                  href="/about"
                  className="px-8 py-3.5 rounded-full bg-[#161822] border border-amber-500/30 hover:border-amber-400 text-zinc-200 hover:text-white font-bold text-sm text-center transition-colors"
                >
                  Learn About Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* MoviesAngularProject Inspired "Don't Miss the Chance" Showcase */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 mb-8">
          <div className="rounded-3xl p-8 sm:p-12 border border-amber-500/25 bg-gradient-to-r from-[#11131C] via-[#0E1017] to-[#141722] shadow-2xl relative overflow-hidden text-center">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="w-14 h-14 rounded-full border-2 border-amber-500/60 bg-amber-500/15 flex items-center justify-center mx-auto text-amber-400 shadow-[0_0_20px_rgba(229,137,10,0.4)]">
                <Film className="w-7 h-7" />
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Don&apos;t Miss the Chance
              </h2>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                A curated collection of your favorite movies in one place with zero mock data and
                ultra-fast live public feeds.
              </p>
              <div className="pt-2">
                <Link
                  href="/movies"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-base shadow-[0_0_25px_rgba(229,137,10,0.5)] hover:scale-105 active:scale-95 transition-all"
                >
                  <span>Explore More</span>
                  <ArrowRight className="w-5 h-5 text-black" />
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
