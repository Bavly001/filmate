import React from 'react';
import Link from 'next/link';
import { FaPlay } from 'react-icons/fa';
import ImageComp from './ImageComp';

interface ImageHeaderProps {
  id?: number;
  watchNowBtn?: boolean;
  imgPriority?: boolean;
  backdrop_path?: string | null;
  title?: string;
  name?: string;
  main_genre?: string;
  release_date?: string;
  first_air_date?: string;
  overview?: string;
}

export default function ImageHeader({
  id,
  watchNowBtn = false,
  imgPriority = true,
  backdrop_path,
  title,
  name,
  main_genre = 'Movie',
  release_date,
  first_air_date,
  overview,
}: ImageHeaderProps) {
  const displayTitle = title || name || 'Featured';
  const displayDate = release_date || first_air_date;
  const year = displayDate ? new Date(displayDate).getFullYear() : new Date().getFullYear();

  return (
    <div className="relative w-full h-full">
      <div className="hidden lg:block w-full h-full bg-gradient-to-tr from-zinc-900 via-zinc-950/20 absolute top-0 left-0 z-10" />
      <div className="w-full h-[30vh] lg:h-[50vh] bg-gradient-to-t from-zinc-900 absolute bottom-0 left-0 z-10" />
      <ImageComp
        img={backdrop_path}
        imgAlt={`${displayTitle} backdrop`}
        priority={imgPriority}
        noSkeleton
      />
      <div className="absolute z-40 bottom-0 lg:bottom-3 left-0 lg:left-20 w-full p-5 lg:w-1/2 flex flex-col gap-y-3 text-white">
        <div className="flex flex-col gap-y-1 md:gap-y-2">
          <h1 className="text-xl md:text-3xl lg:text-5xl font-extrabold font-sans">
            {displayTitle}
          </h1>
          <div className="flex gap-x-2 text-xs lg:text-sm">
            <p className="font-bold py-1 px-2 bg-white/10 h-fit w-fit rounded-md">
              {main_genre}
            </p>
            <p className="font-bold py-1 px-2 border border-cyan-500 h-fit w-fit rounded-md text-cyan-400 box-border">
              {isNaN(year) ? 'Latest' : year}
            </p>
          </div>
        </div>
        <p className="hidden lg:block opacity-60 line-clamp-3">{overview}</p>
        {watchNowBtn && (
          <Link
            href={id ? `/movies/movie/${id}` : '/movies'}
            className="flex justify-center items-center gap-x-1 lg:gap-x-2 text-white w-full sm:w-fit text-center p-2 lg:p-4 rounded-lg bg-white/20 hover:bg-white/40 transition-all backdrop-blur-lg font-bold text-sm lg:text-base cursor-pointer"
          >
            <FaPlay size="1em" />
            <span>Watch Now</span>
          </Link>
        )}
      </div>
    </div>
  );
}
