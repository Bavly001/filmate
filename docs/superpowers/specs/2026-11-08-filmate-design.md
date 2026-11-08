# Filmate System Design Specification

## Overview
**Filmate** (a fusion of *Film* and *Mate*) is a dark-neon, cinema-grade movie preview and intelligent recommendation web application. It combines a sleek, modern streaming & cinema catalog with an interactive AI-style guided companion (**Mate**) that helps indecisive viewers discover the perfect movie for their current mood, company, venue, and age group.

---

## 1. Intent, Goals & Anti-Goals

### 1.1 Intent & Why
Choosing what to watch often leads to "decision fatigue." Filmate solves this by offering a fast, immersive visual catalog alongside a playful, zero-typing conversational companion that asks targeted emotional and contextual questions, simulates a smart "feeling analysis," and delivers tailored recommendations with progressive fallback logic.

### 1.2 Goals
- **Immersive Cinema Aesthetic:** OLED dark background (`#08070d`) with the approved **Electric Sunset** palette (warm sunset tangerine `#ff6b2b`, cyber-violet neon `#e040fb`, golden amber `#ffa726`, and smoky glassmorphism).
- **Subtle Ambient Motion:** Soft animated glowing projector/ambient mesh in the background that continuously gives life to the site without distracting.
- **Public & Keyless Data Integration:** Connect to free public endpoints (KinoCheck API for official YouTube trailers, upcoming cinema movies, and metadata, plus genre endpoints) with a rich local fallback layer.
- **Zero-Typing Mate Assistant:** A friendly companion flow that asks mood, company, venue, and age group through multi-choice interactive pills.
- **Simulated "Deep Feeling Analysis" Loader:** A suspenseful loader that runs for a realistic minimum delay (2.5–3.5s) to simulate sophisticated emotional computation before presenting the recommendation.
- **Dynamic Recommendation & Fallback Loop:** 
  - Randomly selects from matching candidate pool.
  - User can accept ("Yes, perfect!") or decline ("No, give me another").
  - Tracks rejected movies in session state to prevent repeat recommendations.
  - Progressively relaxes category filters when the pool is exhausted (e.g., [Drama, Comedy, Romance] → [Drama, Comedy] → [Drama]).
  - Gracefully alerts user when all matches are exhausted.
- **Trailer Playback:** Seamless in-app pop-up modal playing official YouTube movie trailers without navigating away.
- **Responsive & Performant:** Fast loading, fluid on desktop, tablet, and mobile with no horizontal scroll.

### 1.3 Non-Goals & Anti-Goals
- **Non-Goals:**
  - Full user authentication/login accounts (not required for MVP; session state in Zustand/localStorage is sufficient).
  - Paid ticketing or actual movie streaming/hosting (Filmate previews metadata and trailers and badges platforms).
- **Anti-Goals:**
  - Free-form text chatbot inputs (the user explicitly specified no typing; users only select from curated choice pills to guarantee swift, deterministic recommendations).
  - Generic flat light-mode design (Filmate is exclusively a dark-mode cinema experience).

---

## 2. Visual Design & Theme Contract

### 2.1 Color System (Electric Sunset Palette)
- **Background OLED Base:** `#08070d`
- **Surface / Card Background:** `rgba(18, 17, 26, 0.82)` with backdrop blur `16px`
- **Primary Warm Accent (Tangerine):** `#ff6b2b` (used for active borders, primary buttons, logo highlight)
- **Secondary Excitement Accent (Cyber Violet):** `#e040fb` (used for neon badges, gradient buttons, hover glows)
- **Cinema Gold Accent:** `#ffa726` (used for star ratings, awards, cinema tags)
- **Text Hierarchy:**
  - High Emphasis: `#ffffff`
  - Medium Emphasis: `#d4d4dc`
  - Low Emphasis / Meta: `#8c8c9a`
- **Borders:** `rgba(255, 107, 43, 0.22)` with subtle hover bloom

### 2.2 Ambient Motion
- Fixed, non-blocking background radial gradients with subtle `scale` and `opacity` oscillation (using CSS or Framer Motion) simulating cinema projector dust and soft light refraction.
- Floating Mate button in the bottom right corner with animated expanding neon ping ring.

---

## 3. Core Features & User Flows

