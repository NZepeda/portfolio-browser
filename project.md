# Developer Portfolio Browser – Project Plan

A Next.js web app that lets you browse developer portfolio websites from a curated list.
The browsing UI includes:

- Prev / Next navigation
- Random portfolio selection
- Embedded iframe preview
- “Open in new tab” button
- Loading indicators + graceful fallback for sites that block embedding

This document describes the project structure, data strategy, components, and implementation steps.

---

## 1. Project Overview

Goal: Create a tool to browse personal developer portfolio websites sourced from the GitHub repo `emmabostian/developer-portfolios`.

The app should:

1. Show one portfolio at a time.
2. Allow navigation:
   - Previous
   - Next
   - Random
3. Display site details:
   - Name
   - Description
   - URL
4. Show the website via iframe preview.
5. Provide a fallback and “Open in new tab” option when embedding fails.
6. Use Next.js 15 (app router) with simple, local data (no runtime fetching).

---

## 2. Data Strategy (Simplest Option)

Use a local TypeScript file exporting the list of portfolios.

### Benefits

- No HTTP fetch or API routes needed.
- Works in local dev and production the same way.
- Very fast and easy to change.
- Can later be replaced by a generated file without changing React components.

### File: `app/data/portfolios.ts`

Type and data shape:

    export type Portfolio = {
      id: number;
      name: string;
      url: string;
      description?: string;
    };

    export const portfolios: Portfolio[] = [
      {
        id: 0,
        name: "Aaa Dev Mir",
        url: "https://www.mrwajahatalimir.com",
        description: "App Developer | Python Programmer | Android Enthusiast"
      },
      // ...more entries copied from the GitHub list
    ];

Start with a smaller subset and expand as needed.

---

## 3. Directory Structure

Basic structure:

    app/
      page.tsx                # Entry (server component)
      data/
        portfolios.ts         # Static local data file (list of portfolios)
      components/
        PortfolioBrowser.tsx  # Client logic for navigation + iframe
        TopNav.tsx            # Previous/Next/Random UI
        IframeViewer.tsx      # Iframe + loading overlay
        PortfolioCard.tsx     # (Optional) Metadata UI for current portfolio

    public/
      # Optional: static assets later

    styles/
      # Optional: global CSS or Tailwind config

---

## 4. Component Responsibilities

### 4.1 `page.tsx` (Server Component)

Responsibilities:

- Import `portfolios` from `app/data/portfolios`.
- Render the `<PortfolioBrowser />` client component.
- Provide a page-level layout (title/header + main content).

Pseudo-usage:

    import { portfolios } from "./data/portfolios";
    import PortfolioBrowser from "./components/PortfolioBrowser";

    export default function Page() {
      return (
        <main>
          <h1>Developer Portfolio Browser</h1>
          <PortfolioBrowser portfolios={portfolios} />
        </main>
      );
    }

### 4.2 `PortfolioBrowser.tsx` (Client Component)

Core logic of the app.

State:

- `currentIndex: number` – which portfolio is currently shown.
- `isIframeLoading: boolean` – whether the iframe is still loading.

Responsibilities:

- Implement navigation:
  - `handlePrev`
  - `handleNext`
  - `handleRandom`
- Reset `isIframeLoading` to `true` when `currentIndex` changes.
- Render:
  - `<TopNav />` (pass handlers and index info).
  - Portfolio metadata (name, description, URL, “Open in new tab”).
  - `<IframeViewer />` (pass URL, loading state, onLoad handler).

High-level structure:

    "use client";

    import { useEffect, useState } from "react";
    import type { Portfolio } from "../data/portfolios";
    import TopNav from "./TopNav";
    import IframeViewer from "./IframeViewer";

    export default function PortfolioBrowser({ portfolios }: { portfolios: Portfolio[] }) {
      const [currentIndex, setCurrentIndex] = useState(0);
      const [isIframeLoading, setIsIframeLoading] = useState(false);

      const total = portfolios.length;
      const current = portfolios[currentIndex];

      useEffect(() => {
        setIsIframeLoading(true);
      }, [currentIndex]);

      // handlers: handlePrev, handleNext, handleRandom...

      return (
        // TopNav + metadata + IframeViewer
      );
    }

### 4.3 `TopNav.tsx`

Responsibilities:

- Render navigation bar with:
  - Previous
  - Random
  - Next
  - Index indicator (e.g. `currentIndex + 1` / `total`)

Props:

- `currentIndex: number`
- `total: number`
- `onPrev: () => void`
- `onNext: () => void`
- `onRandom: () => void`

Sketch:

    "use client";

    function TopNav({ currentIndex, total, onPrev, onNext, onRandom }) {
      return (
        <header>
          <button onClick={onPrev}>← Prev</button>
          <button onClick={onRandom}>Random 🎲</button>
          <button onClick={onNext}>Next →</button>
          <span>{currentIndex + 1} / {total}</span>
        </header>
      );
    }

### 4.4 `IframeViewer.tsx`

Responsibilities:

