export type StreamingPlatform =
  | 'Netflix'
  | 'Prime Video'
  | 'Disney+'
  | 'HBO Max'
  | 'Apple TV+'
  | 'Hulu'
  | 'Cinema IMAX'
  | 'In Cinemas';

export type AgeRating = '18+' | 'All Ages';

export type VenueType = 'cinema' | 'home' | 'both';

export type CompanyType = 'solo' | 'partner' | 'family' | 'friends';

export interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number; // e.g. 8.8
  posterUrl: string;
  backdropUrl?: string;
  genres: string[]; // e.g. ['Action', 'Sci-Fi']
  platforms: StreamingPlatform[];
  ageRating: AgeRating;
  venue: VenueType;
  synopsis: string;
  youtubeTrailerKey: string;
  duration?: string;
  director?: string;
  featured?: boolean;
  upcoming?: boolean;
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

export interface MatePreferences {
  moods: string[];
  company: CompanyType;
  venue: VenueType;
  ageRating: AgeRating;
}

export type MateStep =
  | 'idle'
  | 'mood'
  | 'context'
  | 'analyzing'
  | 'result'
  | 'exhausted';
