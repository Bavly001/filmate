import React from 'react';
import { MdImageNotSupported, MdLocalMovies } from 'react-icons/md';
import { BsFillImageFill } from 'react-icons/bs';

interface SkeletonProps {
  imgError?: boolean;
  noImg?: boolean;
  noLoader?: boolean;
  rounded?: boolean;
}

export default function Skeleton({
  imgError = false,
  noImg = false,
  noLoader = false,
  rounded = false,
}: SkeletonProps) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center w-full h-full z-10 text-2xl lg:text-3xl ${
        imgError || noImg ? '' : 'animate-pulse'
      } ${
        noImg
          ? 'bg-gradient-to-t from-zinc-700 to-zinc-500 text-white'
          : 'bg-zinc-700 text-zinc-600'
      } ${rounded ? 'rounded-lg' : ''}`}
    >
      {noImg ? (
        <>
          <MdLocalMovies size="1.5em" />
          <h3 className="text-[0.7em] font-bold flex flex-col text-center">
            <span className="-mb-3">No Image</span>
            <span>Available</span>
          </h3>
        </>
      ) : (
        <>
          {imgError ? (
            <>
              <MdImageNotSupported size="1.5em" />
              <h3 className="text-[0.7em] font-bold">Image Error</h3>
            </>
          ) : (
            !noLoader && <BsFillImageFill size="1.5em" />
          )}
        </>
      )}
    </div>
  );
}
