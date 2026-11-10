import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MoviesCategory from './MoviesCategory';

describe('MoviesCategory component', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const sampleMovies = [
    {
      id: 1,
      title: 'Dune: Part Two',
      overview: 'Paul Atreides unites with Chani...',
      poster_path: '/8b8R8l88Qje9dn9OE8PY05Nx1S8.jpg',
      vote_average: 8.3,
    },
    {
      id: 2,
      title: 'Oppenheimer',
      overview: 'The story of J. Robert Oppenheimer...',
      poster_path: '/ptpr0kGAckfQkJeJIt8st5dglvd.jpg',
      vote_average: 8.1,
    },
  ];

  it('renders section title correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MoviesCategory title="Trending Movies" movies={sampleMovies} />
      </QueryClientProvider>
    );

    expect(screen.getByText('Trending Movies')).toBeInTheDocument();
  });

  it('renders movie titles and cards for provided movies', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MoviesCategory title="Popular Movies" movies={sampleMovies} />
      </QueryClientProvider>
    );

    expect(screen.getAllByText('Dune: Part Two').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Oppenheimer').length).toBeGreaterThanOrEqual(1);
  });
});
