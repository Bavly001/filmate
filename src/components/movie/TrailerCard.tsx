'use client';

import React from 'react';
import { Play, Eye } from 'lucide-react';
import { TrailerItem } from '@/types/movie';

interface TrailerCardProps {
  trailer: TrailerItem;
  onPlayTrailer?: (key: string) => void;
}

export const TrailerCard: React.FC<TrailerCardProps> = ({ trailer, onPlayTrailer }) => {
  return (
    <div
      onClick={() => onPlayTrailer?.(trailer.youtubeVideoId)}
      className="group relative rounded-2xl overflow-hidden glass-card cursor-pointer border border-white/5 hover:border-sunset/50 transition-all duration-300 flex flex-col justify-between"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-dark-surface">
        <img
          src={trailer.thumbnailUrl}
          alt={trailer.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Center Play Button Overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-sunset to-cyber text-white flex items-center justify-center shadow-neon-sunset group-hover:scale-115 active:scale-90 transition-transform duration-300">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* View Count Badge */}
        {trailer.views && (
          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-dark-bg/80 backdrop-blur-md border border-white/10 text-gray-300 text-[10px] font-semibold flex items-center gap-1">
            <Eye className="w-3 h-3 text-sunset" />
            <span>{(trailer.views / 1000).toFixed(0)}k views</span>
          </div>
        )}
      </div>

      <div className="p-3.5 bg-dark-surface/80">
        <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-sunset transition-colors">
          {trailer.title}
        </h4>
        <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
          {trailer.genres.join(' • ')}
        </p>
      </div>
    </div>
  );
};
