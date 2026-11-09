import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MovieDetailPage from './page';
import { Providers } from '@/app/providers';

const mockMovie = {
  id: 'tvm-1',
  title: 'Dune: Part Two',
  rating: 8.8,
  posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1',
  backdropUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1',
  genres: ['Action', 'Sci-Fi'],
  synopsis: 'Paul Atreides unites with Chani and the Fremen.',
  year: '2024',
  runtime: 166,
  cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson'],
  platforms: ['Cinema IMAX', 'WatchIT'],
  source: 'tvmaze' as const,
};

vi.mock('@/services/movieApi', () => ({
  fetchMovieById: vi.fn().mockImplementation((id: string) => {
    if (id === 'tvm-1' || id === 'm-1') {
      return Promise.resolve(mockMovie);
    }
    return Promise.resolve(null);
  }),
  fetchLiveTrailers: vi.fn().mockResolvedValue([]),
  fetchCatalogMovies: vi.fn().mockResolvedValue([]),
}));

describe('Movie Detail Page (/movies/[id])', () => {
  it('renders detailed movie information for a valid movie ID', async () => {
    render(
      <Providers>
        <MovieDetailPage params={{ id: 'tvm-1' }} />
      </Providers>
    );
    expect(await screen.findByText('Dune: Part Two')).toBeInTheDocument();
    expect(screen.getByText(/Paul Atreides unites with Chani/i)).toBeInTheDocument();
    expect(screen.getByText(/Cinema IMAX/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back/i })).toBeInTheDocument();
    expect(screen.getByText(/Gold Cinema Booking/i)).toBeInTheDocument();
  });

  it('allows reserving a Gold Cinema seat via the booking concierge', async () => {
    render(
      <Providers>
        <MovieDetailPage params={{ id: 'tvm-1' }} />
      </Providers>
    );
    expect(await screen.findByText('Dune: Part Two')).toBeInTheDocument();
    const bookBtn = screen.getByRole('button', { name: /book now/i });
    fireEvent.click(bookBtn);
    expect(screen.getByText(/cinema pass reserved/i)).toBeInTheDocument();
  });

  it('renders elegant not-found state when movie ID is invalid', async () => {
    render(
      <Providers>
        <MovieDetailPage params={{ id: 'non-existent-id' }} />
      </Providers>
    );
    expect(await screen.findByText(/movie not found/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /browse catalog/i })).toBeInTheDocument();
  });
});
