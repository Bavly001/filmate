'use client';

import React, { useState } from 'react';
import { Film } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  fallbackTitle?: string;
  className?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackTitle,
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        data-testid="image-fallback"
        className={`w-full h-full min-h-[140px] bg-dark-surface/90 border border-gray-800/80 flex flex-col items-center justify-center p-4 text-center select-none ${className}`}
      >
        <div className="w-10 h-10 rounded-full bg-dark-bg border border-sunset/30 flex items-center justify-center text-sunset mb-2 shadow-sm">
          <Film className="w-5 h-5" />
        </div>
        <p className="text-xs font-bold text-gray-200 line-clamp-2 max-w-[90%]">
          {fallbackTitle || alt || 'Movie Poster'}
        </p>
        <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">
          Image Unavailable
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={className}
      {...props}
    />
  );
};
