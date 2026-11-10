import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MovieCard from './MovieCard';

describe('MovieCard component', () => {
  const sampleMovie = {
    id: 550,
    title: 'Fight Club',
    overview: 'An insomniac office worker and a devil-may-care soap maker...',
    poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdrop_path: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    vote_average: 8.4,
    popularity: 92.5,
  };

  it('renders movie card without clipping overflow on the outer container', () => {
    const { container } = render(<MovieCard {...sampleMovie} />);
    const outerCard = container.firstChild as HTMLElement;

    expect(outerCard).toBeInTheDocument();
    // Outer card must NOT have overflow-hidden so AnimatedCard rectangle expands freely
    expect(outerCard.className).not.toContain('overflow-hidden');
    expect(outerCard.className).toContain('group-hover:z-50');

    // Poster link must have rounded-xl overflow-hidden for clipped poster image
    const posterLink = outerCard.querySelector('a');
    expect(posterLink).toBeInTheDocument();
    expect(posterLink?.className).toContain('overflow-hidden');
    expect(posterLink?.className).toContain('rounded-xl');
  });

  it('renders AnimatedCard with title and overview within the card structure', () => {
    render(<MovieCard {...sampleMovie} />);
    // Title appears in both image alt and in AnimatedCard
    const titleHeadings = screen.getAllByText('Fight Club');
    expect(titleHeadings.length).toBeGreaterThanOrEqual(1);

    expect(
      screen.getByText(/An insomniac office worker/)
    ).toBeInTheDocument();
  });

  it('renders simple link card when link={true} is passed', () => {
    const { container } = render(<MovieCard {...sampleMovie} link />);
    const linkElement = container.querySelector('a');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement?.getAttribute('href')).toBe('/movies/movie/550');
  });
});
