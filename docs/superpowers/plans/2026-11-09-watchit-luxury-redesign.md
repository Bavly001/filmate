# Filmate Luxury Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure Filmate into an ultra-premium, modern luxury streaming platform inspired by WatchIT Midnight Gold (with elements from Netflix and Yango Play), powered 100% by live public APIs (KinoCheck & TVMaze with TMDB option), completely purging upcoming movies logic, featuring a scroll-responsive transparent-to-glassmorphic header (no search bar, no trailers tab), constant About & Contact pages, and a non-blocking floating Messenger popup chat for AI Mate.

**Architecture:** Next.js 14 App Router with React 18, `@nextui-org/react` (HeroUI) primitives, Tailwind CSS with custom WatchIT Midnight Gold tokens, and Framer Motion spring animations. Data layer fetches live from KinoCheck (theatrical cinema movies, YouTube trailers, HD thumbnails) and TVMaze (rich episodic/movie catalog, ratings, cast, summaries) using a prefixed ID namespace (`kc-*`, `tvm-*`, `tmdb-*`) cached with TanStack Query. Mate AI is redesigned as a non-blocking bottom-right floating Messenger chat widget.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, `@nextui-org/react` (HeroUI for React 18), Tailwind CSS, Framer Motion, `@tanstack/react-query`, Zustand, Lucide React, Vitest, React Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-09-watchit-luxury-redesign.md`

## Global Constraints
- Canvas background must use WatchIT Midnight Obsidian `#07080B` with card surfaces at `#10121B` and gold accents `#F59E0B`, `#FDE68A`, `#D97706`.
- Header must start 100% transparent at top (`scrollY === 0`) and smoothly transition to frosted glassmorphism on scroll (`scrollY > 20`).
- Header must NOT contain any search bar or "Trailers" tab.
- All hardcoded/constant mock movie arrays in `src/data/curatedMovies.ts` must be completely removed.
- All logic, types, questionnaire steps, and filter badges relating to upcoming movies must be permanently purged.
- All git commits must be attributed solely to Bavly (`Bavly001`) with no AI co-authorship.

## Review Focus
1. **Network failure on public APIs:** When KinoCheck or TVMaze is slow or fails, the UI must render elegant fallback error/retry states without crashing or blanking the page.
2. **Dynamic ID resolution in `/movies/[id]`:** Sourcing from both KinoCheck and TVMaze means routes must resolve `kc-{id}` and `tvm-{id}` without collision or 404s.
3. **Scroll listener memory leaks & hydration:** The header scroll listener must properly attach on mount, clean up on unmount, and avoid server-client hydration mismatches.
4. **Messenger popup non-blocking interaction:** The bottom-right Mate popup chat must allow users to click movie cards, watch trailers, and navigate behind it without trapping focus or blocking touch events.
5. **Mobile layout responsiveness:** On viewports from 375px to 768px, horizontal shelves must scroll smoothly without causing horizontal page-level overflow (`overflow-x-hidden`).

---

### Task 1: Install `@nextui-org/react` & Configure WatchIT Midnight Gold Theme Tokens

**Files:**
- Modify: `package.json`
- Modify: `tailwind.config.js`
- Modify: `src/app/globals.css`
- Modify: `src/app/providers.tsx`
- Test: `src/app/providers.test.tsx`

**Interfaces:**
- Consumes: Next.js standard provider wrapping.
- Produces: `NextUIProvider` root context and Tailwind utility classes (`bg-obsidian-canvas`, `bg-obsidian-surface`, `text-gold-accent`, `border-gold-hairline`, `shadow-gold-glow`).

- [ ] **Step 1: Write the failing test for providers**

Create `src/app/providers.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { Providers } from './providers';
import { describe, it, expect } from 'vitest';

describe('Providers root wrapper', () => {
  it('renders children inside NextUI and Query providers', () => {
    render(
      <Providers>
        <div data-testid="child-element">Filmate Test Child</div>
      </Providers>
    );
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/app/providers.test.tsx`
Expected: FAIL (NextUIProvider missing or not configured)

