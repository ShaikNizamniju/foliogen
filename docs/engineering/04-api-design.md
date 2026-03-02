# API Design

## 1. API Strategy

Foliogen uses **Supabase's auto-generated REST API** (PostgREST) for standard CRUD operations and **Edge Functions** for custom server-side logic requiring external API calls or complex processing.

## 2. REST API (PostgREST)

All table operations use the Supabase JS client, which maps to PostgREST under the hood.

### Profiles

| Operation | Method | Endpoint | Auth |
|-----------|--------|----------|------|
| Get own profile | `GET` | `/rest/v1/profiles?user_id=eq.{uid}` | JWT (RLS) |
| Update profile | `PATCH` | `/rest/v1/profiles?user_id=eq.{uid}` | JWT (RLS) |
| Get public profile | `GET` | `/rest/v1/profiles_public?user_id=eq.{id}` | Anon |

### Job Applications

| Operation | Method | Endpoint | Auth |
|-----------|--------|----------|------|
| List jobs | `GET` | `/rest/v1/job_applications?user_id=eq.{uid}` | JWT (RLS) |
| Create job | `POST` | `/rest/v1/job_applications` | JWT (RLS) |
| Update job | `PATCH` | `/rest/v1/job_applications?id=eq.{id}` | JWT (RLS) |
| Delete job | `DELETE` | `/rest/v1/job_applications?id=eq.{id}` | JWT (RLS) |

### RPC Functions

| Function | Purpose | Auth |
|----------|---------|------|
| `increment_views(p_user_id)` | Atomically increment portfolio view counter | Anon |
| `check_rate_limit(endpoint, key, max, window)` | Enforce per-endpoint rate limits | Anon |

## 3. Edge Functions

| Function | Method | Purpose | Auth |
|----------|--------|---------|------|
| `parse-resume` | POST | Extract structured data from uploaded resume PDF | JWT |
| `enhance-project` | POST | AI-generate project descriptions and visual prompts | JWT |
| `analyze-job-match` | POST | Score profile against job description | JWT |
| `generate-interview-prep` | POST | Generate interview questions for a job application | JWT |
| `chat-with-profile` | POST | AI chatbot answering questions about a user's profile | Anon (rate-limited) |
| `send-contact-email` | POST | Send contact form email to portfolio owner | Anon (rate-limited) |
| `activate-pro` | POST | Activate Pro subscription after payment verification | JWT |
| `verify-project-password` | POST | Validate password for protected projects | Anon |

## 4. Request/Response Conventions

- **Content-Type**: `application/json`
- **Auth Header**: `Authorization: Bearer <jwt>`
- **Error Shape**: `{ error: string, message: string, statusCode: number }`
- **Rate Limit Headers**: `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## 5. Data Contracts

### Profile Update Payload

```typescript
{
  full_name: string;
  bio: string | null;
  headline: string | null;
  location: string | null;
  email: string | null;
  website: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  twitter_url: string | null;
  photo_url: string | null;
  skills: string[];
  key_highlights: string[];
  work_experience: WorkExperience[];  // JSON column
  projects: Project[];                // JSON column
  selected_template: string;
  selected_font: string;
  resume_url: string | null;
  calendly_url: string | null;
}
```
