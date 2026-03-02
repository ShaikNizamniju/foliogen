# Database Schema

## 1. Entity Relationship Overview

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│  auth.users  │────▶│    profiles       │────▶│profiles_public│
│  (managed)   │  1:1│                   │     │   (view)      │
└──────────────┘     └──────────────────┘     └──────────────┘
       │                     │
       │              ┌──────┴──────┐
       │              │             │
       ▼              ▼             ▼
┌──────────────┐ ┌──────────┐ ┌───────────┐
│job_applications│ │favorites │ │blog_posts │
└──────────────┘ └──────────┘ └───────────┘
       │
       ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│analytics_events│  │ visit_logs  │  │ rate_limits  │
└──────────────┘  └──────────────┘  └──────────────┘
```

## 2. Core Tables

### `profiles`

Primary user data store. One row per authenticated user.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | No | `gen_random_uuid()` | PK |
| `user_id` | uuid | No | — | References `auth.users`, unique |
| `full_name` | text | Yes | — | |
| `email` | text | Yes | — | |
| `headline` | text | Yes | — | |
| `bio` | text | Yes | — | |
| `location` | text | Yes | — | |
| `photo_url` | text | Yes | — | |
| `website` | text | Yes | — | |
| `linkedin_url` | text | Yes | — | |
| `github_url` | text | Yes | — | |
| `twitter_url` | text | Yes | — | |
| `skills` | text[] | Yes | — | |
| `key_highlights` | text[] | Yes | — | |
| `work_experience` | jsonb | Yes | — | `WorkExperience[]` |
| `projects` | jsonb | Yes | — | `Project[]` |
| `selected_template` | text | Yes | — | Template ID |
| `selected_font` | text | Yes | — | Font ID |
| `resume_url` | text | Yes | — | |
| `calendly_url` | text | Yes | — | |
| `username` | text | Yes | — | Unique, for public URL |
| `views` | integer | Yes | `0` | |
| `is_pro` | boolean | Yes | `false` | |
| `pro_since` | timestamptz | Yes | — | |
| `subscription_id` | text | Yes | — | |
| `meta_title` | text | Yes | — | SEO |
| `meta_description` | text | Yes | — | SEO |
| `meta_keywords` | text[] | Yes | — | SEO |
| `created_at` | timestamptz | No | `now()` | |
| `updated_at` | timestamptz | No | `now()` | |

### `job_applications`

Kanban-style job tracker.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | uuid | No | `gen_random_uuid()` |
| `user_id` | uuid | No | — |
| `company` | text | No | — |
| `role` | text | No | — |
| `status` | text | No | `'wishlist'` |
| `job_url` | text | Yes | — |
| `salary_range` | text | Yes | — |
| `notes` | text | Yes | — |
| `ai_prep` | jsonb | Yes | — |
| `created_at` | timestamptz | No | `now()` |
| `updated_at` | timestamptz | No | `now()` |

### `analytics_events`

Portfolio visitor tracking.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | uuid | No | `gen_random_uuid()` |
| `profile_user_id` | uuid | No | — |
| `event_type` | text | No | — |
| `page_path` | text | Yes | — |
| `referrer` | text | Yes | — |
| `browser` | text | Yes | — |
| `device_type` | text | Yes | — |
| `country` | text | Yes | — |
| `city` | text | Yes | — |
| `created_at` | timestamptz | No | `now()` |

## 3. Views

### `profiles_public`

Read-only view exposing non-sensitive profile columns for public portfolio rendering. Excludes `email`, `subscription_id`, `meta_*` fields.

## 4. RPC Functions

- **`increment_views(p_user_id uuid)`**: Atomic counter increment with built-in rate limiting.
- **`check_rate_limit(p_endpoint, p_key, p_max_requests, p_window_minutes)`**: Sliding-window rate limiter returning boolean.

## 5. RLS Policy Summary

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `profiles` | Own row | Trigger-created | Own row | — |
| `job_applications` | Own rows | Own rows | Own rows | Own rows |
| `favorites` | Own rows | Own rows | — | Own rows |
| `blog_posts` | Own rows | Own rows | Own rows | Own rows |
| `documents` | Own rows | Own rows | Own rows | Own rows |
| `analytics_events` | Own rows | Anon insert | — | — |
| `visit_logs` | Own rows | Anon insert | — | — |
| `rate_limits` | Deny all | Deny all | Deny all | Deny all |
| `profiles_public` | Public read | — | — | — |
