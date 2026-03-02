# Authentication & Authorization

## 1. Authentication

### Strategy

Email/password authentication via Lovable Cloud Auth (JWT-based).

### Flow

```
1. User submits email + password on /auth
2. Auth service issues JWT + refresh token
3. Client stores session via supabase.auth.onAuthStateChange()
4. JWT attached to all subsequent API requests
5. RLS policies validate auth.uid() on every query
```

### Session Management

- `AuthContext` wraps the entire app
- `onAuthStateChange` listener set up before `getSession()` check
- Redirect to `/auth` on unauthenticated dashboard access
- Redirect to `/dashboard` on authenticated auth page access

## 2. Authorization

### Row Level Security (RLS)

Every user-owned table enforces:

```sql
-- SELECT: Users can only read their own data
CREATE POLICY "select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

-- UPDATE: Users can only modify their own data
CREATE POLICY "update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
```

### Public Access

- `profiles_public` view: Readable by anonymous users (no sensitive fields)
- `analytics_events` / `visit_logs`: Anonymous INSERT for visitor tracking
- `rate_limits`: Deny-all RLS; accessed only via SECURITY DEFINER functions

### Pro Feature Gating

```typescript
// ProContext checks profiles.is_pro
// ProGate component wraps premium features
<ProGate feature="ai-resume-parser">
  <SmartResumeParser />
</ProGate>
```

## 3. Portfolio Strength Score

### Purpose

Quantifies profile completeness to guide users toward a stronger portfolio.

### Scoring Engine Specification

| Criterion | Weight | Scoring Logic |
|-----------|--------|---------------|
| **Project Count** | 30% | 0 projects = 0pts; 1-2 = 15pts; 3-4 = 25pts; 5+ = 30pts |
| **Contact Info Presence** | 20% | 4pts per field (email, LinkedIn, GitHub, Twitter, website) |
| **Skill-to-Project Mapping** | 50% | For each skill, check if ≥1 project's `techStack` includes it. Score = (matched_skills / total_skills) × 50 |

### Total Score

```
strength_score = project_score + contact_score + mapping_score
// Range: 0–100
```

### Display Tiers

| Range | Label | Color |
|-------|-------|-------|
| 0–30 | Needs Work | Red |
| 31–60 | Getting There | Amber |
| 61–85 | Strong | Blue |
| 86–100 | Outstanding | Green |

### Implementation Notes

- Computed client-side in real-time as profile data changes
- Displayed in `OverviewSection` as a radial progress indicator
- Breakdown tooltip shows per-criterion scores
- Score recalculates on every `ProfileContext` update
