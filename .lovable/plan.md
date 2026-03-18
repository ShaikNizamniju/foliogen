

## Plan: Production Alignment & Bug Fixes

### 1. Fix Build Error (scoringEngine.test.ts)
The test file's `emptyProfile` object is missing `activePersona` and `narrativeVariants` which were recently added to `ProfileData`.

**File:** `src/utils/__tests__/scoringEngine.test.ts`
- Add `activePersona: "general"` and `narrativeVariants: { general: { bio: "", headline: "" }, startup: { bio: "", headline: "" }, bigtech: { bio: "", headline: "" }, fintech: { bio: "", headline: "" } }` to the `emptyProfile` constant.

### 2. Fix Avatar in DashboardHeader
The current code falls back to a static `profile-photo.jpeg` import which shows a generic photo. Replace the avatar `<div>` with a proper `Avatar`/`AvatarFallback` pattern.

**File:** `src/components/dashboard/DashboardHeader.tsx`
- Import `Avatar`, `AvatarImage`, `AvatarFallback` from `@/components/ui/avatar`.
- Remove the `import profilePhoto` static asset line.
- Replace the raw `<div><img>` block (lines 105-116) with:
  - `<Avatar>` with `<AvatarImage>` sourcing from `profile.photoUrl || user?.user_metadata?.avatar_url`.
  - `<AvatarFallback>` showing the user's initials derived from `profile.fullName` or `user?.email`.

### 3. Harden Stripe Checkout Edge Function
**File:** `supabase/functions/stripe-checkout/index.ts`
- Add a hardcoded `FALLBACK_PRICE_ID` constant (e.g., Sprint Pass price) so if both `priceId` param and env vars are missing, the function still has a valid price to use.
- Update the `selectedPriceId` resolution: `priceId || env-based || FALLBACK_PRICE_ID`.

### 4. Harden Frontend Payment Handler
**File:** `src/lib/payment.ts`
- Remove the `STRIPE_PUBLISHABLE_KEY` gate — it's unnecessary since we redirect to a Stripe-hosted checkout URL (no client-side Stripe.js needed).
- Add detailed `console.error` logging of the full error response body in the catch block.
- Ensure the `supabase.functions.invoke` call works without the publishable key check.

### 5. Deploy Updated Edge Function
- Redeploy `stripe-checkout` after changes.

### Files Changed
1. `src/utils/__tests__/scoringEngine.test.ts` — fix build error
2. `src/components/dashboard/DashboardHeader.tsx` — avatar fix with initials fallback
3. `supabase/functions/stripe-checkout/index.ts` — fallback price ID
4. `src/lib/payment.ts` — remove unnecessary gate, add error logging

