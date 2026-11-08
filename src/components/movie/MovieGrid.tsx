'use client';

import React, { useMemo } from 'react';
import { Sparkles, Film, Flame, PlayCircle, Clapperboard } from 'lucide-react';
import { MovieCard } from './MovieCard';
import { TrailerCard } from './TrailerCard';
import { useMovieStore } from '@/store/useMovieStore';
import { getCuratedMovies, filterMoviesByCriteria } from '@/services/movieApi';
import { TrailerItem } from '@/types/movie';

interface MovieGridProps {
  liveTrailers?: TrailerItem[];
}

export const MovieGrid: React.FC<MovieGridProps> = ({ liveTrailers = [] }) => {
  const { searchQuery, selectedCategory, setSelectedCategory, openTrailerModal } = useMovieStore();

  const allMovies = useMemo(() => getCuratedMovies(), []);

  const categories = [
    { id: 'all', label: 'All Catalog' },
    { id: 'cinema', label: 'In Cinemas (IMAX)' },
    { id: 'upcoming', label: 'Upcoming 2026' },
    { id: 'Action', label: 'Action & Thrills' },
    { id: 'Sci-Fi', label: 'Sci-Fi' },
    { id: 'Comedy', label: 'Comedy' },
    { id: 'Drama', label: 'Drama & Romance' },
    { id: 'Horror', label: 'Horror' },
    { id: 'Animation', label: 'Animation & Family' },
  ];

  const filteredMovies = useMemo(() => {
    let list = allMovies;

    if (selectedCategory === 'cinema') {
      list = list.filter((m) => m.venue === 'cinema' || m.venue === 'both');
    } else if (selectedCategory === 'upcoming') {
      list = list.filter((m) => m.upcoming);
    } else if (selectedCategory !== 'all') {
      list = list.filter((m) =>
        m.genres.some((g) => g.toLowerCase() === selectedCategory.toLowerCase())
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.genres.some((g) => g.toLowerCase().includes(q)) ||
          m.platforms.some((p) => p.toLowerCase().includes(q))
      );
    }

    return list;
  }, [allMovies, selectedCategory, searchQuery]);

  return (
    <div id="cinema-catalog" className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-sunset to-cyber text-white shadow-neon-sunset scale-105'
                : 'bg-dark-surface/80 border border-gray-800 text-gray-400 hover:text-white hover:border-sunset/40'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Live KinoCheck Upcoming Trailers Section */}
      {liveTrailers.length > 0 && selectedCategory === 'all' && !searchQuery && (
        <section className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <PlayCircle className="w-6 h-6 text-sunset animate-pulse" />
              <span>Upcoming Cinema Trailers (KinoCheck Live)</span>
            </h2>
            <span className="text-xs text-sunset font-bold uppercase tracking-wider">
              Live Feed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {liveTrailers.slice(0, 4).map((trailer) => (
              <TrailerCard
                key={trailer.id}
                trailer={trailer}
                onPlayTrailer={(key) => openTrailerModal(key)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Main Movies Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Clapperboard className="w-6 h-6 text-sunset" />
            <span>
              {searchQuery
                ? `Results for "${searchQuery}"`
                : selectedCategory === 'all'
                ? 'Now Showing & Featured Catalog'
                : `${categories.find((c) => c.id === selectedCategory)?.label || 'Movies'}`}
            </span>
          </h2>
          <span className="text-xs text-gray-400 font-semibold">
            {filteredMovies.length} movies available
          </span>
        </div>

        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onPlayTrailer={(key, m) => openTrailerModal(key, m)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl glass-panel">
            <p className="text-gray-400 text-base mb-2">No movies found matching your filter.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                useMovieStore.getState().setSearchQuery('');
              }}
              className="text-sunset font-bold text-sm hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
