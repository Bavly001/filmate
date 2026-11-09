import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchLiveTrailers,
  fetchHeroShowcase,
  fetchTop10BoxOffice,
  fetchCatalogMovies,
  fetchMovieById,
  resolveTrailer,
} from './movieApi';

describe('Live Movie API Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchLiveTrailers fetches and maps KinoCheck trailers with kc- prefixed IDs', async () => {
    const mockKinoCheck = {
      '0': {
        id: 'knxn',
        title: 'Godzilla vs. Ghidorah (2026)',
        youtube_video_id: 'E-Q2tEgJ1ZI',
        thumbnail: 'https://cdn.kinocheck.com/i/thumb.jpg',
        views: 827667,
        genres: ['Action', 'Horror'],
      },
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockKinoCheck,
    });

    const trailers = await fetchLiveTrailers();
    expect(trailers).toBeDefined();
    expect(trailers.length).toBe(1);
    expect(trailers[0].id).toBe('kc-knxn');
    expect(trailers[0].youtubeVideoId).toBe('E-Q2tEgJ1ZI');
  });

  it('fetchHeroShowcase returns a featured cinema title with high-res backdrop', async () => {
    const mockKinoCheck = {
      '0': {
        id: 'kc1',
        title: 'Dune: Part Two',
        youtube_video_id: 'Way9Dexny3w',
        youtube_thumbnail: 'https://img.youtube.com/vi/Way9Dexny3w/maxresdefault.jpg',
        thumbnail: 'https://cdn.kinocheck.com/i/dune.jpg',
        genres: ['Sci-Fi', 'Adventure'],
        views: 1500000,
      },
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockKinoCheck,
    });

    const showcase = await fetchHeroShowcase();
    expect(showcase).toBeDefined();
    expect(showcase.id).toBe('kc-kc1');
    expect(showcase.title).toBe('Dune: Part Two');
    expect(showcase.backdropUrl).toContain('Way9Dexny3w');
    expect(showcase.source).toBe('kinocheck');
  });

  it('fetchTop10BoxOffice returns 10 ranked cinema titles with kc- IDs', async () => {
    const mockList = Array.from({ length: 12 }, (_, i) => ({
      id: `kc-${i}`,
      title: `Hit Film ${i + 1}`,
      youtube_video_id: `yt-${i}`,
      thumbnail: `https://thumb/${i}.jpg`,
      views: 900000 - i * 10000,
      genres: ['Action', 'Drama'],
    }));
    const mockObj = Object.fromEntries(mockList.map((item, idx) => [idx.toString(), item]));

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockObj,
    });

    const top10 = await fetchTop10BoxOffice();
    expect(top10.length).toBe(10);
    expect(top10[0].id).toBe('kc-0');
    expect(top10[0].source).toBe('kinocheck');
    expect(top10[0].views).toBe(900000);
  });

  it('fetchCatalogMovies queries TVMaze and maps records with tvm- prefixed IDs', async () => {
    const mockShows = [
      {
        show: {
          id: 975,
          name: 'Batman',
          genres: ['Action', 'Adventure'],
          rating: { average: 7.8 },
          image: { original: 'https://static.tvmaze.com/batman.jpg' },
          summary: '<p>Bruce Wayne fights crime in Gotham.</p>',
          premiered: '1966-01-12',
          runtime: 30,
        },
      },
    ];

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockShows,
    });

    const movies = await fetchCatalogMovies({ query: 'Batman' });
    expect(movies.length).toBe(1);
    expect(movies[0].id).toBe('tvm-975');
    expect(movies[0].title).toBe('Batman');
    expect(movies[0].rating).toBe(7.8);
    expect(movies[0].source).toBe('tvmaze');
    expect(movies[0].synopsis).toBe('Bruce Wayne fights crime in Gotham.');
  });

  it('fetchMovieById retrieves a tvm- movie by fetching show details from TVMaze', async () => {
    const mockDetail = {
      id: 975,
      name: 'Batman',
      genres: ['Action', 'Adventure'],
      rating: { average: 7.8 },
      image: { original: 'https://static.tvmaze.com/batman.jpg' },
      summary: '<p>Gotham protector.</p>',
      runtime: 30,
      _embedded: {
        cast: [
          { person: { name: 'Adam West' }, character: { name: 'Batman' } },
        ],
      },
    };

    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockDetail,
      })
      .mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

    const movie = await fetchMovieById('tvm-975');
    expect(movie).toBeDefined();
    expect(movie?.id).toBe('tvm-975');
    expect(movie?.cast).toContain('Adam West');
  });

  it('resolveTrailer returns a matching trailer for a title from KinoCheck', async () => {
    const mockKinoCheck = {
      '0': {
        id: 'abc',
        title: 'The Batman Official Trailer',
        youtube_video_id: 'mqqft2x_Aa4',
        thumbnail: 'https://cdn.kinocheck.com/thumb.jpg',
      },
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockKinoCheck,
    });

    const trailerKey = await resolveTrailer('Batman');
    expect(trailerKey).toBe('mqqft2x_Aa4');
  });

  it('handles network failure gracefully without throwing errors', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network offline'));

    const trailers = await fetchLiveTrailers();
    expect(trailers).toBeDefined();
    expect(Array.isArray(trailers)).toBe(true);

    const catalog = await fetchCatalogMovies({ query: 'test' });
    expect(catalog).toBeDefined();
    expect(Array.isArray(catalog)).toBe(true);
  });
});
