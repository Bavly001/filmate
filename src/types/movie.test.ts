import { describe, it, expect } from 'vitest';
import { Movie, FilterCriteria, ChatMessage } from './movie';

describe('Movie Types Contract', () => {
  it('validates a movie with prefixed ID and source discriminator', () => {
    const movie: Movie = {
      id: 'kc-1381071',
      title: 'Godzilla Minus Zero',
      rating: 8.4,
      posterUrl: 'https://cdn.kinocheck.com/i/8qwlxv0cge.jpg',
      backdropUrl: 'https://img.youtube.com/vi/E-Q2tEgJ1ZI/maxresdefault.jpg',
      genres: ['Action', 'Sci-Fi'],
      source: 'kinocheck',
      youtubeVideoId: 'E-Q2tEgJ1ZI',
      synopsis: 'Cinema premiere trailer description',
    };

    expect(movie.id.startsWith('kc-')).toBe(true);
    expect(movie.source).toBe('kinocheck');
    expect((movie as unknown as Record<string, unknown>).upcoming).toBeUndefined();
  });

  it('validates FilterCriteria has no upcomingOnly property', () => {
    const criteria: FilterCriteria = {
      genres: ['Action'],
      searchQuery: 'Batman',
    };
    expect((criteria as unknown as Record<string, unknown>).upcomingOnly).toBeUndefined();
  });

  it('validates ChatMessage structure for Mate Messenger popup', () => {
    const message: ChatMessage = {
      id: 'msg-1',
      role: 'mate',
      text: 'Here is a cinematic thriller for tonight:',
      timestamp: new Date().toISOString(),
      recommendation: {
        id: 'tvm-975',
        title: 'Batman',
        rating: 7.8,
        posterUrl: 'https://image.com/batman.jpg',
        genres: ['Action'],
        source: 'tvmaze',
      },
    };
    expect(message.role).toBe('mate');
    expect(message.recommendation?.title).toBe('Batman');
    expect(message.recommendation?.source).toBe('tvmaze');
  });
});
