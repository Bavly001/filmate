import React from 'react';
import PaginatedCatalog from '@/components/PaginatedCatalog';

interface MoviesPageProps {
  searchParams?: {
    filter?: string;
    page?: string;
    genre?: string;
    sort_by?: string;
    year?: string;
    query?: string;
  };
}

export default function MoviesPage({ searchParams }: MoviesPageProps) {
  const currentFilter = searchParams?.filter || 'popular';
  const currentPage = Math.max(1, parseInt(searchParams?.page || '1', 10));
  const currentGenre = searchParams?.genre;
  const currentSortBy = searchParams?.sort_by || 'popularity.desc';
  const currentYear = searchParams?.year;
  const currentQuery = searchParams?.query;

  const filters = [
    { label: 'Popular', value: 'popular' },
    { label: 'Trending', value: 'trending' },
    { label: 'Top Rated', value: 'top_rated' },
    { label: 'Now Playing', value: 'now_playing' },
    { label: 'Upcoming', value: 'upcoming' },
  ];

  return (
    <main className="w-full min-h-screen bg-zinc-900 text-white pt-24 px-4 sm:px-8 lg:px-14 pb-16">
      <PaginatedCatalog
        type="movie"
        initialFilter={currentFilter}
        initialGenre={currentGenre}
        initialSortBy={currentSortBy}
        initialYear={currentYear}
        initialQuery={currentQuery}
        filters={filters}
        initialPage={currentPage}
        title="Explore"
        highlightWord="Movies"
        subtitle="Browse the latest cinematic releases, trending hits, and timeless classics"
      />
    </main>
  );
}
