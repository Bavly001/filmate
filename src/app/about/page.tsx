import React from 'react';
import Logo from '@/components/Logo';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="w-full min-h-screen bg-zinc-900 text-white pt-28 px-6 lg:px-20 pb-20">
      <div className="max-w-4xl mx-auto flex flex-col gap-y-10">
        <div className="flex flex-col items-center text-center gap-y-4">
          <Logo title text height="h-24" textSize="text-lg" />
          <h1 className="text-3xl lg:text-5xl font-black tracking-tight mt-2">
            About <span className="text-cyan-400">Filmate</span>
          </h1>
          <p className="text-base lg:text-lg text-zinc-300 max-w-2xl leading-relaxed">
            Filmate is your premier cinematic discovery platform, powered by live
            TMDB data and our smart Mate finder to help you find unforgettable films
            and TV series.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-zinc-800/60 border border-zinc-700/60 p-6 rounded-2xl flex flex-col gap-y-2">
            <h3 className="text-xl font-bold text-amber-400">Live Cinema Data</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Real-time streaming feeds for trending, top-rated, and upcoming
              releases worldwide with zero latency.
            </p>
          </div>

          <div className="bg-zinc-800/60 border border-zinc-700/60 p-6 rounded-2xl flex flex-col gap-y-2">
            <h3 className="text-xl font-bold text-cyan-400">Smart Mate Finder</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              A guided questionnaire experience designed to pinpoint exactly what
              you want to watch without typing.
            </p>
          </div>

          <div className="bg-zinc-800/60 border border-zinc-700/60 p-6 rounded-2xl flex flex-col gap-y-2">
            <h3 className="text-xl font-bold text-amber-400">Instant Preview</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Interactive movie cards with ratings, language flags, and smooth
              quick-look overlays.
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/movies"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-base transition-all shadow-lg shadow-cyan-500/20"
          >
            Start Exploring Movies
          </Link>
        </div>
      </div>
    </main>
  );
}
