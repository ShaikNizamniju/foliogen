# Testing Strategy

## 1. Testing Pyramid

```
        ┌───────────┐
        │   E2E     │  Manual / Browser automation
        ├───────────┤
        │Integration│  Edge function + DB tests
        ├───────────┤
        │   Unit    │  Data mapping, utilities, scoring
        └───────────┘
```

## 2. Unit Testing

### Framework

- **Vitest** with TypeScript support
- Configuration in `vitest.config.ts`
- Test files collocated: `src/test/*.test.ts`

### Priority Test Targets

| Module | Test Focus |
|--------|-----------|
| Profile data mapping | DB row → `ProfileData` transformation accuracy |
| Portfolio strength score | Score calculation across edge cases (0 projects, all fields, partial) |
| URL utilities | Slug generation, URL validation |
| Video utilities | Embed URL parsing |
| Confetti triggers | Function invocation (no DOM assertion) |

### Example: Data Mapping Test

```typescript
describe('Profile data mapping', () => {
  it('maps snake_case DB row to camelCase ProfileData', () => {
    const dbRow = { full_name: 'Jane Doe', photo_url: '...', skills: ['React'] };
    const result = mapToProfile(dbRow);
    expect(result.fullName).toBe('Jane Doe');
    expect(result.skills).toEqual(['React']);
  });

  it('handles null/undefined fields gracefully', () => {
    const dbRow = { full_name: null, skills: null };
    const result = mapToProfile(dbRow);
    expect(result.fullName).toBe('');
    expect(result.skills).toEqual([]);
  });
});
```

## 3. Integration Testing

### Edge Functions

- Test via `supabase--test-edge-functions` or `supabase--curl_edge_functions`
- Verify request/response contracts
- Validate rate limiting behavior
- Confirm JWT rejection for unauthenticated requests

### Database

- RLS policy verification: Ensure users cannot access other users' data
- RPC function testing: `increment_views`, `check_rate_limit`

## 4. End-to-End Testing

### Manual Testing Checklist

- [ ] Sign up → email verification → sign in
- [ ] Complete profile → select template → preview updates
- [ ] Add projects → toggle visibility → verify public view
- [ ] Export PDF → verify ATS formatting
- [ ] Job tracker → create/move/delete cards
- [ ] Public portfolio → contact form → email delivery
- [ ] Password-protected project → verify gate

### Browser Automation

- Available via Lovable browser tools for regression checks
- Focus on critical user flows (auth, profile save, public render)

## 5. Testing Standards

- **Coverage target**: Critical utilities and data mapping at 80%+
- **Test naming**: `describe('Module') → it('should behavior when condition')`
- **No mocking Supabase client** in unit tests — test pure functions only
- **Edge function tests**: Use real HTTP calls against preview environment
