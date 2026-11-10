'use client';

import React, { useEffect, useState } from 'react';
import { IoClose, IoMenu, IoSearch } from 'react-icons/io5';
import Logo from './Logo';
import NavLink from './NavLink';
import Link from 'next/link';
import { useSearchStore } from '@/store/useSearchStore';

const links = ['home', 'movies', 'tv-shows', 'about'];

interface LinksCompProps {
  open?: boolean;
  setOpen?: (val: boolean) => void;
}

const LinksComp: React.FC<LinksCompProps> = ({ open, setOpen }) => (
  <div
    className={`flex items-center ${
      open ? 'flex-col gap-y-5 text-xl' : 'gap-x-6'
    }`}
  >
    {links.map((link) => (
      <NavLink
        key={link}
        href={link === 'home' ? '/' : '/' + link}
        onClick={() => (open && setOpen ? setOpen(false) : undefined)}
        className="capitalize transition-all text-center hover:text-cyan-400 cursor-pointer"
        activeClassName={`text-cyan-400 font-bold ${
          open ? 'bg-cyan-950 w-full py-3 rounded-md' : 'cursor-default'
        }`}
        inActiveClassName="text-white"
      >
        {link.replaceAll('-', ' ')}
      </NavLink>
    ))}
  </div>
);

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openSearch } = useSearchStore();

  useEffect(() => {
    const handleScroll = () =>
      window.scrollY > 100 ? setScrolled(true) : setScrolled(false);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (open) {
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalBodyOverflow = document.body.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      return () => {
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.overflow = originalBodyOverflow;
      };
    }
  }, [open]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full h-10 md:h-12 lg:h-16 flex justify-between items-center px-4 md:px-6 lg:px-10 z-50 transition-all text-base md:text-lg ${
        scrolled
          ? 'bg-zinc-800/60 backdrop-blur border-b border-zinc-500'
          : 'bg-gradient-to-b from-zinc-950'
      }`}
    >
      <IoMenu
        size="1.5em"
        className="lg:hidden text-white cursor-pointer"
        onClick={() => setOpen(true)}
      />

      <div
        className={`w-full inset-0 h-full bg-black/90 backdrop-blur transition-all ${
          open ? 'opacity-100 z-20 fixed' : 'hidden -z-30 opacity-0'
        }`}
        onClick={() => setOpen(false)}
      />
      <div
        className={`w-4/5 fixed h-full bg-zinc-800 shadow transition-all top-0 px-4 flex flex-col gap-y-8 ${
          open ? 'left-0 z-20' : '-left-full'
        }`}
      >
        <div className="w-full border-b border-zinc-400 flex justify-between items-center py-2">
          <Logo title height="h-12" />
          <IoClose
            size="1.5em"
            className="text-white cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>
        <LinksComp open={open} setOpen={(val) => setOpen(val)} />
      </div>
      <div className="flex items-center gap-x-10 text-white h-full">
        <Link className="h-full flex items-center" href="/">
          <Logo />
        </Link>
        <div className="hidden lg:block">
          <LinksComp />
        </div>
      </div>
      <button
        type="button"
        onClick={() => openSearch()}
        aria-label="Search movies and TV shows"
        className="p-1 rounded-lg text-white hover:text-cyan-400 hover:bg-white/5 transition-all cursor-pointer"
      >
        <IoSearch size="1.5em" />
      </button>
    </nav>
  );
}
