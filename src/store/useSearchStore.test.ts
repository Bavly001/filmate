import { describe, it, expect, beforeEach } from 'vitest';
import { useSearchStore } from './useSearchStore';

describe('useSearchStore', () => {
  beforeEach(() => {
    useSearchStore.getState().clearSearch();
    useSearchStore.getState().closeSearch();
  });

  it('initializes with default closed state and empty query', () => {
    const state = useSearchStore.getState();
    expect(state.isOpen).toBe(false);
    expect(state.query).toBe('');
    expect(state.filter).toBe('all');
    expect(state.genre).toBe('');
    expect(state.sortBy).toBe('popularity.desc');
  });

  it('opens and closes search overlay', () => {
    useSearchStore.getState().openSearch();
    expect(useSearchStore.getState().isOpen).toBe(true);

    useSearchStore.getState().closeSearch();
    expect(useSearchStore.getState().isOpen).toBe(false);
  });

  it('updates query, filter, genre, and sorting properly', () => {
    useSearchStore.getState().setQuery('Inception');
    expect(useSearchStore.getState().query).toBe('Inception');

    useSearchStore.getState().setFilter('movie');
    expect(useSearchStore.getState().filter).toBe('movie');

    useSearchStore.getState().setGenre('28');
    expect(useSearchStore.getState().genre).toBe('28');

    useSearchStore.getState().setSortBy('vote_average.desc');
    expect(useSearchStore.getState().sortBy).toBe('vote_average.desc');

    useSearchStore.getState().clearSearch();
    expect(useSearchStore.getState().query).toBe('');
    expect(useSearchStore.getState().filter).toBe('all');
    expect(useSearchStore.getState().genre).toBe('');
    expect(useSearchStore.getState().sortBy).toBe('popularity.desc');
  });
});