- [ ] **Step 3: Install `@nextui-org/react` and configure Tailwind theme tokens**

Run: `npm install @nextui-org/react`
Update `tailwind.config.js` to include NextUI plugin, darkMode: 'class', and custom WatchIT Midnight Gold palette:
- `obsidian-canvas`: `#07080B`
- `obsidian-surface`: `#10121B`
- `obsidian-elevated`: `#161926`
- `gold-primary`: `#F59E0B`
- `gold-light`: `#FDE68A`
- `gold-dark`: `#D97706`
- `gold-hairline`: `rgba(245, 158, 11, 0.18)`
- `gold-glow`: `rgba(245, 158, 11, 0.25)`

Update `src/app/globals.css` with dark theme root styles and custom gold scrollbars.
Update `src/app/providers.tsx` to wrap children in `<NextUIProvider>` alongside `<QueryClientProvider>`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/app/providers.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json tailwind.config.js src/app/globals.css src/app/providers.tsx src/app/providers.test.tsx
git commit -m "feat: configure NextUI provider and WatchIT Midnight Gold theme tokens"
```

---

### Task 2: Update Movie Data Models & Purge Upcoming Logic

**Files:**
- Modify: `src/types/movie.ts`
- Modify: `src/types/movie.test.ts`

**Interfaces:**
- Consumes: None (core type definition).
- Produces: `Movie` interface with prefixed IDs, `source` discriminator, and complete removal of `upcoming` and `releaseDate`.

- [ ] **Step 1: Write the failing test for updated Movie types**

Update `src/types/movie.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { Movie, FilterCriteria } from './movie';