### 3.1 Main Showcase & Navigation
- **Header:**
  - Logo: `Fil` in crisp white, `Mate` in glowing sunset neon with film reel icon.
  - Links: *Trending Now*, *In Cinema*, *Upcoming Releases*, *Top Rated*.
  - Action: "Talk to Mate 🤖" button that directly triggers the recommendation drawer.
- **Hero Banner:**
  - Welcoming callout highlighting Mate's decision engine with a "Start Movie Quiz →" CTA button.
- **Movie Grids & Carousels:**
  - Categorized rows: *Now Showing in Cinemas*, *Upcoming Trailers*, *Popular Streaming Hits*.
  - Movie Cards displaying:
    - High-definition poster with smooth hover zoom.
    - Badges: `IN CINEMA`, `UPCOMING`, `NETFLIX`, `PRIME VIDEO`, `DISNEY+`, `IMAX`.
    - Star Rating (`★ 8.8`).
    - Release year and genres.
    - Floating "Play Trailer" button triggering the modal trailer player.
- **Trailer Modal:**
  - Dark glass overlay with close button (`Esc` or backdrop click).
  - High-res YouTube embed iframe playing official trailer.
  - Movie synopsis, director, cast, and platform links.

---

## 4. The Mate Recommendation Engine

### 4.1 Invocation
- Launched either from the Hero Banner button, the header navigation, or the persistent floating robot action button in the bottom-right corner.
- Opens a sleek right-side drawer or centered neon glass dialog.

### 4.2 Scripted Choice Questions (No Typing)
The chat starts with the greeting:
> *"Hi mate! I'm your mate that will help you choose which movie you watch."*

The user is guided through sequential or grouped choice pills:
1. **Mood / Feeling (Multi-select supported):**
   - ⚡ High Adrenaline & Thrills (Action, Adventure)
   - 😂 Need a Good Laugh (Comedy)
   - 🍷 Warm Romance & Feelings (Romance, Drama)
   - 🧠 Mind-Twisting & Deep (Sci-Fi, Mystery, Thriller)
   - 😱 Spooky & Terrifying (Horror)
   - 🍿 Feel-Good & Heartwarming (Family, Animation)
2. **Company / Setting:**
   - 🛋️ Solo Movie Night
   - 💑 With Partner (Date Night)
   - 👨‍👩‍👧 Family & Kids
   - 🍻 Friends Night Out
3. **Venue:**
   - 🍿 In Cinema (Big Screen)
   - 🏠 At Home (Streaming)
4. **Age Classification:**
   - 🔞 18+ (Mature / Unrestricted)
   - 👨‍👩‍👧 All Ages / Under 18 (Family Friendly)

### 4.3 Fake "Deep Analysis" Loader
- Once the user clicks "Find My Movie":
  - Triggers an animated neon spinner and step-by-step diagnostic text:
    - *"Analyzing your feelings and emotional state..."*
    - *"Filtering age ratings and viewing company..."*
    - *"Cross-referencing cinema showtimes & streaming platforms..."*
  - **Timing Enforcement:** An artificial delay between 2.5s and 3.5s is enforced via a timer promise. Even if API data is already fetched in 100ms, the loader remains visible until the timer elapses to deliver the intended psychological satisfaction.

### 4.4 Recommendation & Feedback Loop
- **Decision Pool Generation:**
  - Query movies matching selected genres + age rating + venue.
  - Pick a random title from the candidate list that is not in `rejectedMovieIds`.
### 4.4 Recommendation & Progressive Category Relaxation Engine
- **Matching Algorithm:**
  - Candidate movies are matched against the user's active categories using **intersection matching** (movies containing all active selected genre moods, e.g. `[Drama, Comedy, Romance]`).
  - **Company & Setting Influences:**
    - If `Family & Kids` is chosen: Automatically sets/enforces the `All Ages` filter and excludes mature content regardless of age pill selection.
    - If `Partner / Date Night`: Prioritizes romance, high-rated drama, and captivating thriller.
    - If `Solo Chill`: Broadens to mind-bending sci-fi, intense crime/thrillers, or deep dramas.
    - If `Friends Night Out`: Prioritizes high adrenaline action, horror, and laugh-out-loud comedy.
  - **Exclusion & Relaxation Flow:**
    1. A random movie is picked from the intersection pool and shown to the user with tailored rationale.
    2. If the user clicks `✅ Yes, I love this!`, the session concludes with a celebratory success message.
    3. If the user clicks `❌ No, give me another`:
       - The rejected movie is saved to `seenMovieIds`.
       - If unshown movies remain in the current intersection pool, the next random candidate is displayed.
       - When the current pool is exhausted, the engine **relaxes the category constraint by removing the last selected mood category** (e.g., dropping from `[Drama, Comedy, Romance]` down to `[Drama, Comedy]`, thereby expanding the candidate pool).
       - Candidates are filtered against `seenMovieIds` to guarantee zero repeats.
       - When only 1 category remains and all matching titles have been seen and rejected, Mate displays the friendly terminal message: *"Sorry mate, we've exhausted all matching movies for this combination! Try restarting with different feelings."*

