'use client';

import React, { useEffect } from 'react';
import { X, Star, Calendar, Clock } from 'lucide-react';
import { useMovieStore } from '@/store/useMovieStore';

export const TrailerModal: React.FC = () => {
  const { activeTrailerKey, selectedMovieForModal, closeTrailerModal } = useMovieStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeTrailerModal();
      }
    };
    if (activeTrailerKey) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTrailerKey, closeTrailerModal]);

  if (!activeTrailerKey) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={closeTrailerModal}
    >
      <div
        className="relative w-full max-w-4xl bg-dark-surface border border-sunset/30 rounded-3xl overflow-hidden shadow-2xl shadow-sunset/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeTrailerModal}
          title="Close Trailer"
          className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-dark-bg/80 border border-white/10 hover:border-sunset text-gray-300 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Embed Frame */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${activeTrailerKey}?autoplay=1&rel=0`}
            title="Movie Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Details Footer if movie passed */}
        {selectedMovieForModal && (
          <div className="p-6 bg-dark-card/90 border-t border-white/5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <h3 className="text-xl font-extrabold text-white">
                {selectedMovieForModal.title}
              </h3>

              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1 rounded-lg bg-dark-bg/90 border border-gold/40 text-gold text-xs font-black flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                  <span>{selectedMovieForModal.rating.toFixed(1)}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedMovieForModal.year}</span>
                </div>

                {selectedMovieForModal.duration && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{selectedMovieForModal.duration}</span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              {selectedMovieForModal.synopsis}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {selectedMovieForModal.platforms.map((p) => (
                <span
                  key={p}
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sunset/15 border border-sunset/30 text-sunset"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