describe('Movie Types Contract', () => {
  it('validates a movie with prefixed ID and source without upcoming property', () => {
    const movie: Movie = {
      id: 'kc-1381071',
      title: 'Godzilla Minus Zero',
      overview: 'Cinema premiere trailer',
      genres: ['Action', 'Sci-Fi'],
      rating: 8.4,
      posterUrl: 'https://cdn.kinocheck.com/i/8qwlxv0cge.jpg',
      backdropUrl: 'https://img.youtube.com/vi/E-Q2tEgJ1ZI/maxresdefault.jpg',
      ageRating: '18+',
      venue: 'cinema',
      platforms: ['Cinema'],
      source: 'kinocheck',
      youtubeVideoId: 'E-Q2tEgJ1ZI',
    };

    expect(movie.id.startsWith('kc-')).toBe(true);
    expect(movie.source).toBe('kinocheck');
    // @ts-expect-error upcoming must not exist on Movie interface
    expect(movie.upcoming).toBeUndefined();
  });

  it('validates FilterCriteria has no upcomingOnly property', () => {
    const criteria: FilterCriteria = {
      genres: ['Action'],
      ageRating: '18+',
      venue: 'cinema',
      searchQuery: 'Dune',
    };
    // @ts-expect-error upcomingOnly must not exist on FilterCriteria
    expect(criteria.upcomingOnly).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/types/movie.test.ts`
Expected: FAIL (TypeScript type error or assertion failure due to old `upcoming` property)

- [ ] **Step 3: Update `src/types/movie.ts`**

In `src/types/movie.ts`:
- Update `Movie`:
  ```typescript
  export interface Movie {
    id: string; // e.g., 'kc-123' or 'tvm-456' or 'tmdb-789'
    title: string;
    overview: string;
    genres: string[];
    rating: number;
    posterUrl: string;
    backdropUrl?: string;
    ageRating?: '18+' | 'All Ages';
    venue: 'cinema' | 'home' | 'both';
    platforms: string[];
    source: 'kinocheck' | 'tvmaze' | 'tmdb';
    youtubeVideoId?: string;
    cast?: string[];
    runtime?: number;
    year?: string;
  }
  ```
- Remove `upcoming` and `releaseDate` from `Movie`.
- Remove `upcomingOnly` from `FilterCriteria`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/types/movie.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/types/movie.ts src/types/movie.test.ts
git commit -m "refactor: update Movie types with prefixed IDs and purge upcoming properties"
```

---

### Task 3: Implement Live Public API Service (KinoCheck + TVMaze + TMDB)

**Files:**
- Modify: `src/services/movieApi.ts`
- Modify: `src/services/movieApi.test.ts`

**Interfaces:**
- Consumes: KinoCheck REST API (`https://api.kinocheck.com`), TVMaze REST API (`https://api.tvmaze.com`).
- Produces: `fetchHeroShowcase()`, `fetchTop10BoxOffice()`, `fetchLiveTrailers()`, `fetchCatalogMovies()`, `fetchMovieById()`, `resolveTrailer()`.

- [ ] **Step 1: Write the failing tests for live movie API**

Update `src/services/movieApi.test.ts`:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchHeroShowcase,
  fetchTop10BoxOffice,
  fetchLiveTrailers,
  fetchCatalogMovies,
  fetchMovieById,
} from './movieApi';

describe('movieApi live service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchLiveTrailers maps KinoCheck items to TrailerItem array', async () => {
    const mockKinoCheck = {
      '0': {
        id: 'knxn',
        title: 'Godzilla Minus Zero',
        youtube_video_id: 'E-Q2tEgJ1ZI',
        thumbnail: 'https://cdn.kinocheck.com/i/thumb.jpg',
        views: 800000,
        genres: ['Action', 'Sci-Fi'],
      },
    };
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockKinoCheck,
    });

    const trailers = await fetchLiveTrailers();
    expect(trailers.length).toBeGreaterThan(0);
    expect(trailers[0].youtubeVideoId).toBe('E-Q2tEgJ1ZI');
    expect(trailers[0].id).toBe('kc-knxn');
  });

  it('fetchTop10BoxOffice returns 10 ranked cinema titles with kc- IDs', async () => {
    const mockList = Array.from({ length: 10 }, (_, i) => ({
      id: `item-${i}`,
      title: `Cinema Hit ${i + 1}`,
      youtube_video_id: `yt-${i}`,
      thumbnail: `https://thumb/${i}.jpg`,
      views: 500000 - i * 10000,
      genres: ['Action'],
    }));
    const mockObj = Object.fromEntries(mockList.map((item, idx) => [idx.toString(), item]));

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockObj,
    });

    const movies = await fetchTop10BoxOffice();
    expect(movies.length).toBe(10);
    expect(movies[0].id).toBe('kc-item-0');
    expect(movies[0].source).toBe('kinocheck');
  });

  it('fetchCatalogMovies queries TVMaze and maps show records with tvm- IDs', async () => {
    const mockShows = [
      {
        show: {
          id: 975,
          name: 'Batman',
          genres: ['Action', 'Adventure'],
          rating: { average: 7.8 },
          image: { original: 'https://tvmaze/batman.jpg' },
          summary: '<p>Bruce Wayne is Batman.</p>',
          runtime: 30,
        },
      },
    ];

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockShows,
    });

    const movies = await fetchCatalogMovies({ query: 'Batman' });
    expect(movies.length).toBe(1);
    expect(movies[0].id).toBe('tvm-975');
    expect(movies[0].title).toBe('Batman');
    expect(movies[0].source).toBe('tvmaze');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/services/movieApi.test.ts`
Expected: FAIL (missing methods or incompatible data shapes)

- [ ] **Step 3: Implement live movie API service in `src/services/movieApi.ts`**

Implement:
- `fetchLiveTrailers()`: calls KinoCheck `/trailers/recommended?language=en`, maps to `TrailerItem[]` with `kc-` IDs.
- `fetchHeroShowcase()`: retrieves top cinema item with maxres backdrop for the Hero Banner.
- `fetchTop10BoxOffice()`: retrieves top 10 items from KinoCheck sorted by popularity/views.
- `fetchCatalogMovies({ genre, query, page })`: queries TVMaze `/search/shows?q=` or `/shows?page=` and transforms into `Movie[]`.
- `fetchMovieById(id)`: handles `kc-*` (lookup via KinoCheck) and `tvm-*` (lookup via TVMaze `/shows/{id}?embed[]=cast`).
- Fallback resilient error handling returning structured data on network failure.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/services/movieApi.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/movieApi.ts src/services/movieApi.test.ts
git commit -m "feat: implement 100% live public API service for KinoCheck and TVMaze"
```

