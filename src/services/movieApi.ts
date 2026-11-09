import { Movie, TrailerItem, FilterCriteria } from '@/types/movie';

const KINOCHECK_API_URL = 'https://api.kinocheck.com/trailers/recommended?language=en';
const TVMAZE_API_URL = 'https://api.tvmaze.com';

function stripHtml(html?: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').trim();
}

/**
 * Fetches live video trailers from KinoCheck's public API.
 */
export async function fetchLiveTrailers(): Promise<TrailerItem[]> {
  try {
    const res = await fetch(KINOCHECK_API_URL, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`KinoCheck responded with status ${res.status}`);
    }

    const data = await res.json();
    const rawList = Array.isArray(data) ? data : Object.values(data);
    const items: TrailerItem[] = [];

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
          id: record.id?.startsWith('kc-') ? record.id : `kc-${record.id || Math.random().toString()}`,
          title: record.title || 'Cinema Premiere Trailer',
          youtubeVideoId: record.youtube_video_id,
          thumbnailUrl:
            record.youtube_thumbnail ||
            record.thumbnail ||
            `https://img.youtube.com/vi/${record.youtube_video_id}/maxresdefault.jpg`,
          genres: record.genres || ['Cinema', 'Trailer'],
          views: record.views || 100000,
          publishedAt: record.published,
        });
      }
    }

    return items;
  } catch (error) {
    console.error('Error in fetchLiveTrailers:', error);
    return [];
  }
}

/**
 * Fetches a featured cinema title for the Hero Banner showcase.
 */
export async function fetchHeroShowcase(): Promise<Movie | null> {
  try {
    const trailers = await fetchLiveTrailers();
    if (trailers.length > 0) {
      const topTrailer = trailers[0];
      return {
        id: topTrailer.id,
        title: topTrailer.title,
        rating: 8.8,
        posterUrl: topTrailer.thumbnailUrl,
        backdropUrl: `https://img.youtube.com/vi/${topTrailer.youtubeVideoId}/maxresdefault.jpg`,
        genres: topTrailer.genres.length > 0 ? topTrailer.genres : ['Action', 'Sci-Fi'],
        source: 'kinocheck',
        youtubeVideoId: topTrailer.youtubeVideoId,
        youtubeTrailerKey: topTrailer.youtubeVideoId,
        synopsis: 'Experience the newest blockbuster premiere in ultra high fidelity.',
        venue: 'cinema',
        platforms: ['Cinema IMAX', 'WatchIT'],
        views: topTrailer.views,
      };
    }

    // Fallback showcase from TVMaze
    const tvShows = await fetchCatalogMovies({ query: 'Dune' });
    if (tvShows.length > 0) {
      return tvShows[0];
    }

    return null;
  } catch (error) {
    console.error('Error in fetchHeroShowcase:', error);
    return null;
  }
}

/**
 * Fetches the Top 10 Box Office shelf titles.
 */
export async function fetchTop10BoxOffice(): Promise<Movie[]> {
  try {
    const trailers = await fetchLiveTrailers();
    // Sort trailers by views or take top 10
    const sorted = [...trailers].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 10);

    if (sorted.length > 0) {
      return sorted.map((t, idx) => ({
        id: t.id,
        title: t.title.replace(/\s*(Official\s*)?(Final\s*)?Trailer.*$/i, '').trim() || t.title,
        rating: Number((8.9 - idx * 0.1).toFixed(1)),
        posterUrl: t.thumbnailUrl,
        backdropUrl: `https://img.youtube.com/vi/${t.youtubeVideoId}/maxresdefault.jpg`,
        genres: t.genres.length > 0 ? t.genres : ['Blockbuster'],
        source: 'kinocheck',
        youtubeVideoId: t.youtubeVideoId,
        youtubeTrailerKey: t.youtubeVideoId,
        synopsis: `Rank #${idx + 1} cinema blockbuster sensation.`,
        venue: 'cinema',
        platforms: ['Cinema', 'WatchIT'],
        views: t.views,
      }));
    }

    // Fallback to top-rated catalog items
    const catalog = await fetchCatalogMovies({ page: 0 });
    return catalog.slice(0, 10);
  } catch (error) {
    console.error('Error in fetchTop10BoxOffice:', error);
    return [];
  }
}

interface TVMazeShowItem {
  id: number;
  name: string;
  genres: string[];
  rating?: { average?: number };
  image?: { original?: string; medium?: string };
  summary?: string;
  premiered?: string;
  runtime?: number;
}

/**
 * Fetches catalog items from TVMaze API (100% free, keyless).
 */
