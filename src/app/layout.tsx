import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Filmate | Luxury Cinema & AI Movie Companion',
  description: 'Experience premier cinema titles, official 4K trailers, and instant AI concierge recommendations with Filmate.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-obsidian-canvas text-gray-100 antialiased selection:bg-gold selection:text-black">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
