# Security Guidelines

## 1. Authentication Security

- **Password hashing**: Handled by Lovable Cloud Auth (bcrypt)
- **JWT lifecycle**: Short-lived access tokens with automatic refresh
- **Session storage**: Secure, httpOnly cookies managed by auth SDK
- **No anonymous sign-ups**: All users must verify email before access

## 2. Authorization (RLS)

- **Principle of least privilege**: Every table has RLS enabled
- **Default deny**: No table is accessible without an explicit policy
- **User isolation**: `auth.uid() = user_id` enforced on all user-owned tables
- **Service-only access**: `rate_limits` table uses deny-all RLS, accessed via SECURITY DEFINER functions

## 3. Data Protection

- **Sensitive field exclusion**: `profiles_public` view omits email, subscription data, SEO metadata
- **Password-protected projects**: Server-side verification via `verify-project-password` edge function
- **Input sanitization**: All user input rendered via React (auto-escaped JSX)
- **SQL injection prevention**: Parameterized queries via Supabase SDK (PostgREST)

## 4. API Security

- **Rate limiting**: All public endpoints protected by `check_rate_limit` RPC
- **CORS**: Edge functions explicitly set `Access-Control-Allow-Origin`
- **JWT validation**: Authenticated edge functions verify token via `supabase.auth.getUser()`
- **No secrets in client code**: All API keys stored as backend secrets

## 5. Infrastructure Security

- **HTTPS**: Enforced on all endpoints
- **Environment isolation**: Preview and production environments are separate
- **Secret management**: Managed via Lovable Cloud (never committed to repository)
- **Dependency auditing**: Regular review of `package.json` dependencies

## 6. Security Checklist

- [ ] RLS enabled on every new table
- [ ] Public views expose only non-sensitive columns
- [ ] Edge functions validate JWT for authenticated operations
- [ ] Rate limiting applied to all public-facing endpoints
- [ ] No hardcoded secrets in source code
- [ ] Input validation on all form submissions
- [ ] CORS headers configured on all edge functions
