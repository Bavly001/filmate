'use client';

import React, { useEffect, useRef, useState } from 'react';
import MovieCard from './movie-card/MovieCard';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { MovieItem } from '@/types/tmdb';
import { useCategoryMedia } from '@/hooks/useCategoryMedia';

const arrowBtnClasses =
  'sticky bg-zinc-700 border border-zinc-500 flex justify-center items-center shadow text-white w-9 aspect-square rounded-full z-30 cursor-pointer hover:bg-zinc-600 transition-colors';

interface MoviesCategoryProps {
  title: string;
  endpoint?: string;
  movies?: MovieItem[];
  className?: string;
}

export default function MoviesCategory({
  title,
  endpoint,
  movies: propMovies,
  className = '',
}: MoviesCategoryProps) {
  const categoryRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  // TanStack Query client hook for fetching directly from base API
  const { data: fetchedMovies, isLoading } = useCategoryMedia(endpoint);

  const movies = propMovies || fetchedMovies || [];

  useEffect(() => {
    if (categoryRef.current) {
      setScroll(categoryRef.current.scrollLeft);
      setMaxScroll(
        categoryRef.current.scrollWidth -
          categoryRef.current.clientWidth -
          0.5
      );
    }
  }, [movies]);

  const scrollHandler = (scrollDir = 1) => {
    if (categoryRef.current) {
      categoryRef.current.scrollLeft +=
        categoryRef.current.clientWidth * 0.8 * scrollDir;
    }
  };

  const renderSkeletons = () =>
    [...Array(8)].map((_, i) => (
      <div
        key={i}
        className="w-[160px] lg:w-[200px] h-56 lg:h-72 my-2 rounded-xl bg-gradient-to-br from-zinc-800/80 via-zinc-800/40 to-zinc-900/90 animate-pulse border border-white/5 flex-shrink-0 flex flex-col justify-between p-3.5 shadow-lg"
      >
        <div className="w-12 h-5 rounded-md bg-zinc-700/60" />
        <div className="flex flex-col gap-2">
          <div className="w-3/4 h-4 rounded-md bg-zinc-700/60" />
          <div className="w-1/2 h-3.5 rounded-md bg-zinc-700/40" />
        </div>
      </div>
    ));

  return (
    <div
      className={`w-full text-white h-fit py-3 lg:py-0 lg:h-96 relative ${className}`}
    >
      <h2 className="text-2xl lg:text-3xl font-bold lg:absolute top-7 ps-4 lg:ps-10">
        {title}
      </h2>
      <div
        ref={categoryRef}
        onScroll={() => {
          if (categoryRef.current) {
            setScroll(categoryRef.current.scrollLeft);
          }
        }}
        className="w-full h-[30rem] absolute hidden lg:flex items-center overflow-x-scroll scroll-smooth no-scroll-bar pb-10"
      >
        <div className="flex flex-nowrap h-96 items-center gap-x-3 px-10">
          {isLoading && movies.length === 0 ? (
            renderSkeletons()
          ) : (
            movies.map((movie) => <MovieCard key={movie.id} {...movie} />)
          )}
        </div>
        {scroll > 0.4 && (
          <button
            type="button"
            aria-label="Scroll left"
            className={`${arrowBtnClasses} left-[4%]`}
            onClick={() => scrollHandler(-1)}
          >
            <FaArrowLeft />
          </button>
        )}
        {scroll <= maxScroll && (
          <button
            type="button"
            aria-label="Scroll right"
            className={`${arrowBtnClasses} left-[96%]`}
            onClick={() => scrollHandler(1)}
          >
            <FaArrowRight />
          </button>
        )}
      </div>
      <div className="w-full flex lg:hidden flex-nowrap overflow-x-scroll snap-x no-scroll-bar">
        <div className="h-full ps-4" />
        <div className="flex items-center gap-x-3 overflow-x-visible scroll-smooth w-full h-fit">
          {isLoading && movies.length === 0 ? (
            renderSkeletons()
          ) : (
            movies.map((movie) => (
              <MovieCard key={movie.id} {...movie} link />
            ))
          )}
        </div>
        <div className="h-full pe-4" />
      </div>
    </div>
  );
}
