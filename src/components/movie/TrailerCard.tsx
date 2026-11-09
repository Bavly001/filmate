'use client';

import React from 'react';
import { Play, Eye } from 'lucide-react';
import { TrailerItem } from '@/types/movie';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';

interface TrailerCardProps {
  trailer: TrailerItem;
  onPlayTrailer?: (key: string) => void;
}

export const TrailerCard: React.FC<TrailerCardProps> = ({ trailer, onPlayTrailer }) => {
  return (
    <div
      onClick={() => onPlayTrailer?.(trailer.youtubeVideoId)}
      className="group relative rounded-2xl overflow-hidden bg-[#10121B] border border-amber-500/15 hover:border-amber-400/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-[#07080B]">
        <ImageWithFallback
          src={trailer.thumbnailUrl}
          alt={trailer.title}
          fallbackTitle={trailer.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Center Play Button Overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.6)] group-hover:scale-115 active:scale-90 transition-transform duration-300">
            <Play className="w-5 h-5 fill-black ml-0.5" />
          </div>
        </div>

        {/* View Count Badge */}
        {trailer.views && (
          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#07080B]/85 backdrop-blur-md border border-amber-500/20 text-amber-200 text-[10px] font-semibold flex items-center gap-1 shadow-sm">
            <Eye className="w-3 h-3 text-amber-400" />
            <span>{(trailer.views / 1000).toFixed(0)}k views</span>
          </div>
        )}
      </div>

      <div className="p-3.5 bg-[#10121B]">
        <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
          {trailer.title}
        </h4>
        <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
          {trailer.genres.join(' • ')}
        </p>
      </div>
    </div>
  );
};