---

### Task 4: Dynamic Scroll-Responsive Luxury Header (`src/components/common/Navbar.tsx`)

**Files:**
- Modify: `src/components/common/Navbar.tsx`
- Modify: `src/components/common/Navbar.test.tsx`

**Interfaces:**
- Consumes: None (independent header component).
- Produces: Header with 100% transparent top state (`scrollY === 0`) and frosted glassmorphic state on scroll (`scrollY > 20`), links to *Discover*, *Movies*, *Trending*, *Top Rated*, *About Us*, *Contact Us*, and strictly NO search bar and NO trailers tab.

- [ ] **Step 1: Write the failing tests for Navbar**

Update `src/components/common/Navbar.test.tsx`:
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from './Navbar';
import { describe, it, expect } from 'vitest';

describe('Navbar WatchIT Luxury Header', () => {
  it('renders brand logo and required navigation links without search bar or trailers tab', () => {
    render(<Navbar />);
    expect(screen.getByText(/FILMATE/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /discover/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /movies/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about us/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact us/i })).toBeInTheDocument();

    // Verify search input is NOT present in the header
    expect(screen.queryByPlaceholderText(/search/i)).toBeNull();
    // Verify trailers tab is NOT in the header navigation
    expect(screen.queryByRole('link', { name: /^trailers$/i })).toBeNull();
  });

  it('starts transparent and adds glassmorphic class on scroll', () => {
    const { container } = render(<Navbar />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('bg-transparent');

    // Simulate scroll down
    window.scrollY = 50;
    fireEvent.scroll(window);

    expect(header).toHaveClass('backdrop-blur-md');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/components/common/Navbar.test.tsx`
Expected: FAIL (search input present, trailers tab present, or scroll state missing)

- [ ] **Step 3: Implement dynamic luxury Navbar in `src/components/common/Navbar.tsx`**

Implement:
- Scroll state listener updating `isScrolled` when `window.scrollY > 20`.
- Classes:
  - Top: `bg-transparent border-b border-transparent`
  - Scrolled: `bg-[#0B0D13]/85 backdrop-blur-md border-b border-amber-500/15 shadow-2xl shadow-black/60`
- Links:
  - `Discover` (`/`)
  - `Movies` (`/movies`)
  - `Trending` (`/#trending`)
  - `Top Rated` (`/#top-rated`)
  - `About Us` (`/about`)
  - `Contact Us` (`/contact`)
- Right actions: VIP Lounge status badge (`★ VIP Lounge`), User profile circle.
- Mobile hamburger menu drawer with matching midnight gold links.
- Strictly exclude search input and trailers tab.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/components/common/Navbar.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/common/Navbar.tsx src/components/common/Navbar.test.tsx
git commit -m "feat: implement WatchIT luxury header with scroll glassmorphism and clean navigation"
```

---

### Task 5: WatchIT Movie Cards, Numbered Top 10 Shelf & Video Trailer Modal

**Files:**
- Modify: `src/components/movie/MovieCard.tsx`
- Modify: `src/components/movie/MovieCard.test.tsx`
- Modify: `src/components/movie/TrailerCard.tsx`
- Modify: `src/components/movie/TrailerModal.tsx`
- Create: `src/components/movie/NumberedMovieCard.tsx`
- Create: `src/components/movie/NumberedMovieCard.test.tsx`

**Interfaces:**
- Consumes: `Movie` interface from `src/types/movie.ts`, `useMovieStore` for trailer modal state.
- Produces: `MovieCard`, `NumberedMovieCard` with oversized rank indicator (1-10), `TrailerCard`, `TrailerModal`.

- [ ] **Step 1: Write the failing tests for NumberedMovieCard and MovieCard**

Create `src/components/movie/NumberedMovieCard.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { NumberedMovieCard } from './NumberedMovieCard';
import { Movie } from '@/types/movie';
import { describe, it, expect } from 'vitest';

const sampleMovie: Movie = {
  id: 'kc-1',
  title: 'Dune: Part Two',
  overview: 'Epic desert journey',
  genres: ['Sci-Fi', 'Adventure'],
  rating: 8.6,
  posterUrl: 'https://image/dune.jpg',
  venue: 'cinema',
  platforms: ['Cinema'],
  source: 'kinocheck',
  youtubeVideoId: 'E-Q2tEgJ1ZI',
};

describe('NumberedMovieCard', () => {
  it('renders rank number with oversized outline typography and movie title', () => {
    render(<NumberedMovieCard movie={sampleMovie} rank={1} onPlayTrailer={() => {}} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Dune: Part Two')).toBeInTheDocument();
    expect(screen.getByText(/8.6/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/components/movie/NumberedMovieCard.test.tsx`
Expected: FAIL (file does not exist)

- [ ] **Step 3: Implement `NumberedMovieCard`, `MovieCard`, and `TrailerModal`**

Implement:
- `NumberedMovieCard.tsx`: Displays rank index (1-10) styled with oversized gold outline (`-webkit-text-stroke: 2px #F59E0B`, `text-shadow: 0 0 20px rgba(245,158,11,0.4)`), 2:3 vertical poster card, rating chip, and quick trailer play button.
- `MovieCard.tsx`: Modern luxury card with smooth hover scale (`hover:scale-[1.03]`), amber hairline border glow, rating pill, genre badges, and direct detail link.
- `TrailerModal.tsx`: Framer Motion scaled modal playing the YouTube video trailer with amber border accents.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/components/movie/NumberedMovieCard.test.tsx src/components/movie/MovieCard.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/movie/NumberedMovieCard.tsx src/components/movie/NumberedMovieCard.test.tsx src/components/movie/MovieCard.tsx src/components/movie/MovieCard.test.tsx src/components/movie/TrailerCard.tsx src/components/movie/TrailerModal.tsx
git commit -m "feat: add WatchIT numbered rank cards and luxury movie card components"
```

---

### Task 6: AI Mate Redesign: Side Messenger Popup Chat

**Files:**
- Create: `src/components/mate/MateChatPopup.tsx`
- Create: `src/components/mate/MateChatPopup.test.tsx`
- Modify: `src/components/mate/FloatingMateButton.tsx`
- Modify: `src/store/useMateStore.ts`
- Modify: `src/store/useMateStore.test.ts`
- Delete: `src/components/mate/MateDrawer.tsx`, `MateDrawer.test.tsx`

**Interfaces:**
- Consumes: `useMateStore`, `Movie` recommendations.
- Produces: 42px floating launcher orb and 360px non-blocking floating messenger popup chat.

- [ ] **Step 1: Write the failing tests for MateChatPopup and updated useMateStore**

Create `src/components/mate/MateChatPopup.test.tsx`:
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MateChatPopup } from './MateChatPopup';
import { useMateStore } from '@/store/useMateStore';
import { describe, it, expect, beforeEach } from 'vitest';

describe('MateChatPopup Messenger Chat', () => {
  beforeEach(() => {
    useMateStore.setState({ isChatOpen: true, messages: [] });
  });

  it('renders chat header and quick mood vibe chips when open', () => {
    render(<MateChatPopup />);
    expect(screen.getByText(/Filmate Mate/i)).toBeInTheDocument();
    expect(screen.getByText(/Mind-bending Sci-Fi/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Type a vibe or ask for a movie/i)).toBeInTheDocument();
  });

  it('allows clicking mood chips to send vibe message', () => {
    render(<MateChatPopup />);
    const chip = screen.getByText(/Mind-bending Sci-Fi/i);
    fireEvent.click(chip);
    expect(screen.getByText(/Mind-bending Sci-Fi/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/components/mate/MateChatPopup.test.tsx`
Expected: FAIL (file does not exist)

- [ ] **Step 3: Implement `useMateStore` state machine & `MateChatPopup`**

Update `useMateStore.ts`:
- Replace drawer open state with `isChatOpen: boolean`, `toggleChat()`, `closeChat()`.
- Store `messages: ChatMessage[]` (`role: 'user' | 'mate'`, `text: string`, `recommendation?: Movie`).
- Implement vibe matching: when a user clicks a chip or types a vibe, query the live catalog by genre/keyword and reply with an inline movie card.
- Remove upcoming questionnaire questions.

Create `src/components/mate/MateChatPopup.tsx`:
- Position: `fixed bottom-20 right-6 z-50 w-[360px] max-h-[520px]`.
- Midnight gold glassmorphic container: `bg-[#10121B]/95 backdrop-blur-xl border border-amber-500/25 rounded-2xl shadow-2xl`.
- Header with online indicator dot and minimize button.
- Conversational bubble feed with smooth scroll to bottom.
- Inline recommendation mini-card with poster, rating, and "Play Trailer" button.
- Bottom input field with send button.

Update `FloatingMateButton.tsx`:
- Reduced size: 42px floating orb with gold glow pulse at `bottom-6 right-6`.

Delete obsolete `MateDrawer.tsx` and `MateDrawer.test.tsx`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/components/mate/MateChatPopup.test.tsx src/store/useMateStore.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/mate/MateChatPopup.tsx src/components/mate/MateChatPopup.test.tsx src/components/mate/FloatingMateButton.tsx src/store/useMateStore.ts src/store/useMateStore.test.ts
git rm src/components/mate/MateDrawer.tsx src/components/mate/MateDrawer.test.tsx
git commit -m "feat: replace blocking drawer with non-blocking floating messenger popup chat"
```

---

### Task 7: Constant Pages: About Us (`/about`) & Contact Us (`/contact`)

**Files:**
- Create: `src/app/about/page.tsx`
- Create: `src/app/about/page.test.tsx`
- Create: `src/app/contact/page.tsx`
- Create: `src/app/contact/page.test.tsx`

**Interfaces:**
- Consumes: `Navbar`, common footer and layout.
- Produces: `/about` brand storytelling page and `/contact` VIP Concierge inquiry page.

- [ ] **Step 1: Write failing tests for About and Contact pages**

Create `src/app/about/page.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import AboutPage from './page';
import { describe, it, expect } from 'vitest';

describe('About Us Page', () => {
  it('renders the luxury Filmate vision and KPI stat metrics', () => {
    render(<AboutPage />);
    expect(screen.getByText(/The Filmate Standard/i)).toBeInTheDocument();
    expect(screen.getByText(/10,000\+/i)).toBeInTheDocument();
  });
});
```

Create `src/app/contact/page.test.tsx`:
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ContactPage from './page';
import { describe, it, expect } from 'vitest';

describe('Contact Us Page', () => {
  it('renders VIP concierge contact form and submit button', () => {
    render(<ContactPage />);
    expect(screen.getByText(/VIP Cinema Concierge/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send inquiry/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/app/about/page.test.tsx src/app/contact/page.test.tsx`
Expected: FAIL (pages do not exist)

- [ ] **Step 3: Implement `/about` and `/contact` pages**

Create `src/app/about/page.tsx`:
- Modern Luxury layout with gold gradient headlines.
- KPI stats row (*10,000+ Real Titles*, *Zero Constant Mock Data*, *Instant AI Concierge*, *4K Cinema Trailers*).
- Filmate Philosophy: "Cinema Without Noise".

Create `src/app/contact/page.tsx`:
- VIP Concierge contact form with name, email, VIP subject, and message.
- Success confirmation modal / toast upon submission.
- Concierge office details (Cairo / Global).

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/app/about/page.test.tsx src/app/contact/page.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/about/page.tsx src/app/about/page.test.tsx src/app/contact/page.tsx src/app/contact/page.test.tsx
git commit -m "feat: add constant About Us and VIP Contact Us pages in WatchIT luxury style"
```

---

### Task 8: Restructure Homepage (`/`) and Movies Catalog (`/movies`) with Live Data & Zero Mocks

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/page.test.tsx`
- Modify: `src/components/common/HeroBanner.tsx`
- Modify: `src/app/movies/page.tsx`
- Modify: `src/app/movies/page.test.tsx`
- Delete: `src/data/curatedMovies.ts`

**Interfaces:**
- Consumes: `fetchHeroShowcase`, `fetchTop10BoxOffice`, `fetchCatalogMovies`, `fetchLiveTrailers` from `src/services/movieApi.ts`.
- Produces: Restructured homepage with live Hero Banner, Top 10 Box Office numbered shelf, curated live shelves, and live trailer carousels.

- [ ] **Step 1: Write the failing tests for restructured Homepage and Movies catalog**

Update `src/app/page.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import Home from './page';
import { Providers } from './providers';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/services/movieApi', () => ({
  fetchHeroShowcase: vi.fn().mockResolvedValue({
    id: 'kc-1',
    title: 'Dune: Part Two',
    overview: 'Paul Atreides seeks revenge.',
    rating: 8.6,
    genres: ['Sci-Fi', 'Adventure'],
    posterUrl: 'https://thumb.jpg',
    backdropUrl: 'https://backdrop.jpg',
    source: 'kinocheck',
    youtubeVideoId: 'E-Q2tEgJ1ZI',
  }),
  fetchTop10BoxOffice: vi.fn().mockResolvedValue([
    {
      id: 'kc-1',
      title: 'Dune: Part Two',
      rating: 8.6,
      genres: ['Sci-Fi'],
      posterUrl: 'https://thumb.jpg',
      source: 'kinocheck',
    },
  ]),
  fetchLiveTrailers: vi.fn().mockResolvedValue([]),
  fetchCatalogMovies: vi.fn().mockResolvedValue([]),
}));

describe('Homepage Live Experience', () => {
  it('renders Hero Banner and Top 10 Box Office shelf without upcoming movies', async () => {
    render(
      <Providers>
        <Home />
      </Providers>
    );

    expect(await screen.findByText(/Top 10 Box Office/i)).toBeInTheDocument();
    expect(screen.queryByText(/upcoming movies/i)).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/app/page.test.tsx`
Expected: FAIL (upcoming elements present or mock data dependencies)

- [ ] **Step 3: Restructure `src/app/page.tsx`, `HeroBanner.tsx`, and `src/app/movies/page.tsx`**

Implement:
- `HeroBanner.tsx`: Full-bleed cinema backdrop, title typography, IMDb gold badge, "▶ Watch Trailer" button (triggers video modal), "ℹ More Details" button.
- `src/app/page.tsx`:
  - Section 1: Hero Banner
  - Section 2: Top 10 Box Office Shelf (Numbered 1-10 with `NumberedMovieCard`)
  - Section 3: Curated Live Shelves ("Critically Acclaimed", "Action & Thrillers", "Sci-Fi Dimensions")
  - Section 4: Live Official Video Trailers Carousel (KinoCheck)
  - Floating Mate Messenger popup button at bottom right.
- `src/app/movies/page.tsx`:
  - Catalog browser powered by live TVMaze search & genre filter queries.
  - Upcoming tab and upcoming filters completely purged.
- Delete `src/data/curatedMovies.ts`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/app/page.test.tsx src/app/movies/page.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/app/page.test.tsx src/components/common/HeroBanner.tsx src/app/movies/page.tsx src/app/movies/page.test.tsx
git rm src/data/curatedMovies.ts
git commit -m "feat: restructure homepage and movies catalog with live APIs and delete mock data"
```

---

### Task 9: Complete Test Suite Verification & Responsiveness Polish

**Files:**
- Modify: Any files needing test adjustments
- Verify: Entire codebase

**Interfaces:**
- Consumes: All tests across `src/`.
- Produces: 100% passing test suite and clean production build.

- [ ] **Step 1: Run full test suite**

Run: `npm run test`
Expected: ALL test suites pass (0 failures)

- [ ] **Step 2: Run production build check**

Run: `npm run build`
Expected: Next.js build succeeds with 0 type errors and 0 lint errors

- [ ] **Step 3: Final verification commit**

```bash
git commit -m "chore: verify test suite passes and build succeeds for luxury redesign"
```
