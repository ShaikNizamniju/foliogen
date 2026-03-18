

## Production Hardening Plan — 6 Work Streams

This is a large, multi-faceted request. Here is the implementation plan organized by work stream.

---

### 1. Sidebar & Branding Updates

**a) Logo replacement:** Replace the `<Sparkles>` icon in `DashboardSidebar.tsx` with `<img src="/assets/logo.png">` (the existing `src/assets/logo.png`), maintaining the 36×36 rounded container.

**b) Navigation rename:** In `DashboardSidebar.tsx`, change the menu item `{ title: 'Projects', icon: FolderOpen, section: 'jobs' }` to `{ title: 'Career Hub', icon: Briefcase, section: 'jobs' }`.

---

### 2. Font Preview Enhancement

In `ProfileSection.tsx` font tab and `TemplatePreview.tsx` font selector, each `<SelectItem>` already renders with `style={{ fontFamily }}`. The fonts are preloaded via `loadGoogleFont()`. No changes needed — this already works. Will verify the preview panel font selector also uses styled items (it currently does not style them). Update `TemplatePreview.tsx` to render font names in their own typeface.

---

### 3. RAG Chatbot — Qualifying Questions on Open

**a) Update `ProfileChatBot.tsx`:** Change the initial assistant message to a qualifying question: *"Hi! Before I share details, which company are you reaching out from?"* Add a `qualificationStep` state (0–3) that tracks the recruiter screening flow. Until step 3, the system prompt instructs the AI to ask the next qualifying question and withhold project details/contact info.

**b) Chat History / Query Log table:**
- Create a `chat_queries` table: `id, profile_user_id, visitor_company, visitor_question, ai_response, created_at`
- RLS: owner can SELECT; INSERT is open (via edge function with service role)
- Update `chat-with-profile` edge function to log each Q&A pair to this table after streaming completes
- Add a new "Chat Log" section in the dashboard (accessible from sidebar or settings) showing a table of visitor queries with timestamps

**c) Disable Onboarding Tour:** In `Dashboard.tsx`, remove the `<OnboardingTour />` component render.

---

### 4. Domain-Driven Template Locking

**Current state:** `OnboardingQuestionnaire` and `SmartResumeParser` already detect domains and recommend templates via `getRecommendedTemplate()`.

**Changes:**
- After domain selection (questionnaire or resume parse), auto-set `selectedTemplate` and save immediately
- In `TemplatesSection.tsx`, if `profile.predictedDomain` is set (needs adding to ProfileData + DB column), show a banner: "Your template is optimized for [domain]. Changing templates may reduce your portfolio's effectiveness."
- Gray out / visually lock other template cards with an overlay message, but do NOT prevent selection (advisory lock, not hard lock) — hard locking would be a poor UX for paying Pro users

**DB change:** Add `predicted_domain text` column to `profiles` table; add to `profiles_public` view.

---

### 5. Resume Import & Job Match Fixes

**a) Resume "Update from Resume" button:** Already works — `OverviewSection.tsx` line 322 renders `<SmartResumeParser>` inside the collapsible. The parser uses `saveProfile(overrides)` correctly. No fix needed here.

**b) Job Match — URL support:** Update `JobMatchSection.tsx` to detect if the input looks like a URL (starts with `http`). If so, show a toast explaining that URL fetching is not supported yet and to paste the job description text directly. (Implementing server-side URL scraping would require a new edge function and is out of scope for launch.)

**c) Edge function error:** The `analyze-job-match` function requires Pro status. The 403 error is expected for free users. Add a clear UI guard in `JobMatchSection.tsx` that checks `profile.is_pro` (needs adding to ProfileData) and shows a Pro gate before allowing analysis. Also add `is_pro` to ProfileData interface and fetch logic.

---

### 6. Scoring & Real-Time Sync

**Current state:** `calculatePortfolioStrength()` in `scoringEngine.ts` runs on every render from `profile` state. When `updateProfile()` is called, React re-renders and the score updates automatically. No additional work needed for real-time updates.

**Enhancement:** Remove the `console.error` in `JobMatchSection.tsx` line 105 (production cleanup).

---

### Technical Changes Summary

| File | Change |
|---|---|
| `DashboardSidebar.tsx` | Replace logo icon with image; rename "Projects" → "Career Hub" |
| `TemplatePreview.tsx` | Style font selector items with their own typeface |
| `ProfileChatBot.tsx` | Add qualifying question flow; withhold data until answered |
| `chat-with-profile/index.ts` | Log Q&A to `chat_queries` table after stream |
| `Dashboard.tsx` | Remove `<OnboardingTour />` |
| `DashboardContent.tsx` | Add "Chat Log" section route |
| `DashboardSidebar.tsx` | Add "Chat Log" nav item |
| `JobMatchSection.tsx` | Add Pro gate; URL detection toast; remove console.error |
| `ProfileContext.tsx` | Add `isPro` and `predictedDomain` to ProfileData |
| `TemplatesSection.tsx` | Add domain-lock advisory banner |
| **New file:** `sections/ChatLogSection.tsx` | Dashboard section showing visitor chat queries |
| **DB migration:** | `chat_queries` table + RLS; `predicted_domain` column on profiles; update `profiles_public` view |

### Execution Order
1. DB migrations (chat_queries table, predicted_domain column)
2. Sidebar & branding (quick visual wins)
3. Disable onboarding tour
4. ProfileContext updates (isPro, predictedDomain)
5. RAG qualifying flow + chat logging
6. Chat Log dashboard section
7. Job Match Pro gate + cleanup
8. Template locking banner
9. Font preview styling
10. Deploy edge functions

