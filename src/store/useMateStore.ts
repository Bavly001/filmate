import { create } from 'zustand';
import { MovieItem } from '@/types/tmdb';
import { discoverMateMedia } from '@/services/mediaApi';

export interface FeelingOption {
  id: string;
  name: string;
  genreId: number;
  label: string;
}

export const FEELING_OPTIONS: FeelingOption[] = [
  { id: 'comedy', name: 'Comedy', genreId: 35, label: '😂 Laugh Out Loud' },
  { id: 'romance', name: 'Romance', genreId: 10749, label: '❤️ Romantic & Warm' },
  { id: 'drama', name: 'Drama', genreId: 18, label: '🎭 Deep & Emotional' },
  { id: 'thriller', name: 'Thriller', genreId: 53, label: '⚡ Thrilled & Edge-of-Seat' },
  { id: 'scifi', name: 'Sci-Fi', genreId: 878, label: '🤯 Mind-Bending Sci-Fi' },
  { id: 'action', name: 'Action', genreId: 28, label: '🛡️ High-Octane Action' },
  { id: 'adventure', name: 'Adventure', genreId: 12, label: '🍿 Adventurous & Escapist' },
  { id: 'mystery', name: 'Mystery', genreId: 9648, label: '🔍 Mystery & Detective' },
  { id: 'animation', name: 'Animation', genreId: 16, label: '✨ Wholesome & Fun' },
  { id: 'fantasy', name: 'Fantasy', genreId: 14, label: '🧙 Magical Fantasy' },
  { id: 'horror', name: 'Horror', genreId: 27, label: '👻 Spooky & Chilled' },
];

export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇦🇪' },
];

export interface BotOption {
  id: string;
  label: string;
  value: string;
}

export interface BotMessage {
  id: string;
  role: 'bot' | 'user';
  text: string;
  movie?: MovieItem;
  options?: BotOption[];
  metaBadge?: string;
}

export type StepType =
  | 'feelings'
  | 'company'
  | 'age'
  | 'era'
  | 'runtime'
  | 'rating'
  | 'languages'
  | 'recommendation'
  | 'served'
  | 'exhausted';

interface MateState {
  isOpen: boolean;
  step: StepType;
  isAnalyzing: boolean;
  analysisMessage: string;
  selectedFeelings: FeelingOption[];
  feelingStack: FeelingOption[];
  company: string;
  ageRating: string;
  era: string;
  runtime: string;
  rating: string;
  selectedLanguages: string[];
  cachedMovies: MovieItem[];
  historyIds: number[];
  currentMovie: MovieItem | null;
  messages: BotMessage[];

  // Actions
  openBot: () => void;
  closeBot: () => void;
  toggleBot: () => void;
  resetBot: () => void;
  toggleFeeling: (feeling: FeelingOption) => void;
  confirmFeelings: () => void;
  selectCompany: (val: string, label: string) => void;
  selectAge: (val: string, label: string) => void;
  selectEra: (val: string, label: string) => void;
  selectRuntime: (val: string, label: string) => void;
  selectRating: (val: string, label: string) => void;
  toggleLanguage: (code: string) => void;
  confirmLanguages: () => void;
  handleUserLove: () => void;
  handleUserNotForMe: (appendUserMessage?: boolean) => Promise<void>;
}

