'use client';

import React from 'react';
import { Play, Sparkles, Star, Clapperboard, Film, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchHeroShowcase, fetchCatalogMovies } from '@/services/movieApi';
import { useMateStore } from '@/store/useMateStore';
import { useMovieStore } from '@/store/useMovieStore';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { RotatedPosterGrid } from '@/components/common/RotatedPosterGrid';
import Link from 'next/link';

export const HeroBanner: React.FC = () => {
  const openDrawer = useMateStore((s) => s.openDrawer);
  const openTrailerModal = useMovieStore((s) => s.openTrailerModal);

  const { data: movie } = useQuery({
    queryKey: ['heroShowcase'],
    queryFn: fetchHeroShowcase,
    staleTime: 1000 * 60 * 30,
  });

  const { data: catalogMovies = [] } = useQuery({
    queryKey: ['catalogMovies'],
    queryFn: () => fetchCatalogMovies({ page: 0 }),
    staleTime: 1000 * 60 * 30,
  });

  const posters = catalogMovies
    .map((m) => m.posterUrl)
    .filter((url): url is string => Boolean(url && url.length > 5));

  const title = movie?.title || 'Dune: Part Two';
  const backdrop =
    movie?.backdropUrl ||
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&auto=format&fit=crop&q=80';
  const synopsis =
    movie?.synopsis ||
    'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.';
  const rating = movie?.rating || 8.8;
  const genres = movie?.genres?.length ? movie.genres : ['Action', 'Sci-Fi', 'Cinema'];
  const trailerKey = movie?.youtubeTrailerKey || movie?.youtubeVideoId;

  return (
    <section className="relative w-full min-h-[580px] sm:min-h-[660px] lg:min-h-[740px] flex items-center justify-start overflow-hidden pt-28 pb-16 px-4 sm:px-8 md:px-12">
      {/* Dynamic 45-degree Rotated Poster Grid Backdrop (from MoviesAngularProject) */}
      <RotatedPosterGrid posters={posters} className="opacity-20" />

      {/* Full-bleed Backdrop Layer */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src={backdrop}
          alt={title}
          fallbackTitle={title}
          className="w-full h-full object-cover object-center scale-105 filter brightness-70 transition-all duration-700"
        />

        {/* Multi-angle cinematic dark obsidian gradients with Gold Cinema vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080B] via-[#07080B]/60 via-35% to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080B] via-[#07080B]/85 via-45% to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left_center,rgba(7,8,11,0.95)_0%,rgba(7,8,11,0.65)_50%,transparent_100%)]" />
      </div>

      {/* Hero Showcase Content */}
      <div className="relative z-10 max-w-2xl space-y-5 animate-fade-in">
        {/* Premiere Badge with Gold accent */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(229,137,10,0.3)] backdrop-blur-md">
          <Clapperboard className="w-3.5 h-3.5 text-amber-400" />
          <span>Cinematic Premiere Showcase</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] drop-shadow-2xl">
          {title}
        </h1>

        {/* Meta badges: Rating, Genres, 4K Cinema */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <div className="px-3 py-1 rounded-full bg-[#0B0D13]/90 border border-amber-500/50 text-amber-300 text-xs font-black flex items-center gap-1.5 shadow-[0_0_12px_rgba(229,137,10,0.25)]">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{rating.toFixed(1)} Rating</span>
          </div>

          <div className="px-3 py-1 rounded-full bg-[#0B0D13]/80 border border-zinc-700 text-zinc-300 text-xs font-semibold">
            <span>4K Ultra HD</span>
          </div>

          {genres.slice(0, 3).map((g) => (
            <span
              key={g}
              className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-200/90 text-xs font-bold"
            >
              {g}
            </span>
          ))}
        </div>

        {/* Synopsis */}
        <p className="text-sm sm:text-base text-zinc-300 line-clamp-3 leading-relaxed max-w-xl font-normal drop-shadow">
          {synopsis}
        </p>

        {/* Action Buttons with Gold Cinema Styling */}
        <div className="flex flex-wrap items-center gap-3.5 pt-3">
          {trailerKey ? (
            <button
              onClick={() => openTrailerModal(trailerKey, movie || undefined)}
              aria-label={`Watch ${title} trailer`}
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm sm:text-base shadow-[0_0_25px_rgba(229,137,10,0.5)] hover:shadow-[0_0_35px_rgba(229,137,10,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 cursor-pointer"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-black text-black" />
              <span>Watch Trailer</span>
            </button>
          ) : (
            <Link
              href="/movies"
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm sm:text-base shadow-[0_0_25px_rgba(229,137,10,0.5)] hover:shadow-[0_0_35px_rgba(229,137,10,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 cursor-pointer"
            >
              <Film className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              <span>Explore More</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </Link>
          )}

          <button
            onClick={openDrawer}
            className="px-6 py-3.5 rounded-full bg-[#10121B]/90 hover:bg-[#151926] border border-amber-500/40 hover:border-amber-400 text-zinc-200 hover:text-white font-bold text-sm sm:text-base transition-all duration-200 flex items-center gap-2 backdrop-blur-md cursor-pointer hover:shadow-[0_0_20px_rgba(229,137,10,0.3)]"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            <span>Ask Mate AI</span>
          </button>
        </div>
      </div>
    </section>
  );
};
