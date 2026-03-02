# Backend Architecture

## 1. Overview

Foliogen's backend is powered by **Lovable Cloud**, providing a fully managed PostgreSQL database, authentication, file storage, and serverless edge functions without requiring external account setup.

## 2. Architecture

```
Client (Supabase JS SDK)
  │
  ├── PostgREST ──▶ PostgreSQL (RLS-enforced)
  ├── Auth ────────▶ JWT issuance + session management
  ├── Storage ─────▶ File uploads (avatars, resumes)
  └── Edge Fns ────▶ Deno runtime (AI, email, payments)
```

## 3. Edge Functions

All edge functions run on **Deno** and are deployed automatically.

| Function | Runtime | External Dependencies |
|----------|---------|----------------------|
| `parse-resume` | Deno | AI model API |
| `enhance-project` | Deno | AI model API |
| `analyze-job-match` | Deno | AI model API |
| `generate-interview-prep` | Deno | AI model API |
| `chat-with-profile` | Deno | AI model API |
| `send-contact-email` | Deno | EmailJS |
| `activate-pro` | Deno | Payment provider |
| `verify-project-password` | Deno | — |

### Edge Function Patterns

- **Auth validation**: All authenticated functions verify JWT via `supabase.auth.getUser()`
- **Rate limiting**: Public functions call `check_rate_limit` RPC before processing
- **Error handling**: Consistent `{ error, message, statusCode }` response shape
- **CORS**: Preflight handling in each function

## 4. Database Functions

| Function | Type | Purpose |
|----------|------|---------|
| `increment_views` | RPC | Atomic view counter with deduplication |
| `check_rate_limit` | RPC (SECURITY DEFINER) | Sliding-window rate limiter bypassing RLS |

## 5. Storage Buckets

| Bucket | Access | Purpose |
|--------|--------|---------|
| `avatars` | Public read | Profile photos |
| `resumes` | Authenticated | Resume PDF uploads |

## 6. Environment & Secrets

- **Auto-configured**: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- **User-configured**: AI API keys, EmailJS credentials, payment provider keys
- Secrets managed via Lovable Cloud interface
