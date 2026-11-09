'use client';

import React from 'react';
import Link from 'next/link';
import { Film, Sparkles, Clapperboard, ShieldCheck, ArrowRight, Video, Tv } from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';
import { FloatingMateButton } from '@/components/mate/FloatingMateButton';
import { MateDrawer } from '@/components/mate/MateDrawer';

export default function AboutPage() {
  const pillars = [
    {
      title: 'Bespoke Curation',
      desc: 'Handcrafted cinema collections, numbered Top 10 Box Office shelves, and curated world-class film catalogs tailored for film enthusiasts.',
      icon: <Film className="w-6 h-6 text-amber-400" />,
    },
    {
      title: 'Live Premiere Feeds',
      desc: 'Direct live public synchronization with KinoCheck to stream official 4K/HD YouTube trailers, cinema premiere announcements, and box office hits.',
      icon: <Video className="w-6 h-6 text-amber-400" />,
    },
    {
      title: 'Mate Cinema AI',
      desc: 'Your personal, non-blocking side concierge. Instant vibe matches, mood-based recommendations, and intelligent title discovery in real time.',
      icon: <Sparkles className="w-6 h-6 text-amber-400" />,
    },
    {
      title: 'Global Open Catalog',
      desc: 'Powered by open keyless REST endpoints from TVMaze and leading film archives, indexing cast, runtime, summaries, and critical ratings.',
      icon: <Tv className="w-6 h-6 text-amber-400" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#07080B] text-white flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-300">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-8 pt-32 pb-20">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modern Luxury Cinematic Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6">
            About{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500 bg-clip-text text-transparent">
              Filmate
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
            Filmate redefines the modern streaming discovery experience. Inspired by the refined
            midnight aesthetic of WatchIT, Yango Play, and Netflix, we unite high-definition cinema
            trailers, real public API data, and an intelligent side companion into a seamless
            cinematic destination.
          </p>
        </div>

        {/* Pillars Grid */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="p-8 rounded-3xl bg-[#10121B] border border-amber-500/15 hover:border-amber-400/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#07080B] border border-amber-500/30 flex items-center justify-center mb-6 shadow-inner group-hover:scale-105 transition-transform">
                  {pillar.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed font-normal">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Craftsmanship & Creator Spotlight (from MoviesAngularProject & Gold-cinema) */}
        <section className="mb-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#141722] to-[#0E1017] border border-amber-500/30 text-left max-w-5xl mx-auto shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full border-2 border-amber-500/50 bg-[#161822] flex items-center justify-center text-amber-400 text-3xl font-black shadow-[0_0_25px_rgba(229,137,10,0.4)] mb-3">
                BA
              </div>
              <h3 className="text-xl font-black text-white">Bavly Ashraf</h3>
              <p className="text-xs text-amber-400 font-semibold">Lead Creator & Frontend Architect</p>
            </div>

            <div className="md:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <span>The Vision Behind Filmate</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Synthesizing Cinema Aesthetic with Next-Gen Engineering
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed font-normal">
                Filmate represents a progression across multiple generations of cinema applications
                crafted by Bavly—synthesizing the dynamic layouts of MoviesAngularProject, the luxury gold
                atmosphere of Gold-cinema, and modern Next.js server components into a high-performance,
                zero-mock streaming platform.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black font-extrabold text-xs shadow-[0_0_15px_rgba(229,137,10,0.4)] hover:scale-105 active:scale-95 transition-all"
                >
                  Connect with the Creator
                </Link>
                <Link
                  href="/movies"
                  className="px-6 py-2.5 rounded-full bg-[#161822] border border-amber-500/40 text-amber-300 hover:text-white font-bold text-xs transition-colors"
                >
                  Browse Movie Catalog
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Craftsmanship & Mission Quote */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#10121B] to-[#0B0D13] border border-amber-500/20 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            Built for Cinema Lovers
          </h2>
          <p className="text-zinc-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
            No mock placeholders. No clunky full-page blocking dialogs. Experience smooth
            interactions, frosted glassmorphism, and live trailer streaming designed for all devices.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/movies"
              className="px-7 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm shadow-[0_0_20px_rgba(229,137,10,0.4)] flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>Explore All Movies</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contact"
              className="px-7 py-3 rounded-full bg-[#10121B] border border-amber-500/30 hover:border-amber-400 text-zinc-200 hover:text-white font-bold text-sm transition-colors"
            >
              <span>Contact Concierge</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Floating Mate Assistant & Drawer */}
      <FloatingMateButton />
      <MateDrawer />

      {/* Footer */}
      <footer className="w-full border-t border-amber-500/10 py-8 px-4 text-center text-xs text-zinc-500 bg-[#07080B]">
        <p>© 2026 Filmate. All rights reserved. Crafted in Midnight Gold.</p>
      </footer>
    </div>
  );
}
