'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Film,
  Sparkles,
  Clapperboard,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Flame,
  Star,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Navbar } from '@/components/common/Navbar';
import { AmbientBackground } from '@/components/common/AmbientBackground';
import { MovieCard } from '@/components/movie/MovieCard';
import { FloatingMateButton } from '@/components/mate/FloatingMateButton';
import { MateDrawer } from '@/components/mate/MateDrawer';
import { TrailerModal } from '@/components/movie/TrailerModal';
import { useMovieStore } from '@/store/useMovieStore';
import { fetchCatalogMovies } from '@/services/movieApi';

type SortOption = 'rating-desc' | 'rating-asc' | 'year-desc' | 'year-asc' | 'title-asc';

export default function MoviesCatalogPage() {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    openTrailerModal,
  } = useMovieStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('rating-desc');
  const itemsPerPage = 12;

  const { data: allMovies = [], isLoading } = useQuery({
    queryKey: ['catalogMoviesFull', searchQuery],
    queryFn: () => fetchCatalogMovies({ query: searchQuery.trim() || undefined, page: 0 }),
    staleTime: 1000 * 60 * 15,
  });

  const categories = [
    { id: 'all', label: 'All Catalog' },
    { id: 'cinema', label: 'In Cinemas (IMAX)' },
    { id: 'Action', label: 'Action & Thrills' },
    { id: 'Sci-Fi', label: 'Sci-Fi' },
    { id: 'Comedy', label: 'Comedy' },
    { id: 'Drama', label: 'Drama & Romance' },
    { id: 'Horror', label: 'Horror' },
    { id: 'Animation', label: 'Animation & Family' },
  ];

  // Reset page when filter, sort, or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortBy]);

  const filteredMovies = useMemo(() => {
    let list = [...allMovies];

    if (selectedCategory === 'cinema') {
      list = list.filter((m) => m.venue === 'cinema' || m.venue === 'both');
    } else if (selectedCategory !== 'all') {
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

    // Sort
    list.sort((a, b) => {
      switch (sortBy) {
        case 'rating-desc':
          return b.rating - a.rating;
        case 'rating-asc':
          return a.rating - b.rating;
        case 'year-desc':
          return (Number(b.year) || 0) - (Number(a.year) || 0);
        case 'year-asc':
          return (Number(a.year) || 0) - (Number(b.year) || 0);
        case 'title-asc':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return list;
  }, [allMovies, selectedCategory, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredMovies.length / itemsPerPage));
  const paginatedMovies = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMovies.slice(start, start + itemsPerPage);
  }, [filteredMovies, currentPage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    const catalogHeader = document.getElementById('catalog-header');
    if (catalogHeader && typeof catalogHeader.scrollIntoView === 'function') {
      catalogHeader.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#07080B] text-white flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-300">
      <AmbientBackground />

      <div className="relative z-10 flex-1">
        <Navbar />

        {/* Page Header */}
        <section id="catalog-header" className="max-w-7xl mx-auto px-4 sm:px-8 pt-32 pb-4 scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-amber-500/15">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-3">
                <Clapperboard className="w-3.5 h-3.5 text-amber-400" />
                <span>Global Public Cinema Catalog</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Explore{' '}
                <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500 bg-clip-text text-transparent">
                  All Movies
                </span>
              </h1>
              <p className="text-zinc-400 text-sm mt-2 max-w-xl">
                Browse our real-time catalog powered by live TVMaze and KinoCheck public endpoints.
              </p>
            </div>

            {/* Total Count Chip */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#10121B] border border-amber-500/25 self-start md:self-auto shadow-lg">
              <Film className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-white">
                {filteredMovies.length}{' '}
                <span className="text-zinc-400 font-normal">titles available</span>
              </span>
            </div>
          </div>
        </section>

        {/* Search, Filter & Sort Toolbar */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
            {/* Search Input */}
            <div className="relative flex-1 max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                <Search className="w-5 h-5 text-amber-400" />
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

            {/* Sort Control */}
            <div className="flex items-center gap-2.5 self-end lg:self-auto">
              <label
                htmlFor="sort-select"
                className="text-xs font-bold text-zinc-400 flex items-center gap-1.5 whitespace-nowrap"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                <span>Sort By:</span>
              </label>
              <select
                id="sort-select"
                aria-label="Sort by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3.5 py-2.5 rounded-xl bg-[#10121B] border border-amber-500/20 text-zinc-200 text-xs font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="rating-desc">Highest Rated (★ 10-0)</option>
                <option value="rating-asc">Lowest Rated</option>
                <option value="year-desc">Newest Releases</option>
                <option value="year-asc">Oldest Classics</option>
                <option value="title-asc">Title (A - Z)</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'bg-[#10121B] border border-amber-500/15 text-zinc-400 hover:text-white hover:border-amber-400/40'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Showing Indicator */}
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-6">
            <span>
              Showing{' '}
              <strong className="text-white">
                {filteredMovies.length === 0
                  ? 0
                  : `${(currentPage - 1) * itemsPerPage + 1}–${Math.min(
                      currentPage * itemsPerPage,
                      filteredMovies.length
                    )}`}
              </strong>{' '}
              of <strong className="text-white">{filteredMovies.length}</strong> movies
            </span>
          </div>

          {/* Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] rounded-2xl bg-[#10121B] border border-amber-500/10 animate-pulse"
                />
              ))}
            </div>
          ) : paginatedMovies.length > 0 ? (
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
            <div className="p-16 text-center rounded-3xl bg-[#10121B] border border-amber-500/20 my-8">
              <Film className="w-12 h-12 text-amber-500/60 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No movies match your criteria</h3>
              <p className="text-zinc-400 text-xs mb-4">
                Try searching for a different keyword or resetting your category filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setSortBy('rating-desc');
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all cursor-pointer"
              >
                Reset All Filters
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
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((pageNum) => (
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

      <footer className="relative z-10 border-t border-amber-500/10 bg-[#07080B] py-8 px-4 sm:px-8 text-center text-xs text-zinc-500">
        <p>© 2026 Filmate. All rights reserved. Crafted in Midnight Gold.</p>
      </footer>

      <FloatingMateButton />
      <MateDrawer />
      <TrailerModal />
    </main>
  );
}
