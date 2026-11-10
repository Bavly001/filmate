'use client';

import React, { useEffect, useRef, useState } from 'react';
import AnimatedCard from './AnimatedCard';
import ImageComp from '../ImageComp';
import Link from 'next/link';

interface MovieCardProps {
  id: number;
  name?: string;
  title?: string;
  overview?: string;
  movieType?: 'Movie' | 'TV Show';
  popularity?: number;
  poster_path?: string | null;
  link?: boolean;
  vote_average?: number;
  backdrop_path?: string | null;
  original_language?: string;
}

export default function MovieCard({
  id,
  name,
  title,
  overview,
  movieType = 'Movie',
  popularity,
  poster_path,
  link = false,
  vote_average = 0,
  backdrop_path,
  original_language,
}: MovieCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const routePrefix =
    movieType === 'Movie' ? '/movies/movie/' : '/tv-shows/show/';
  const fullHref = `${routePrefix}${id}`;

  const [windowSize, setWindowSize] = useState<{ w: number; h: number }>({
    w: typeof window !== 'undefined' ? window.innerWidth : 1200,
    h: typeof window !== 'undefined' ? window.innerHeight : 800,
  });
  const [isHovered, setIsHovered] = useState(false);
  const [justify, setJustify] = useState('justify-center');
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleWindowSize() {
      setWindowSize({
        h: window.innerHeight,
        w: window.innerWidth,
      });
      setJustify('justify-center');
    }
    handleWindowSize();
    window.addEventListener('resize', handleWindowSize);
    return () => {
      window.removeEventListener('resize', handleWindowSize);
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (link) return;
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);

    hoverTimerRef.current = setTimeout(() => {
      setIsHovered(true);

      if (windowSize.w >= 1024 && cardRef.current) {
        const cardDetails = cardRef.current.getBoundingClientRect();
        const checkWidth = () => {
          if (cardDetails.width + cardDetails.x > windowSize.w) {
            return 'justify-end';
          }
          if (cardDetails.x <= 0) {
            return 'justify-start';
          }
          return 'justify-center';
        };

        if (justify === 'justify-center') {
          setJustify(checkWidth());
        }
      }
    }, 400);
  };

  const handleMouseLeave = () => {
    if (link) return;
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setIsHovered(false);
    setJustify('justify-center');
  };

  const displayTitle = title ?? name ?? 'Movie';

  if (link) {
    return (
      <Link
        href={fullHref}
        className={`text-start w-[160px] lg:w-[200px] flex-shrink-0 h-56 lg:h-72 relative shadow-lg group flex duration-150 my-2 items-center rounded-xl overflow-hidden ${justify}`}
      >
        <ImageComp
          img={poster_path}
          imgAlt={`${displayTitle} poster`}
          imgQuality="low"
          rounded
        />
      </Link>
    );
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`text-start w-[160px] lg:w-[200px] flex-shrink-0 h-56 lg:h-72 relative shadow-lg group flex duration-150 my-2 items-center rounded-xl group-hover:z-50 ${justify}`}
    >
      <Link
        href={fullHref}
        prefetch={true}
        className="w-full h-full block cursor-pointer rounded-xl overflow-hidden"
        aria-label={`View ${displayTitle}`}
      >
        <ImageComp
          img={poster_path}
          imgAlt={`${displayTitle} poster`}
          imgQuality="low"
          rounded
        />
      </Link>

      <AnimatedCard
        id={id}
        isHovered={isHovered}
        cardRef={cardRef}
        title={displayTitle}
        href={fullHref}
        overview={overview}
        popularity={popularity}
        vote_average={vote_average}
        backdrop_path={backdrop_path}
        original_language={original_language}
      />
    </div>
  );
}
