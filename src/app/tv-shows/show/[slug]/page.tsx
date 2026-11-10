'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ImageHeader from '@/components/ImageHeader';
import RatingStars from '@/components/RatingStars';
import MoviesCategory from '@/components/MoviesCategory';
import { useTvShowDetail } from '@/hooks/useMediaDetail';
import TvShowDetailLoading from './loading';

interface TvShowDetailPageProps {
  params?: {
    slug?: string;
  };
}

export default function TvShowDetailPage({
  params: propParams,
}: TvShowDetailPageProps) {
  const routeParams = useParams();
  const slug = (routeParams?.slug as string) || propParams?.slug || '';

  const { show, similarShows, isLoading, isError } = useTvShowDetail(slug);

  if (isLoading) {
    return <TvShowDetailLoading />;
  }

  if (isError || !show || (!show.title && !show.name) || show.title === 'TV Show Not Found') {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-3">
          TV Show Not Found
        </h1>
        <p className="text-zinc-400 text-sm max-w-md mb-6">
          Could not load the details for this show. It may be unavailable or the identifier is invalid.
        </p>
        <Link
          href="/tv-shows"
          className="px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-zinc-950 font-semibold text-sm transition-all shadow-lg shadow-purple-500/20"
        >
          Explore TV Shows
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="h-[50vh] lg:h-[85vh] w-full">
        <ImageHeader {...show} />
        <p className="text-sm md:text-base lg:hidden opacity-60 px-5 mt-4">
          {show.overview}
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
                  {show.vote_average ? show.vote_average.toFixed(1) : 'N/A'}
                </span>
                <RatingStars
                  count={show.vote_average ? show.vote_average / 2 : 0}
                  filledStarsClassName="text-amber-400"
                />
              </div>
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider text-zinc-400">
                Original Language
              </span>
              <p className="text-lg font-semibold text-white mt-1">
                {show.original_language || 'English'}
              </p>
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider text-zinc-400">
                Genres
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {show.genres?.map((g) => (
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

          {similarShows && similarShows.length > 0 && (
            <div className="-mx-5 lg:-mx-20">
              <MoviesCategory title="Similar TV Shows" movies={similarShows} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
