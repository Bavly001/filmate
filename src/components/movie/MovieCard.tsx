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
      className="group relative rounded-2xl overflow-hidden bg-[#10121B] border border-amber-500/15 hover:border-amber-400/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] transition-all duration-300 flex flex-col justify-between cursor-pointer block"
    >
      {/* Poster Wrap */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#07080B]">
        <ImageWithFallback
          src={movie.posterUrl}
          alt={movie.title}
          fallbackTitle={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          <div className="px-2 py-0.5 rounded-lg bg-[#07080B]/90 backdrop-blur-md border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1 shadow-sm">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        </div>

        {movie.ageRating === '18+' && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-400 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md z-10">
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
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-amber-500 text-black flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)] group-hover:scale-110 active:scale-95 transition-all duration-300 z-20 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-black ml-0.5" />
          </button>
        )}

        {/* Platform tag overlay on bottom left */}
        {movie.platforms && movie.platforms.length > 0 && (
          <div className="absolute bottom-3 left-3 right-14 pointer-events-none flex flex-wrap gap-1 z-10">
            {movie.platforms.slice(0, 2).map((p, idx) => (
              <span
                key={`${p}-${idx}`}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-tight border backdrop-blur-md shadow-sm ${getPlatformBadgeColor(
                  p
                )}`}
              >
                {p}
              </span>
            ))}
          </div>
        )}

        {/* Dark gradient fade on bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#10121B] via-transparent to-transparent opacity-85 pointer-events-none" />
      </div>

      {/* Info Body */}
      <div className="p-4 flex flex-col gap-1.5 flex-1 justify-between bg-[#10121B]">
        <div>
          <h3 className="font-extrabold text-base text-white tracking-tight leading-snug line-clamp-1 group-hover:text-amber-400 transition-colors">
            {movie.title}
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
            {movie.genres?.join(' • ') || 'Cinema'}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-white/5">
          <span>{movie.year || '2024'}</span>
          <span>{movie.runtime ? `${movie.runtime} min` : movie.duration || 'Feature'}</span>
        </div>
      </div>
    </Link>
  );
};
