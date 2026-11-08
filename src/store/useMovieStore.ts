import { create } from 'zustand';
import { Movie } from '@/types/movie';

interface MovieState {
  searchQuery: string;
  selectedCategory: string; // 'all' | 'cinema' | 'upcoming' | 'action' | 'comedy' | etc.
  activeTrailerKey: string | null;
  selectedMovieForModal: Movie | null;

  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  openTrailerModal: (trailerKey: string, movie?: Movie) => void;
  closeTrailerModal: () => void;
}

export const useMovieStore = create<MovieState>((set) => ({
  searchQuery: '',
  selectedCategory: 'all',
  activeTrailerKey: null,
  selectedMovieForModal: null,

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  openTrailerModal: (activeTrailerKey, movie) =>
    set({
      activeTrailerKey,
      selectedMovieForModal: movie || null,
    }),
  closeTrailerModal: () =>
    set({
      activeTrailerKey: null,
      selectedMovieForModal: null,
    }),
}));
