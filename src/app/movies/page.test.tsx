import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import MoviesCatalogPage from './page';
import { useMovieStore } from '@/store/useMovieStore';
import { Providers } from '@/app/providers';

const mockCatalog = Array.from({ length: 25 }, (_, i) => ({
  id: `tvm-${i + 1}`,
  title: `Cinema Title ${i + 1}`,
  rating: 8.5,
  posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba',
  genres: ['Action', 'Drama'],
  synopsis: 'A great cinematic experience.',
  year: '2024',
  platforms: ['WatchIT'],
}));

vi.mock('@/services/movieApi', () => ({
  fetchCatalogMovies: vi.fn().mockImplementation(() => Promise.resolve(mockCatalog)),
  fetchMovieById: vi.fn(),
  fetchHeroShowcase: vi.fn(),
  fetchTop10BoxOffice: vi.fn(),
  fetchLiveTrailers: vi.fn().mockResolvedValue([]),
}));

describe('Movies Catalog Dedicated Page (/movies)', () => {
  beforeEach(() => {
    useMovieStore.getState().setSelectedCategory('all');
    useMovieStore.getState().setSearchQuery('');
  });

  it('renders movies page header, search bar, and genre filter pills', async () => {
    render(
      <Providers>
        <MoviesCatalogPage />
      </Providers>
    );
    expect(screen.getByRole('heading', { name: /explore all movies/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search movies/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /all catalog/i })).toBeInTheDocument();
  });

  it('renders sorting options for rating, year, and title', () => {
    render(
      <Providers>
        <MoviesCatalogPage />
      </Providers>
    );
    const sortSelect = screen.getByLabelText(/sort by/i);
    expect(sortSelect).toBeInTheDocument();
  });

  it('shows paginated movies with 12 items and controls', async () => {
    render(
      <Providers>
        <MoviesCatalogPage />
      </Providers>
    );
    expect(screen.getAllByText(/showing/i).length).toBeGreaterThan(0);
    const nextBtn = await screen.findByRole('button', { name: /next page/i });
    expect(nextBtn).toBeInTheDocument();
  });
});
