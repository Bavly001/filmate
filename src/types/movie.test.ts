import { describe, it, expect } from 'vitest';
import { Movie, MatePreferences, TrailerItem } from './movie';

describe('Movie Types', () => {
  it('validates a well-formed movie record', () => {
    const movie: Movie = {
      id: 'm1',
      title: 'Inception',
      year: 2010,
      rating: 8.8,
      posterUrl: 'https://example.com/poster.jpg',
      genres: ['Sci-Fi', 'Action', 'Mystery'],
      platforms: ['Netflix'],
      ageRating: '18+',
      venue: 'both',
      synopsis: 'A thief steals corporate secrets through dream-sharing tech.',
      youtubeTrailerKey: 'YoHD9XEInc0',
    };
    expect(movie.title).toBe('Inception');
    expect(movie.platforms).toContain('Netflix');
    expect(movie.genres).toContain('Sci-Fi');
  });

  it('validates a well-formed trailer item from public feed', () => {
    const trailer: TrailerItem = {
      id: 'p1yj',
      title: 'Godzilla Minus Zero',
      youtubeVideoId: 'NOT42AUSzCs',
      thumbnailUrl: 'https://img.youtube.com/vi/NOT42AUSzCs/maxresdefault.jpg',
      genres: ['Action', 'Horror', 'Sci-Fi'],
      views: 198159,
      publishedAt: '2026-11-06T16:16:38+01:00',
    };
    expect(trailer.youtubeVideoId).toBe('NOT42AUSzCs');
  });

  it('validates mate preferences', () => {
    const prefs: MatePreferences = {
      moods: ['Action', 'Comedy'],
      company: 'partner',
      venue: 'cinema',
      ageRating: '18+',
    };
    expect(prefs.moods).toHaveLength(2);
    expect(prefs.company).toBe('partner');
  });
});
