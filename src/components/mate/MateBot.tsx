'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  X,
  RotateCcw,
  Star,
  ExternalLink,
  Heart,
  ThumbsDown,
  Compass,
  Check,
  Loader2,
  Calendar,
  Clock,
} from 'lucide-react';
import {
  useMateStore,
  FEELING_OPTIONS,
  LANGUAGE_OPTIONS,
  FeelingOption,
  BotOption,
} from '@/store/useMateStore';

export default function MateBot() {
  const {
    isOpen,
    toggleBot,
    closeBot,
    resetBot,
    step,
    isAnalyzing,
    analysisMessage,
    selectedFeelings,
    toggleFeeling,
    confirmFeelings,
    selectCompany,
    selectAge,
    selectEra,
    selectRuntime,
    selectRating,
    selectedLanguages,
    toggleLanguage,
    confirmLanguages,
    handleUserLove,
    handleUserNotForMe,
    currentMovie,
    messages,
  } = useMateStore();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAnalyzing, step, isOpen]);

  return (
    <>
      {/* Floating launcher button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 group">
          <button
            type="button"
            onClick={toggleBot}
            aria-label="Open Filmate Movie Finder"
            className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-400 via-cyan-500 to-teal-400 text-black flex items-center justify-center shadow-[0_4px_25px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <Sparkles className="w-6 h-6 fill-black" />
            <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-zinc-900" />
          </button>
          <div className="absolute right-16 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap px-3 py-1.5 rounded-lg bg-zinc-900 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-xl">
            Find My Movie with Mate
          </div>
        </div>
      )}

      {/* Choice-based Scripted Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[600px] max-h-[85vh] bg-zinc-900/95 border border-cyan-500/30 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-zinc-800 bg-zinc-950/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-teal-400 flex items-center justify-center text-black shadow-sm">
                <Sparkles className="w-4 h-4 fill-black" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Filmate <span className="text-cyan-400">Mate</span>
                  </h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                    Smart Assistant
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400">
                  Select your choices to discover the perfect film
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetBot}
                title="Restart questionnaire"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={closeBot}
                title="Close"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conversation stream */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 no-scroll-bar bg-zinc-900/40"
          >
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isUser ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-semibold rounded-2xl rounded-tr-xs shadow-md'
                        : 'bg-zinc-800/90 border border-zinc-700/80 text-zinc-100 rounded-2xl rounded-tl-xs shadow-md'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>

                  {/* Single Recommended Movie Card */}
                  {msg.movie && (
                    <div className="mt-3 w-full rounded-2xl bg-zinc-950/80 border border-cyan-500/40 p-3.5 shadow-xl space-y-3">
                      {msg.metaBadge && (
                        <div className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {msg.metaBadge}
                        </div>
                      )}
                      <div className="flex gap-3">
                        <div className="relative w-20 h-28 rounded-lg overflow-hidden bg-black shrink-0 border border-zinc-700 shadow-md">
                          <Image
                            src={
                              msg.movie.poster_path
                                ? `https://image.tmdb.org/t/p/w300${msg.movie.poster_path}`
                                : 'https://placehold.co/300x450/111827/06b6d4?text=Filmate'
                            }
                            alt={msg.movie.title || 'Movie Poster'}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="font-bold text-sm text-white line-clamp-1">
                                {msg.movie.title}
                              </h4>
                              <span className="flex items-center gap-0.5 text-xs font-bold text-amber-400 shrink-0">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                {msg.movie.vote_average?.toFixed(1) || 'N/A'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {msg.movie.release_date
                                  ? msg.movie.release_date.slice(0, 4)
                                  : 'N/A'}
                              </span>
                              {msg.movie.vote_count ? (
                                <span>• {msg.movie.vote_count.toLocaleString()} votes</span>
                              ) : null}
                            </div>
                            <p className="text-[11px] text-zinc-300 line-clamp-3 mt-1.5 leading-relaxed">
                              {msg.movie.overview}
                            </p>
                          </div>
                          <Link
                            href={`/movies/movie/${msg.movie.id}`}
                            onClick={closeBot}
                            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-black text-xs font-bold transition-all shadow-md w-fit cursor-pointer"
                          >
                            <span>View Movie Details</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>

                      {/* Feedback buttons */}
                      <div className="pt-2 border-t border-zinc-800 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleUserLove}
                          className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                        >
                          <Heart className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                          <span>I love it!</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUserNotForMe(true)}
                          className="flex-1 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-zinc-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                        >
                          <ThumbsDown className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Not for me</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Inline Options for standard steps */}
                  {msg.options && msg.options.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 w-full">
                      {msg.options.map((opt) => {
                        const isAction =
                          opt.value === 'restart' || opt.value === 'identify';
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              if (opt.value === 'restart') resetBot();
                              else if (step === 'company')
                                selectCompany(opt.value, opt.label);
                              else if (step === 'age') selectAge(opt.value, opt.label);
                              else if (step === 'era') selectEra(opt.value, opt.label);
                              else if (step === 'runtime')
                                selectRuntime(opt.value, opt.label);
                              else if (step === 'rating')
                                selectRating(opt.value, opt.label);
                            }}
                            className={`text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer shadow-sm active:scale-95 ${
                              isAction
                                ? 'bg-cyan-500/20 hover:bg-cyan-500 hover:text-black border border-cyan-500/40 text-cyan-300 font-bold'
                                : 'bg-zinc-800 hover:bg-cyan-500 hover:text-black border border-zinc-700 hover:border-cyan-400 text-zinc-200'
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Dynamic Interactive Input Section based on current step */}

            {/* STEP 1: Feelings Selection Stack */}
            {step === 'feelings' && !isAnalyzing && (
              <div className="mt-3 p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-2.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Pick feelings in priority order:</span>
                  <span className="text-[10px] font-semibold text-cyan-400">
                    {selectedFeelings.length} chosen
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {FEELING_OPTIONS.map((f) => {
                    const idx = selectedFeelings.findIndex((item) => item.id === f.id);
                    const isSelected = idx !== -1;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => toggleFeeling(f)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                            : 'bg-zinc-800/90 text-zinc-300 hover:bg-zinc-700 border border-zinc-700/80'
                        }`}
                      >
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-black/40 text-white text-[10px] flex items-center justify-center font-bold">
                            #{idx + 1}
                          </span>
                        )}
                        <span>{f.label}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedFeelings.length > 0 && (
                  <button
                    type="button"
                    onClick={confirmFeelings}
                    className="w-full mt-2 py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-teal-400 text-black font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Confirm Moods ({selectedFeelings.length} selected)</span>
                    <Compass className="w-3.5 h-3.5 fill-black" />
                  </button>
                )}
              </div>
            )}

            {/* STEP 7: Languages Selection */}
            {step === 'languages' && !isAnalyzing && (
              <div className="mt-3 p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-2.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Select one or more languages:</span>
                  <span className="text-[10px] font-semibold text-cyan-400">
                    {selectedLanguages.length} selected
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {LANGUAGE_OPTIONS.map((lang) => {
                    const isSelected = selectedLanguages.includes(lang.code);
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => toggleLanguage(lang.code)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700/70'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                        {isSelected && <Check className="w-3 h-3 text-cyan-400" />}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={confirmLanguages}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-teal-400 text-black font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-black" />
                  <span>
                    Find My Movie{' '}
                    {selectedLanguages.length > 0
                      ? `(${selectedLanguages.length} Langs)`
                      : '(Any Language)'}
                  </span>
                </button>
              </div>
            )}

            {/* FAKE ANALYSIS LOADER (Variable 2 to 8 seconds, coordinated with network promise) */}
            {isAnalyzing && (
              <div className="my-3 p-4 rounded-2xl bg-zinc-950/90 border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.15)] animate-in fade-in duration-300 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-teal-400 flex items-center justify-center animate-spin">
                    <Loader2 className="w-5 h-5 text-black" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-cyan-300 animate-pulse">
                      Analyzing Recommendation Data
                    </h5>
                    <p className="text-[11px] text-zinc-300 leading-snug mt-0.5">
                      {analysisMessage}
                    </p>
                  </div>
                </div>

                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-500 animate-[pulse_1.5s_infinite] w-full" />
                </div>

                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    Scanning 10,000+ TMDB titles...
                  </span>
                  <span className="text-cyan-400 font-mono">deep analysis</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer status bar */}
          <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-950/80 text-center text-[11px] text-zinc-400 shrink-0 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Filmate Smart Assistant active</span>
            </span>
            <button
              type="button"
              onClick={resetBot}
              className="text-cyan-400 hover:underline cursor-pointer"
            >
              Start Fresh
            </button>
          </div>
        </div>
      )}
    </>
  );
}
