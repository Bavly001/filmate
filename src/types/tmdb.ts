export interface Genre {
  id: number;
  name: string;
}

export interface Language {
  iso_639_1: string;
  english_name: string;
  name: string;
}

export interface MovieItem {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count?: number;
  popularity?: number;
  genre_ids?: number[];
  genres?: Genre[];
  original_language?: string;
  movieType?: 'Movie' | 'TV Show';
  main_genre?: string;
  link?: boolean;
}

export interface MovieDetail extends MovieItem {
  tagline?: string;
  runtime?: number;
  status?: string;
  budget?: number;
  revenue?: number;
}
