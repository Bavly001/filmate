'use client';

import React from 'react';
import { Play, Star, Sparkles } from 'lucide-react';
import { Movie } from '@/types/movie';

interface MovieCardProps {
  movie: Movie;
  onPlayTrailer?: (key: string, movie?: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onPlayTrailer }) => {
  const isCinema = movie.platforms.includes('Cinema IMAX') || movie.platforms.includes('In Cinemas');

  const getPlatformBadgeColor = (platform: string) => {
    switch (platform) {
      case 'Netflix':
        return 'bg-red-600/90 text-white border-red-500/40';
      case 'Prime Video':
        return 'bg-sky-500/90 text-white border-sky-400/40';
      case 'Disney+':
        return 'bg-blue-600/90 text-white border-blue-400/40';
      case 'HBO Max':
        return 'bg-purple-600/90 text-white border-purple-400/40';
      case 'Apple TV+':
        return 'bg-zinc-700/90 text-white border-zinc-500/40';
      case 'Hulu':
        return 'bg-emerald-600/90 text-white border-emerald-400/40';
      case 'Paramount+':
        return 'bg-blue-700/90 text-white border-blue-500/40';
      case 'Cinema IMAX':
      case 'In Cinemas':
        return 'bg-sunset/90 text-white border-sunset/50';
      default:
        return 'bg-gray-800/90 text-gray-200 border-gray-700/50';
    }
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden glass-card flex flex-col justify-between cursor-pointer border border-white/5 hover:border-sunset/40">
      {/* Poster Wrap */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-dark-surface">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          <div className="px-2 py-1 rounded-lg bg-dark-bg/90 backdrop-blur-md border border-gold/40 text-gold text-xs font-black flex items-center gap-1 shadow-sm">
            <Star className="w-3 h-3 fill-gold text-gold" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>

          {movie.upcoming && (
            <div className="px-2 py-0.5 rounded-lg bg-cyber/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
              Upcoming
            </div>
          )}
        </div>

        {movie.ageRating === '18+' && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-400 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md">
            18+
          </div>
        )}

        {/* Play Trailer Floating Button */}
        {movie.youtubeTrailerKey && (
          <button
            title="Play Trailer"
            onClick={(e) => {
              e.stopPropagation();
              onPlayTrailer?.(movie.youtubeTrailerKey, movie);
            }}
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-gradient-to-r from-sunset to-cyber text-white flex items-center justify-center shadow-neon-sunset group-hover:scale-110 active:scale-90 transition-transform duration-300 z-20 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white ml-0.5" />
          </button>
        )}

        {/* Platform tag overlay on bottom left */}
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

        {/* Dark gradient fade on bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/95 via-transparent to-transparent opacity-80 pointer-events-none" />
      </div>

      {/* Info Body */}
      <div className="p-4 flex flex-col gap-1.5 flex-1 justify-between bg-dark-surface/60">
        <div>
          <h3 className="font-extrabold text-base text-white tracking-tight leading-snug line-clamp-1 group-hover:text-sunset transition-colors">
            {movie.title}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
            {movie.genres.join(' • ')}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-white/5">
          <span>{movie.year}</span>
          <span>{movie.duration || 'Feature'}</span>
        </div>
      </div>
    </div>
  );
};
