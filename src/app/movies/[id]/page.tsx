'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  Clock,
  Calendar,
  Film,
  Play,
  Share2,
  Tv,
  CheckCircle2,
  AlertCircle,
  Users,
  Ticket,
  Sparkles,
  Clapperboard,
  Check,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchMovieById } from '@/services/movieApi';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { Navbar } from '@/components/common/Navbar';
import { AmbientBackground } from '@/components/common/AmbientBackground';
import { MateDrawer } from '@/components/mate/MateDrawer';
import { FloatingMateButton } from '@/components/mate/FloatingMateButton';
import { TrailerModal } from '@/components/movie/TrailerModal';
import { useMovieStore } from '@/store/useMovieStore';

interface MovieDetailPageProps {
  params: {
    id: string;
  };
}

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { data: movie, isLoading } = useQuery({
    queryKey: ['movieDetail', params.id],
    queryFn: () => fetchMovieById(params.id),
    staleTime: 1000 * 60 * 30,
  });

  const openTrailerModal = useMovieStore((s) => s.openTrailerModal);

  // Gold-cinema interactive booking state
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('19:30');
  const [ticketType, setTicketType] = useState<'standard' | 'vip'>('vip');
  const [isBooked, setIsBooked] = useState<boolean>(false);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#07080B] text-white flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-300">
        <AmbientBackground />
        <Navbar />
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#10121B] border border-amber-500/30 flex items-center justify-center animate-spin mb-4">
            <Film className="w-7 h-7 text-amber-400" />
          </div>
          <p className="text-sm text-zinc-400">Retrieving cinematic details from live feeds...</p>
        </div>
      </main>
    );
  }

  if (!movie) {
    return (
      <main className="min-h-screen bg-[#07080B] text-white flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-300">
        <AmbientBackground />
        <Navbar />
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#10121B] border border-amber-500/40 text-amber-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Movie Not Found</h1>
          <p className="text-zinc-400 text-sm mb-6">
            The film you requested could not be located in our active public catalog.
          </p>
          <Link
            href="/movies"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black font-extrabold text-sm shadow-[0_0_20px_rgba(229,137,10,0.4)] transition-all"
          >
            Browse Catalog
          </Link>
        </div>
      </main>
    );
  }

  const trailerKey = movie.youtubeTrailerKey || movie.youtubeVideoId;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#07080B] text-white flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-300">
      <AmbientBackground />

      <div className="relative z-10 flex-1">
        <Navbar />

        {/* Back Link Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-28 pb-4">
          <Link
            href="/movies"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-amber-400 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Movies</span>
          </Link>
        </div>

        {/* Cinematic Dual-Column Detail Section (MoviesAngular & Gold-cinema synthesis) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
          <div className="relative rounded-3xl overflow-hidden border border-amber-500/25 bg-[#0E1017]/95 shadow-2xl backdrop-blur-2xl">
            {/* Top Backdrop Image Overlay with Motion Blur */}
            <div className="relative w-full h-56 sm:h-80 overflow-hidden">
              <ImageWithFallback
                src={movie.backdropUrl || movie.posterUrl}
                alt={movie.title}
                fallbackTitle={movie.title}
                className="w-full h-full object-cover opacity-25 filter blur-[2px] scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E1017] via-[#0E1017]/80 to-transparent" />
            </div>

            {/* Main Dual-Column Content */}
            <div className="relative z-10 px-6 sm:px-10 pb-12 -mt-36 sm:-mt-48 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Poster + Full Metadata (MoviesAngular style) */}
              <div className="lg:col-span-7 flex flex-col sm:flex-row gap-6 items-start">
                {/* Poster Frame with Gold Glow */}
                <div className="w-48 sm:w-60 aspect-[2/3] rounded-3xl overflow-hidden border-2 border-amber-500/50 shadow-[0_0_30px_rgba(229,137,10,0.35)] shrink-0 bg-[#07080B] group">
                  <ImageWithFallback
                    src={movie.posterUrl}
                    alt={movie.title}
                    fallbackTitle={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Metadata Details */}
                <div className="flex-1 space-y-4">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="px-3 py-1 rounded-full bg-[#07080B] border border-amber-500/50 text-amber-300 text-xs font-black flex items-center gap-1.5 shadow-sm">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{movie.rating ? movie.rating.toFixed(1) : '8.0'} / 10</span>
                    </div>

                    {movie.ageRating === '18+' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-950/90 border border-red-500/50 text-red-400 text-xs font-extrabold uppercase tracking-wider">
                        18+ Rated
                      </span>
                    )}

                    {movie.year && (
                      <span className="px-3 py-1 rounded-full bg-[#07080B]/80 border border-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>{movie.year}</span>
                      </span>
                    )}

                    {movie.runtime && (
                      <span className="px-3 py-1 rounded-full bg-[#07080B]/80 border border-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{movie.runtime} min</span>
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                    {movie.title}
                  </h1>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-1.5">
                    {movie.genres?.map((g) => (
                      <span
                        key={g}
                        className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-200"
                      >
                        {g}
                      </span>
                    ))}
                  </div>

                  {/* Overview */}
                  <div className="space-y-1.5 pt-1">
                    <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider">
                      Movie Description
                    </h3>
                    <p className="text-sm text-zinc-300 leading-relaxed font-normal">
                      {movie.synopsis || 'An exceptional cinema presentation.'}
                    </p>
                  </div>

                  {/* Cast & Director specs with Warning/Gold Labels (from MoviesAngularProject) */}
                  <div className="space-y-1.5 pt-2 text-xs border-t border-amber-500/15">
                    {movie.cast && movie.cast.length > 0 && (
                      <p className="text-zinc-300">
                        <span className="text-amber-400 font-bold uppercase tracking-wider mr-1">
                          Actors:
                        </span>
                        {movie.cast.join(', ')}
                      </p>
                    )}
                    {movie.director && (
                      <p className="text-zinc-300">
                        <span className="text-amber-400 font-bold uppercase tracking-wider mr-1">
                          Director:
                        </span>
                        {movie.director}
                      </p>
                    )}
                    <p className="text-zinc-300">
                      <span className="text-amber-400 font-bold uppercase tracking-wider mr-1">
                        Duration:
                      </span>
                      {movie.runtime ? `${movie.runtime} min` : movie.duration || '120 min'}
                    </p>
                    <p className="text-zinc-300">
                      <span className="text-amber-400 font-bold uppercase tracking-wider mr-1">
                        Category:
                      </span>
                      {movie.genres?.join(', ') || 'Feature Film'}
                    </p>
                  </div>

                  {/* Streaming Platforms */}
                  {movie.platforms && movie.platforms.length > 0 && (
                    <div className="pt-2">
                      <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Tv className="w-3.5 h-3.5" />
                        <span>Available On</span>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {movie.platforms.map((platform) => (
                          <span
                            key={platform}
                            className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#07080B] border border-amber-500/30 text-white shadow-sm flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                            <span>{platform}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* See more movies link */}
                  <div className="pt-4">
                    <Link
                      href="/movies"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#161822] border border-amber-500/40 hover:border-amber-400 text-xs font-extrabold text-amber-400 hover:text-amber-300 transition-all"
                    >
                      <span>See More Movies &rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column: Embedded Trailer Player & Gold Cinema Booking (from Gold-cinema) */}
              <div className="lg:col-span-5 space-y-6 w-full">
                {/* Watch Trailer Showcase Container */}
                <div className="rounded-3xl p-5 bg-[#141722] border border-amber-500/30 shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clapperboard className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">
                        Watch Trailer
                      </h3>
                    </div>
                    {trailerKey && (
                      <button
                        onClick={() => openTrailerModal(trailerKey, movie)}
                        className="text-xs text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-amber-400" />
                        <span>Theater Mode</span>
                      </button>
                    )}
                  </div>

                  {trailerKey ? (
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-amber-500/20 shadow-inner">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${trailerKey}?rel=0&modestbranding=1`}
                        title={`${movie.title} Official Trailer`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full rounded-2xl bg-black/60 border border-zinc-800 flex flex-col items-center justify-center text-center p-4">
                      <Film className="w-8 h-8 text-zinc-500 mb-2" />
                      <p className="text-xs text-zinc-400">Official trailer currently previewing</p>
                    </div>
                  )}
                </div>

                {/* Gold Cinema Ticket Booking & VIP Seat Concierge (from Gold-cinema Movie.html) */}
                <div className="rounded-3xl p-6 bg-[#141722] border border-amber-500/30 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-amber-400" />
                      <h3 className="text-base font-black text-white tracking-tight">
                        Gold Cinema Booking
                      </h3>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      VIP Experience
                    </span>
                  </div>

                  {isBooked ? (
                    <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center animate-in zoom-in-95 duration-200 space-y-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                        <Check className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-emerald-300">
                        Cinema Pass Reserved!
                      </h4>
                      <p className="text-xs text-zinc-300">
                        Showtime reserved for {bookingTime} ({ticketType === 'vip' ? 'VIP Hall - $35' : 'Standard - $15'}).
                      </p>
                      <button
                        onClick={() => setIsBooked(false)}
                        className="text-xs text-amber-400 hover:underline font-bold mt-2 cursor-pointer"
                      >
                        Book Another Seat
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleBookingSubmit} className="space-y-3.5">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                          Choose Date
                        </label>
                        <input
                          type="date"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#07080B] border border-zinc-700 focus:border-amber-400 text-white text-xs outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                          Choose Showtime
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {['17:00', '19:30', '22:15'].map((time) => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setBookingTime(time)}
                              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                bookingTime === time
                                  ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(229,137,10,0.5)]'
                                  : 'bg-[#07080B] border border-zinc-800 text-zinc-300 hover:border-amber-500/40'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                          Experience Tier
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setTicketType('vip')}
                            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center cursor-pointer ${
                              ticketType === 'vip'
                                ? 'bg-amber-500/20 border-2 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(229,137,10,0.3)]'
                                : 'bg-[#07080B] border border-zinc-800 text-zinc-400 hover:text-white'
                            }`}
                          >
                            <span>VIP Hall Pass</span>
                            <span className="text-[10px] text-zinc-400 mt-0.5">$35 / seat</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setTicketType('standard')}
                            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center cursor-pointer ${
                              ticketType === 'standard'
                                ? 'bg-amber-500/20 border-2 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(229,137,10,0.3)]'
                                : 'bg-[#07080B] border border-zinc-800 text-zinc-400 hover:text-white'
                            }`}
                          >
                            <span>Standard Screen</span>
                            <span className="text-[10px] text-zinc-400 mt-0.5">$15 / seat</span>
                          </button>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-zinc-400 uppercase block font-semibold">
                            Total Price
                          </span>
                          <span className="text-xl font-black text-amber-400">
                            {ticketType === 'vip' ? '$35' : '$15'}
                          </span>
                        </div>

                        <button
                          type="submit"
                          className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs sm:text-sm shadow-[0_0_18px_rgba(229,137,10,0.4)] active:scale-95 transition-all cursor-pointer"
                        >
                          Book Now
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="relative z-10 border-t border-amber-500/10 bg-[#07080B] mt-16 py-8 px-4 sm:px-8 text-center text-xs text-zinc-500">
        <p>© 2026 Filmate. All rights reserved. Crafted in Midnight Gold.</p>
      </footer>

      <FloatingMateButton />
      <MateDrawer />
      <TrailerModal />
    </main>
  );
}
