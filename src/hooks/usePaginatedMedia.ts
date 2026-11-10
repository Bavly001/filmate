import { useQuery } from '@tanstack/react-query';
import { discoverMedia, DiscoverParams, PaginatedResponse } from '@/services/mediaApi';

interface UsePaginatedMediaOptions extends DiscoverParams {
  initialData?: PaginatedResponse;
}

export function usePaginatedMedia({
  type,
  filter = 'popular',
  genre,
  sortBy = 'popularity.desc',
  year,
  query,
  page = 1,
  initialData,
}: UsePaginatedMediaOptions) {
  return useQuery<PaginatedResponse>({
    queryKey: ['media', type, filter, genre, sortBy, year, query, page],
    queryFn: () =>
      discoverMedia({
        type,
        filter,
        genre,
        sortBy,
        year,
        query,
        page,
      }),
    initialData,
    staleTime: 60 * 1000,
  });
}
