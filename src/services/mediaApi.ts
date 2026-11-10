import { apiClient } from './apiClient';
import { MovieItem, MovieDetail, Genre, Language } from '@/types/tmdb';
import { MOVIE_GENRES, TV_GENRES } from '@/constants/genres';

export let moviesGenreArr: Genre[] = [...MOVIE_GENRES];
export let TVSGenreArr: Genre[] = [...TV_GENRES];

export let languagesArr: Language[] = [
  { iso_639_1: 'en', english_name: 'English', name: 'English' },
  { iso_639_1: 'ja', english_name: 'Japanese', name: '日本語' },
  { iso_639_1: 'ko', english_name: 'Korean', name: '한국어/조선말' },
  { iso_639_1: 'fr', english_name: 'French', name: 'Français' },
  { iso_639_1: 'es', english_name: 'Spanish', name: 'Español' },
  { iso_639_1: 'de', english_name: 'German', name: 'Deutsch' },
  { iso_639_1: 'it', english_name: 'Italian', name: 'Italiano' },
  { iso_639_1: 'ar', english_name: 'Arabic', name: 'العربية' },
];

export function getGenreById(id?: number, TVS?: boolean): string {
  if (!id) return TVS ? 'TV Series' : 'Movie';
  if (TVS) {
    return TVSGenreArr.find((genre) => genre.id === id)?.name || 'TV Series';
  }
  return moviesGenreArr.find((genre) => genre.id === id)?.name || 'Movie';
}

export function getLanguageByISO(iso?: string): string {
  if (!iso) return 'English';
  return (
    languagesArr.find((language) => language.iso_639_1 === iso)?.english_name ||
    iso
  );
}

