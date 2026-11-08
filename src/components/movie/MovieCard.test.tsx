import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MovieCard } from './MovieCard';
import { Movie } from '@/types/movie';

const mockMovie: Movie = {
  id: 'm-test-1',
  title: 'Dune: Part Two',
  year: 2024,
  rating: 8.8,
  posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600',
  genres: ['Sci-Fi', 'Action'],
  platforms: ['Cinema IMAX', 'HBO Max'],
  ageRating: '18+',
  venue: 'both',
  synopsis: 'Paul Atreides unites with Chani.',
  youtubeTrailerKey: 'Way9Dexny3w',
  director: 'Denis Villeneuve',
};

describe('MovieCard Component', () => {
  it('renders title, rating, and platform badges correctly', () => {
    render(<MovieCard movie={mockMovie} onPlayTrailer={vi.fn()} />);
    expect(screen.getByText('Dune: Part Two')).toBeInTheDocument();
    expect(screen.getByText(/8.8/)).toBeInTheDocument();
    expect(screen.getByText('Cinema IMAX')).toBeInTheDocument();
    expect(screen.getByText(/Sci-Fi/)).toBeInTheDocument();
  });

  it('triggers onPlayTrailer callback with trailer key when play button is clicked', () => {
    const playSpy = vi.fn();
    render(<MovieCard movie={mockMovie} onPlayTrailer={playSpy} />);
    const btn = screen.getByTitle(/play trailer/i);
    fireEvent.click(btn);
    expect(playSpy).toHaveBeenCalledWith('Way9Dexny3w', mockMovie);
  });
});
