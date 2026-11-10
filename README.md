# Filmate 🎬

> **Filmate** is a modern cinematic discovery platform and smart assistant designed to help you discover the perfect film or TV show matching your exact mood, company, and viewing preferences — without endless scrolling or decision paralysis.

---

## 🌟 Overview

Choosing what to watch shouldn't feel like work. **Filmate** combines live global cinema catalogs with **Filmate Mate** — an interactive smart assistant that guides you through a personalized questionnaire to pinpoint what fits your night.

Whether you are enjoying a solo night in, planning a cozy date night, hosting a family movie marathon, or hanging out with friends, Filmate Mate tailors recommendations to your mood stack, duration, preferred era, and language preferences.

---

## ✨ Key Features

### 1. 🤖 Smart Mate Assistant
- **Priority Mood Stacks**: Select and prioritize multiple feelings (e.g. *😂 Laugh Out Loud*, *⚡ Thrilled & Edge-of-Seat*, *🤯 Mind-Bending Sci-Fi*).
- **Company & Occasion Filtering**: Tailor recommendations for solo viewings, date nights, family with kids, or friends hangouts.
- **Granular Controls**: Filter by era (recent hits, 2010s, 2000s, 90s, retro), content rating, runtime (snappy, standard, epic), and multi-language selections.
- **Adaptive Recommendation Discovery**: If an ultra-niche combination has no direct matches, Filmate Mate automatically and smoothly broadens your mood stack to surface the top curated title.
- **Feedback & Re-roll**: Love your recommendation or ask for another tailored title with a single click.

### 2. 🍿 Comprehensive Cinema & TV Catalogs
- **Live Trending Feeds**: Day and week trending movies and television series powered by TMDB.
- **Categorized Carousels**: *Now Playing*, *Top Rated*, *Upcoming*, and *On The Air*.
- **Interactive Catalogs**: Infinite/paginated browsing with multi-genre filters, release window filters, and sorting options (popularity, release date, rating, vote count, title).

### 3. 🔍 Universal Instant Search
- **Instant Search Modal**: Fast, keyboard-accessible (`ESC` to close, `Enter` to submit) search overlay.
- **Filter by Type**: Quickly switch between All, Movies, and TV Shows.
- **Deep Catalog Linking**: Open your active search query directly in the full catalog view.
- **Scroll-Locked Viewport**: Clean modal presentation with zero background scroll chaining.

### 4. 📽️ Immersive Detail Pages
- Full cinematic backdrops, high-resolution posters, ratings, cast highlights, runtimes, genres, and overviews.
- Direct trailer previews and related movie suggestions.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching & Cache**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons & Animations**: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/), [Framer Motion](https://www.framer.com/motion/)
- **Testing**: [Vitest](https://vitest.dev/), [Testing Library](https://testing-library.com/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.17 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)
- A free [TMDB API](https://www.themoviedb.org/documentation/api) account and API Read Access Token

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Bavly001/filmate.git
   cd filmate
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Add your TMDB API credentials inside `.env.local`:
   ```env
   # Recommended: TMDB API v4 Read Access Token (Bearer Token)
   TMDB_READ_ACCESS_TOKEN=your_tmdb_read_access_token_here
   NEXT_PUBLIC_TMDB_READ_ACCESS_TOKEN=your_tmdb_read_access_token_here

   # Optional fallback: TMDB API v3 Key
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Run tests**:
   ```bash
   npm run test
   ```

6. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📁 Project Structure

```
filmate/
├── public/                  # Static assets and favicons
├── src/
│   ├── app/                 # Next.js App Router pages and layouts
│   │   ├── home/            # Home hero slider and sections
│   │   ├── movies/          # Movies catalog and movie details
│   │   ├── tv-shows/        # TV shows catalog and series details
│   │   ├── about/           # About Us page
│   │   ├── layout.tsx       # Root layout with providers & modals
│   │   └── providers.tsx    # TanStack Query & NextUI providers
│   ├── components/          # Reusable UI components
│   │   ├── mate/            # Smart Mate Bot & interactive questionnaire
│   │   ├── movie-card/      # Movie cards with hover states & badges
│   │   ├── Navbar.tsx       # Navigation bar with scroll-aware styling
│   │   ├── SearchOverlay.tsx# Universal instant search modal
│   │   └── Footer.tsx       # Application footer
│   ├── constants/           # Genres, sort options, and language definitions
│   ├── hooks/               # Custom TanStack Query hooks
│   ├── lib/                 # Direct TMDB client & error handling
│   ├── services/            # Media catalog & discovery API services
│   ├── store/               # Zustand stores (useMateStore, useSearchStore)
│   └── types/               # TypeScript interfaces for TMDB data
└── .env.example             # Example environment configuration
```

---

## 👤 Author

Developed by **Bavly** ([@Bavly001](https://github.com/Bavly001))

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
