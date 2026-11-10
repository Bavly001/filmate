import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useMateStore } from './useMateStore';
import * as mediaApi from '@/services/mediaApi';

vi.mock('@/services/mediaApi', () => ({
  discoverMateMedia: vi.fn(),
  FEELING_OPTIONS: [],
  LANGUAGE_OPTIONS: [],
}));

describe('useMateStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useMateStore.getState().resetBot();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('initializes with default state', () => {
    const state = useMateStore.getState();
    expect(state.isOpen).toBe(false);
    expect(state.step).toBe('feelings');
    expect(state.messages).toHaveLength(1);
    expect(state.messages[0].id).toBe('welcome-1');
  });

  it('handleUserNotForMe directly adds "Not for me" user message by default', async () => {
    vi.mocked(mediaApi.discoverMateMedia).mockResolvedValueOnce([]);

    const promise = useMateStore.getState().handleUserNotForMe();

    // User message should be added immediately
    const messagesAfterClick = useMateStore.getState().messages;
    const notForMeMsg = messagesAfterClick.find(
      (m) => m.role === 'user' && m.text.includes('Not for me')
    );
    expect(notForMeMsg).toBeDefined();

    await vi.runAllTimersAsync();
    await promise;
  });

  it('handleUserNotForMe(false) does NOT add "Not for me" user message', async () => {
    vi.mocked(mediaApi.discoverMateMedia).mockResolvedValueOnce([]);

    const promise = useMateStore.getState().handleUserNotForMe(false);

    const messages = useMateStore.getState().messages;
    const notForMeMsg = messages.find(
      (m) => m.role === 'user' && m.text.includes('Not for me')
    );
    expect(notForMeMsg).toBeUndefined();

    await vi.runAllTimersAsync();
    await promise;
  });

  it('when confirmLanguages has empty initial results, it broadens without adding "Not for me" user message', async () => {
    // 1st call (initial search): returns empty array []
    // 2nd call (broadened search): returns a movie
    const mockMovie = {
      id: 999,
      title: 'Broadened Movie',
      overview: 'A movie found after broadening',
      poster_path: '/poster.jpg',
      vote_average: 8.5,
      release_date: '2023-01-01',
    };

    vi.mocked(mediaApi.discoverMateMedia)
      .mockResolvedValueOnce([]) // initial call empty
      .mockResolvedValueOnce([mockMovie as any]); // broadened call succeeds

    // Setup feelings stack with 2 feelings so it can pop one to broaden
    useMateStore.setState({
      feelingStack: [
        { id: 'comedy', name: 'Comedy', genreId: 35, label: 'Comedy' },
        { id: 'scifi', name: 'Sci-Fi', genreId: 878, label: 'Sci-Fi' },
      ],
      selectedLanguages: ['en'],
    });

    const confirmPromise = useMateStore.getState().confirmLanguages();

    await vi.runAllTimersAsync();
    await confirmPromise;

    const messages = useMateStore.getState().messages;

    // Verify there is NO "Not for me" user message in the messages list
    const notForMeMsg = messages.find(
      (m) => m.role === 'user' && m.text.includes('Not for me')
    );
    expect(notForMeMsg).toBeUndefined();

    // Verify the bot recommendation message with the broadened movie was set
    const botRecMsg = messages.find((m) => m.movie?.id === 999);
    expect(botRecMsg).toBeDefined();
    expect(useMateStore.getState().currentMovie?.id).toBe(999);
  });
});