const INITIAL_MESSAGES: BotMessage[] = [
  {
    id: 'welcome-1',
    role: 'bot',
    text: "Hello! I'm your Filmate Mate 🎬 Tell me what emotions or feelings you're craving right now. You can pick multiple feelings in order of priority!",
  },
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const getRandomDelay = () => Math.floor(Math.random() * 6001) + 2000; // 2000ms - 8000ms

export const useMateStore = create<MateState>((set, get) => ({
  isOpen: false,
  step: 'feelings',
  isAnalyzing: false,
  analysisMessage:
    "Okay mate, I'm analyzing the data you gave me to tell you what is the best choice for you...",
  selectedFeelings: [],
  feelingStack: [],
  company: '',
  ageRating: '',
  era: '',
  runtime: '',
  rating: '',
  selectedLanguages: ['en'],
  cachedMovies: [],
  historyIds: [],
  currentMovie: null,
  messages: INITIAL_MESSAGES,

  openBot: () => set({ isOpen: true }),
  closeBot: () => set({ isOpen: false }),
  toggleBot: () => set((state) => ({ isOpen: !state.isOpen })),

  resetBot: () => {
    set({
      step: 'feelings',
      isAnalyzing: false,
      selectedFeelings: [],
      feelingStack: [],
      company: '',
      ageRating: '',
      era: '',
      runtime: '',
      rating: '',
      selectedLanguages: ['en'],
      cachedMovies: [],
      historyIds: [],
      currentMovie: null,
      messages: INITIAL_MESSAGES,
    });
  },

  toggleFeeling: (feeling: FeelingOption) => {
    const { selectedFeelings } = get();
    const exists = selectedFeelings.some((f) => f.id === feeling.id);
    let updated: FeelingOption[];
    if (exists) {
      updated = selectedFeelings.filter((f) => f.id !== feeling.id);
    } else {
      updated = [...selectedFeelings, feeling];
    }
    set({ selectedFeelings: updated });
  },

  confirmFeelings: () => {
    const { selectedFeelings } = get();
    if (selectedFeelings.length === 0) return;

    const summary = selectedFeelings.map((f, i) => `#${i + 1} ${f.label}`).join(', ');
    const userMsg: BotMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: `My mood stack: ${summary}`,
    };

    const nextBotMsg: BotMessage = {
      id: `bot-company-${Date.now()}`,
      role: 'bot',
      text: 'Who are you watching with tonight?',
      options: [
        { id: 'cmp-alone', label: '👤 Just Me (Solo Night)', value: 'alone' },
        { id: 'cmp-partner', label: '❤️ Date Night / With Partner', value: 'partner' },
        { id: 'cmp-family', label: '👨‍👩‍👧‍👦 Family & Kids', value: 'family' },
        { id: 'cmp-friends', label: '👥 Friends Hangout', value: 'friends' },
      ],
    };

    set((state) => ({
      step: 'company',
      feelingStack: [...selectedFeelings],
      messages: [...state.messages, userMsg, nextBotMsg],
    }));
  },

  selectCompany: (val: string, label: string) => {
    const userMsg: BotMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: label,
    };

    const nextBotMsg: BotMessage = {
      id: `bot-age-${Date.now()}`,
      role: 'bot',
      text: 'What content rating or age appropriateness would you prefer?',
      options: [
        { id: 'age-family', label: '👶 All Ages / Family Safe (G / PG)', value: 'family' },
        { id: 'age-teens', label: '🎒 Teens & Young Adults (PG-13)', value: 'teens' },
        { id: 'age-mature', label: '🔞 Mature Audiences (R-Rated / 18+)', value: 'mature' },
        { id: 'age-any', label: '🎬 Any Age Rating', value: 'any' },
      ],
    };

    set((state) => ({
      company: val,
      step: 'age',
      messages: [...state.messages, userMsg, nextBotMsg],
    }));
  },

  selectAge: (val: string, label: string) => {
    const userMsg: BotMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: label,
    };

    const nextBotMsg: BotMessage = {
      id: `bot-era-${Date.now()}`,
      role: 'bot',
      text: 'What era or release window are you in the mood for?',
      options: [
        { id: 'era-2020', label: '✨ Recent Hits (2020 - Present)', value: '2020+' },
        { id: 'era-2010', label: '📼 2010s Modern Classics', value: '2010s' },
        { id: 'era-2000', label: '💿 2000s Golden Era', value: '2000s' },
        { id: 'era-90s', label: '🎞️ 90s Vintage Favorites', value: '90s' },
        { id: 'era-retro', label: '📻 Retro (Pre-1990)', value: 'retro' },
        { id: 'era-any', label: '🎲 Any Era is Great', value: 'any' },
      ],
    };

    set((state) => ({
      ageRating: val,
      step: 'era',
      messages: [...state.messages, userMsg, nextBotMsg],
    }));
  },

  selectEra: (val: string, label: string) => {
    const userMsg: BotMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: label,
    };

    const nextBotMsg: BotMessage = {
      id: `bot-runtime-${Date.now()}`,
      role: 'bot',
      text: 'How long should the movie be?',
      options: [
        { id: 'rt-quick', label: '⏱️ Snappy & Quick (< 95 min)', value: 'quick' },
        { id: 'rt-std', label: '🍿 Standard Sweet Spot (95 - 130 min)', value: 'standard' },
        { id: 'rt-epic', label: '⏳ Long & Immersive (> 135 min)', value: 'epic' },
        { id: 'rt-any', label: '🕒 Any Duration', value: 'any' },
      ],
    };

    set((state) => ({
      era: val,
      step: 'runtime',
      messages: [...state.messages, userMsg, nextBotMsg],
    }));
  },

  selectRuntime: (val: string, label: string) => {
    const userMsg: BotMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: label,
    };

    const nextBotMsg: BotMessage = {
      id: `bot-rating-${Date.now()}`,
      role: 'bot',
      text: 'How acclaimed or popular should it be?',
      options: [
        { id: 'rate-master', label: '🏆 Universal Masterpiece (7.8+ Rating)', value: 'masterpiece' },
        { id: 'rate-crowd', label: '⭐ Crowd Pleaser (7.0+ & High Acclaim)', value: 'crowd_pleaser' },
        { id: 'rate-block', label: '🔥 Massive Blockbuster (High Vote Count)', value: 'blockbuster' },
        { id: 'rate-any', label: '💎 Open to Anything & Hidden Gems', value: 'any' },
      ],
    };

    set((state) => ({
      runtime: val,
      step: 'rating',
      messages: [...state.messages, userMsg, nextBotMsg],
    }));
  },

  selectRating: (val: string, label: string) => {
    const userMsg: BotMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: label,
    };

    const nextBotMsg: BotMessage = {
      id: `bot-lang-${Date.now()}`,
      role: 'bot',
      text: 'Select your preferred language(s). You can choose multiple languages!',
    };

    set((state) => ({
      rating: val,
      step: 'languages',
      messages: [...state.messages, userMsg, nextBotMsg],
    }));
  },

  toggleLanguage: (code: string) => {
    const { selectedLanguages } = get();
    let updated: string[];
    if (selectedLanguages.includes(code)) {
      updated = selectedLanguages.filter((c) => c !== code);
    } else {
      updated = [...selectedLanguages, code];
    }
    set({ selectedLanguages: updated });
  },

  confirmLanguages: async () => {
    const { selectedLanguages, feelingStack, company, ageRating, era, runtime, rating } = get();

    const langNames =
      selectedLanguages.length > 0
        ? selectedLanguages
            .map((c) => LANGUAGE_OPTIONS.find((l) => l.code === c)?.name || c)
            .join(', ')
        : 'Any Language';

    const userMsg: BotMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: `Preferred languages: ${langNames}`,
    };

    set((state) => ({
      step: 'recommendation',
      isAnalyzing: true,
      analysisMessage:
        "Okay mate, I'm analyzing the data you gave me to tell you what is the best choice for you...",
      messages: [...state.messages, userMsg],
    }));

    const delayMs = getRandomDelay();
    const timerPromise = sleep(delayMs);

    const genres = feelingStack.map((f) => f.genreId);
    const fetchPromise = discoverMateMedia({
      genres,
      company,
      ageRating,
      era,
      runtime,
      rating,
      languages: selectedLanguages,
    });

    try {
      const [_, fetchedMovies] = await Promise.all([timerPromise, fetchPromise]);

      // Exclude already recommended IDs
      const { historyIds } = get();
      const freshMovies = fetchedMovies.filter((m) => !historyIds.includes(m.id));

      if (freshMovies.length > 0) {
        const [firstMovie, ...remainingCache] = freshMovies;
        const newHistory = [...historyIds, firstMovie.id];

        const botRecMsg: BotMessage = {
          id: `rec-${Date.now()}`,
          role: 'bot',
          text: `Here is the top tailored movie matching your ${feelingStack.map((f) => f.name).join(' + ')} mood:`,
          movie: firstMovie,
          metaBadge: `Mood: ${feelingStack.map((f) => f.name).join(' • ')}`,
        };

        set((state) => ({
          isAnalyzing: false,
          currentMovie: firstMovie,
          cachedMovies: remainingCache,
          historyIds: newHistory,
          messages: [...state.messages, botRecMsg],
        }));
      } else {
        // Cache empty on first fetch -> attempt pop or fallback without phantom "Not for me" user message
        await get().handleUserNotForMe(false);
      }
    } catch (err) {
      console.error('Discover fetch error:', err);
      set({
        isAnalyzing: false,
        messages: [
          ...get().messages,
          {
            id: `err-${Date.now()}`,
            role: 'bot',
            text: "Sorry mate, I hit a temporary network snag searching TMDB. Let's start fresh!",
            options: [{ id: 'opt-restart', label: '🔄 Start Fresh', value: 'restart' }],
          },
        ],
      });
    }
  },

  handleUserLove: () => {
    const { currentMovie } = get();
    const userMsg: BotMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: '💖 I love it!',
    };

    const botMsg: BotMessage = {
      id: `bot-served-${Date.now()}`,
      role: 'bot',
      text: `Happy to serve you! 🎉 Enjoy watching "${currentMovie?.title || 'your movie'}"! Have a wonderful movie night!`,
      options: [
        { id: 'opt-again', label: '🔍 Find Another Movie', value: 'restart' },
      ],
    };

    set((state) => ({
      step: 'served',
      messages: [...state.messages, userMsg, botMsg],
    }));
  },

  handleUserNotForMe: async (appendUserMessage?: boolean | unknown) => {
    const shouldAppendUser = appendUserMessage !== false;

    if (shouldAppendUser) {
      const userMsg: BotMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        text: '👎 Not for me, show another',
      };

      set((state) => ({
        isAnalyzing: true,
        analysisMessage:
          "Okay mate, I'm analyzing the data you gave me to tell you what is the best choice for you...",
        messages: [...state.messages, userMsg],
      }));
    } else {
      set({
        isAnalyzing: true,
        analysisMessage:
          "Okay mate, I'm analyzing the data you gave me to tell you what is the best choice for you...",
      });
    }

    const delayMs = getRandomDelay();
    const timerPromise = sleep(delayMs);

    const { cachedMovies, historyIds, feelingStack, company, ageRating, era, runtime, rating, selectedLanguages } = get();

    // 1. If local cache still has movies, pop the next one!
    if (cachedMovies.length > 0) {
      await timerPromise;
      const [nextMovie, ...remainingCache] = cachedMovies;
      const newHistory = [...historyIds, nextMovie.id];

      const botRecMsg: BotMessage = {
        id: `rec-${Date.now()}`,
        role: 'bot',
        text: `Here is another curated match from your selection:`,
        movie: nextMovie,
        metaBadge: `Mood: ${feelingStack.map((f) => f.name).join(' • ')}`,
      };

      set((state) => ({
        isAnalyzing: false,
        currentMovie: nextMovie,
        cachedMovies: remainingCache,
        historyIds: newHistory,
        messages: [...state.messages, botRecMsg],
      }));
      return;
    }

    // 2. Cache is empty! Check feeling stack.
    // If feelingStack has more than 1 feeling, pop the last feeling and re-query TMDB
    let currentStack = [...feelingStack];

    while (currentStack.length > 1) {
      const popped = currentStack.pop(); // pop last feeling to broaden search
      const genres = currentStack.map((f) => f.genreId);

      const fetchPromise = discoverMateMedia({
        genres,
        company,
        ageRating,
        era,
        runtime,
        rating,
        languages: selectedLanguages,
      });

      try {
        const [_, fetchedMovies] = await Promise.all([timerPromise, fetchPromise]);
        const freshMovies = fetchedMovies.filter((m) => !get().historyIds.includes(m.id));

        if (freshMovies.length > 0) {
          const [nextMovie, ...remainingCache] = freshMovies;
          const newHistory = [...get().historyIds, nextMovie.id];

          const botRecMsg: BotMessage = {
            id: `rec-${Date.now()}`,
            role: 'bot',
            text: `I broadened your feelings profile to focus on your top mood (${currentStack.map((f) => f.name).join(' + ')}). Here is your next tailored recommendation:`,
            movie: nextMovie,
            metaBadge: `Broadened: ${currentStack.map((f) => f.name).join(' • ')}`,
          };

          set((state) => ({
            isAnalyzing: false,
            feelingStack: currentStack,
            currentMovie: nextMovie,
            cachedMovies: remainingCache,
            historyIds: newHistory,
            messages: [...state.messages, botRecMsg],
          }));
          return;
        }
      } catch (err) {
        console.error('Broaden discover fetch error:', err);
      }
    }

    // 3. Only 1 genre was in stack or all broadened searches exhausted!
    await timerPromise;
    const exhaustedMsg: BotMessage = {
      id: `exhausted-${Date.now()}`,
      role: 'bot',
      text: "Sorry mate, I couldn't find more matches for all your exact criteria across your feeling spectrum. Would you like to adjust your filters or start fresh?",
      options: [{ id: 'opt-restart', label: '🔄 Start Fresh', value: 'restart' }],
    };

    set((state) => ({
      step: 'exhausted',
      isAnalyzing: false,
      currentMovie: null,
      messages: [...state.messages, exhaustedMsg],
    }));
  },
}));
