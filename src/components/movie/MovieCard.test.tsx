import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MovieCard } from './MovieCard';
import { NumberedMovieCard } from './NumberedMovieCard';
import { Movie } from '@/types/movie';

const mockMovie: Movie = {
  id: 'kc-1381071',
  title: 'Dune: Part Two',
  year: 2024,
  rating: 8.8,
  posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600',
  genres: ['Sci-Fi', 'Action'],
  platforms: ['Cinema IMAX', 'WatchIT'],
  ageRating: '18+',
  venue: 'both',
  synopsis: 'Paul Atreides unites with Chani.',
  youtubeTrailerKey: 'Way9Dexny3w',
  youtubeVideoId: 'Way9Dexny3w',
  source: 'kinocheck',
  views: 1500000,
};

describe('MovieCard Component', () => {
  it('renders title, gold rating, and platform badges correctly', () => {
    render(<MovieCard movie={mockMovie} onPlayTrailer={vi.fn()} />);
    expect(screen.getByText('Dune: Part Two')).toBeInTheDocument();
    expect(screen.getByText(/8.8/)).toBeInTheDocument();
    expect(screen.getByText('Cinema IMAX')).toBeInTheDocument();
    expect(screen.getByText(/Sci-Fi/)).toBeInTheDocument();
  });

  it('links to /movies/[id] for detailed luxury movie route', () => {
    render(<MovieCard movie={mockMovie} onPlayTrailer={vi.fn()} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/movies/kc-1381071');
  });

  it('triggers onPlayTrailer callback with trailer key when play button is clicked', () => {
    const playSpy = vi.fn();
    render(<MovieCard movie={mockMovie} onPlayTrailer={playSpy} />);
    const btn = screen.getByTitle(/play trailer/i);
    fireEvent.click(btn);
    expect(playSpy).toHaveBeenCalledWith('Way9Dexny3w', mockMovie);
  });

  it('strictly contains no upcoming badge in rendered markup', () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.queryByText(/upcoming/i)).toBeNull();
  });
});

describe('NumberedMovieCard Component', () => {
  it('renders rank number and links to movie detail', () => {
    render(<NumberedMovieCard rank={1} movie={mockMovie} onPlayTrailer={vi.fn()} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Dune: Part Two')).toBeInTheDocument();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/movies/kc-1381071');
  });

  it('triggers trailer playback when play button is clicked', () => {
    const playSpy = vi.fn();
    render(<NumberedMovieCard rank={2} movie={mockMovie} onPlayTrailer={playSpy} />);
    const btn = screen.getByTitle(/play trailer/i);
    fireEvent.click(btn);
    expect(playSpy).toHaveBeenCalledWith('Way9Dexny3w', mockMovie);
  });
});
