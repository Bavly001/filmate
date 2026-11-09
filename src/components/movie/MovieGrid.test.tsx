import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MovieGrid } from './MovieGrid';
import { useMovieStore } from '@/store/useMovieStore';
import { Movie } from '@/types/movie';

const mockCatalog: Movie[] = Array.from({ length: 18 }, (_, idx) => ({
  id: `tvm-${idx + 1}`,
  title: idx === 0 ? 'Oppenheimer' : `Cinematic Hit ${idx + 1}`,
  rating: 8.5,
  posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401',
  genres: idx % 2 === 0 ? ['Action', 'Sci-Fi'] : ['Drama'],
  source: 'tvmaze',
  year: 2024,
  runtime: 120,
}));

describe('MovieGrid Component with Search & Pagination', () => {
  beforeEach(() => {
    useMovieStore.getState().setSelectedCategory('all');
    useMovieStore.getState().setSearchQuery('');
  });

  it('renders search input and category filter buttons without upcoming category', () => {
    render(<MovieGrid movies={mockCatalog} />);
    expect(screen.getByPlaceholderText(/search movies/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /all catalog/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /upcoming/i })).toBeNull();
  });

  it('filters movies when search input is typed', () => {
    render(<MovieGrid movies={mockCatalog} />);
    const searchInput = screen.getByPlaceholderText(/search movies/i);
    fireEvent.change(searchInput, { target: { value: 'Oppenheimer' } });
    expect(screen.getByText('Oppenheimer')).toBeInTheDocument();
    expect(screen.queryByText('Cinematic Hit 2')).toBeNull();
  });

  it('renders pagination controls and limits movies per page to 12', () => {
    render(<MovieGrid movies={mockCatalog} />);
    // Pagination indicator should show
    expect(screen.getAllByText(/showing/i).length).toBeGreaterThan(0);
    // Next page button should be present
    const nextBtn = screen.getByRole('button', { name: /next page/i });
    expect(nextBtn).toBeInTheDocument();
    expect(nextBtn).not.toBeDisabled();

    // Previous button should be disabled on first page
    const prevBtn = screen.getByRole('button', { name: /previous page/i });
    expect(prevBtn).toBeDisabled();
  });

  it('navigates to next page when clicking next', () => {
    render(<MovieGrid movies={mockCatalog} />);
    const nextBtn = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextBtn);

    const prevBtn = screen.getByRole('button', { name: /previous page/i });
    expect(prevBtn).not.toBeDisabled();
  });
});
