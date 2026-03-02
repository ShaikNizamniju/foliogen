# Technical Specifications

## 1. Information Architecture

### Sitemap

```
/                        Landing Page
├── /auth                Authentication (Sign In / Sign Up)
├── /dashboard           Authenticated Dashboard
│   ├── Overview         Portfolio strength, analytics summary
│   ├── Profile          BasicInfoForm, photo upload, social links
│   ├── Projects         CRUD with image, tech stack, visibility
│   ├── Experience       Work history timeline
│   ├── Skills           Tag-based skill management
│   ├── Templates        Gallery with live preview
│   ├── Jobs             Kanban job tracker
│   ├── Billing          Pro subscription management
│   └── Settings         Account, export, danger zone
├── /p/:id               Public Portfolio (username or user_id)
├── /templates           Public template gallery
├── /social-kit          Social media card generator
├── /privacy             Privacy policy
└── *                    404 Not Found
```

### Navigation Model

- **Landing**: Unauthenticated users → marketing pages
- **Dashboard**: Sidebar-driven SPA with `DashboardSidebar` + `DashboardContent`
- **Public Portfolio**: Standalone render, no navigation chrome

## 2. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | React | 18.3.x |
| Build | Vite | Latest |
| Styling | TailwindCSS + shadcn/ui | 3.x |
| Animation | Framer Motion | 12.x |
| Routing | React Router DOM | 6.x |
| State | TanStack Query + Context | 5.x |
| Backend | Supabase (PostgreSQL 15) | — |
| Auth | Supabase Auth (JWT) | — |
| Edge Functions | Deno Runtime | — |
| Type Safety | TypeScript | 5.x |

## 3. Component Architecture

```
src/
├── components/
│   ├── ui/              # shadcn/ui primitives (Button, Dialog, etc.)
│   ├── landing/         # Marketing page sections
│   ├── dashboard/       # Dashboard layout + forms + sections
│   │   ├── forms/       # Profile editing components
│   │   ├── sections/    # Sidebar content panels
│   │   ├── templates/   # Dashboard template previews
│   │   └── analytics/   # Charts and metrics
│   ├── jobs/            # Job tracker Kanban
│   ├── public/          # Public portfolio utilities
│   └── templates/       # Full-page portfolio templates
├── contexts/            # Auth, Profile, Pro, Theme
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── pages/               # Route-level components
└── integrations/        # Supabase client + types
```

## 4. Design System

- **Tokens**: HSL-based CSS custom properties in `index.css`
- **Theming**: Light/dark via `next-themes` + CSS variable swap
- **Typography**: Google Fonts catalog with 17 curated choices
- **Spacing**: Tailwind default scale (4px base unit)
- **Components**: shadcn/ui with custom variants via `class-variance-authority`
