# Deployment Strategy

## 1. Environments

| Environment | Purpose | URL |
|-------------|---------|-----|
| Preview | Development & testing | `*-preview--*.lovable.app` |
| Production | Live application | `foliogen.lovable.app` |

## 2. Release Phases

### Phase 1 — MVP

**Goal**: Core portfolio creation and sharing.

| Feature | Status |
|---------|--------|
| 5+ portfolio templates | ✅ Shipped (12+ templates) |
| Profile CRUD (name, bio, photo, links) | ✅ Shipped |
| Project CRUD with images | ✅ Shipped |
| Work experience management | ✅ Shipped |
| Skills tagging | ✅ Shipped |
| Public portfolio URL (`/p/:id`) | ✅ Shipped |
| Email/password authentication | ✅ Shipped |
| Light/dark theme | ✅ Shipped |
| Mobile-responsive dashboard | ✅ Shipped |

### Phase 2 — Intelligence

**Goal**: AI-powered enhancements and career tools.

| Feature | Status |
|---------|--------|
| AI resume parser (LinkedIn PDF) | ✅ Shipped |
| AI project description enhancement | ✅ Shipped |
| Job application Kanban tracker | ✅ Shipped |
| AI job-match scoring | ✅ Shipped |
| AI interview prep generation | ✅ Shipped |
| Portfolio analytics (views, visitors) | ✅ Shipped |
| Portfolio strength scoring | ✅ Shipped |
| ATS-friendly resume PDF export | ✅ Shipped |

### Phase 3 — Growth

**Goal**: Monetization and advanced features.

| Feature | Status |
|---------|--------|
| Pro subscription tier | ✅ Shipped |
| Custom font selection (17 fonts) | ✅ Shipped |
| Password-protected projects | ✅ Shipped |
| Social media kit generator | ✅ Shipped |
| Profile chatbot (AI Q&A) | ✅ Shipped |
| Contact form with email delivery | ✅ Shipped |
| Custom domains | 🔜 Planned |
| Blog/writing section | 🔜 Planned |
| Team/agency portfolios | 🔜 Planned |

## 3. Deployment Pipeline

```
Code Change → Lovable Build → Preview Deploy → Manual Publish → Production
```

- **Build**: Vite production build with tree-shaking
- **Edge Functions**: Auto-deployed on save
- **Database Migrations**: Applied via migration tool with approval gate
- **Rollback**: Restore to previous version via Lovable UI

## 4. Infrastructure

- **Frontend**: Static assets served via CDN
- **Backend**: Lovable Cloud (managed PostgreSQL, Auth, Storage, Edge Functions)
- **DNS**: Lovable-managed subdomain with optional custom domain support
