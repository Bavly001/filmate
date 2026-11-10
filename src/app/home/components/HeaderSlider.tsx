'use client';

import React from 'react';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ImageHeader from '@/components/ImageHeader';
import { MovieItem } from '@/types/tmdb';
import { useCategoryMedia } from '@/hooks/useCategoryMedia';

interface HeaderSliderProps {
  endpoint?: string;
  movies?: MovieItem[];
}

export default function HeaderSlider({
  endpoint,
  movies: propMovies,
}: HeaderSliderProps) {
  const { data: fetchedMovies, isLoading } = useCategoryMedia(endpoint);
  const movies = propMovies || fetchedMovies || [];

  if (isLoading && movies.length === 0) {
    return (
      <div className="h-[50vh] lg:h-[85vh] w-full bg-gradient-to-b from-zinc-800/40 via-zinc-900/60 to-zinc-950 animate-pulse relative flex items-end p-6 sm:p-10 lg:p-16">
        <div className="flex flex-col gap-4 max-w-xl">
          <div className="w-28 h-6 rounded-md bg-zinc-700/60" />
          <div className="w-72 sm:w-96 h-10 rounded-md bg-zinc-700/80" />
          <div className="w-full h-16 rounded-md bg-zinc-700/40 hidden sm:block" />
          <div className="w-36 h-11 rounded-xl bg-cyan-500/20 mt-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-[50vh] lg:h-[85vh] w-full">
      <Swiper
        loop
        navigation={{
          enabled: true,
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        autoplay={{ delay: 6000 }}
        modules={[Navigation, Autoplay]}
        className="h-full w-full relative"
      >
        {movies &&
          movies.slice(0, 6).map((movie) => (
            <SwiperSlide key={movie.id}>
              <ImageHeader
                watchNowBtn
                imgPriority={movies[0]?.backdrop_path === movie?.backdrop_path}
                {...movie}
              />
            </SwiperSlide>
          ))}

        <IoIosArrowForward className="swiper-button-next fill-none lg:fill-white cursor-pointer" />
        <IoIosArrowBack className="swiper-button-prev fill-none lg:fill-white cursor-pointer" />
      </Swiper>
    </div>
  );
}
