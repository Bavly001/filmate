'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  IoSearch,
  IoClose,
  IoFilmOutline,
  IoTvOutline,
  IoStar,
  IoCalendarOutline,
  IoArrowForward,
} from 'react-icons/io5';
import { useSearchStore } from '@/store/useSearchStore';
import { useSearchQuery } from '@/hooks/useSearchQuery';
import ImageComp from './ImageComp';
import {
  MOVIE_GENRES,
  TV_GENRES,
  SORT_OPTIONS,
} from '@/constants/genres';

export default function SearchOverlay() {
  const {
    isOpen,
    closeSearch,
    query,
    setQuery,
    filter,
    setFilter,
    genre,
    setGenre,
    sortBy,
    setSortBy,
    clearSearch,
  } = useSearchStore();

  const [debouncedQuery, setDebouncedQuery] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // TanStack Query custom hook for searching movies and TV shows
  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useSearchQuery(debouncedQuery);

  const results = data?.results || [];

  // Available genres based on media filter
  const availableGenres = useMemo(() => {
    if (filter === 'movie') return MOVIE_GENRES;
    if (filter === 'tv') return TV_GENRES;
    // For 'all', merge without duplicates
    const map = new Map<number, string>();
    MOVIE_GENRES.forEach((g) => map.set(g.id, g.name));
    TV_GENRES.forEach((g) => map.set(g.id, g.name));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [filter]);

  // Handle typing: 3 letters minimum + smooth 350ms debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const trimmed = val.trim();
    if (trimmed.length < 3) {
      setDebouncedQuery('');
      return;
    }

    timerRef.current = setTimeout(() => {
      setDebouncedQuery(trimmed);
    }, 350);
  };

  // Immediate search on Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = query.trim();
      if (trimmed.length >= 3) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        setDebouncedQuery(trimmed);
      }
    } else if (e.key === 'Escape') {
      closeSearch();
    }
  };

  const handleClear = () => {
    clearSearch();
    setDebouncedQuery('');
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    inputRef.current?.focus();
  };

  // Auto-focus and document scroll lock
  useEffect(() => {
    if (isOpen) {
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalBodyOverflow = document.body.style.overflow;

      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 80);

      return () => {
        clearTimeout(timeout);
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.overflow = originalBodyOverflow;
      };
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  }, [isOpen]);

  // Global Escape key handler
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, closeSearch]);

  if (!isOpen) return null;

  const isSearching = (isLoading || isFetching) && debouncedQuery.length >= 3;

  // Filtered and Sorted results
  const filteredResults = results
    .filter((item) => {
      if (filter === 'movie' && item.movieType !== 'Movie') return false;
      if (filter === 'tv' && item.movieType !== 'TV Show') return false;
      if (genre && !item.genre_ids?.includes(Number(genre))) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'vote_average.desc') {
        return (b.vote_average || 0) - (a.vote_average || 0);
      }
      if (sortBy === 'primary_release_date.desc') {
        const dateA = new Date(a.release_date || '').getTime() || 0;
        const dateB = new Date(b.release_date || '').getTime() || 0;
        return dateB - dateA;
      }
      if (sortBy === 'vote_count.desc') {
        return (b.vote_count || 0) - (a.vote_count || 0);
      }
      if (sortBy === 'title.asc') {
        const titleA = a.title || a.name || '';
        const titleB = b.title || b.name || '';
        return titleA.localeCompare(titleB);
      }
      // default: popularity.desc
      return (b.popularity || 0) - (a.popularity || 0);
    });

  const movieCount = results.filter((i) => i.movieType === 'Movie').length;
  const tvCount = results.filter((i) => i.movieType === 'TV Show').length;

  // Build target catalog link based on search query, genre, and sort
  const catalogHref = (() => {
    const targetType = filter === 'tv' ? '/tv-shows' : '/movies';
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('query', debouncedQuery);
    if (genre) params.set('genre', genre);
    if (sortBy && sortBy !== 'popularity.desc') params.set('sort_by', sortBy);
    const queryString = params.toString();
    return queryString ? `${targetType}?${queryString}` : targetType;
  })();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Universal Search"
      className="fixed inset-0 z-[100] flex flex-col bg-zinc-950/95 backdrop-blur-2xl transition-all duration-300 animate-fadeIn overscroll-contain"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeSearch();
      }}
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Search Bar Container */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-4 flex flex-col gap-4">
        {/* Controls row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-semibold px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Universal Search
            </span>
          </div>

          <button
            onClick={closeSearch}
            aria-label="Close search overlay"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 transition-all text-xs font-medium cursor-pointer"
          >
            <span>Close</span>
            <kbd className="hidden sm:inline bg-zinc-800 px-1.5 py-0.5 rounded text-[10px] text-zinc-300 border border-zinc-700">
              ESC
            </kbd>
            <IoClose size="1.2em" />
          </button>
        </div>

        {/* Floating Glass Search Input */}
        <div className="relative group">
          <div
            className={`w-full flex items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl bg-zinc-900/70 border backdrop-blur-xl transition-all duration-200 shadow-2xl shadow-black/60 ${
              isSearching
                ? 'border-cyan-400/60 ring-1 ring-cyan-400/30'
                : 'border-white/15 focus-within:border-cyan-400/60 focus-within:ring-2 focus-within:ring-cyan-400/20'
            }`}
          >
            <IoSearch
              size="1.5em"
              className={`shrink-0 transition-colors ${
                isSearching
                  ? 'text-cyan-400 animate-pulse'
                  : 'text-zinc-400 group-focus-within:text-cyan-400'
              }`}
            />

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search movies, TV shows, franchises..."
              className="w-full bg-transparent text-white text-base sm:text-lg outline-none placeholder:text-zinc-500 font-normal tracking-wide"
            />

            {/* Loader / Clear */}
            <div className="flex items-center gap-2 shrink-0">
              {isSearching && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-medium">
                  <span className="inline-block w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Searching...</span>
                </div>
              )}

              {query && (
                <button
                  onClick={handleClear}
                  aria-label="Clear search input"
                  className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <IoClose size="1.25em" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters and Sorting Bar */}
        {results.length > 0 && !isSearching && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-zinc-950 font-bold shadow-lg shadow-cyan-500/20'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                All ({results.length})
              </button>
              <button
                onClick={() => setFilter('movie')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium ${
                  filter === 'movie'
                    ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-zinc-950 font-bold shadow-lg shadow-cyan-500/20'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                <IoFilmOutline />
                <span>Movies ({movieCount})</span>
              </button>
              <button
                onClick={() => setFilter('tv')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium ${
                  filter === 'tv'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-400 text-zinc-950 font-bold shadow-lg shadow-purple-500/20'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                <IoTvOutline />
                <span>TV Shows ({tvCount})</span>
              </button>
            </div>

            {/* Granular Genre and Sort Dropdowns */}
            <div className="flex items-center gap-2 text-xs">
              {/* Genre Filter */}
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                aria-label="Filter results by genre"
                className={`appearance-none pl-2.5 pr-7 py-1.5 rounded-xl text-xs font-medium cursor-pointer border focus:outline-none focus:border-cyan-400/60 transition-all ${
                  genre
                    ? 'bg-amber-950/40 text-amber-300 border-amber-500/40'
                    : 'bg-zinc-900/90 text-zinc-300 border-white/10 hover:border-white/20'
                }`}
              >
                <option value="" className="bg-zinc-900 text-white">All Genres</option>
                {availableGenres.map((g) => (
                  <option key={g.id} value={String(g.id)} className="bg-zinc-900 text-white">
                    {g.name}
                  </option>
                ))}
              </select>

              {/* Sort By Filter */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort search results"
                className={`appearance-none pl-2.5 pr-7 py-1.5 rounded-xl text-xs font-medium cursor-pointer border focus:outline-none focus:border-cyan-400/60 transition-all ${
                  sortBy !== 'popularity.desc'
                    ? 'bg-cyan-950/40 text-cyan-300 border-cyan-500/40'
                    : 'bg-zinc-900/90 text-zinc-300 border-white/10 hover:border-white/20'
                }`}
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value} className="bg-zinc-900 text-white">
                    {s.label}
                  </option>
                ))}
              </select>

              {/* Catalog Deep Link Button */}
              {debouncedQuery.length >= 3 && (
                <Link
                  href={catalogHref}
                  onClick={closeSearch}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white border border-white/10 transition-all text-xs font-medium"
                  title="Open full catalog with these parameters"
                >
                  <span className="hidden sm:inline">Open in Catalog</span>
                  <IoArrowForward size="1.1em" />
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Results Scrollable Area */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 pb-16 custom-scrollbar overscroll-contain">
        <div className="w-full max-w-5xl mx-auto">
          {/* Initial State (< 3 characters) */}
          {query.trim().length < 3 && !isSearching && (
            <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-400">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 mb-4 shadow-xl">
                <IoSearch size="2em" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Explore Filmate Catalog
              </h3>
              <p className="text-sm max-w-md text-zinc-400">
                Type at least{' '}
                <span className="text-cyan-400 font-semibold">3 characters</span>{' '}
                to discover movies, television series, and live titles.
              </p>
              {query.trim().length > 0 && query.trim().length < 3 && (
                <span className="mt-3 text-xs px-2.5 py-1 rounded bg-zinc-800/80 text-amber-400 border border-amber-500/20">
                  {3 - query.trim().length} more character
                  {3 - query.trim().length === 1 ? '' : 's'} required
                </span>
              )}
            </div>
          )}

          {/* Loading Skeleton Grid: exact card dimensions */}
          {isSearching && (
            <div className="flex flex-col gap-6 py-6">
              <div className="flex items-center justify-center gap-3 py-4 text-cyan-400">
                <span className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium tracking-wide">
                  Searching global database...
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 justify-items-center">
                {[...Array(10)].map((_, idx) => (
                  <div
                    key={idx}
                    className="w-full max-w-[200px] h-56 lg:h-72 my-2 rounded-xl bg-gradient-to-br from-zinc-800/70 via-zinc-800/40 to-zinc-900/80 animate-pulse border border-white/5 overflow-hidden flex flex-col justify-between p-3.5 relative shadow-lg"
                  >
                    <div className="w-12 h-5 rounded-md bg-zinc-700/60" />
                    <div className="flex flex-col gap-2">
                      <div className="w-3/4 h-4 rounded-md bg-zinc-700/60" />
                      <div className="w-1/2 h-3.5 rounded-md bg-zinc-700/40" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error State */}
          {isError && !isSearching && (
            <div className="flex flex-col items-center justify-center py-20 text-center text-red-400">
              <p className="text-sm">Error fetching search results. Please try again.</p>
            </div>
          )}

          {/* No Results Found */}
          {debouncedQuery.length >= 3 && !isSearching && filteredResults.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-400">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 mb-4">
                <IoFilmOutline size="2em" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">
                No titles found
              </h3>
              <p className="text-sm max-w-md text-zinc-400">
                We couldn&apos;t find any {filter !== 'all' ? (filter === 'movie' ? 'movies' : 'TV shows') : 'movies or TV shows'} matching &ldquo;<span className="text-white font-medium">{debouncedQuery}</span>&rdquo;.
              </p>
              <button
                onClick={handleClear}
                className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Results Grid */}
          {!isSearching && filteredResults.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 py-4 justify-items-center">
              {filteredResults.map((item) => {
                const isTV = item.movieType === 'TV Show';
                const detailHref = isTV
                  ? `/tv-shows/show/${item.id}`
                  : `/movies/movie/${item.id}`;
                const title = item.title || item.name || 'Untitled';
                const releaseYear = item.release_date
                  ? new Date(item.release_date).getFullYear()
                  : null;

                return (
                  <Link
                    key={`${item.movieType}-${item.id}`}
                    href={detailHref}
                    prefetch={true}
                    onClick={closeSearch}
                    className="group relative flex flex-col w-full max-w-[200px] h-56 lg:h-72 my-2 rounded-xl overflow-hidden bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/40"
                  >
                    {/* Poster container */}
                    <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
                      <ImageComp
                        img={item.poster_path}
                        imgAlt={title}
                        imgQuality="med"
                      />

                      {/* Top badges gradient overlay */}
                      <div className="absolute inset-x-0 top-0 p-2.5 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none">
                        {/* Type badge */}
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded backdrop-blur-md border ${
                            isTV
                              ? 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                              : 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                          }`}
                        >
                          {isTV ? 'TV Series' : 'Movie'}
                        </span>

                        {/* Rating */}
                        {item.vote_average > 0 && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded border border-amber-500/30">
                            <IoStar size="0.9em" />
                            <span>{item.vote_average.toFixed(1)}</span>
                          </span>
                        )}
                      </div>

                      {/* Hover subtle glow shimmer */}
                      <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/10 transition-colors pointer-events-none" />
                    </div>

                    {/* Metadata */}
                    <div className="p-3 flex flex-col flex-1 justify-between bg-zinc-900/80">
                      <div>
                        <h4
                          title={title}
                          className="font-semibold text-white text-xs sm:text-sm line-clamp-1 group-hover:text-cyan-400 transition-colors"
                        >
                          {title}
                        </h4>

                        <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                          {releaseYear && (
                            <span className="flex items-center gap-1">
                              <IoCalendarOutline size="0.95em" />
                              <span>{releaseYear}</span>
                            </span>
                          )}
                          {item.main_genre && (
                            <>
                              <span>•</span>
                              <span className="truncate">{item.main_genre}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
