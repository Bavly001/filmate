import React from 'react';

export default function TvShowsLoading() {
  return (
    <main className="w-full min-h-screen bg-zinc-900 text-white pt-24 px-4 sm:px-8 lg:px-14 pb-16 animate-fadeIn">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Top Header & Search Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div className="flex flex-col gap-2">
            <div className="w-52 h-10 rounded-xl bg-zinc-800/80 animate-pulse border border-white/5" />
            <div className="w-80 h-4 rounded bg-zinc-800/50 animate-pulse" />
          </div>
          <div className="w-full lg:w-80 h-11 rounded-xl bg-zinc-950/70 border border-white/10 animate-pulse" />
        </div>

        {/* Filter Control Deck Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950/50 border border-white/10">
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-24 h-8 rounded-xl bg-zinc-800/80 border border-white/5 animate-pulse"
              />
            ))}
          </div>
          <div className="flex gap-2.5">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-32 h-8 rounded-xl bg-zinc-900/90 border border-white/10 animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Results Grid Skeleton: 1:1 Exact Dimensions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 justify-items-center">
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="w-full max-w-[200px] h-56 lg:h-72 my-2 rounded-xl bg-gradient-to-br from-zinc-800/70 via-zinc-800/40 to-zinc-900/80 animate-pulse border border-white/5 overflow-hidden flex flex-col justify-between p-3.5 relative shadow-lg"
            >
              <div className="w-12 h-5 rounded-md bg-zinc-700/60" />
              <div className="flex flex-col gap-2">
                <div className="w-3/4 h-4 rounded-md bg-zinc-700/60" />
                <div className="w-1/2 h-3.5 rounded-md bg-zinc-700/40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
