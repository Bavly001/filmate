'use client';

import React from 'react';
import { Play, Sparkles, Star, Clapperboard, Film } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchHeroShowcase } from '@/services/movieApi';
import { useMateStore } from '@/store/useMateStore';
import { useMovieStore } from '@/store/useMovieStore';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';

export const HeroBanner: React.FC = () => {
  const openDrawer = useMateStore((s) => s.openDrawer);
  const openTrailerModal = useMovieStore((s) => s.openTrailerModal);

  const { data: movie, isLoading } = useQuery({
    queryKey: ['heroShowcase'],
    queryFn: fetchHeroShowcase,
    staleTime: 1000 * 60 * 30,
  });

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
    <section className="relative w-full min-h-[550px] sm:min-h-[640px] lg:min-h-[720px] flex items-center justify-start overflow-hidden pt-24 pb-16 px-4 sm:px-8 md:px-12">
      {/* Full-bleed Backdrop Layer */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src={backdrop}
          alt={title}
          fallbackTitle={title}
          className="w-full h-full object-cover object-center scale-105 filter brightness-75 transition-all duration-700"
        />

        {/* Multi-angle cinematic dark obsidian gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080B] via-[#07080B]/60 via-30% to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080B] via-[#07080B]/80 via-40% to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left_center,rgba(7,8,11,0.95)_0%,rgba(7,8,11,0.6)_50%,transparent_100%)]" />
      </div>

      {/* Hero Showcase Content */}
      <div className="relative z-10 max-w-2xl space-y-5 animate-fade-in">
        {/* Premiere Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.25)] backdrop-blur-md">
          <Clapperboard className="w-3.5 h-3.5 text-amber-400" />
          <span>Cinematic Premiere Showcase</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] drop-shadow-2xl">
          {title}
        </h1>

        {/* Meta badges: Rating, Genres, Venue */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <div className="px-3 py-1 rounded-xl bg-[#0B0D13]/90 border border-amber-500/40 text-amber-300 text-xs font-black flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{rating.toFixed(1)} Rating</span>
          </div>

          <div className="px-3 py-1 rounded-xl bg-[#0B0D13]/80 border border-zinc-800 text-zinc-300 text-xs font-semibold">
            <span>4K Ultra HD</span>
          </div>

          {genres.slice(0, 3).map((g) => (
            <span
              key={g}
              className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-xs font-bold"
            >
              {g}
            </span>
          ))}
        </div>

        {/* Synopsis */}
        <p className="text-sm sm:text-base text-zinc-300 line-clamp-3 leading-relaxed max-w-xl font-normal drop-shadow">
          {synopsis}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-3">
          {trailerKey ? (
            <button
              onClick={() => openTrailerModal(trailerKey, movie || undefined)}
              aria-label={`Watch ${title} trailer`}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm sm:text-base shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:shadow-[0_0_35px_rgba(245,158,11,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 cursor-pointer"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-black text-black" />
              <span>Watch Trailer</span>
            </button>
          ) : (
            <a
              href="#catalog"
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm sm:text-base shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:shadow-[0_0_35px_rgba(245,158,11,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 cursor-pointer"
            >
              <Film className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              <span>Explore Cinema</span>
            </a>
          )}

          <button
            onClick={openDrawer}
            className="px-6 py-3.5 rounded-2xl bg-[#10121B]/90 hover:bg-[#151926] border border-amber-500/30 hover:border-amber-400 text-zinc-200 hover:text-white font-bold text-sm sm:text-base transition-all duration-200 flex items-center gap-2 backdrop-blur-md cursor-pointer hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            <span>Ask Mate AI</span>
          </button>
        </div>
      </div>
    </section>
  );
};
