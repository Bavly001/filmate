import React from 'react';

export default function RootLoading() {
  return (
    <div className="w-full min-h-screen bg-zinc-900 text-white animate-fadeIn">
      {/* Hero Banner Skeleton */}
      <div className="relative h-[45vh] lg:h-[70vh] w-full bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800/40 to-zinc-900 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
        <div className="absolute bottom-8 left-6 sm:left-14 max-w-xl flex flex-col gap-3 z-10">
          <div className="w-24 h-5 rounded-md bg-cyan-500/20 border border-cyan-500/30 animate-pulse" />
          <div className="w-3/4 h-10 rounded-lg bg-zinc-700/60 animate-pulse" />
          <div className="w-full h-3 rounded bg-zinc-700/40 animate-pulse" />
          <div className="w-4/5 h-3 rounded bg-zinc-700/40 animate-pulse" />
        </div>
      </div>

      {/* Media Cards Row Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6">
        <div className="w-48 h-6 rounded bg-zinc-700/50 animate-pulse" />
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
  );
}
