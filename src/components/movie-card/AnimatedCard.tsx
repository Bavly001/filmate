import React from 'react';
import RatingStars from '../RatingStars';
import ImageComp from '../ImageComp';
import Link from 'next/link';

interface AnimatedCardProps {
  id: number;
  href: string;
  title: string;
  isHovered?: boolean;
  cardRef: React.RefObject<HTMLDivElement>;
  overview?: string;
  popularity?: number;
  vote_average?: number;
  backdrop_path?: string | null;
  original_language?: string;
}

export default function AnimatedCard({
  href,
  title,
  isHovered = false,
  cardRef,
  overview,
  popularity,
  vote_average = 0,
  backdrop_path,
  original_language,
}: AnimatedCardProps) {
  return (
    <div
      ref={cardRef}
      className={`absolute w-[24rem] bg-zinc-800 transition-all duration-300 ease-out hidden lg:flex flex-col gap-y-1 text-white shadow-2xl overflow-hidden rounded-lg z-40 ${
        isHovered
          ? 'opacity-100 min-h-[19rem] pointer-events-auto'
          : 'opacity-0 h-0 pointer-events-none -z-10'
      }`}
    >
      <Link href={href}>
        <div className="relative top-0 w-full h-40">
          <ImageComp
            img={backdrop_path}
            imgAlt={`${title} poster`}
            imgOpacity="opacity-60"
            imgQuality="med"
          />
          <div className="absolute w-full h-32 bg-gradient-to-t from-zinc-800 to-zinc-800/0 bottom-0 left-0" />
        </div>
        <div className="px-4 pb-4">
          <h1 className="text-xl font-extrabold">{title}</h1>
          <div className="opacity-60 text-sm">
            {!overview || overview === '' ? (
              <span className="flex flex-col gap-y-1 pt-2">
                <span>
                  Original Language:{' '}
                  <span className="first-letter:uppercase">
                    {original_language ?? 'en'}
                  </span>
                </span>
                <span>
                  Popularity: {popularity ? popularity.toFixed(0) : 'N/A'}
                </span>
                <span className="flex items-center gap-x-1">
                  <span>Vote:</span>
                  <RatingStars
                    count={vote_average / 2}
                    containerClassName="w-fit text-white"
                    emptyStarsClassName="opacity-50 text-current"
                  />
                </span>
              </span>
            ) : (
              <p className="line-clamp-3">{overview}</p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
