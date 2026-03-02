# Product Requirements

## 1. Overview

**Foliogen** is a portfolio-generation platform that enables professionals to build, customize, and publish high-quality portfolio websites without writing code. Users populate a single data model and select from curated templates to produce a public-facing portfolio with a unique shareable URL.

## 2. User Stories

| Role | Goal | Acceptance Criteria |
|------|------|---------------------|
| Job Seeker | Swap templates instantly to see which best highlights my skills | Template preview updates in real-time within the dashboard |
| Job Seeker | Upload my resume and have it auto-populate my profile | Parser extracts name, experience, skills, and projects with ≥80% accuracy |
| Job Seeker | Share a single link with recruiters that always shows my latest data | Public URL (`/p/:id`) renders live data from the database |
| Job Seeker | Track how many people view my portfolio | View counter increments on each unique visit |
| Job Seeker | Protect sensitive projects behind a password | Password-gated overlay prevents rendering until authenticated |
| Recruiter | Quickly assess a candidate's technical breadth | Template surfaces skill tags, project count, and key highlights |
| Recruiter | Contact a candidate directly from their portfolio | Contact dialog sends email via backend function |
| Admin | Monitor platform usage and enforce rate limits | Rate-limit table and RPC enforce per-endpoint thresholds |

## 3. Functional Requirements

- **FR-01**: Users must authenticate via email/password before accessing the dashboard.
- **FR-02**: Profile CRUD — full_name, bio, headline, location, contact links, photo, resume.
- **FR-03**: Project CRUD — title, description, image, link, tech stack, visibility toggle, password protection.
- **FR-04**: Work Experience CRUD — job title, company, date range, description.
- **FR-05**: Template selection with live preview (minimum 12 templates at launch).
- **FR-06**: Font selection from curated Google Fonts catalog.
- **FR-07**: Public portfolio rendering at `/p/:username` or `/p/:user_id`.
- **FR-08**: Resume PDF export (ATS-friendly printable layout).
- **FR-09**: AI-powered resume parsing (LinkedIn PDF upload).
- **FR-10**: Job application tracker with Kanban board.
- **FR-11**: AI job-match scoring and interview prep generation.
- **FR-12**: Portfolio strength scoring engine.

## 4. Non-Functional Requirements

- **NFR-01**: First Contentful Paint < 1.5s on 4G connection.
- **NFR-02**: All API responses < 500ms p95.
- **NFR-03**: RLS policies on every user-owned table.
- **NFR-04**: WCAG 2.1 AA compliance for public templates.
- **NFR-05**: Mobile-responsive across all breakpoints (320px–2560px).
