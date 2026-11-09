'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Star } from 'lucide-react';
import { Movie } from '@/types/movie';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';

interface NumberedMovieCardProps {
  rank: number;
  movie: Movie;
  onPlayTrailer?: (key: string, movie?: Movie) => void;
}

export const NumberedMovieCard: React.FC<NumberedMovieCardProps> = ({
  rank,
  movie,
  onPlayTrailer,
}) => {
  const isTopThree = rank <= 3;
  const trailerKey = movie.youtubeTrailerKey || movie.youtubeVideoId;

  return (
    <div className="group relative flex items-end pl-8 sm:pl-10 pb-2">
      {/* Giant Outline Rank Number behind card */}
      <span
        className={`absolute left-0 bottom-0 z-0 font-black text-7xl sm:text-8xl md:text-9xl leading-none select-none pointer-events-none transition-all duration-300 ${
          isTopThree
            ? 'text-transparent [-webkit-text-stroke:2.5px_#F59E0B] drop-shadow-[0_0_15px_rgba(245,158,11,0.4)] group-hover:scale-105'
            : 'text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.25)] group-hover:[-webkit-text-stroke:2px_#F59E0B] group-hover:drop-shadow-[0_0_12px_rgba(245,158,11,0.3)]'
        }`}
      >
        {rank}
      </span>

      {/* Foreground Vertical Poster Card with Gold-cinema hover glow */}
      <Link
        href={`/movies/${movie.id}`}
        className="relative z-10 w-full rounded-3xl overflow-hidden bg-[#10121B] border-2 border-transparent group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(229,137,10,0.45)] group-hover:-translate-y-2 transition-all duration-500 block"
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#07080B]">
          <ImageWithFallback
            src={movie.posterUrl}
            alt={movie.title}
            fallbackTitle={movie.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Top Rating Badge */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 z-10 px-2.5 py-1 rounded-full bg-[#07080B]/90 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-black shadow-sm">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>

          {/* Play Trailer Floating Button */}
          {trailerKey && (
            <button
              type="button"
              title="Play Trailer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPlayTrailer?.(trailerKey, movie);
              }}
              className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-amber-500 text-black flex items-center justify-center shadow-[0_0_15px_rgba(229,137,10,0.6)] group-hover:scale-110 active:scale-95 transition-all duration-300 z-20 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black ml-0.5" />
            </button>
          )}

          {/* Bottom Gradient Fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#10121B] via-transparent to-transparent opacity-85 pointer-events-none" />
        </div>

        {/* Info Body */}
        <div className="p-3 bg-[#10121B]">
          <h3 className="font-black text-sm text-white tracking-tight leading-snug line-clamp-1 group-hover:text-amber-400 transition-colors">
            {movie.title}
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
            {movie.genres?.join(' • ') || 'Cinema'}
          </p>
        </div>
      </Link>
    </div>
  );
};
