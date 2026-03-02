# Frontend Architecture

## 1. Overview

Foliogen's frontend is a **single-page application** built with React 18, Vite, and TailwindCSS. The application follows a component-driven architecture with clear separation between page-level routes, feature modules, and shared UI primitives.

## 2. Monorepo Structure

```
src/
├── pages/               # Route-level entry points (1 per route)
├── components/
│   ├── ui/              # shadcn/ui design system primitives
│   ├── landing/         # Marketing/landing page sections
│   ├── dashboard/       # Dashboard feature module
│   │   ├── forms/       # Data entry components
│   │   ├── sections/    # Sidebar panel content
│   │   ├── templates/   # Template preview renderers
│   │   └── analytics/   # Charts and score displays
│   ├── jobs/            # Job tracker Kanban module
│   ├── public/          # Public portfolio utilities
│   └── templates/       # Full-page portfolio templates
├── contexts/            # React Context providers
├── hooks/               # Custom hooks (debounce, favorites, etc.)
├── lib/                 # Pure utility functions
├── integrations/        # External service clients
└── types/               # TypeScript declarations
```

## 3. Routing

React Router v6 with flat route configuration in `App.tsx`:

| Path | Component | Auth Required |
|------|-----------|---------------|
| `/` | `Index` | No |
| `/auth` | `Auth` | No |
| `/dashboard` | `Dashboard` | Yes (redirect to `/auth`) |
| `/p/:id` | `PublicPortfolio` | No |
| `/templates` | `TemplatesGallery` | No |
| `/social-kit` | `SocialKit` | No |
| `/privacy` | `Privacy` | No |
| `*` | `NotFound` | No |

## 4. State Architecture

### Context Providers (nested in `App.tsx`)

```
HelmetProvider
  └── QueryClientProvider
        └── ThemeProvider
              └── AuthProvider
                    └── ProProvider
                          └── TooltipProvider
                                └── BrowserRouter
```

### Data Flow Pattern

1. **Profile editing**: `ProfileContext.updateProfile()` → local state → live preview re-render
2. **Save**: `ProfileContext.saveProfile()` → Supabase PATCH → optimistic UI
3. **Public render**: `useQuery` → `profiles_public` view → template props

## 5. Design System Integration

- All colors defined as HSL CSS custom properties in `index.css`
- Components consume semantic tokens (`--primary`, `--background`, `--muted`, etc.)
- Dark mode via CSS variable swap (no conditional class logic in components)
- shadcn/ui components extended with `class-variance-authority` variants

## 6. Performance Strategy

- **Code splitting**: `React.lazy()` for template components
- **Image optimization**: Lazy loading, `SmartProjectImage` with fallback
- **Bundle**: Vite tree-shaking + chunk splitting
- **Caching**: TanStack Query with `staleTime` for profile data
