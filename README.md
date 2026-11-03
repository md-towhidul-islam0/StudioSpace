<div align="center">

# StudioSpace

**Find & book creative studios by the hour**

A modern studio rental platform for photographers, filmmakers, podcasters, and creators — browse spaces, check details, and book by the hour.

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](#license)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Routes](#routes)
- [Available Scripts](#available-scripts)
- [Authentication](#authentication)
- [Data Fetching & Rendering](#data-fetching--rendering)
- [Troubleshooting](#troubleshooting)
- [Learn More](#learn-more)

---

## Overview

StudioSpace is a full-stack studio booking application. Creators can discover studios by category, view detailed listings, and book spaces by the hour — while hosts can publish, edit, and manage their own listings.

**Key features**

- 🔐 **Authentication** — email/password sign-up and Google OAuth, powered by `better-auth` with JWT sessions
- 🏠 **Home page** — auto-playing hero carousel, category discovery, and featured studios
- 🔍 **Explore studios** — browse listings filtered by category (photo, film, podcast, music, art, dance, and more)
- 📄 **Studio details** — full listing view with amenities, pricing, capacity, and an inline booking modal
- ➕ **Host a studio** — create listings with images, pricing, amenities, and a detailed overview
- ✏️ **Manage listings** — edit or delete your studios, and track your bookings in one place
- 🌗 **Dark mode** — system-aware theme with a manual toggle, applied before first paint (no flash)
- ⚡ **Instant navigations** — partial prerendering and React Server Components keep pages fast

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| UI | [React 19](https://react.dev), TypeScript 5 |
| Styling | [Tailwind CSS 4](https://tailwindcss.com), `tw-animate-css` |
| Components | [shadcn/ui](https://ui.shadcn.com) primitives, Base UI, HeroUI, [Lucide icons](https://lucide.dev) |
| Carousel | [Swiper](https://swiperjs.com) |
| Auth | [better-auth](https://better-auth.com) + MongoDB adapter, Google OAuth, JWT plugin |
| Database | [MongoDB](https://www.mongodb.com) |
| Linting / Formatting | [Biome](https://biomejs.dev) |
| Compiler | React Compiler (experimental) |

---

## Getting Started

### Prerequisites

- **Node.js** 20.11 or later
- A **MongoDB** database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A **Google OAuth** credentials (optional — only needed for Google sign-in)
- The **StudioSpace backend API** running (see [Troubleshooting](#troubleshooting))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or: yarn install / pnpm install / bun install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root — see [Environment Variables](#environment-variables) for the required keys.

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open the app**

   Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env` file in the project root:

```bash
# --- Auth ---
BETTER_AUTH_SECRET=your-auth-secret        # openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000

# --- Database ---
MONGODB_URI=mongodb://localhost:27017      # or your MongoDB Atlas connection string

# --- Backend API ---
API_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000  # used by the frontend for all API calls

# --- Google OAuth (optional) ---
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

> ⚠️ **Never commit `.env` files.** Keep credentials out of version control.

---

## Project Structure

```text
src/
├── app/                      # App Router pages & layouts
│   ├── layout.tsx            # Root layout (NavBar, Footer, theme bootstrap)
│   ├── page.tsx              # Home page
│   ├── login/                # Sign-in page
│   ├── signup/               # Sign-up page
│   ├── add-studio/           # Create a listing        🔒 protected
│   ├── my-listing/           # Manage your listings    🔒 protected
│   ├── booking-list/         # Your bookings           🔒 protected
│   └── explore-studio/
│       ├── page.tsx          # Browse all studios
│       ├── [id]/             # Category-filtered listings
│       ├── eachDetials/[id]/ # Studio details + booking
│       └── edit/[id]/        # Edit a listing          🔒 protected
├── components/               # Reusable UI & feature components
│   ├── ui/                   # shadcn/ui primitives
│   ├── NavBar.tsx            # Responsive nav with session awareness
│   ├── HeroSection.tsx       # Swiper hero carousel
│   ├── FeatureCard*.tsx      # Studio listing cards
│   ├── EachDetialse.tsx      # Detail view + booking modal
│   ├── EditStudioForm.tsx    # Listing editor
│   └── Toast.tsx             # Toast notifications
├── lib/                      # Core services
│   ├── auth.ts               # better-auth server config (MongoDB + Google)
│   └── auth-client.ts        # better-auth React client
└── proxy.ts                  # Route protection middleware
```

🔒 — routes are guarded by `src/proxy.ts` and redirect unauthenticated users to `/signup`.

---

## Routes

| Route | Description | Access |
| --- | --- | --- |
| `/` | Home — hero, categories, featured studios | Public |
| `/explore-studio` | Browse all studios | Public |
| `/explore-studio/[id]` | Studios filtered by category | Public |
| `/explore-studio/eachDetials/[id]` | Studio details & booking | Public |
| `/explore-studio/edit/[id]` | Edit a listing | Protected |
| `/add-studio` | Publish a new studio | Protected |
| `/my-listing` | Manage your listings | Protected |
| `/booking-list` | View your bookings | Protected |
| `/login` · `/signup` | Authentication | Public |

---

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server with Turbopack |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run Biome checks |
| `npm run format` | Format all files with Biome |

---

## Authentication

Auth is handled by [`better-auth`](https://better-auth.com):

- **Providers** — email/password and Google OAuth
- **Sessions** — JWT-based with a 7-day cookie cache
- **Database** — persisted through the official MongoDB adapter
- **Route protection** — `src/proxy.ts` intercepts protected routes and redirects unauthenticated visitors to `/signup`
- **Client access** — components read the session via `authClient.useSession()`, and API calls carry a `Bearer` token obtained from `authClient.token()`

---

## Data Fetching & Rendering

This app uses several Next.js 16 rendering features:

- **`cacheComponents` + `partialPrefetching`** — routes prerender a static shell and stream dynamic content behind `<Suspense>` boundaries (shown as `◐` in the build output).
- **`loading.tsx` files** — dynamic routes (`/explore-studio/[id]`, `/eachDetials/[id]`, `/edit/[id]`) stream their loading state while `params` resolve at request time.
- **Client-side fetching** — listing and category data is fetched from the backend API in client components with loading skeletons.
- **`next/font`** — Geist Sans and Geist Mono are self-hosted and optimized automatically.

> **Note:** the home page's category section fetches from the backend at build time. Start your backend before `npm run build` if you want that data included in the prerendered HTML — otherwise the page still builds successfully and fills in at runtime.

---

## Troubleshooting

<details>
<summary><code>npm run build</code> fails with prerender / <code>Suspense</code> errors</summary>

This project enables `cacheComponents`, which requires runtime-only data (<code>params</code>, <code>usePathname()</code>, <code>fetch()</code>, <code>new Date()</code>) to sit behind a <code>&lt;Suspense&gt;</code> boundary. If you add new dynamic pages, wrap request-time work in <code>&lt;Suspense&gt;</code> or add a <code>loading.tsx</code>. For detailed stacks:

```bash
npx next build --debug-prerender
```

</details>

<details>
<summary>Category list is empty on the home page</summary>

<code>CatagoryCard</code> fetches from the backend during the build. Make sure the backend API (default <code>http://localhost:5000</code>) is running before building, or the list will populate on the next client render.

</details>

<details>
<summary>Protected pages redirect me to <code>/signup</code></summary>

That's expected — <code>src/proxy.ts</code> guards <code>/add-studio</code>, <code>/my-listing</code>, <code>/explore-studio/edit/:id</code>, and <code>/booking-list</code>. Sign in first.

</details>

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) — features and API
- [Learn Next.js](https://nextjs.org/learn) — interactive tutorial
- [better-auth Documentation](https://better-auth.com) — authentication
- [Tailwind CSS Documentation](https://tailwindcss.com) — styling
- [Biome Documentation](https://biomejs.dev) — linting and formatting

---

## Deploy on Vercel

The easiest way to deploy is the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Set the environment variables listed above in your Vercel project settings, then push to your repository's main branch.

See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

<div align="center">
Made with ❤️ using Next.js
</div>
