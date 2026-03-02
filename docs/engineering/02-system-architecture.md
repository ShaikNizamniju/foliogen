# System Architecture

## 1. High-Level Overview

```
┌─────────────────────────────────────────────────────┐
│                   Client Layer                       │
│  React 18 + Vite + TailwindCSS + Framer Motion      │
│  ┌─────────┐  ┌──────────┐  ┌───────────────────┐   │
│  │ Landing  │  │Dashboard │  │ Public Portfolio   │   │
│  └─────────┘  └──────────┘  └───────────────────┘   │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS / REST
┌──────────────────────▼──────────────────────────────┐
│                 Backend Layer                         │
│  Supabase (PostgreSQL + Auth + Storage + Edge Fns)   │
│  ┌──────────┐  ┌────────────┐  ┌────────────────┐   │
│  │ Auth     │  │ Database   │  │ Edge Functions │   │
│  │ (JWT)    │  │ (RLS)      │  │ (Deno Runtime) │   │
│  └──────────┘  └────────────┘  └────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## 2. Data Flow

1. **Authenticated Flow**: User → Auth (JWT) → Dashboard → Supabase Client → PostgreSQL (RLS-filtered)
2. **Public Flow**: Visitor → `/p/:id` → `profiles_public` view → Read-only render
3. **AI Flow**: Dashboard → Edge Function → AI Model API → Parsed/scored response → Client

## 3. Dual-Mode Rendering

All portfolio templates implement a **dual-mode prop pattern**:

```typescript
interface TemplateProps {
  profile: ProfileData;  // When populated → live user data
                         // When empty    → demo/placeholder data
}

// Resolution logic
const displayData = profile.fullName ? profile : DEMO_PROFILE;
```

This enables:
- **Dashboard Preview**: Real data rendered in real-time as user edits
- **Template Gallery**: Demo data showcasing template design
- **Public Portfolio**: Live data fetched from `profiles_public` view

## 4. Animation Layer

Framer Motion provides the animation substrate across all templates:
- Page transitions via `AnimatePresence`
- Scroll-triggered reveals via `whileInView`
- Micro-interactions on hover/tap states
- Template-specific motion variants (e.g., Brutalist shake, Swiss grid slide)

## 5. State Management

| Scope | Solution | Purpose |
|-------|----------|---------|
| Server state | TanStack Query | Caching, deduplication, background refetch |
| Auth state | `AuthContext` | Session/user lifecycle |
| Profile state | `ProfileContext` | Dashboard form ↔ preview sync |
| Pro status | `ProContext` | Feature gating |
| Theme | `ThemeProvider` | Light/dark mode persistence |

## 6. Security Boundaries

- **Row Level Security**: All user-owned tables enforce `auth.uid() = user_id`
- **Public View**: `profiles_public` exposes only non-sensitive columns
- **Rate Limiting**: `check_rate_limit` RPC guards AI and contact endpoints
- **Edge Function Auth**: JWT validation on all authenticated endpoints
