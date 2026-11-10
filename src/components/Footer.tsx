import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import Logo from './Logo';
import { LuCopyright } from 'react-icons/lu';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full px-8 lg:px-24 py-5 lg:py-10 flex flex-wrap gap-y-5 lg:gap-y-0 lg:justify-center bg-zinc-800/50">
      <div className="lg:flex-1 w-full lg:w-auto flex flex-col">
        <Logo height="h-20" title text textSize="text-sm" />
        <p className="opacity-50 text-white text-xs flex items-center gap-x-1 -mt-2 font-light">
          <LuCopyright size="1em" className="mt-px" />
          <span className="text-[1em]">
            Bavly Ashraf 2024. All rights reserved.
          </span>
        </p>
      </div>
      <div className="gap-y-2 md:gap-y-0 md:flex-1 flex flex-col md:flex-row justify-between md:items-center text-white text-xs lg:text-sm">
        <div className="flex flex-col gap-y-1">
          <Link href="/movies" className="hover:text-cyan-400 transition-colors">
            Movies
          </Link>
          <Link href="/tv-shows" className="hover:text-cyan-400 transition-colors">
            TV Shows
          </Link>
          <Link href="/about" className="hover:text-cyan-400 transition-colors">
            About
          </Link>
        </div>
        <div className="flex flex-col gap-y-1">
          <p className="hover:text-cyan-400 transition-colors cursor-pointer">Terms & Conditions</p>
          <p className="hover:text-cyan-400 transition-colors cursor-pointer">Privacy Policy</p>
        </div>
        <div>
          <p className="opacity-50 text-sm">Connect with us</p>
          <div className="flex gap-x-3 text-lg mt-1">
            <FaFacebook size="1em" className="hover:text-cyan-400 transition-colors cursor-pointer" />
            <FaInstagram size="1em" className="hover:text-cyan-400 transition-colors cursor-pointer" />
            <FaWhatsapp size="1em" className="hover:text-cyan-400 transition-colors cursor-pointer" />
            <FaLinkedin size="1em" className="hover:text-cyan-400 transition-colors cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