export interface PaginatedResponse {
  results: MovieItem[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface DiscoverParams {
  type?: 'movie' | 'tv';
  filter?: string;
  genre?: string;
  sortBy?: string;
  year?: string;
  query?: string;
  page?: number;
}

export async function getMovieById(id: string | number): Promise<MovieDetail> {
  try {
    const data = await apiClient<MovieDetail>(`movie/${id}`);
    return {
      ...data,
      movieType: 'Movie',
      main_genre: data.genres?.[0]?.name || 'Movie',
      original_language:
        getLanguageByISO(data.original_language) ?? data.original_language,
    };
  } catch {
    return {
      id: Number(id),
      title: 'Movie Not Found',
      overview: 'Could not load details for this title.',
      vote_average: 0,
    };
  }
}

export async function getTvShowById(id: string | number): Promise<MovieDetail> {
  try {
    const data = await apiClient<MovieDetail>(`tv/${id}`);
    return {
      ...data,
      movieType: 'TV Show',
      title: data.name,
      main_genre: data.genres?.[0]?.name || 'TV Series',
      original_language:
        getLanguageByISO(data.original_language) ?? data.original_language,
    };
  } catch {
    return {
      id: Number(id),
      name: 'TV Show Not Found',
      title: 'TV Show Not Found',
      overview: 'Could not load details for this title.',
      vote_average: 0,
      movieType: 'TV Show',
    };
  }
}

export async function searchMulti(
  query: string,
  signal?: AbortSignal
): Promise<MovieItem[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 3) return [];

  try {
    const data = await apiClient<{
      results: (MovieItem & { media_type?: string })[];
    }>('search/multi', {
      params: {
        query: trimmed,
        include_adult: false,
        page: 1,
      },
      signal,
    });

    return (
      data?.results
        ?.filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
        ?.map((item) => {
          const isTV = item.media_type === 'tv';
          return {
            ...item,
            movieType: isTV ? ('TV Show' as const) : ('Movie' as const),
            title: isTV ? item.name : item.title,
            release_date: isTV ? item.first_air_date : item.release_date,
            main_genre: getGenreById(item.genre_ids?.[0], isTV),
            original_language:
              getLanguageByISO(item.original_language) ?? item.original_language,
          };
        }) || []
    );
  } catch {
    return [];
  }
}

export async function discoverMedia(
  {
    type = 'movie',
    filter = 'popular',
    genre,
    sortBy = 'popularity.desc',
    year,
    query,
    page = 1,
  }: DiscoverParams,
  signal?: AbortSignal
): Promise<PaginatedResponse> {
  const isTV = type === 'tv';
  const trimmedQuery = query?.trim();

  // 1. Text search
  if (trimmedQuery && trimmedQuery.length >= 3) {
    const searchEndpoint = isTV ? 'search/tv' : 'search/movie';
    try {
      const data = await apiClient<{
        page: number;
        results: MovieItem[];
        total_pages: number;
        total_results: number;
      }>(searchEndpoint, {
        params: {
          query: trimmedQuery,
          page,
          include_adult: false,
          ...(year ? (isTV ? { first_air_date_year: year } : { primary_release_year: year }) : {}),
        },
        signal,
      });

      let results = (data?.results || []).map((item) => ({
        ...item,
        movieType: isTV ? ('TV Show' as const) : ('Movie' as const),
        title: isTV ? item.name : item.title,
        release_date: isTV ? item.first_air_date : item.release_date,
        main_genre: getGenreById(item.genre_ids?.[0], isTV),
        original_language:
          getLanguageByISO(item.original_language) ?? item.original_language,
      }));

      if (genre) {
        const genreId = parseInt(genre, 10);
        if (!isNaN(genreId)) {
          results = results.filter((i) => i.genre_ids?.includes(genreId));
        }
      }

      if (sortBy === 'vote_average.desc') {
        results.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
      } else if (sortBy === 'primary_release_date.desc') {
        results.sort((a, b) => {
          const dateA = new Date(a.release_date || '').getTime() || 0;
          const dateB = new Date(b.release_date || '').getTime() || 0;
          return dateB - dateA;
        });
      } else if (sortBy === 'title.asc') {
        results.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      }

      return {
        results,
        page: data?.page || page,
        total_pages: Math.min(data?.total_pages || 1, 500),
        total_results: data?.total_results || 0,
      };
    } catch {
      return { results: [], page, total_pages: 1, total_results: 0 };
    }
  }

  // 2. Discover endpoint with filtering
  const isDiscover = Boolean(
    genre ||
    year ||
    (sortBy && sortBy !== 'popularity.desc') ||
    filter === 'discover'
  );

  if (isDiscover) {
    const discoverEndpoint = isTV ? 'discover/tv' : 'discover/movie';
    const params: Record<string, string | number> = {
      page,
      sort_by: sortBy || 'popularity.desc',
      include_adult: 'false',
    };

    if (sortBy === 'vote_average.desc') {
      params['vote_count.gte'] = isTV ? 20 : 50;
    }

    if (genre) {
      params.with_genres = genre;
    }

    if (year) {
      if (year === 'classic') {
        if (isTV) {
          params['first_air_date.lte'] = '1999-12-31';
        } else {
          params['primary_release_date.lte'] = '1999-12-31';
        }
      } else if (year === '2010s') {
        if (isTV) {
          params['first_air_date.gte'] = '2010-01-01';
          params['first_air_date.lte'] = '2019-12-31';
        } else {
          params['primary_release_date.gte'] = '2010-01-01';
          params['primary_release_date.lte'] = '2019-12-31';
        }
      } else {
        if (isTV) {
          params.first_air_date_year = year;
        } else {
          params.primary_release_year = year;
        }
      }
    }

    try {
      const data = await apiClient<{
        page: number;
        results: MovieItem[];
        total_pages: number;
        total_results: number;
      }>(discoverEndpoint, { params, signal });

      const results = (data?.results || []).map((movie) => ({
        ...movie,
        movieType: isTV ? ('TV Show' as const) : ('Movie' as const),
        title: isTV ? movie.name : movie.title,
        release_date: isTV ? movie.first_air_date : movie.release_date,
        main_genre: getGenreById(movie.genre_ids?.[0], isTV),
        original_language:
          getLanguageByISO(movie.original_language) ?? movie.original_language,
      }));

      return {
        results,
        page: data?.page || page,
        total_pages: Math.min(data?.total_pages || 1, 500),
        total_results: data?.total_results || 0,
      };
    } catch {
      return { results: [], page, total_pages: 1, total_results: 0 };
    }
  }

  // 3. Category presets
  let endpoint = isTV ? 'tv/popular' : 'movie/popular';
  if (isTV) {
    if (filter === 'top_rated') endpoint = 'tv/top_rated';
    else if (filter === 'on_the_air') endpoint = 'tv/on_the_air';
    else if (filter === 'airing_today') endpoint = 'tv/airing_today';
  } else {
    if (filter === 'trending') endpoint = 'trending/movie/day';
    else if (filter === 'top_rated') endpoint = 'movie/top_rated';
    else if (filter === 'now_playing') endpoint = 'movie/now_playing';
    else if (filter === 'upcoming') endpoint = 'movie/upcoming';
  }

  return getPaginatedMedia(endpoint, page, signal);
}

export async function getPaginatedMedia(
  endpoint: string,
  page = 1,
  signal?: AbortSignal
): Promise<PaginatedResponse> {
  const isTV = endpoint.includes('tv');
  try {
    const data = await apiClient<{
      page: number;
      results: MovieItem[];
      total_pages: number;
      total_results: number;
    }>(endpoint, {
      params: { page },
      signal,
    });

    const results =
      data?.results?.map((movie) => ({
        ...movie,
        movieType: isTV ? ('TV Show' as const) : ('Movie' as const),
        main_genre: getGenreById(movie.genre_ids?.[0], isTV),
        original_language:
          getLanguageByISO(movie.original_language) ?? movie.original_language,
      })) || [];

    return {
      results,
      page: data?.page || page,
      total_pages: Math.min(data?.total_pages || 1, 500),
      total_results: data?.total_results || 0,
    };
  } catch {
    return {
      results: [],
      page,
      total_pages: 1,
      total_results: 0,
    };
  }
}

export async function getMovies(
  link: string,
  signal?: AbortSignal
): Promise<MovieItem[]> {
  const isTV = link.includes('tv');
  try {
    const data = await apiClient<{ results: MovieItem[] }>(link, { signal });
    return (
      data?.results?.map((movie) => ({
        ...movie,
        movieType: isTV ? 'TV Show' : 'Movie',
        main_genre: getGenreById(movie.genre_ids?.[0], isTV),
        original_language:
          getLanguageByISO(movie.original_language) ?? movie.original_language,
      })) || []
    );
  } catch {
    return [];
  }
}

export interface MateDiscoverParams {
  genres?: number[];
  withoutGenres?: number[];
  company?: string;
  ageRating?: string;
  era?: string;
  runtime?: string;
  rating?: string;
  languages?: string[];
  page?: number;
}

export async function discoverMateMedia(
  params: MateDiscoverParams,
  signal?: AbortSignal
): Promise<MovieItem[]> {
  const {
    genres = [],
    withoutGenres = [],
    company,
    ageRating,
    era,
    runtime,
    rating,
    languages = [],
    page = 1,
  } = params;

  const queryParams: Record<string, string | number> = {
    page,
    sort_by: 'popularity.desc',
    include_adult: 'false',
    include_video: 'false',
  };

  if (Array.isArray(genres) && genres.length > 0) {
    queryParams.with_genres = genres.join(',');
  }

  const excludeGenres = [...(withoutGenres || [])];
  if (company === 'family' || ageRating === 'family') {
    if (!excludeGenres.includes(27)) excludeGenres.push(27);
  }
  if (excludeGenres.length > 0) {
    queryParams.without_genres = excludeGenres.join(',');
  }

  if (era === '2020+') {
    queryParams['primary_release_date.gte'] = '2020-01-01';
  } else if (era === '2010s') {
    queryParams['primary_release_date.gte'] = '2010-01-01';
    queryParams['primary_release_date.lte'] = '2019-12-31';
  } else if (era === '2000s') {
    queryParams['primary_release_date.gte'] = '2000-01-01';
    queryParams['primary_release_date.lte'] = '2009-12-31';
  } else if (era === '90s') {
    queryParams['primary_release_date.gte'] = '1990-01-01';
    queryParams['primary_release_date.lte'] = '1999-12-31';
  } else if (era === 'retro') {
    queryParams['primary_release_date.lte'] = '1989-12-31';
  }

  if (runtime === 'quick') {
    queryParams['with_runtime.lte'] = 95;
  } else if (runtime === 'standard') {
    queryParams['with_runtime.gte'] = 95;
    queryParams['with_runtime.lte'] = 130;
  } else if (runtime === 'epic') {
    queryParams['with_runtime.gte'] = 135;
  }

  if (rating === 'masterpiece') {
    queryParams['vote_average.gte'] = 7.8;
    queryParams['vote_count.gte'] = 800;
    queryParams.sort_by = 'vote_average.desc';
  } else if (rating === 'crowd_pleaser') {
    queryParams['vote_average.gte'] = 7.0;
    queryParams['vote_count.gte'] = 300;
    queryParams.sort_by = 'popularity.desc';
  } else if (rating === 'blockbuster') {
    queryParams['vote_count.gte'] = 1500;
    queryParams.sort_by = 'popularity.desc';
  } else {
    queryParams['vote_count.gte'] = 100;
  }

  if (Array.isArray(languages) && languages.length > 0) {
    queryParams.with_original_language = languages.join('|');
  }

  if (company === 'family' || ageRating === 'family') {
    queryParams.certification_country = 'US';
    queryParams['certification.lte'] = 'PG';
  } else if (ageRating === 'teens') {
    queryParams.certification_country = 'US';
    queryParams['certification.lte'] = 'PG-13';
  } else if (ageRating === 'mature') {
    queryParams.certification_country = 'US';
    queryParams.certification = 'R';
  }

  try {
    const data = await apiClient<{ results: MovieItem[] }>(
      'discover/movie',
      {
        params: queryParams,
        signal,
      }
    );

    return (data?.results || []).filter(
      (m) => Boolean(m.poster_path) && Boolean(m.overview)
    );
  } catch {
    return [];
  }
}

export async function getGenres(): Promise<void> {
  try {
    const [tvData, movieData] = await Promise.all([
      apiClient<{ genres: Genre[] }>('genre/tv/list'),
      apiClient<{ genres: Genre[] }>('genre/movie/list'),
    ]);
    if (tvData?.genres?.length) TVSGenreArr = tvData.genres;
    if (movieData?.genres?.length) moviesGenreArr = movieData.genres;
  } catch {
    // fallback lists already defined
  }
}

export async function getLanguages(): Promise<void> {
  try {
    const data = await apiClient<Language[]>('configuration/languages');
    if (data?.length) languagesArr = data;
  } catch {
    // fallback list already defined
  }
}
