import React from 'react';
import PaginatedCatalog from '@/components/PaginatedCatalog';

interface TvShowsPageProps {
  searchParams?: {
    filter?: string;
    page?: string;
    genre?: string;
    sort_by?: string;
    year?: string;
    query?: string;
  };
}

export default function TvShowsPage({ searchParams }: TvShowsPageProps) {
  const currentFilter = searchParams?.filter || 'popular';
  const currentPage = Math.max(1, parseInt(searchParams?.page || '1', 10));
  const currentGenre = searchParams?.genre;
  const currentSortBy = searchParams?.sort_by || 'popularity.desc';
  const currentYear = searchParams?.year;
  const currentQuery = searchParams?.query;

  const filters = [
    { label: 'Popular', value: 'popular' },
    { label: 'Top Rated', value: 'top_rated' },
    { label: 'On The Air', value: 'on_the_air' },
    { label: 'Airing Today', value: 'airing_today' },
  ];

  return (
    <main className="w-full min-h-screen bg-zinc-900 text-white pt-24 px-4 sm:px-8 lg:px-14 pb-16">
      <PaginatedCatalog
        type="tv"
        initialFilter={currentFilter}
        initialGenre={currentGenre}
        initialSortBy={currentSortBy}
        initialYear={currentYear}
        initialQuery={currentQuery}
        filters={filters}
        initialPage={currentPage}
        title="Explore"
        highlightWord="TV Shows"
        subtitle="Binge-worthy series, critically acclaimed dramas, and trending television hits"
      />
    </main>
  );
}
