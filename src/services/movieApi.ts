import { Movie, TrailerItem } from '@/types/movie';
import { curatedMovies } from '@/data/curatedMovies';

export interface FilterCriteria {
  genres?: string[];
  ageRating?: '18+' | 'All Ages';
  venue?: 'cinema' | 'home' | 'both';
  searchQuery?: string;
  upcomingOnly?: boolean;
}

export function getCuratedMovies(): Movie[] {
  return curatedMovies;
}

export function getMovieById(id: string): Movie | undefined {
  return curatedMovies.find((m) => m.id === id);
}

export function filterMoviesByCriteria(criteria: FilterCriteria): Movie[] {
  return curatedMovies.filter((movie) => {
    // Genres filter: if provided, movie must contain all specified genres (intersection)
    if (criteria.genres && criteria.genres.length > 0) {
      const hasAllGenres = criteria.genres.every((g) =>
        movie.genres.some((mg) => mg.toLowerCase() === g.toLowerCase())
      );
      if (!hasAllGenres) return false;
    }

    // Age rating filter
    if (criteria.ageRating && movie.ageRating !== criteria.ageRating) {
      return false;
    }

    // Venue filter: if looking for cinema, include cinema & both
    if (criteria.venue && criteria.venue !== 'both') {
      if (criteria.venue === 'cinema' && movie.venue === 'home') return false;
      if (criteria.venue === 'home' && movie.venue === 'cinema') return false;
    }

    // Upcoming only filter
    if (criteria.upcomingOnly && !movie.upcoming) {
      return false;
    }

    // Text search query
    if (criteria.searchQuery) {
      const q = criteria.searchQuery.toLowerCase();
      const titleMatch = movie.title.toLowerCase().includes(q);
      const genreMatch = movie.genres.some((g) => g.toLowerCase().includes(q));
      const platformMatch = movie.platforms.some((p) => p.toLowerCase().includes(q));
      if (!titleMatch && !genreMatch && !platformMatch) return false;
    }

    return true;
  });
}

/**
 * Fetches real live video trailers from KinoCheck's public API.
 * Falls back to curated items if network is unavailable or fails.
 */
export async function fetchLiveTrailers(): Promise<TrailerItem[]> {
  try {
    const res = await fetch('https://api.kinocheck.com/trailers/recommended?language=en', {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`KinoCheck responded with status ${res.status}`);
    }

    const data = await res.json();
    const items: TrailerItem[] = [];

    // KinoCheck returns an object keyed by indexes "0", "1", ...
    const rawList = Array.isArray(data) ? data : Object.values(data);

    for (const item of rawList) {
      const record = item as {
        id?: string;
        title?: string;
        youtube_video_id?: string;
        thumbnail?: string;
        youtube_thumbnail?: string;
        genres?: string[];
        views?: number;
        published?: string;
      };

      if (record && record.youtube_video_id) {
        items.push({
          id: record.id || Math.random().toString(),
          title: record.title || 'Cinema Premiere Trailer',
          youtubeVideoId: record.youtube_video_id,
          thumbnailUrl:
            record.youtube_thumbnail ||
            record.thumbnail ||
            'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
          genres: record.genres || ['Action', 'Thriller'],
          views: record.views || 100000,
          publishedAt: record.published,
        });
      }
    }

    if (items.length > 0) {
      return items.slice(0, 12);
    }
  } catch (error) {
    // Graceful fallback to curated trailers
  }

  // Fallback trailers from curated collection
  return curatedMovies
    .filter((m) => m.youtubeTrailerKey)
    .slice(0, 10)
    .map((m) => ({
      id: m.id,
      title: `${m.title} - Official Trailer`,
      youtubeVideoId: m.youtubeTrailerKey,
      thumbnailUrl: m.posterUrl,
      genres: m.genres,
      views: 350000,
      publishedAt: '2026',
    }));
}
