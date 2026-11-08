'use client';

import React from 'react';
import { Check, X, RotateCcw, Play, Star, Sparkles, HeartHandshake } from 'lucide-react';
import { useMateStore } from '@/store/useMateStore';
import { useMovieStore } from '@/store/useMovieStore';

export const MateResultCard: React.FC = () => {
  const {
    currentRecommendation,
    rationale,
    isAccepted,
    acceptRecommendation,
    rejectRecommendation,
    resetQuiz,
    step,
  } = useMateStore();

  const openTrailerModal = useMovieStore((s) => s.openTrailerModal);

  if (step === 'exhausted' || !currentRecommendation) {
    return (
      <div className="py-8 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-sunset/15 border border-sunset/40 text-sunset flex items-center justify-center mx-auto mb-4">
          <RotateCcw className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          Sorry mate, all matches are out!
        </h3>
        <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
          We relaxed our search through all your chosen categories, but couldn&apos;t find more unseen titles. Want to reset and try different feelings?
        </p>
        <button
          onClick={resetQuiz}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-sunset to-cyber text-white font-bold text-sm shadow-neon-sunset hover:scale-105 active:scale-95 transition-all"
        >
          Start Fresh Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bot Chat Header */}
      <div className="p-4 rounded-2xl bg-dark-surface/90 border border-sunset/20 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-sunset/20 text-sunset flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-bold text-sunset uppercase tracking-wider block">
            Mate Recommendation
          </span>
          <p className="text-sm text-gray-200 mt-1">{rationale}</p>
        </div>
      </div>

      {/* Recommended Movie Poster & Details Card */}
      <div className="rounded-2xl overflow-hidden glass-panel border border-sunset/40 shadow-xl shadow-sunset/10">
        <div className="relative aspect-video w-full overflow-hidden bg-dark-surface">
          <img
            src={currentRecommendation.posterUrl}
            alt={currentRecommendation.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-90" />

          {currentRecommendation.youtubeTrailerKey && (
            <button
              onClick={() =>
                openTrailerModal(currentRecommendation.youtubeTrailerKey, currentRecommendation)
              }
              className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sunset to-cyber text-white text-xs font-bold flex items-center gap-1.5 shadow-neon-sunset hover:scale-105 transition-transform"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Watch Trailer</span>
            </button>
          )}

          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <div className="px-2 py-0.5 rounded-md bg-dark-bg/90 border border-gold/40 text-gold text-xs font-black flex items-center gap-1">
              <Star className="w-3 h-3 fill-gold text-gold" />
              <span>{currentRecommendation.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-gray-300 font-bold">
              {currentRecommendation.year}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h4 className="text-xl font-extrabold text-white mb-1.5">
            {currentRecommendation.title}
          </h4>
          <p className="text-xs text-gray-400 mb-3">
            {currentRecommendation.genres.join(' • ')}
          </p>
          <p className="text-sm text-gray-300 leading-relaxed mb-4 line-clamp-3">
            {currentRecommendation.synopsis}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {currentRecommendation.platforms.map((p, idx) => (
              <span
                key={`${p}-${idx}`}
                className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sunset/15 border border-sunset/30 text-sunset"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Do you like this movie? */}
      {isAccepted ? (
        <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center animate-in zoom-in-95 duration-200">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-extrabold text-emerald-300 mb-1">
            Happy I could assist you, mate! 🍿
          </h4>
          <p className="text-xs text-gray-300 mb-4">
            Enjoy your movie tonight! If you ever need another pick, I&apos;m right here.
          </p>
          <button
            onClick={resetQuiz}
            className="text-xs text-gray-400 hover:text-white underline font-semibold"
          >
            Start Another Search
          </button>
        </div>
      ) : (
        <div className="space-y-3 pt-2">
          <p className="text-sm font-bold text-center text-gray-200">
            Do you like this movie?
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={acceptRecommendation}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 active:scale-95 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Yes, perfect!</span>
            </button>

            <button
              onClick={rejectRecommendation}
              className="py-3 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>No, give another</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
