'use client';

import React from 'react';

interface RotatedPosterGridProps {
  posters?: string[];
  className?: string;
}

const DEFAULT_POSTERS = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=500&auto=format&fit=crop&q=80',
];

export const RotatedPosterGrid: React.FC<RotatedPosterGridProps> = ({
  posters = DEFAULT_POSTERS,
  className = '',
}) => {
  const displayPosters = posters.length > 0 ? posters : DEFAULT_POSTERS;
  // Repeat items to fill the rotated grid
  const repeated = Array.from({ length: 24 }).map(
    (_, i) => displayPosters[i % displayPosters.length]
  );

  return (
    <div
      data-testid="rotated-poster-grid"
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none flex items-center justify-center opacity-25 mix-blend-screen ${className}`}
    >
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 sm:gap-5 transform rotate-45 scale-125 sm:scale-150 origin-center transition-opacity duration-1000">
        {repeated.map((src, idx) => (
          <div
            key={idx}
            className="w-24 h-36 sm:w-32 sm:h-48 rounded-2xl overflow-hidden border border-amber-500/20 bg-dark-surface/60 shadow-lg relative group"
            style={{
              animation: `pulse ${(idx % 5) + 3}s ease-in-out infinite alternate`,
              animationDelay: `${(idx % 4) * 0.5}s`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover filter brightness-75 contrast-125 hover:brightness-100 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
          </div>
        ))}
      </div>
    </div>
  );
};
