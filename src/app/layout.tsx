import './globals.css';
import React from 'react';
import type { Metadata } from 'next';
import Providers from './providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MateBot from '@/components/mate/MateBot';
import SearchOverlay from '@/components/SearchOverlay';

export const metadata: Metadata = {
  title: 'Filmate - Watch Movies & TV Series',
  description:
    'Explore trending movies, top rated TV series, and find your next favorite film with Filmate Mate.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="w-full min-h-screen bg-zinc-900 text-white selection:bg-cyan-500 selection:text-black">
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <MateBot />
          <SearchOverlay />
        </Providers>
      </body>
    </html>
  );
}
