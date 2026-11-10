import React from 'react';

export default function MovieDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full min-h-screen text-white bg-zinc-900">
      {children}
    </main>
  );
}
