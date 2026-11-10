'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ImageHeader from '@/components/ImageHeader';
import RatingStars from '@/components/RatingStars';
import MoviesCategory from '@/components/MoviesCategory';
import { useMovieDetail } from '@/hooks/useMediaDetail';
import MovieDetailLoading from './loading';

interface MovieDetailPageProps {
  params?: {
    slug?: string;
  };
}

export default function MovieDetailPage({ params: propParams }: MovieDetailPageProps) {
  const routeParams = useParams();
  const slug = (routeParams?.slug as string) || propParams?.slug || '';

  const { movie, similarMovies, isLoading, isError } = useMovieDetail(slug);

  if (isLoading) {
    return <MovieDetailLoading />;
  }

  if (isError || !movie || !movie.title || movie.title === 'Movie Not Found') {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-3">
          Movie Not Found
        </h1>
        <p className="text-zinc-400 text-sm max-w-md mb-6">
          Could not load the details for this title. It may be unavailable or the identifier is invalid.
        </p>
        <Link
          href="/movies"
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold text-sm transition-all shadow-lg shadow-cyan-500/20"
        >
          Explore Movies
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="h-[50vh] lg:h-[85vh] w-full">
        <ImageHeader {...movie} />
        <p className="text-sm md:text-base lg:hidden opacity-60 px-5 mt-4">
          {movie.overview}
        </p>
      </div>

      <div className="w-full px-5 lg:px-20 py-8">
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-800/40 p-6 rounded-2xl border border-zinc-700/50">
            <div>
              <span className="text-xs uppercase tracking-wider text-zinc-400">
                Rating
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold text-amber-400">
                  {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </span>
                <RatingStars
                  count={movie.vote_average ? movie.vote_average / 2 : 0}
                  filledStarsClassName="text-amber-400"
                />
              </div>
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider text-zinc-400">
                Original Language
              </span>
              <p className="text-lg font-semibold text-white mt-1">
                {movie.original_language || 'English'}
              </p>
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider text-zinc-400">
                Genres
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {movie.genres?.map((g) => (
                  <span
                    key={g.id}
                    className="text-xs px-2.5 py-1 rounded bg-zinc-700 text-zinc-200"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {similarMovies && similarMovies.length > 0 && (
            <div className="-mx-5 lg:-mx-20">
              <MoviesCategory title="Similar Movies" movies={similarMovies} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
