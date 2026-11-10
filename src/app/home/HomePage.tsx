'use client';

import React from 'react';
import MoviesCategory from '@/components/MoviesCategory';
import HeaderSlider from './components/HeaderSlider';

export default function HomePage() {
  return (
    <main className="w-full min-h-screen bg-zinc-900 text-white">
      <HeaderSlider endpoint="trending/movie/day" />
      <div className="overflow-hidden">
        <MoviesCategory
          title="Now Playing Movies"
          endpoint="movie/now_playing"
        />
        <MoviesCategory
          title="Upcoming Movies"
          endpoint="movie/upcoming"
        />
        <MoviesCategory
          title="Top Rated Movies"
          endpoint="movie/top_rated"
        />
        <MoviesCategory
          title="Trending Movies"
          endpoint="trending/movie/day"
        />
        <MoviesCategory
          title="Popular Movies"
          endpoint="movie/popular"
        />
        <MoviesCategory
          title="Now Playing TV Series"
          endpoint="tv/on_the_air"
        />
        <MoviesCategory
          title="Airing Today TV Series"
          endpoint="tv/airing_today"
        />
        <MoviesCategory
          title="Popular TV Series"
          endpoint="tv/popular"
        />
        <MoviesCategory
          title="Top Rated TV Series"
          endpoint="tv/top_rated"
          className="mb-2 lg:mb-12"
        />
      </div>
    </main>
  );
}
