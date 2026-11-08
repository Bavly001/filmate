import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Filmate | Smart Movie Companion & Streaming Catalog',
  description: 'Discover trending movies, upcoming cinema releases, and get AI-powered recommendations matching your exact feelings.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark-bg text-gray-100 antialiased selection:bg-sunset selection:text-white">
        {children}
      </body>
    </html>
  );
}
