export type StreamingPlatform =
  | 'Netflix'
  | 'Prime Video'
  | 'Disney+'
  | 'HBO Max'
  | 'Apple TV+'
  | 'Hulu'
  | 'Paramount+'
  | 'Cinema IMAX'
  | 'In Cinemas'
  | string;

export type AgeRating = '18+' | 'All Ages';

export type VenueType = 'cinema' | 'home' | 'both';

export type CompanyType = 'solo' | 'partner' | 'family' | 'friends';

export type MovieSource = 'kinocheck' | 'tvmaze' | 'tmdb';

export interface Movie {
  id: string; // Prefixed: kc-*, tvm-*, tmdb-*
  title: string;
  year?: number | string;
  rating: number; // e.g. 8.8
  posterUrl: string;
  backdropUrl?: string;
  genres: string[]; // e.g. ['Action', 'Sci-Fi']
  platforms?: StreamingPlatform[];
  ageRating?: AgeRating;
  venue?: VenueType;
  synopsis?: string;
  overview?: string; // Alias for synopsis
  youtubeTrailerKey?: string;
  youtubeVideoId?: string;
  source: MovieSource;
  cast?: string[];
  runtime?: number;
  duration?: string;
  director?: string;
  featured?: boolean;
  views?: number;
}

export interface TrailerItem {
  id: string;
  title: string;
  youtubeVideoId: string;
  thumbnailUrl: string;
  genres: string[];
  views?: number;
  publishedAt?: string;
}

export interface FilterCriteria {
  genres?: string[];
  ageRating?: AgeRating;
  venue?: VenueType;
  searchQuery?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'mate';
  text: string;
  timestamp: string;
  recommendation?: Movie;
}

export interface MatePreferences {
  moods: string[];
  company?: CompanyType;
  venue?: VenueType;
  ageRating?: AgeRating;
  searchQuery?: string;
}

export type MateStep =
  | 'idle'
  | 'chatting'
  | 'analyzing'
  | 'result'
  | 'exhausted';
