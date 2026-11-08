import { create } from 'zustand';
import { Movie, MatePreferences, MateStep, CompanyType, VenueType, AgeRating } from '@/types/movie';
import { curatedMovies } from '@/data/curatedMovies';

interface MateState {
  isDrawerOpen: boolean;
  step: MateStep;
  preferences: MatePreferences;
  activeCategories: string[];
  seenMovieIds: string[];
  currentRecommendation: Movie | null;
  rationale: string;
  isAccepted: boolean;

  // Actions
  openDrawer: () => void;
  closeDrawer: () => void;
  setStep: (step: MateStep) => void;
  toggleMood: (mood: string) => void;
  setCompany: (company: CompanyType) => void;
  setVenue: (venue: VenueType) => void;
  setAgeRating: (ageRating: AgeRating) => void;
  startAnalysis: (minDurationMs?: number) => Promise<void>;
  computeRecommendation: () => void;
  acceptRecommendation: () => void;
  rejectRecommendation: () => void;
  relaxCategories: () => void;
  resetQuiz: () => void;
}

const initialPreferences: MatePreferences = {
  moods: [],
  company: 'solo',
  venue: 'both',
  ageRating: '18+',
};

export const useMateStore = create<MateState>((set, get) => ({
  isDrawerOpen: false,
  step: 'idle',
  preferences: { ...initialPreferences },
  activeCategories: [],
  seenMovieIds: [],
  currentRecommendation: null,
  rationale: '',
  isAccepted: false,

  openDrawer: () => set({ isDrawerOpen: true, step: get().step === 'idle' ? 'mood' : get().step }),
  closeDrawer: () => set({ isDrawerOpen: false }),
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
    // Rule: Family & kids automatically enforces All Ages
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
    // If family is chosen, don't allow 18+
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

  startAnalysis: async (minDurationMs = 2800) => {
    set({ step: 'analyzing', isAccepted: false });
    const startTime = Date.now();

    // Prepare active categories from chosen moods (or default to popular categories if none picked)
    const initialMoods =
      get().preferences.moods.length > 0
        ? [...get().preferences.moods]
        : ['Action', 'Drama'];
    set({ activeCategories: initialMoods });

    // Enforce artificial delay for suspenseful analysis
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minDurationMs - elapsed);

    await new Promise((resolve) => setTimeout(resolve, remaining));

    get().computeRecommendation();
  },

  computeRecommendation: () => {
    const { activeCategories, preferences, seenMovieIds } = get();

    // Find candidates matching active categories, age rating, and venue
    const findCandidates = (categories: string[]) => {
      return curatedMovies.filter((movie) => {
        // Exclude previously rejected/shown movies
        if (seenMovieIds.includes(movie.id)) return false;

        // Age rating check
        if (preferences.ageRating && movie.ageRating !== preferences.ageRating) {
          return false;
        }

        // Venue check
        if (preferences.venue !== 'both') {
          if (preferences.venue === 'cinema' && movie.venue === 'home') return false;
          if (preferences.venue === 'home' && movie.venue === 'cinema') return false;
        }

        // Category intersection match
        if (categories.length > 0) {
          const matches = categories.every((cat) =>
            movie.genres.some((mg) => mg.toLowerCase() === cat.toLowerCase())
          );
          if (!matches) return false;
        }

        return true;
      });
    };

    let candidates = findCandidates(activeCategories);

    // If no candidate matches strict intersection, relax categories progressively
    let workingCategories = [...activeCategories];
    while (candidates.length === 0 && workingCategories.length > 1) {
      workingCategories = workingCategories.slice(0, workingCategories.length - 1);
      candidates = findCandidates(workingCategories);
    }

    // If still 0, try with any single remaining category or broadest match
    if (candidates.length === 0 && workingCategories.length === 1) {
      candidates = findCandidates([]);
    }

    if (candidates.length > 0) {
      // Pick a random candidate
      const randomIndex = Math.floor(Math.random() * candidates.length);
      const chosen = candidates[randomIndex];

      // Formulate rationale
      const moodText =
        workingCategories.length > 0
          ? workingCategories.join(' & ')
          : 'Trending';
      const companyText =
        preferences.company === 'partner'
          ? 'date night'
          : preferences.company === 'family'
          ? 'family movie time'
          : preferences.company === 'friends'
          ? 'a fun group watch'
          : 'a solo movie night';

      const rationale = `Curated for your ${moodText} mood, perfect for ${companyText}.`;

      set({
        currentRecommendation: chosen,
        activeCategories: workingCategories,
        seenMovieIds: [...seenMovieIds, chosen.id],
        rationale,
        step: 'result',
      });
    } else {
      set({
        currentRecommendation: null,
        step: 'exhausted',
      });
    }
  },

  acceptRecommendation: () => {
    set({ isAccepted: true });
  },

  rejectRecommendation: () => {
    const { activeCategories, seenMovieIds, currentRecommendation } = get();
    const updatedSeen = currentRecommendation
      ? [...seenMovieIds, currentRecommendation.id]
      : seenMovieIds;

    set({ seenMovieIds: updatedSeen });

    // Check if there are other candidates in current category
    const remainingInPool = curatedMovies.filter((movie) => {
      if (updatedSeen.includes(movie.id)) return false;
      return activeCategories.every((cat) =>
        movie.genres.some((mg) => mg.toLowerCase() === cat.toLowerCase())
      );
    });

    if (remainingInPool.length > 0) {
      get().computeRecommendation();
    } else if (activeCategories.length > 1) {
      // Relax category by dropping the last
      get().relaxCategories();
      get().computeRecommendation();
    } else {
      // All exhausted
      set({ step: 'exhausted', currentRecommendation: null });
    }
  },

  relaxCategories: () => {
    const { activeCategories } = get();
    if (activeCategories.length > 1) {
      set({ activeCategories: activeCategories.slice(0, activeCategories.length - 1) });
    }
  },

  resetQuiz: () => {
    set({
      step: 'idle',
      preferences: { ...initialPreferences },
      activeCategories: [],
      seenMovieIds: [],
      currentRecommendation: null,
      rationale: '',
      isAccepted: false,
    });
  },
}));
