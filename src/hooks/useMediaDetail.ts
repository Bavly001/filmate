import { useQuery } from '@tanstack/react-query';
import { getMovieById, getTvShowById, getMovies } from '@/services/mediaApi';
import { MovieDetail, MovieItem } from '@/types/tmdb';

export function useMovieDetail(id?: string | number) {
  const idStr = id ? String(id) : '';

  const movieQuery = useQuery<MovieDetail>({
    queryKey: ['movie', idStr],
    queryFn: () => getMovieById(idStr),
    enabled: Boolean(idStr),
    staleTime: 5 * 60 * 1000,
  });

  const similarQuery = useQuery<MovieItem[]>({
    queryKey: ['movie-similar', idStr],
    queryFn: () => getMovies(`movie/${idStr}/similar`),
    enabled: Boolean(idStr),
    staleTime: 5 * 60 * 1000,
  });

  return {
    movie: movieQuery.data,
    similarMovies: similarQuery.data || [],
    isLoading: movieQuery.isLoading,
    isError: movieQuery.isError,
    error: movieQuery.error,
    refetch: movieQuery.refetch,
  };
}

export function useTvShowDetail(id?: string | number) {
  const idStr = id ? String(id) : '';

  const showQuery = useQuery<MovieDetail>({
    queryKey: ['tv-show', idStr],
    queryFn: () => getTvShowById(idStr),
    enabled: Boolean(idStr),
    staleTime: 5 * 60 * 1000,
  });

  const similarQuery = useQuery<MovieItem[]>({
    queryKey: ['tv-show-similar', idStr],
    queryFn: () => getMovies(`tv/${idStr}/similar`),
    enabled: Boolean(idStr),
    staleTime: 5 * 60 * 1000,
  });

  return {
    show: showQuery.data,
    similarShows: similarQuery.data || [],
    isLoading: showQuery.isLoading,
    isError: showQuery.isError,
    error: showQuery.error,
    refetch: showQuery.refetch,
  };
}
