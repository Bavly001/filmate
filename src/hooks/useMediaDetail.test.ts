import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMovieDetail, useTvShowDetail } from './useMediaDetail';
import * as mediaApi from '@/services/mediaApi';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useMediaDetail hooks', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('useMovieDetail fetches movie and similar movies with TanStack Query', async () => {
    vi.spyOn(mediaApi, 'getMovieById').mockResolvedValueOnce({
      id: 550,
      title: 'Fight Club',
      overview: 'Test overview',
      vote_average: 8.4,
      movieType: 'Movie',
      genres: [{ id: 18, name: 'Drama' }],
    });

    vi.spyOn(mediaApi, 'getMovies').mockResolvedValueOnce([
      {
        id: 551,
        title: 'Similar Movie',
        vote_average: 7.5,
      },
    ]);

    const { result } = renderHook(() => useMovieDetail('550'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.movie?.title).toBe('Fight Club');
    expect(result.current.similarMovies).toHaveLength(1);
    expect(result.current.similarMovies[0].title).toBe('Similar Movie');
  });

  it('useTvShowDetail fetches TV show and similar shows with TanStack Query', async () => {
    vi.spyOn(mediaApi, 'getTvShowById').mockResolvedValueOnce({
      id: 1399,
      title: 'Game of Thrones',
      name: 'Game of Thrones',
      overview: 'Seven noble families fight for control...',
      vote_average: 8.4,
      movieType: 'TV Show',
      genres: [{ id: 10765, name: 'Sci-Fi & Fantasy' }],
    });

    vi.spyOn(mediaApi, 'getMovies').mockResolvedValueOnce([
      {
        id: 1400,
        title: 'Similar Show',
        vote_average: 7.8,
      },
    ]);

    const { result } = renderHook(() => useTvShowDetail('1399'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.show?.title).toBe('Game of Thrones');
    expect(result.current.similarShows).toHaveLength(1);
    expect(result.current.similarShows[0].title).toBe('Similar Show');
  });
});
