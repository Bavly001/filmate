export {
  apiClient,
  TMDB_BASE_URL,
  ImageURL,
  mediumImageURL,
  lowImageURL,
} from '@/services/apiClient';

export {
  moviesGenreArr,
  TVSGenreArr,
  languagesArr,
  getGenreById,
  getLanguageByISO,
  getMovieById,
  getTvShowById,
  searchMulti,
  discoverMedia,
  getPaginatedMedia,
  getMovies,
  discoverMateMedia,
  getGenres,
  getLanguages,
} from '@/services/mediaApi';

export type {
  PaginatedResponse,
  DiscoverParams,
  MateDiscoverParams,
} from '@/services/mediaApi';
