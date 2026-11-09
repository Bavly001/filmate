# Filmate Luxury Redesign: WatchIT Modern Luxury & Live API Architecture

## 1. Intent & Purpose
Transform Filmate into an ultra-premium, modern luxury cinematic streaming platform inspired by **WatchIT Midnight Gold** with elements from **Netflix** and **Yango Play**. 

The redesign delivers:
- **Modern Luxury Aesthetic:** Deep obsidian canvas (`#07080B`), midnight slate card surfaces (`#10121B`), and royal gold & amber highlights (`#F59E0B`, `#FDE68A`, `#D97706`).
- **Dynamic Header:** Starts 100% transparent at the top of the page, smoothly transitions to frosted glassmorphism (`backdrop-blur-md bg-[#0B0D13]/85 border-b border-amber-500/15`) on scroll.
- **Header Navigation:**
  - **NO search bar** on the header.
  - **NO "Trailers" tab** on the header.
  - **API-driven content tabs:** *Discover*, *Movies*, *Trending*, *Top Rated*.
  - **Constant pages:** *About Us* (`/about`) and *Contact Us* (`/contact`).
  - Mobile responsive hamburger menu drawer for compact viewports.
- **HeroUI & Framer Motion:** Modern UI primitives (Buttons, Chips, Modals, Dropdowns, Tabs, Cards) integrated via `@nextui-org/react` (HeroUI for React 18) seamlessly with custom luxury gold styling and butter-smooth animation physics.
- **100% Real Live Public APIs:** Completely removing all static `curatedMovies` mock data arrays. Integrated with **KinoCheck API** for real cinema movies, box office hits, and live YouTube trailers + **TVMaze REST API** (keyless, free) for live titles, genres, ratings, cast, and high-res imagery + optional **TMDB** (`NEXT_PUBLIC_TMDB_API_KEY`).
- **Prefixed ID Namespace:** Unified movie identifier system (`kc-{id}` for KinoCheck, `tvm-{id}` for TVMaze, `tmdb-{id}` for TMDB) avoiding any ID collision across public providers.
- **Complete Purge of Upcoming Movies:** All upcoming movie logic, filter badges, and questionnaire steps removed across the entire application.
- **Mate AI Redesign: Side Messenger Popup Chat:** Sleek, non-blocking 360px floating popup chat in the bottom-right corner with a smaller trigger icon, interactive vibe chips, natural language search matching, and inline recommendation mini-cards with direct trailer playback. Works 100% out-of-the-box without keys, with an optional `/api/mate/chat` LLM streaming hook if an API key is provided.
- **Strict Responsiveness:** 100% fluid and tested across mobile (375px+), tablet (768px+), and widescreen desktop (1280px+).

---

## 2. Header & Navigation Structure
- **Initial State (`scrollY === 0`):** `bg-transparent border-transparent`.
- **Scrolled State (`scrollY > 20`):** `bg-[#0B0D13]/85 backdrop-blur-md border-b border-amber-500/15 shadow-2xl shadow-black/60`.
- **Desktop Navigation Links:**
  - **Discover** (`/` - Cinema Showcase, Top 10 Box Office, Curated Rows, Live Trailers)
  - **Movies** (`/movies` - Catalog browser with genre filters and live pagination/search)
  - **Trending** (`/#trending` - Section anchor to live trending titles)
  - **Top Rated** (`/#top-rated` - Section anchor to critically acclaimed titles)
  - **About Us** (`/about` - Constant luxury brand storytelling page)
  - **Contact Us** (`/contact` - Constant VIP support and inquiries page)
- **Header Actions (Right):**
  - VIP Lounge status chip (Gold star badge)
  - User profile avatar / VIP indicator
  - **Mobile:** Elegant slide-out navigation sheet matching the midnight gold theme.

---

## 3. Data Architecture: 100% Real Public APIs (Zero Constant Mock Data)
- **Live Catalog & Details (`src/services/movieApi.ts`):**
  - Powered by **KinoCheck API** (`https://api.kinocheck.com/trailers/recommended?language=en`):
    - Real live cinema titles, YouTube video IDs (`youtube_video_id`), official HD poster thumbnails, and view counts for the Hero Banner, Top 10 Box Office, and Live Trailers carousel.
  - Powered by **TVMaze API** (`https://api.tvmaze.com`):
    - `fetchFeaturedShowcase()`: High-rated featured title for Hero Banner with backdrop image.
    - `fetchTrendingCatalog()`: Ranked popular titles.
    - `fetchMoviesCatalog(genre?, query?)`: Live catalog with filtering.
    - `fetchMovieById(id)`: Comprehensive details, cast list, summary, ratings.
  - Optional **TMDB API** support via `NEXT_PUBLIC_TMDB_API_KEY`:
    - Automatically enhances data if an API key is provided, while guaranteeing graceful, keyless operation via TVMaze + KinoCheck.
- **Cache & State:** Managed via **TanStack Query** (`@tanstack/react-query`) with automatic background refetching and smooth loading skeletons.

---

## 4. Constant Pages: About Us & Contact Us
1. **About Us (`/about`):**
   - High-end cinematic layout presenting the Filmate mission: curated cinema, intelligent AI pairing, and luxury viewing experiences.
   - Golden stats KPI row (e.g., *10,000+ Titles Indexed*, *Zero Ads*, *Live AI Concierge*).
   - "The Filmate Standard" luxury pillars (Curation, High Fidelity, Intelligent Discovery).
2. **Contact Us (`/contact`):**
   - Sleek VIP Concierge & Support form with gold-accented inputs.
   - Contact methods: VIP Concierge email, Media inquiries, Cairo/Global presence info.
   - Smooth form validation and instant feedback modal.

---

## 5. Floating Messenger Popup Chat: AI Mate
- **Trigger Button (`FloatingMateButton.tsx`):**
  - Compact 42px floating orb at bottom-right (`bottom-6 right-6`).
  - Subtle gold glow, online indicator dot, and tooltip.
- **Messenger Popup Window (`MateChatPopup.tsx`):**
  - Docked bottom-right (`bottom-20 right-6`), 360px wide, max 520px height.
  - Glassmorphic midnight gold styling (`bg-[#10121B]/95 backdrop-blur-xl border border-amber-500/25 rounded-2xl shadow-2xl`).
  - Real-time conversation stream: Mate bubbles, user bubbles, typing dots.
  - Quick mood chips: *"⚡ Mind-bending Sci-Fi"*, *"🍿 Epic Action"*, *"🏆 Award-Winning Drama"*, *"🌙 Late Night Mystery"*.
  - Natural language input: parses user queries and matches against live API catalog.
  - Inline movie recommendation cards with poster, rating, vibe synopsis, and direct "Play Trailer" button.
  - Completely non-blocking: users can browse and watch movies while chatting.

---

## 6. Motion & Animations
- Hero text staggered fade-in with spring transitions.
- Movie cards with `hover:scale-105`, smooth amber glow elevation (`shadow-amber-500/10`), and image scale.
- Video trailer modal with smooth backdrop blur fade and scale-in video player.
- Header scroll transition with CSS `transition: background-color 0.3s ease, border-color 0.3s ease`.
- Mate chat popup with smooth Framer Motion `scale` and `opacity` enter/exit animations.

---

## 7. Responsiveness & Accessibility
- Fluid layouts adapting seamlessly from 375px mobile screens up to 4K displays.
- Touch-friendly tap targets (minimum 44px) on mobile.
- Horizontal carousel shelves with smooth native touch-scrolling and snap behavior on mobile, paired with desktop chevron navigation controls.
- Zero horizontal layout shift or overflow bugs (`overflow-x-hidden`).
