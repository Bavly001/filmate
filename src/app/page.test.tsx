import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HomePage from './page';
import Providers from './providers';

const mockTrailers = [
  {
    id: 'kc-1',
    title: 'Gladiator II Official Trailer',
    youtubeVideoId: 'trailer123',
    thumbnailUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1',
    genres: ['Action', 'Drama'],
    views: 4500000,
  },
];

const mockTop10 = [
  {
    id: 'kc-1',
    title: 'Gladiator II',
    rating: 8.9,
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1',
    genres: ['Action', 'Drama'],
  },
];

const mockCatalog = [
  {
    id: 'tvm-1',
    title: 'Dune: Part Two',
    rating: 8.8,
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1',
    genres: ['Sci-Fi', 'Action'],
  },
];

vi.mock('@/services/movieApi', () => ({
  fetchLiveTrailers: vi.fn().mockImplementation(() => Promise.resolve(mockTrailers)),
  fetchTop10BoxOffice: vi.fn().mockImplementation(() => Promise.resolve(mockTop10)),
  fetchCatalogMovies: vi.fn().mockImplementation(() => Promise.resolve(mockCatalog)),
  fetchHeroShowcase: vi.fn().mockImplementation(() => Promise.resolve(mockCatalog[0])),
  fetchMovieById: vi.fn(),
}));

describe('HomePage Integration', () => {
  it('renders header, hero, catalog sections and floating mate button', async () => {
    render(
      <Providers>
        <HomePage />
      </Providers>
    );

    // Dynamic brand crest logo
    expect(screen.getByTestId('brand-crest')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /filmate/i }).length).toBeGreaterThan(0);

    // Floating Mate chat button
    expect(screen.getByLabelText(/Open Mate Assistant/i)).toBeInTheDocument();

    // Top 10 Box Office section
    expect(await screen.findByText(/Top 10 in Box Office & Cinema/i)).toBeInTheDocument();

    // Footer
    expect(screen.getByText(/Crafted in Midnight Gold/i)).toBeInTheDocument();
  });
});
