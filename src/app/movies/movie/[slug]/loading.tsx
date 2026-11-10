import React from 'react';

export default function MovieDetailLoading() {
  return (
    <main className="w-full min-h-screen text-white bg-zinc-900 animate-fadeIn">
      {/* Hero Banner Skeleton */}
      <div className="relative h-[50vh] lg:h-[85vh] w-full bg-zinc-950 overflow-hidden">
        {/* Shimmer backdrop */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800/50 to-zinc-900 animate-pulse" />

        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-transparent to-transparent" />

        {/* Hero Bottom Content Skeleton */}
        <div className="absolute bottom-6 sm:bottom-12 left-5 sm:left-12 lg:left-20 right-5 max-w-3xl flex flex-col gap-4 z-10">
          {/* Badge */}
          <div className="w-20 h-5 rounded-md bg-cyan-500/20 border border-cyan-500/30 animate-pulse" />

          {/* Title */}
          <div className="w-3/4 sm:w-1/2 h-8 sm:h-12 rounded-xl bg-zinc-700/60 animate-pulse" />

          {/* Meta line */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-6 rounded bg-amber-400/20 animate-pulse" />
            <div className="w-24 h-4 rounded bg-zinc-700/50 animate-pulse" />
            <div className="w-16 h-4 rounded bg-zinc-700/50 animate-pulse" />
          </div>

          {/* Overview lines */}
          <div className="hidden sm:flex flex-col gap-2 pt-2">
            <div className="w-full h-3.5 rounded bg-zinc-700/40 animate-pulse" />
            <div className="w-5/6 h-3.5 rounded bg-zinc-700/40 animate-pulse" />
            <div className="w-2/3 h-3.5 rounded bg-zinc-700/40 animate-pulse" />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-3">
            <div className="w-32 h-10 rounded-full bg-cyan-500/30 animate-pulse" />
            <div className="w-28 h-10 rounded-full bg-zinc-800/80 border border-white/10 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Detail Content Skeleton */}
      <div className="w-full max-w-7xl mx-auto px-5 lg:px-20 py-8 flex flex-col gap-y-10">
        {/* 3 Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-800/40 p-6 rounded-2xl border border-zinc-700/50">
          <div className="flex flex-col gap-2">
            <div className="w-16 h-3 rounded bg-zinc-700/60" />
            <div className="w-24 h-7 rounded bg-zinc-700/80 animate-pulse" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-28 h-3 rounded bg-zinc-700/60" />
            <div className="w-20 h-7 rounded bg-zinc-700/80 animate-pulse" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-16 h-3 rounded bg-zinc-700/60" />
            <div className="flex gap-2">
              <div className="w-16 h-6 rounded bg-zinc-700/60 animate-pulse" />
              <div className="w-16 h-6 rounded bg-zinc-700/60 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Similar Row Skeleton */}
        <div className="flex flex-col gap-4">
          <div className="w-40 h-6 rounded bg-zinc-700/60 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] rounded-xl bg-zinc-800/50 animate-pulse border border-white/5"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
