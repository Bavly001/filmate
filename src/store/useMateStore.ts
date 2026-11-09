import { create } from 'zustand';
import {
  Movie,
  ChatMessage,
  MatePreferences,
  MateStep,
  CompanyType,
  VenueType,
  AgeRating,
} from '@/types/movie';
import { fetchCatalogMovies } from '@/services/movieApi';

interface MateState {
  isDrawerOpen: boolean;
  step: MateStep;
  messages: ChatMessage[];
  isTyping: boolean;
  preferences: MatePreferences;
  activeCategories: string[];
  seenMovieIds: string[];
  currentRecommendation: Movie | null;
  rationale: string;
  isAccepted: boolean;

  // Actions
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  sendMessage: (text: string) => Promise<void>;
  selectQuickVibe: (vibe: string) => Promise<void>;
  resetChat: () => void;
  setStep: (step: MateStep) => void;
  toggleMood: (mood: string) => void;
  setCompany: (company: CompanyType) => void;
  setVenue: (venue: VenueType) => void;
  setAgeRating: (ageRating: AgeRating) => void;
  startAnalysis: (minDurationMs?: number) => Promise<void>;
  computeRecommendation: () => Promise<void>;
  acceptRecommendation: () => void;
  rejectRecommendation: () => Promise<void>;
  relaxCategories: () => void;
  resetQuiz: () => void;
}

const initialGreeting: ChatMessage = {
  id: 'mate-welcome',
  role: 'mate',
  text: "Welcome to FilmMate! I'm your luxury cinema companion. Tell me what genre or mood you are craving, or pick a vibe below.",
  timestamp: new Date().toISOString(),
};

const initialPreferences: MatePreferences = {
  moods: [],
  company: 'solo',
  venue: 'both',
  ageRating: '18+',
};

export const useMateStore = create<MateState>((set, get) => ({
  isDrawerOpen: false,
  step: 'chatting',
  messages: [{ ...initialGreeting }],
  isTyping: false,
  preferences: { ...initialPreferences },
  activeCategories: [],
  seenMovieIds: [],
  currentRecommendation: null,
  rationale: '',
  isAccepted: false,

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set({ isDrawerOpen: !get().isDrawerOpen }),

  sendMessage: async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    set({
      messages: [...get().messages, userMessage],
      isTyping: true,
    });

    try {
      // Query live public API for matching movies
      const cleaned = text.trim();
      const results = await fetchCatalogMovies({ query: cleaned });
      const candidate = results.length > 0 ? results[0] : null;

      // Also fallback to a popular genre query if zero results
      let fallbackMovie: Movie | null = candidate;
      if (!fallbackMovie) {
        const broad = await fetchCatalogMovies({ page: 0 });
        fallbackMovie = broad.length > 0 ? broad[Math.floor(Math.random() * Math.min(5, broad.length))] : null;
      }

      const mateReply: ChatMessage = {
        id: `mate-${Date.now()}`,
        role: 'mate',
        text: fallbackMovie
          ? `I picked this cinematic experience for "${cleaned}":`
          : "I couldn't locate an exact match, but check out our curated top rated titles!",
        timestamp: new Date().toISOString(),
        recommendation: fallbackMovie || undefined,
      };

      set({
        messages: [...get().messages, mateReply],
        currentRecommendation: fallbackMovie,
        isTyping: false,
      });
    } catch (error) {
      console.error('Error fetching Mate recommendation:', error);
      set({
        messages: [
          ...get().messages,
          {
            id: `mate-err-${Date.now()}`,
            role: 'mate',
            text: 'I had a brief connection issue reaching the movie database. Please try again!',
            timestamp: new Date().toISOString(),
          },
        ],
        isTyping: false,
      });
    }
  },

  selectQuickVibe: async (vibe: string) => {
    await get().sendMessage(vibe);
  },

  resetChat: () => {
    set({
      messages: [{ ...initialGreeting, timestamp: new Date().toISOString() }],
      isTyping: false,
      currentRecommendation: null,
      preferences: { ...initialPreferences },
      activeCategories: [],
      seenMovieIds: [],
    });
  },

  setStep: (step) => set({ step }),

  toggleMood: (mood) => {
    const current = get().preferences.moods;
    const next = current.includes(mood)
      ? current.filter((m) => m !== mood)
      : [...current, mood];
    set({
      preferences: {
        ...get().preferences,
        moods: next,
      },
      activeCategories: next,
    });
  },

  setCompany: (company) => {
    const currentAge = get().preferences.ageRating;
    const ageRating = company === 'family' ? 'All Ages' : currentAge;
    set({
      preferences: {
        ...get().preferences,
        company,
        ageRating,
      },
    });
  },

  setVenue: (venue) => {
    set({
      preferences: {
        ...get().preferences,
        venue,
      },
    });
  },

  setAgeRating: (ageRating) => {
    if (get().preferences.company === 'family') {
      set({
        preferences: {
          ...get().preferences,
          ageRating: 'All Ages',
        },
      });
      return;
    }
    set({
      preferences: {
        ...get().preferences,
        ageRating,
      },
    });
  },

  startAnalysis: async (minDurationMs = 500) => {
    set({ step: 'analyzing', isAccepted: false });
    await new Promise((resolve) => setTimeout(resolve, minDurationMs));
    get().computeRecommendation();
  },

  computeRecommendation: async () => {
    try {
      const { moods } = get().preferences;
      const seen = get().seenMovieIds;
      const genre = moods.length > 0 ? moods[0] : undefined;
      const candidates = await fetchCatalogMovies({ genre });
      const available = candidates.filter((m) => !seen.includes(m.id));
      const chosen = available.length > 0 ? available[0] : candidates[0] || null;

      if (chosen) {
        set({
          currentRecommendation: chosen,
          seenMovieIds: [...seen, chosen.id],
          rationale: `Curated for your ${moods.join(' & ') || 'cinematic'} mood.`,
          step: 'result',
        });
      } else {
        set({ step: 'exhausted' });
      }
    } catch {
      set({ step: 'idle' });
    }
  },

  acceptRecommendation: () => {
    set({ isAccepted: true });
  },

  rejectRecommendation: async () => {
    await get().computeRecommendation();
  },

  relaxCategories: () => {
    const { activeCategories } = get();
    if (activeCategories.length > 1) {
      set({ activeCategories: activeCategories.slice(0, activeCategories.length - 1) });
    }
  },

  resetQuiz: () => {
    get().resetChat();
    set({ step: 'idle' });
  },
}));
