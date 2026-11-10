import { create } from 'zustand';

interface SearchState {
  isOpen: boolean;
  query: string;
  filter: 'all' | 'movie' | 'tv';
  genre: string;
  sortBy: string;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  setQuery: (query: string) => void;
  setFilter: (filter: 'all' | 'movie' | 'tv') => void;
  setGenre: (genre: string) => void;
  setSortBy: (sortBy: string) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  isOpen: false,
  query: '',
  filter: 'all',
  genre: '',
  sortBy: 'popularity.desc',
  openSearch: () => set({ isOpen: true }),
  closeSearch: () => set({ isOpen: false }),
  toggleSearch: () => set((state) => ({ isOpen: !state.isOpen })),
  setQuery: (query) => set({ query }),
  setFilter: (filter) => set({ filter, genre: '' }), // reset genre if media type changes
  setGenre: (genre) => set({ genre }),
  setSortBy: (sortBy: string) => set({ sortBy }),
  clearSearch: () =>
    set({
      query: '',
      filter: 'all',
      genre: '',
      sortBy: 'popularity.desc',
    }),
}));
