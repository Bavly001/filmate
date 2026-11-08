import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getCuratedMovies,
  filterMoviesByCriteria,
  fetchLiveTrailers,
  getMovieById,
} from './movieApi';

describe('Curated Movie Catalog & Service', () => {
  it('returns at least 100 curated movies with valid metadata', () => {
    const movies = getCuratedMovies();
    expect(movies.length).toBeGreaterThanOrEqual(100);

    movies.forEach((m) => {
      expect(m.id).toBeTruthy();
      expect(m.title).toBeTruthy();
      expect(m.year).toBeGreaterThanOrEqual(1970);
      expect(m.rating).toBeGreaterThan(0);
      expect(m.posterUrl).toContain('http');
      expect(m.genres.length).toBeGreaterThan(0);
      expect(m.platforms.length).toBeGreaterThan(0);
      expect(['18+', 'All Ages']).toContain(m.ageRating);
      expect(['cinema', 'home', 'both']).toContain(m.venue);
      expect(m.youtubeTrailerKey).toBeTruthy();
    });
  });

  it('retrieves a single movie by id', () => {
    const movies = getCuratedMovies();
    const target = movies[0];
    const retrieved = getMovieById(target.id);
    expect(retrieved).toEqual(target);
  });

  it('filters movies accurately by multiple categories and age rating', () => {
    const actionMovies = filterMoviesByCriteria({
      genres: ['Action'],
      ageRating: '18+',
    });
    expect(actionMovies.length).toBeGreaterThan(0);
    expect(actionMovies.every((m) => m.genres.includes('Action') && m.ageRating === '18+')).toBe(true);
  });

  it('filters movies by venue preference', () => {
    const cinemaMovies = filterMoviesByCriteria({
      venue: 'cinema',
    });
    expect(cinemaMovies.length).toBeGreaterThan(0);
    expect(cinemaMovies.every((m) => m.venue === 'cinema' || m.venue === 'both')).toBe(true);
  });

  it('fetches live trailers from KinoCheck API with clean fallback', async () => {
    const trailers = await fetchLiveTrailers();
    expect(trailers).toBeDefined();
    expect(Array.isArray(trailers)).toBe(true);
    expect(trailers.length).toBeGreaterThan(0);
    expect(trailers[0].youtubeVideoId).toBeTruthy();
  });
});
