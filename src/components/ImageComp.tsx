'use client';

import React, { useState } from 'react';
import Skeleton from './Skeleton';
import Image from 'next/image';
import { lowImageURL, mediumImageURL, ImageURL } from '@/lib/actions';

interface ImageCompProps {
  img?: string | null;
  imgAlt?: string;
  rounded?: boolean;
  noSkeleton?: boolean;
  imgQuality?: 'full' | 'med' | 'low';
  imgOpacity?: string;
  priority?: boolean;
}

export default function ImageComp({
  img,
  imgAlt = '',
  rounded = false,
  noSkeleton = false,
  imgQuality = 'full',
  imgOpacity = 'opacity-100',
  priority = false,
}: ImageCompProps) {
  const [imgIsLoading, setImgIsLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  const imgQ =
    imgQuality === 'full'
      ? ImageURL
      : imgQuality === 'med'
      ? mediumImageURL
      : lowImageURL;

  if (!img || img === '') {
    return <Skeleton noImg noLoader rounded={rounded} />;
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {!noSkeleton && (imgIsLoading || imgError) && (
        <Skeleton imgError={imgError} rounded={rounded} />
      )}
      {imgQuality === 'full' && noSkeleton && imgIsLoading && (
        <Image
          src={lowImageURL + img}
          alt={imgAlt}
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'top',
          }}
          className={`absolute w-full h-full blur ${
            rounded ? 'rounded-lg' : ''
          }`}
          onError={() => setImgError(true)}
          unoptimized
        />
      )}
      <Image
        src={imgQ + img}
        alt={imgAlt}
        fill
        priority={priority}
        style={{
          objectFit: 'cover',
          objectPosition: 'top',
        }}
        className={`absolute w-full h-full ${
          imgIsLoading && !noSkeleton ? 'opacity-0' : imgOpacity
        } ${rounded ? 'rounded-lg' : ''}`}
        onLoad={() => {
          setImgIsLoading(false);
        }}
        onError={() => setImgError(true)}
        unoptimized
      />
    </div>
  );
}
