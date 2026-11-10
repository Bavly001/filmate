import { useQuery } from '@tanstack/react-query';
import { getMovies } from '@/services/mediaApi';
import { MovieItem } from '@/types/tmdb';

export function useCategoryMedia(endpoint?: string) {
  return useQuery<MovieItem[]>({
    queryKey: ['category', endpoint],
    queryFn: () => (endpoint ? getMovies(endpoint) : Promise.resolve([])),
    enabled: Boolean(endpoint),
    staleTime: 5 * 60 * 1000,
  });
}
