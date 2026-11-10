'use client';

import React, { useState, useEffect, useTransition, useCallback } from 'react';
import MovieCard from '@/components/movie-card/MovieCard';
import Pagination from '@/components/Pagination';
import { MovieItem } from '@/types/tmdb';
import { PaginatedResponse } from '@/lib/actions';
import { usePaginatedMedia } from '@/hooks/usePaginatedMedia';
import {
  MOVIE_GENRES,
  TV_GENRES,
  SORT_OPTIONS,
  YEAR_OPTIONS,
} from '@/constants/genres';

interface FilterOption {
  label: string;
  value: string;
}

interface PaginatedCatalogProps {
  type: 'movie' | 'tv';
  initialFilter?: string;
  initialGenre?: string;
  initialSortBy?: string;
  initialYear?: string;
  initialQuery?: string;
  filters: FilterOption[];
  initialPage?: number;
  initialData?: PaginatedResponse;
  title: string;
  highlightWord: string;
  subtitle: string;
}

export default function PaginatedCatalog({
  type,
  initialFilter = 'popular',
  initialGenre = '',
  initialSortBy = 'popularity.desc',
  initialYear = '',
  initialQuery = '',
  filters,
  initialPage = 1,
  initialData,
  title,
  highlightWord,
  subtitle,
}: PaginatedCatalogProps) {
  const [currentFilter, setCurrentFilter] = useState(initialFilter);
  const [currentGenre, setCurrentGenre] = useState(initialGenre);
  const [currentSortBy, setCurrentSortBy] = useState(initialSortBy);
  const [currentYear, setCurrentYear] = useState(initialYear);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [page, setPage] = useState(initialPage);
  const [cols, setCols] = useState(6);
  const [, startTransition] = useTransition();

  const genreList = type === 'movie' ? MOVIE_GENRES : TV_GENRES;

  // Debounce catalog search query (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Dynamically calculate responsive column count to guarantee symmetric rows
  useEffect(() => {
    const updateCols = () => {
      const width = window.innerWidth;
      if (width >= 1280) setCols(6);      // xl: 6 cols
      else if (width >= 1024) setCols(5); // lg: 5 cols
      else if (width >= 768) setCols(4);  // md: 4 cols
      else if (width >= 640) setCols(3);  // sm: 3 cols
      else setCols(2);                    // default mobile: 2 cols
    };

    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);

  // Update browser URL query string
  const syncUrlParams = useCallback(
    (params: {
      filter: string;
      genre: string;
      sortBy: string;
      year: string;
      query: string;
      page: number;
    }) => {
      if (typeof window === 'undefined') return;
      const url = new URL(window.location.href);

      if (params.filter && params.filter !== 'popular') {
        url.searchParams.set('filter', params.filter);
      } else {
        url.searchParams.delete('filter');
      }

      if (params.genre) {
        url.searchParams.set('genre', params.genre);
      } else {
        url.searchParams.delete('genre');
      }

      if (params.sortBy && params.sortBy !== 'popularity.desc') {
        url.searchParams.set('sort_by', params.sortBy);
      } else {
        url.searchParams.delete('sort_by');
      }

      if (params.year) {
        url.searchParams.set('year', params.year);
      } else {
        url.searchParams.delete('year');
      }

      if (params.query.trim()) {
        url.searchParams.set('query', params.query.trim());
      } else {
        url.searchParams.delete('query');
      }

      if (params.page > 1) {
        url.searchParams.set('page', String(params.page));
      } else {
        url.searchParams.delete('page');
      }

      window.history.pushState({}, '', url.toString());
    },
    []
  );

  // TanStack Query custom hook for paginated media fetching
  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = usePaginatedMedia({
    type,
    filter: currentFilter,
    genre: currentGenre || undefined,
    sortBy: currentSortBy,
    year: currentYear || undefined,
    query: debouncedQuery || undefined,
    page,
    initialData:
      currentFilter === initialFilter &&
      currentGenre === initialGenre &&
      currentSortBy === initialSortBy &&
      currentYear === initialYear &&
      debouncedQuery === initialQuery &&
      page === initialPage
        ? initialData
        : undefined,
  });

  const movies: MovieItem[] = data?.results || [];
  const totalPages = data?.total_pages || 1;

  // Ensure displayed items strictly fill full symmetric rows with zero leftover orphan cards
  const fullRowCount = Math.floor(movies.length / cols) * cols;
  const symmetricMovies =
    fullRowCount > 0 ? movies.slice(0, fullRowCount) : movies;

  // Number of skeleton cards matching full symmetric rows (3 full rows)
  const skeletonCount = cols * 3;

  const handleFilterClick = (filterValue: string) => {
    if (filterValue === currentFilter) return;
    setCurrentFilter(filterValue);
    setPage(1);
    startTransition(() => {
      syncUrlParams({
        filter: filterValue,
        genre: currentGenre,
        sortBy: currentSortBy,
        year: currentYear,
        query: debouncedQuery,
        page: 1,
      });
    });
  };

  const handleGenreChange = (newGenre: string) => {
    setCurrentGenre(newGenre);
    setPage(1);
    startTransition(() => {
      syncUrlParams({
        filter: currentFilter,
        genre: newGenre,
        sortBy: currentSortBy,
        year: currentYear,
        query: debouncedQuery,
        page: 1,
      });
    });
  };

  const handleSortChange = (newSort: string) => {
    setCurrentSortBy(newSort);
    setPage(1);
    startTransition(() => {
      syncUrlParams({
        filter: currentFilter,
        genre: currentGenre,
        sortBy: newSort,
        year: currentYear,
        query: debouncedQuery,
        page: 1,
      });
    });
  };

  const handleYearChange = (newYear: string) => {
    setCurrentYear(newYear);
    setPage(1);
    startTransition(() => {
      syncUrlParams({
        filter: currentFilter,
        genre: currentGenre,
        sortBy: currentSortBy,
        year: newYear,
        query: debouncedQuery,
        page: 1,
      });
    });
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setPage(1);
    startTransition(() => {
      syncUrlParams({
        filter: currentFilter,
        genre: currentGenre,
        sortBy: currentSortBy,
        year: currentYear,
        query: val,
        page: 1,
      });
    });
  };

  const handleResetFilters = () => {
    setCurrentFilter('popular');
    setCurrentGenre('');
    setCurrentSortBy('popularity.desc');
    setCurrentYear('');
    setSearchQuery('');
    setDebouncedQuery('');
    setPage(1);
    startTransition(() => {
      syncUrlParams({
        filter: 'popular',
        genre: '',
        sortBy: 'popularity.desc',
        year: '',
        query: '',
        page: 1,
      });
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'instant' });
    startTransition(() => {
      syncUrlParams({
        filter: currentFilter,
        genre: currentGenre,
        sortBy: currentSortBy,
        year: currentYear,
        query: debouncedQuery,
        page: newPage,
      });
    });
  };

  const hasActiveFilters =
    Boolean(currentGenre) ||
    Boolean(currentYear) ||
    currentSortBy !== 'popularity.desc' ||
    Boolean(searchQuery.trim()) ||
    currentFilter !== 'popular';

  const showSkeleton = isLoading || isFetching;

  // Active genre label
  const activeGenreName =
    genreList.find((g) => String(g.id) === currentGenre)?.name || '';

  // Active sort label
  const activeSortLabel =
    SORT_OPTIONS.find((s) => s.value === currentSortBy)?.label || '';

  // Active year label
  const activeYearLabel =
    YEAR_OPTIONS.find((y) => y.value === currentYear)?.label || '';

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8">
      {/* Top Banner & Search Console */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
            {title}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-cyan-400">
              {highlightWord}
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl">{subtitle}</p>
        </div>

        {/* Catalog Live Search Input */}
        <div className="relative w-full lg:w-80">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={`Filter ${type === 'movie' ? 'movies' : 'shows'} by title...`}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-zinc-950/70 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40 transition-all backdrop-blur-md"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-0.5 rounded cursor-pointer"
              title="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Luxury Filter & Sort Control Deck */}
      <div className="flex flex-col gap-4 p-4 rounded-2xl bg-zinc-950/50 border border-white/10 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Preset Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {filters.map((f) => {
              const active = currentFilter === f.value && !currentGenre && !currentYear && !searchQuery;
              return (
                <button
                  key={f.value}
                  onClick={() => handleFilterClick(f.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    active
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-zinc-950 font-bold border-cyan-400 shadow-lg shadow-cyan-500/20'
                      : 'bg-zinc-900/80 text-zinc-300 border-white/5 hover:bg-zinc-800 hover:text-white hover:border-white/15'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Granular Dropdown Selectors: Genre, Year, Sort */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Genre Select */}
            <div className="relative min-w-[130px]">
              <select
                value={currentGenre}
                onChange={(e) => handleGenreChange(e.target.value)}
                aria-label="Filter by genre"
                className={`w-full appearance-none pl-3 pr-8 py-2 rounded-xl text-xs font-medium cursor-pointer border focus:outline-none focus:border-cyan-400/60 transition-all ${
                  currentGenre
                    ? 'bg-amber-950/40 text-amber-300 border-amber-500/40'
                    : 'bg-zinc-900/90 text-zinc-300 border-white/10 hover:border-white/20'
                }`}
              >
                <option value="" className="bg-zinc-900 text-white">All Genres</option>
                {genreList.map((g) => (
                  <option key={g.id} value={String(g.id)} className="bg-zinc-900 text-white">
                    {g.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Year Select */}
            <div className="relative min-w-[110px]">
              <select
                value={currentYear}
                onChange={(e) => handleYearChange(e.target.value)}
                aria-label="Filter by release year"
                className={`w-full appearance-none pl-3 pr-8 py-2 rounded-xl text-xs font-medium cursor-pointer border focus:outline-none focus:border-cyan-400/60 transition-all ${
                  currentYear
                    ? 'bg-amber-950/40 text-amber-300 border-amber-500/40'
                    : 'bg-zinc-900/90 text-zinc-300 border-white/10 hover:border-white/20'
                }`}
              >
                {YEAR_OPTIONS.map((y) => (
                  <option key={y.value} value={y.value} className="bg-zinc-900 text-white">
                    {y.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Sort Select */}
            <div className="relative min-w-[140px]">
              <select
                value={currentSortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                aria-label="Sort catalog by"
                className={`w-full appearance-none pl-3 pr-8 py-2 rounded-xl text-xs font-medium cursor-pointer border focus:outline-none focus:border-cyan-400/60 transition-all ${
                  currentSortBy !== 'popularity.desc'
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
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Tags & Reset Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/5 text-xs">
            <span className="text-zinc-500 font-medium mr-1">Active Filters:</span>

            {activeGenreName && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Genre: {activeGenreName}
                <button
                  onClick={() => handleGenreChange('')}
                  className="hover:text-white cursor-pointer"
                  title="Remove genre filter"
                >
                  ✕
                </button>
              </span>
            )}

            {activeYearLabel && currentYear && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Year: {activeYearLabel}
                <button
                  onClick={() => handleYearChange('')}
                  className="hover:text-white cursor-pointer"
                  title="Remove year filter"
                >
                  ✕
                </button>
              </span>
            )}

            {currentSortBy !== 'popularity.desc' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Sorted: {activeSortLabel}
                <button
                  onClick={() => handleSortChange('popularity.desc')}
                  className="hover:text-white cursor-pointer"
                  title="Reset sorting"
                >
                  ✕
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-200 border border-white/10">
                Query: &quot;{searchQuery}&quot;
                <button
                  onClick={() => handleSearchChange('')}
                  className="hover:text-white cursor-pointer"
                  title="Clear search query"
                >
                  ✕
                </button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="ml-auto text-zinc-400 hover:text-white underline underline-offset-4 cursor-pointer font-medium transition-colors"
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* Immediate Loading Skeleton on Page Switch or Filter Switch: 1:1 Exact Dimensions */}
      {showSkeleton && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 justify-items-center">
          {[...Array(skeletonCount)].map((_, i) => (
            <div
              key={i}
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
      )}

      {/* Error state */}
      {isError && !showSkeleton && (
        <div className="text-center py-20 text-red-400 text-sm">
          Failed to load {type === 'movie' ? 'movies' : 'TV shows'}. Please try refreshing.
        </div>
      )}

      {/* Results Grid: Strictly symmetric rows with zero orphan cards */}
      {!showSkeleton && !isError && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 justify-items-center">
            {symmetricMovies.length > 0 ? (
              symmetricMovies.map((item) => (
                <MovieCard
                  key={`${item.movieType || type}-${item.id}`}
                  {...item}
                  movieType={type === 'tv' ? 'TV Show' : 'Movie'}
                  link={false}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-24">
                <p className="text-lg font-semibold text-zinc-300">
                  No {type === 'movie' ? 'movies' : 'TV shows'} matched your criteria.
                </p>
                <p className="text-sm text-zinc-500 mt-1">
                  Try broadening your genre, year, or search query filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {symmetricMovies.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isFetching={isFetching}
            />
          )}
        </>
      )}
    </div>
  );
}
