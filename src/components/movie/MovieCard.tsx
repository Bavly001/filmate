'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Star } from 'lucide-react';
import { Movie } from '@/types/movie';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';

interface MovieCardProps {
  movie: Movie;
  onPlayTrailer?: (key: string, movie?: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onPlayTrailer }) => {
  const getPlatformBadgeColor = (platform: string) => {
    switch (platform) {
      case 'Netflix':
        return 'bg-red-600/80 text-white border-red-500/30';
      case 'Prime Video':
        return 'bg-sky-600/80 text-white border-sky-400/30';
      case 'Disney+':
        return 'bg-blue-600/80 text-white border-blue-400/30';
      case 'HBO Max':
        return 'bg-purple-600/80 text-white border-purple-400/30';
      case 'Apple TV+':
        return 'bg-zinc-700/80 text-white border-zinc-500/30';
      case 'Hulu':
        return 'bg-emerald-600/80 text-white border-emerald-400/30';
      case 'Cinema IMAX':
      case 'In Cinemas':
      case 'WatchIT':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-zinc-800/80 text-zinc-300 border-zinc-700/40';
    }
  };

  const trailerKey = movie.youtubeTrailerKey || movie.youtubeVideoId;

  return (
    <Link
      href={`/movies/${movie.id}`}
      className="group relative rounded-3xl overflow-hidden bg-[#10121B] border border-amber-500/20 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(229,137,10,0.35)] transition-all duration-500 flex flex-col justify-between cursor-pointer block h-[480px] sm:h-[500px]"
    >
      {/* Blurred Rotated Background Poster (from MoviesAngularProject card style) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={movie.posterUrl}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover filter blur-md opacity-20 transform -rotate-45 scale-150 group-hover:rotate-0 group-hover:scale-100 group-hover:opacity-30 group-hover:blur-none transition-all duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#10121B] via-[#10121B]/70 to-transparent" />
      </div>

      {/* Poster Image Frame */}
      <div className="relative aspect-[3/4] w-full p-3 z-10">
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#07080B] shadow-lg group-hover:-translate-y-2 group-hover:shadow-[0_0_15px_rgba(229,137,10,0.35)] transition-all duration-500">
          <ImageWithFallback
            src={movie.posterUrl}
            alt={movie.title}
            fallbackTitle={movie.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
            <div className="px-2.5 py-1 rounded-full bg-[#07080B]/90 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-black flex items-center gap-1 shadow-sm">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{movie.rating.toFixed(1)}</span>
            </div>
          </div>

          {movie.ageRating === '18+' && (
            <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md z-10">
              18+
            </div>
          )}

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

          {/* Platform badges */}
          {movie.platforms && movie.platforms.length > 0 && (
            <div className="absolute bottom-3 left-3 right-14 pointer-events-none flex flex-wrap gap-1 z-10">
              {movie.platforms.slice(0, 2).map((p, idx) => (
                <span
                  key={`${p}-${idx}`}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight border backdrop-blur-md shadow-sm ${getPlatformBadgeColor(
                    p
                  )}`}
                >
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info Body / Hover Sliding Details Drawer (MoviesAngular style) */}
      <div className="relative z-10 p-4 pt-1 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-black text-base text-white tracking-tight leading-snug line-clamp-1 group-hover:text-amber-400 transition-colors">
              {movie.title}
            </h3>
            <span className="text-xs font-semibold text-amber-500/90 shrink-0">
              ({movie.year || '2024'})
            </span>
          </div>

          <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
            {movie.genres?.join(' • ') || 'Cinema'}
          </p>

          {/* Plot snippet preview (slides up / visible on hover) */}
          {movie.synopsis && (
            <p className="text-[11px] text-zinc-300 line-clamp-2 mt-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {movie.synopsis}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-amber-500/10 mt-2">
          <span>{movie.runtime ? `${movie.runtime} min` : movie.duration || 'Feature'}</span>
          <span className="text-amber-400 font-bold group-hover:underline flex items-center gap-1 text-[11px]">
            More info &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
};