- Render an iframe with the given URL.
- Show a loading overlay while `isLoading` is true.
- Call `onLoad` when the iframe finishes loading.
- Display helper text for sites that won’t embed.

Props:

- `url: string`
- `isLoading: boolean`
- `onLoad: () => void`

Sketch:

    "use client";

    function IframeViewer({ url, isLoading, onLoad }) {
      return (
        <div className="relative w-full h-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60">
              Loading preview...
            </div>
          )}
          <iframe
            src={url}
            title={url}
            loading="lazy"
            onLoad={onLoad}
            className="w-full h-full border-0"
          />
          <p className="text-xs">
            If you don’t see the site, it may block embedding. Use “Open in new tab.”
          </p>
        </div>
      );
    }

### 4.5 `PortfolioCard.tsx` (Optional)

Responsibilities:

- Show metadata for the current portfolio:
  - Name
  - Description (if present)
  - URL
  - “Open in new tab” button

This can be inlined in `PortfolioBrowser` or extracted as its own component.

---

## 5. Navigation Logic Details

Let `total = portfolios.length`.

### Previous

Wrap around when going below 0:

    const handlePrev = () => {
      setCurrentIndex((i) => (i - 1 + total) % total);
    };

### Next

Wrap around when going beyond `total - 1`:

    const handleNext = () => {
      setCurrentIndex((i) => (i + 1) % total);
    };

### Random (avoid immediate repeat)

    const handleRandom = () => {
      if (total <= 1) return;

      setCurrentIndex((current) => {
        let i = current;
        while (i === current) {
          i = Math.floor(Math.random() * total);
        }
        return i;
      });
    };

Whenever `currentIndex` changes, `useEffect` sets `isIframeLoading` to `true`. The iframe’s `onLoad` handler sets it back to `false`.

---

## 6. Iframe Behavior and UX

The iframe will embed the portfolio sites using `src={portfolio.url}`.

Some sites will not allow embedding due to security headers:

- `X-Frame-Options: DENY` or `SAMEORIGIN`
- `Content-Security-Policy: frame-ancestors`

Because you cannot reliably detect all of these from the client, the UX should assume:

- The iframe might fail silently.
- Users always have an escape hatch.

Planned UX:

1. Always show:
   - A visible “Open in new tab” button above the iframe.
2. Show under the iframe:
   - Short message explaining that some sites may not appear in the preview.
3. While `isIframeLoading` is true:
   - Show a semi-opaque loading overlay with text like “Loading preview…”.

---

## 7. Global Layout and Styling

Implementation detail (can use TailwindCSS or simple CSS).

Suggested layout:

- `main`:
  - Top header with title.
  - `<PortfolioBrowser />` fills remaining height.
- Inside `PortfolioBrowser`:
  - `TopNav` at top.
  - Metadata section under nav.
  - `IframeViewer` uses remaining vertical space (flex layout).

Idea with flex:

- `main` is `flex` column, `min-height: 100vh`.
- `PortfolioBrowser` is `flex` column, `flex: 1`.
- `IframeViewer` container is `flex: 1`, `min-height: 0`.

---

## 8. Future Enhancements (Optional)

Once the MVP works, you can extend:

1. Search/filter:
   - Filter portfolios by name or description.
   - Random/next/prev operate on the filtered subset.
2. Keyboard shortcuts:
   - Left arrow → Prev
   - Right arrow → Next
   - `r` → Random
   - `o` → Open in new tab
3. Favorites:
   - Mark portfolios as favorite.
   - Store favorite IDs in `localStorage`.
4. Automatic data generation:
   - Script that reads the GitHub README and generates `app/data/portfolios.ts` or a JSON file.
   - Integrate into `npm run build` so data stays in sync.
5. Dark mode:
   - Toggleable theme or auto dark mode.

---

## 9. MVP Checklist

Data:

- [ ] Create `app/data/portfolios.ts`
- [ ] Add at least 10–20 portfolio entries

Core UI:

- [ ] Create `PortfolioBrowser` with state and nav logic
- [ ] Create `TopNav` with Prev/Random/Next buttons and index display
- [ ] Show current portfolio name, description, and URL
- [ ] Add “Open in new tab” button

Iframe:

- [ ] Implement `IframeViewer` for preview
- [ ] Display loading overlay while iframe loads
- [ ] Show helper text for sites that block embedding

Layout/Styling:

- [ ] Set up basic layout for header, content, and iframe region
- [ ] Make layout responsive

Optional polish:

- [ ] Add keyboard shortcuts
- [ ] Persist last visited index in `localStorage`

---

## 10. Summary

This project is a small, focused Next.js app that:

- Uses a simple local data file (`portfolios.ts`) to store portfolio metadata.
- Renders a client-driven browsing experience with:
  - Previous/Next/Random navigation
  - Iframe previews
  - A clear “Open in new tab” escape hatch
- Keeps the architecture intentionally lightweight and easy to refactor later.

The separation into `page.tsx` (server), `PortfolioBrowser` (client logic), `TopNav`, and `IframeViewer` makes the codebase easy to expand if you decide to add search, favorites, or automated data syncing from GitHub in future iterations.
