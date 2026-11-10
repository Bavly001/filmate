import React from 'react';

interface LogoProps {
  title?: boolean;
  text?: boolean;
  col?: boolean;
  height?: string;
  textSize?: string;
}

export default function Logo({
  title = false,
  text = false,
  col = false,
  height = 'h-full',
  textSize = 'text-base',
}: LogoProps) {
  return (
    <div
      className={`flex gap-x-2.5 justify-center items-center text-white w-fit ${
        col ? 'flex-col' : ''
      } ${height} ${textSize}`}
    >
      <div className="rounded-full aspect-square h-[55%] min-h-[32px] bg-gradient-to-br from-cyan-300 via-cyan-400 to-cyan-600 p-1.5 flex justify-center items-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
        <svg
          viewBox="0 0 64 64"
          className="w-[80%] h-[80%]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 14H44V22H28V29H40V36H28V50H20V14Z"
            fill="#090A0F"
          />
          <polygon
            points="36,36 46,48 38,48 30,38"
            fill="#090A0F"
          />
          <circle cx="43" cy="22" r="2.5" fill="#090A0F" />
        </svg>
      </div>

      <div
        className={`flex flex-col justify-center items-start text-start ${height}`}
      >
        <h1
          className={`justify-center items-center font-bold text-transparent bg-gradient-to-b from-cyan-400 to-cyan-600 bg-clip-text tracking-wide ${
            title ? 'flex' : 'hidden lg:flex'
          } ${text ? 'text-[2em]' : 'text-[2em] h-full'}`}
        >
          Filmate
        </h1>
        {title && text && (
          <p className="font-light tracking-[0.2em] text-[0.85em] text-cyan-200/80 uppercase">
            Movies
          </p>
        )}
      </div>
    </div>
  );
}
