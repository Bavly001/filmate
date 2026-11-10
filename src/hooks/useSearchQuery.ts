import { useQuery } from '@tanstack/react-query';
import { searchMulti } from '@/services/mediaApi';
import { MovieItem } from '@/types/tmdb';

export function useSearchQuery(query: string) {
  const trimmed = query.trim();

  return useQuery<{ results: MovieItem[] }>({
    queryKey: ['search', trimmed],
    queryFn: async () => {
      const results = await searchMulti(trimmed);
      return { results };
    },
    enabled: trimmed.length >= 3,
    staleTime: 5 * 60 * 1000,
  });
}
