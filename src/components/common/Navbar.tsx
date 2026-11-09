'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Menu, X } from 'lucide-react';
import { useMateStore } from '@/store/useMateStore';

export const Navbar: React.FC = () => {
  const openDrawer = useMateStore((s) => s.openDrawer);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Discover', href: '/' },
    { label: 'Movies', href: '/movies' },
    { label: 'Trending', href: '/movies?sort=trending' },
    { label: 'Top Rated', href: '/movies?sort=rating' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full px-3 sm:px-8 py-3 transition-all duration-300 ${
        isScrolled
          ? 'backdrop-blur-md bg-[#0B0D13]/85 border-b border-amber-500/15 shadow-2xl shadow-black/80'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo with Gold Emblem (MoviesAngular / Gold-cinema inspired) */}
        <Link href="/" aria-label="FILMATE" className="flex items-center gap-2.5 sm:gap-3 group select-none shrink-0">
          <div
            data-testid="brand-crest"
            className="w-10 h-10 rounded-full bg-[#10121B] border-2 border-amber-500/50 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(229,137,10,0.35)] group-hover:scale-105 group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(229,137,10,0.6)] transition-all duration-300"
          >
            <svg
              viewBox="0 0 64 64"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="headerGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FDE68A" />
                  <stop offset="50%" stopColor="#E5890A" />
                  <stop offset="100%" stopColor="#9D5C0D" />
                </linearGradient>
              </defs>
              <circle cx="32" cy="32" r="24" fill="#E5890A" fillOpacity="0.15" />
              <path
                d="M20 16H44V22H27V29H41V35H27V48H20V16Z"
                fill="url(#headerGoldGrad)"
              />
              <polygon points="34,36 44,48 37,48 29,38" fill="#FDE68A" fillOpacity="0.9" />
              <circle cx="43" cy="22" r="2.5" fill="#FDE68A" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-wider text-white">
              FILM<span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">ATE</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-amber-500/80 font-bold -mt-1 hidden sm:block">
              Gold Cinema
            </span>
          </div>
        </Link>

        {/* Desktop Floating Pill Navigation (MoviesAngular rounded-pill header style) */}
        <div className="hidden lg:flex items-center rounded-full bg-[#161822]/80 border border-amber-500/25 px-5 py-1.5 shadow-[0_4px_25px_rgba(0,0,0,0.5)] backdrop-blur-xl gap-2">
          {navLinks.map((link) => {
            const current = pathname || '/';
            const isActive =
              link.href === '/' ? current === '/' : current.startsWith(link.href.split('?')[0]);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black font-extrabold shadow-[0_0_12px_rgba(229,137,10,0.5)]'
                    : 'text-zinc-300 hover:text-amber-300 hover:bg-zinc-800/40'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Talk to Mate Action & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={openDrawer}
            className="px-3.5 sm:px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs sm:text-sm shadow-[0_0_18px_rgba(229,137,10,0.45)] hover:shadow-[0_0_28px_rgba(229,137,10,0.7)] active:scale-95 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span>Talk to Mate</span>
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile navigation"
            className="lg:hidden p-2 rounded-full bg-[#10121B] border border-amber-500/30 text-zinc-300 hover:text-amber-400 hover:border-amber-500/60 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Luxury Navigation Menu */}
      {mobileMenuOpen && (
        <div
          data-testid="mobile-nav-menu"
          className="lg:hidden mt-3 p-4 rounded-3xl backdrop-blur-2xl bg-[#0B0D13]/95 border border-amber-500/25 shadow-2xl flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200"
        >
          {navLinks.map((link) => {
            const current = pathname || '/';
            const isActive =
              link.href === '/' ? current === '/' : current.startsWith(link.href.split('?')[0]);
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(229,137,10,0.3)]'
                    : 'text-zinc-300 hover:text-amber-300 hover:bg-zinc-800/40'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
