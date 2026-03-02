# Performance Optimization

## 1. Frontend Performance

### Bundle Optimization

- **Vite** tree-shaking eliminates dead code
- **Code splitting**: Route-level lazy loading for heavy template components
- **Chunk strategy**: Vendor chunks separated from application code
- **CSS**: Tailwind purges unused classes in production

### Rendering Performance

- **React 18 concurrent features**: Automatic batching for state updates
- **Memoization**: `useMemo` / `useCallback` for expensive computations (score calculations, filtered lists)
- **Virtual scrolling**: Not currently needed (profile data volume is bounded)
- **Image lazy loading**: Native `loading="lazy"` on all portfolio images

### Animation Performance

- **Framer Motion**: GPU-accelerated `transform` and `opacity` animations
- **`will-change`**: Applied sparingly to animated elements
- **Reduced motion**: Respect `prefers-reduced-motion` media query

## 2. Data Performance

### Caching Strategy (TanStack Query)

| Query | `staleTime` | `gcTime` | Rationale |
|-------|-------------|----------|-----------|
| Profile (own) | 5 min | 30 min | Infrequent external changes |
| Public profile | 1 min | 10 min | May update between views |
| Job applications | 0 | 5 min | User expects real-time |
| Favorites | 5 min | 30 min | Rarely changes |

### Database Performance

- **Indexes**: `user_id` indexed on all user-owned tables
- **Views**: `profiles_public` avoids expensive JOINs
- **RPC**: `increment_views` uses atomic UPDATE (no read-modify-write)
- **Rate limiting**: Sliding-window via `check_rate_limit` prevents abuse

## 3. Network Performance

- **Request deduplication**: TanStack Query prevents duplicate in-flight requests
- **Optimistic updates**: Profile save shows immediate feedback
- **Debouncing**: Form inputs debounced before triggering preview re-renders
- **Edge Functions**: Deployed to edge locations for low-latency AI calls

## 4. Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint | < 1.5s | Lighthouse (4G) |
| Largest Contentful Paint | < 2.5s | Lighthouse (4G) |
| Cumulative Layout Shift | < 0.1 | Lighthouse |
| Time to Interactive | < 3.0s | Lighthouse (4G) |
| API Response (p95) | < 500ms | Edge function logs |
