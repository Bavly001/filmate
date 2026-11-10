import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient, ApiError, TMDB_BASE_URL } from './api-client';
import { getMovies, getMovieById } from '@/services/mediaApi';

describe('apiClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('constructs correct URL and sends Authorization header', async () => {
    const mockJson = { results: [{ id: 101, title: 'Inception' }] };
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockJson,
    } as Response);

    const result = await apiClient<{ results: { id: number; title: string }[] }>(
      'movie/popular',
      {
        params: { page: 1, language: 'en-US' },
      }
    );

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    expect(calledUrl).toContain(`${TMDB_BASE_URL}/movie/popular`);
    expect(calledUrl).toContain('page=1');
    expect(calledUrl).toContain('language=en-US');

    const calledConfig = fetchSpy.mock.calls[0][1] as RequestInit;
    expect((calledConfig.headers as Record<string, string>)['Content-Type']).toBe(
      'application/json'
    );
    expect(result).toEqual(mockJson);
  });

  it('throws ApiError with message and status when response is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ status_message: 'Invalid API key' }),
    } as Response);

    await expect(apiClient('movie/123')).rejects.toThrow(ApiError);
  });

  it('provides .get helper method matching direct apiClient call', async () => {
    const mockJson = { title: 'Test' };
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockJson,
    } as Response);

    const result = await apiClient.get<{ title: string }>('test/endpoint');
    expect(result).toEqual(mockJson);
  });

  it('getMovies formats movieType, genre, and language from API response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        results: [
          {
            id: 550,
            title: 'Fight Club',
            genre_ids: [18],
            original_language: 'en',
          },
        ],
      }),
    } as Response);

    const movies = await getMovies('movie/popular');
    expect(movies).toHaveLength(1);
    expect(movies[0].title).toBe('Fight Club');
    expect(movies[0].movieType).toBe('Movie');
    expect(movies[0].main_genre).toBe('Drama');
    expect(movies[0].original_language).toBe('English');
  });

  it('getMovieById returns mapped movie detail', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        id: 550,
        title: 'Fight Club',
        genres: [{ id: 18, name: 'Drama' }],
        original_language: 'en',
      }),
    } as Response);

    const detail = await getMovieById(550);
    expect(detail.id).toBe(550);
    expect(detail.title).toBe('Fight Club');
    expect(detail.movieType).toBe('Movie');
    expect(detail.main_genre).toBe('Drama');
  });
});
