'use client';

import React, { useMemo, useState, useEffect } from 'react';
import {
  Clapperboard,
  PlayCircle,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { MovieCard } from './MovieCard';
import { TrailerCard } from './TrailerCard';
import { useMovieStore } from '@/store/useMovieStore';
import { Movie, TrailerItem } from '@/types/movie';

interface MovieGridProps {
  movies?: Movie[];
  liveTrailers?: TrailerItem[];
}

export const MovieGrid: React.FC<MovieGridProps> = ({ movies = [], liveTrailers = [] }) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    openTrailerModal,
  } = useMovieStore();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const categories = [
    { id: 'all', label: 'All Catalog' },
    { id: 'Action', label: 'Action & Thrills' },
    { id: 'Sci-Fi', label: 'Sci-Fi' },
    { id: 'Drama', label: 'Drama & Romance' },
    { id: 'Comedy', label: 'Comedy' },
    { id: 'Horror', label: 'Horror' },
    { id: 'Animation', label: 'Animation & Family' },
  ];

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const filteredMovies = useMemo(() => {
    let list = movies;

    if (selectedCategory !== 'all') {
      list = list.filter((m) =>
        m.genres?.some((g) => g.toLowerCase() === selectedCategory.toLowerCase())
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.genres?.some((g) => g.toLowerCase().includes(q)) ||
          m.platforms?.some((p) => p.toLowerCase().includes(q))
      );
    }

    return list;
  }, [movies, selectedCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredMovies.length / itemsPerPage));
  const paginatedMovies = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMovies.slice(start, start + itemsPerPage);
  }, [filteredMovies, currentPage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    const catalogEl = document.getElementById('cinema-catalog');
    if (catalogEl && typeof catalogEl.scrollIntoView === 'function') {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="movies" className="max-w-7xl mx-auto px-4 sm:px-8 py-8 scroll-mt-20">
      <div id="cinema-catalog" className="scroll-mt-24" />
      {/* Search & Filter Toolbar */}
      <div className="mb-10 space-y-4">
        {/* Unified Search Bar */}
        <div className="relative w-full max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-5 h-5 text-amber-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies by title, genre, or platform..."
            className="w-full pl-11 pr-11 py-3 rounded-2xl bg-[#10121B] border border-amber-500/20 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all shadow-xl"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar justify-start sm:justify-center">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'bg-[#10121B] border border-amber-500/15 text-zinc-300 hover:text-amber-300 hover:border-amber-400/40'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Live KinoCheck Featured Trailers Section */}
      {liveTrailers.length > 0 && selectedCategory === 'all' && !searchQuery && currentPage === 1 && (
        <section className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <PlayCircle className="w-6 h-6 text-amber-500 animate-pulse" />
              <span>Cinema Premiere Trailers (Live)</span>
            </h2>
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Clapperboard className="w-6 h-6 text-amber-500" />
            <span>
              {searchQuery
                ? `Results for "${searchQuery}"`
                : selectedCategory === 'all'
                ? 'Curated Cinema & Television Catalog'
                : `${categories.find((c) => c.id === selectedCategory)?.label || 'Movies'}`}
            </span>
          </h2>
          <span className="text-xs text-zinc-400 font-semibold">
            Showing{' '}
            {filteredMovies.length === 0
              ? 0
              : `${(currentPage - 1) * itemsPerPage + 1}–${Math.min(
                  currentPage * itemsPerPage,
                  filteredMovies.length
                )}`}{' '}
            of {filteredMovies.length} movies
          </span>
        </div>

        {paginatedMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
            {paginatedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onPlayTrailer={(key, m) => openTrailerModal(key, m)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-[#10121B] border border-amber-500/15">
            <p className="text-zinc-400 text-base mb-2">No titles found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-amber-400 font-bold text-sm hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-amber-500/15">
            <p className="text-xs text-zinc-400">
              Page <span className="font-bold text-white">{currentPage}</span> of{' '}
              <span className="font-bold text-white">{totalPages}</span>
            </p>

            <div className="flex items-center gap-1.5">
              <button
                aria-label="Previous page"
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#10121B] border border-amber-500/20 text-zinc-300 hover:text-white hover:border-amber-400 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                        : 'bg-[#10121B] border border-amber-500/15 text-zinc-400 hover:text-white hover:border-amber-400/40'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                aria-label="Next page"
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#10121B] border border-amber-500/20 text-zinc-300 hover:text-white hover:border-amber-400 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
