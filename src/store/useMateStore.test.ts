import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useMateStore } from './useMateStore';

describe('Mate Recommendation Engine & Store', () => {
  beforeEach(() => {
    useMateStore.getState().resetQuiz();
  });

  it('initializes with default quiz state and empty seen list', () => {
    const state = useMateStore.getState();
    expect(state.step).toBe('idle');
    expect(state.isDrawerOpen).toBe(false);
    expect(state.preferences.moods).toEqual([]);
    expect(state.seenMovieIds).toEqual([]);
    expect(state.currentRecommendation).toBeNull();
  });

  it('toggles mood choices in and out', () => {
    const store = useMateStore.getState();
    store.toggleMood('Action');
    expect(useMateStore.getState().preferences.moods).toContain('Action');

    store.toggleMood('Comedy');
    expect(useMateStore.getState().preferences.moods).toEqual(['Action', 'Comedy']);

    store.toggleMood('Action');
    expect(useMateStore.getState().preferences.moods).toEqual(['Comedy']);
  });

  it('enforces All Ages if Family company is selected', () => {
    const store = useMateStore.getState();
    store.setAgeRating('18+');
    expect(useMateStore.getState().preferences.ageRating).toBe('18+');

    store.setCompany('family');
    expect(useMateStore.getState().preferences.company).toBe('family');
    expect(useMateStore.getState().preferences.ageRating).toBe('All Ages');
  });

  it('computes recommendation matching chosen moods', () => {
    const store = useMateStore.getState();
    store.toggleMood('Sci-Fi');
    store.computeRecommendation();

    const state = useMateStore.getState();
    expect(state.currentRecommendation).not.toBeNull();
    expect(state.currentRecommendation?.genres).toContain('Sci-Fi');
    expect(state.seenMovieIds).toContain(state.currentRecommendation?.id);
  });

  it('excludes rejected movie and delivers a different candidate', () => {
    const store = useMateStore.getState();
    store.toggleMood('Action');
    store.computeRecommendation();

    const firstMovie = useMateStore.getState().currentRecommendation;
    expect(firstMovie).not.toBeNull();

    store.rejectRecommendation();
    const secondMovie = useMateStore.getState().currentRecommendation;

    expect(useMateStore.getState().seenMovieIds).toContain(firstMovie!.id);
    if (secondMovie) {
      expect(secondMovie.id).not.toBe(firstMovie!.id);
    }
  });

  it('relaxes categories by removing the last category when pool exhausts', () => {
    useMateStore.setState({
      activeCategories: ['Action', 'Comedy', 'Romance'],
    });

    const store = useMateStore.getState();
    store.relaxCategories();
    expect(useMateStore.getState().activeCategories).toEqual(['Action', 'Comedy']);

    store.relaxCategories();
    expect(useMateStore.getState().activeCategories).toEqual(['Action']);
  });

  it('handles simulated deep analysis loader timing', async () => {
    vi.useFakeTimers();
    const store = useMateStore.getState();
    store.toggleMood('Drama');

    const analysisPromise = store.startAnalysis(2500);
    expect(useMateStore.getState().step).toBe('analyzing');

    vi.advanceTimersByTime(2600);
    await analysisPromise;

    expect(useMateStore.getState().step).toBe('result');
    expect(useMateStore.getState().currentRecommendation).not.toBeNull();
    vi.useRealTimers();
  });
});
