'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  Clock,
  Calendar,
  Film,
  Play,
  Share2,
  Tv,
  CheckCircle2,
  AlertCircle,
  Users,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchMovieById } from '@/services/movieApi';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { Navbar } from '@/components/common/Navbar';
import { AmbientBackground } from '@/components/common/AmbientBackground';
import { MateDrawer } from '@/components/mate/MateDrawer';
import { FloatingMateButton } from '@/components/mate/FloatingMateButton';
import { TrailerModal } from '@/components/movie/TrailerModal';
import { useMovieStore } from '@/store/useMovieStore';

interface MovieDetailPageProps {
  params: {
    id: string;
  };
}

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { data: movie, isLoading } = useQuery({
    queryKey: ['movieDetail', params.id],
    queryFn: () => fetchMovieById(params.id),
    staleTime: 1000 * 60 * 30,
  });

  const openTrailerModal = useMovieStore((s) => s.openTrailerModal);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#07080B] text-white flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-300">
        <AmbientBackground />
        <Navbar />
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#10121B] border border-amber-500/30 flex items-center justify-center animate-spin mb-4">
            <Film className="w-7 h-7 text-amber-400" />
          </div>
          <p className="text-sm text-zinc-400">Retrieving cinematic details from live feeds...</p>
        </div>
      </main>
    );
  }

  if (!movie) {
    return (
      <main className="min-h-screen bg-[#07080B] text-white flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-300">
        <AmbientBackground />
        <Navbar />
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#10121B] border border-amber-500/40 text-amber-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Movie Not Found</h1>
          <p className="text-zinc-400 text-sm mb-6">
            The film you requested could not be located in our active public catalog.
          </p>
          <Link
            href="/movies"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black font-extrabold text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all"
          >
            Browse Catalog
          </Link>
        </div>
      </main>
    );
  }

  const trailerKey = movie.youtubeTrailerKey || movie.youtubeVideoId;

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#07080B] text-white flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-300">
      <AmbientBackground />

      <div className="relative z-10 flex-1">
        <Navbar />

        {/* Back Link Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-32 pb-4">
          <Link
            href="/movies"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-amber-400 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Movies</span>
          </Link>
        </div>

        {/* Movie Hero Banner with Poster & Backdrop */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
          <div className="relative rounded-3xl overflow-hidden border border-amber-500/20 bg-[#10121B] shadow-2xl backdrop-blur-xl">
            {/* Top Backdrop Image Overlay */}
            <div className="relative w-full h-64 sm:h-96 overflow-hidden">
              <ImageWithFallback
                src={movie.backdropUrl || movie.posterUrl}
                alt={movie.title}
                fallbackTitle={movie.title}
                className="w-full h-full object-cover opacity-35 filter blur-[1px] scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10121B] via-[#10121B]/70 to-transparent" />
            </div>

            {/* Content Over Backdrop */}
            <div className="relative z-10 px-6 sm:px-10 pb-10 -mt-36 sm:-mt-48 flex flex-col md:flex-row gap-8 items-start">
              {/* Poster Card */}
              <div className="w-48 sm:w-64 aspect-[2/3] rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.2)] shrink-0 bg-[#07080B]">
                <ImageWithFallback
                  src={movie.posterUrl}
                  alt={movie.title}
                  fallbackTitle={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Movie Meta Information */}
              <div className="flex-1 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="px-3 py-1 rounded-xl bg-[#07080B] border border-amber-500/40 text-amber-300 text-xs font-black flex items-center gap-1.5 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{movie.rating ? movie.rating.toFixed(1) : '8.0'} / 10</span>
                  </div>

                  {movie.ageRating === '18+' && (
                    <span className="px-2.5 py-1 rounded-xl bg-red-950/90 border border-red-500/50 text-red-400 text-xs font-extrabold uppercase tracking-wider">
                      18+ Rated
                    </span>
                  )}

                  {movie.year && (
                    <span className="px-3 py-1 rounded-xl bg-[#07080B]/80 border border-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{movie.year}</span>
                    </span>
                  )}

                  {movie.runtime && (
                    <span className="px-3 py-1 rounded-xl bg-[#07080B]/80 border border-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{movie.runtime} min</span>
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  {movie.title}
                </h1>

                {/* Genre Pills */}
                <div className="flex flex-wrap gap-2">
                  {movie.genres?.map((g) => (
                    <span
                      key={g}
                      className="px-3 py-1 rounded-lg bg-[#07080B]/90 border border-amber-500/25 text-xs font-bold text-zinc-200"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                {/* Synopsis */}
                <div className="space-y-2">
                  <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                    Overview
                  </h3>
                  <p className="text-base text-zinc-300 leading-relaxed max-w-3xl font-normal">
                    {movie.synopsis || 'An exceptional cinema presentation.'}
                  </p>
                </div>

                {/* Cast */}
                {movie.cast && movie.cast.length > 0 && (
                  <div className="space-y-1">
                    <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>Starring Cast</span>
                    </h3>
                    <p className="text-xs text-zinc-300">
                      {movie.cast.join(' • ')}
                    </p>
                  </div>
                )}

                {/* Streaming Platforms */}
                {movie.platforms && movie.platforms.length > 0 && (
                  <div className="pt-2">
                    <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Tv className="w-4 h-4" />
                      <span>Available On</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.platforms.map((platform) => (
                        <span
                          key={platform}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-[#07080B] border border-amber-500/30 text-white shadow-sm flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>{platform}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  {trailerKey && (
                    <button
                      onClick={() => openTrailerModal(trailerKey, movie)}
                      className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-black text-black" />
                      <span>Watch Official Trailer</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="relative z-10 border-t border-amber-500/10 bg-[#07080B] mt-16 py-8 px-4 sm:px-8 text-center text-xs text-zinc-500">
        <p>© 2026 Filmate. All rights reserved. Crafted in Midnight Gold.</p>
      </footer>

      <FloatingMateButton />
      <MateDrawer />
      <TrailerModal />
    </main>
  );
}