---

## 5. Technical Architecture & Stack

### 5.1 Tech Stack
- **Framework:** Next.js 14+ (App Router, React 18, Server & Client Components)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + Custom Neon Glow utilities (`box-shadow`, `backdrop-filter`)
- **State Management:** Zustand (Mate modal state, quiz answers, exclusion lists, search filters)
- **Data Fetching:** TanStack Query v5 (`@tanstack/react-query`) for caching, background revalidation, and loading states
- **Animation:** Framer Motion for drawer slide-ins, modal scale transitions, ambient glow pulse, and card hover effects
- **Icons:** `lucide-react`

### 5.2 Data Architecture & API Unification
- **Primary Catalog (Curated Rich Dataset):**
  - Stored in `src/data/curatedMovies.ts` (120+ top acclaimed cinema and streaming titles).
  - Contains full metadata: vertical 2:3 portrait posters, platform tags (`Netflix`, `Prime`, `Disney+`, `Cinema IMAX`), age classifications (`18+`, `All Ages`), IMDb ratings, synopsis, and genres.
  - Guarantees 100% uptime, zero rate limits, and instant local filtering for the Mate algorithm.
- **Live Keyless Trailer Feed (KinoCheck API):**
  - Fetched live via `https://api.kinocheck.com/trailers/recommended?language=en`.
  - Populates the dedicated **"Live Upcoming Trailers & Cinema Exclusives"** section.
  - Rendered with an optimized 16:9 widescreen trailer card format showing view count, YouTube video badges, and instant pop-up playback.
- **Unified Movie Card & Modal Handlers:**
  - `TrailerModal` accepts either YouTube video keys (from KinoCheck or curated items) and seamlessly streams official trailers in a dark neon glass player.

---

## 6. Project Structure

```
filmate/
├── docs/
│   └── superpowers/specs/
│       └── 2026-11-08-filmate-design.md
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.tsx
│   │   │   ├── AmbientBackground.tsx
│   │   │   └── Footer.tsx
│   │   ├── movie/
│   │   │   ├── MovieCard.tsx
│   │   │   ├── MovieGrid.tsx
│   │   │   ├── TrailerModal.tsx
│   │   │   └── CategoryTabs.tsx
│   │   └── mate/
│   │       ├── MateDrawer.tsx
│   │       ├── MateQuestionnaire.tsx
│   │       ├── MateAnalysisLoader.tsx
│   │       ├── MateResultCard.tsx
│   │       └── FloatingMateButton.tsx
│   ├── data/
│   │   └── curatedMovies.ts
│   ├── hooks/
│   │   ├── useMovies.ts
│   │   └── useTrailers.ts
│   ├── store/
│   │   ├── useMateStore.ts
│   │   └── useMovieStore.ts
│   └── types/
│       └── movie.ts
├── public/
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 7. Verification & Success Criteria
1. **Visual Fidelity:** OLED dark aesthetic with Electric Sunset glows, glass cards, and smooth ambient motion.
2. **API & Data Rendering:** Real posters, upcoming movies, and streaming badges load and display cleanly.
3. **Trailer Playback:** Clicking any trailer button smoothly opens a modal and streams the YouTube trailer.
4. **Mate Script Flow:**
   - No typing required.
   - Multi-step choices record mood, age, venue, and company.
   - Analysis loader runs for minimum 2.5s with engaging step messages.
   - Recommendation displays with options to accept or request another.
   - Rejection correctly records to exclusion list and gracefully broadens categories when exhausted.