export async function fetchCatalogMovies(options?: {
  genre?: string;
  query?: string;
  page?: number;
}): Promise<Movie[]> {
  try {
    const url = options?.query
      ? `${TVMAZE_API_URL}/search/shows?q=${encodeURIComponent(options.query)}`
      : `${TVMAZE_API_URL}/shows?page=${options?.page || 0}`;

    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`TVMaze API returned status ${res.status}`);
    }

    const data = await res.json();
    const shows: TVMazeShowItem[] = options?.query
      ? data.map((item: { show: TVMazeShowItem }) => item.show)
      : Array.isArray(data)
      ? data
      : [];

    const movies: Movie[] = shows
      .filter((s) => s && s.name && (s.image?.medium || s.image?.original))
      .map((s) => ({
        id: `tvm-${s.id}`,
        title: s.name,
        rating: s.rating?.average || 7.5,
        posterUrl: s.image?.original || s.image?.medium || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop',
        backdropUrl: s.image?.original || s.image?.medium,
        genres: s.genres?.length ? s.genres : ['Drama'],
        source: 'tvmaze' as const,
        synopsis: stripHtml(s.summary) || 'A critically acclaimed cinema experience.',
        year: s.premiered ? s.premiered.substring(0, 4) : '2024',
        runtime: s.runtime || 110,
        venue: 'home' as const,
        platforms: ['WatchIT', 'Prime Video'],
        ageRating: s.rating?.average && s.rating.average >= 8 ? '18+' : 'All Ages',
      }));

    if (options?.genre) {
      const g = options.genre.toLowerCase();
      return movies.filter((m) => m.genres.some((mg) => mg.toLowerCase() === g));
    }

    return movies;
  } catch (error) {
    console.error('Error in fetchCatalogMovies:', error);
    return [];
  }
}

/**
 * Fetches movie details by prefixed ID (kc-* or tvm-* or tmdb-*).
 */
export async function fetchMovieById(id: string): Promise<Movie | null> {
  try {
    if (id.startsWith('kc-')) {
      const rawId = id.replace('kc-', '');
      const trailers = await fetchLiveTrailers();
      const match = trailers.find((t) => t.id === id || t.id === `kc-${rawId}`);
      if (match) {
        return {
          id: match.id,
          title: match.title,
          rating: 8.5,
          posterUrl: match.thumbnailUrl,
          backdropUrl: `https://img.youtube.com/vi/${match.youtubeVideoId}/maxresdefault.jpg`,
          genres: match.genres,
          source: 'kinocheck',
          youtubeVideoId: match.youtubeVideoId,
          youtubeTrailerKey: match.youtubeVideoId,
          synopsis: 'A premier cinema release presenting an immersive cinematic spectacle.',
          venue: 'cinema',
          platforms: ['Cinema IMAX', 'WatchIT'],
          views: match.views,
        };
      }
    }

    if (id.startsWith('tvm-')) {
      const tvmId = id.replace('tvm-', '');
      const res = await fetch(`${TVMAZE_API_URL}/shows/${tvmId}?embed[]=cast`, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        const castMembers: string[] = data._embedded?.cast
          ? data._embedded.cast.slice(0, 5).map((c: { person?: { name?: string } }) => c.person?.name || '').filter(Boolean)
          : [];

        // Attempt trailer resolution
        const trailerKey = await resolveTrailer(data.name);

        return {
          id: `tvm-${data.id}`,
          title: data.name,
          rating: data.rating?.average || 7.8,
          posterUrl: data.image?.original || data.image?.medium || '',
          backdropUrl: data.image?.original || data.image?.medium,
          genres: data.genres || ['Drama'],
          source: 'tvmaze',
          synopsis: stripHtml(data.summary),
          year: data.premiered ? data.premiered.substring(0, 4) : '2024',
          runtime: data.runtime || 115,
          cast: castMembers,
          youtubeVideoId: trailerKey || undefined,
          youtubeTrailerKey: trailerKey || undefined,
          venue: 'home',
          platforms: ['WatchIT', 'Prime Video'],
        };
      }
    }

    return null;
  } catch (error) {
    console.error(`Error in fetchMovieById for ${id}:`, error);
    return null;
  }
}

/**
 * Searches KinoCheck for a matching YouTube video trailer by title.
 */
export async function resolveTrailer(title: string): Promise<string | null> {
  try {
    const trailers = await fetchLiveTrailers();
    const lowerTitle = title.toLowerCase();
    const match = trailers.find((t) => {
      const lt = t.title.toLowerCase();
      return lt.includes(lowerTitle) || lowerTitle.includes(lt.split(' ')[0]);
    });

    return match ? match.youtubeVideoId : null;
  } catch (error) {
    console.error('Error in resolveTrailer:', error);
    return null;
  }
}

/**
 * In-memory / query criteria filter for live datasets.
 */
export function filterMoviesByCriteria(movies: Movie[], criteria: FilterCriteria): Movie[] {
  return movies.filter((movie) => {
    if (criteria.genres && criteria.genres.length > 0) {
      const hasAllGenres = criteria.genres.every((g) =>
        movie.genres.some((mg) => mg.toLowerCase() === g.toLowerCase())
      );
      if (!hasAllGenres) return false;
    }

    if (criteria.ageRating && movie.ageRating !== criteria.ageRating) {
      return false;
    }

    if (criteria.venue && criteria.venue !== 'both') {
      if (criteria.venue === 'cinema' && movie.venue === 'home') return false;
      if (criteria.venue === 'home' && movie.venue === 'cinema') return false;
    }

    if (criteria.searchQuery) {
      const q = criteria.searchQuery.toLowerCase();
      const titleMatch = movie.title.toLowerCase().includes(q);
      const genreMatch = movie.genres.some((g) => g.toLowerCase().includes(q));
      if (!titleMatch && !genreMatch) return false;
    }

    return true;
  });
}
