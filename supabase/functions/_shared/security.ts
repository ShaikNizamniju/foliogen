/**
 * Shared security utilities for all edge functions.
 * - Token-bucket rate limiter with Retry-After headers
 * - Allow-list input validation
 * - Consistent error responses
 */

// ─── CORS ──────────────────────────────────────────────────────────────────────
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// ─── TOKEN BUCKET RATE LIMITER ─────────────────────────────────────────────────
interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, TokenBucket>();
const DEFAULT_MAX_TOKENS = 100;
const DEFAULT_REFILL_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Token-bucket rate limiter. Returns { allowed, retryAfterSeconds }.
 * @param key   Unique identifier (e.g. "endpoint:ip")
 * @param max   Max tokens in the bucket (default 100)
 * @param windowMs  Refill window in ms (default 15 min)
 */
export function checkRateLimit(
  key: string,
  max = DEFAULT_MAX_TOKENS,
  windowMs = DEFAULT_REFILL_WINDOW_MS,
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket) {
    bucket = { tokens: max - 1, lastRefill: now };
    buckets.set(key, bucket);
    return { allowed: true, retryAfterSeconds: 0 };
  }

  // Refill tokens proportionally to elapsed time
  const elapsed = now - bucket.lastRefill;
  const refillRate = max / windowMs; // tokens per ms
  const refilled = Math.min(max, bucket.tokens + elapsed * refillRate);
  bucket.tokens = refilled;
  bucket.lastRefill = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return { allowed: true, retryAfterSeconds: 0 };
  }

  // Calculate when 1 token will be available
  const deficit = 1 - bucket.tokens;
  const retryAfterSeconds = Math.ceil(deficit / refillRate / 1000);
  return { allowed: false, retryAfterSeconds };
}

/**
 * Returns a 429 response with Retry-After header and actionable JSON message.
 */
export function rateLimitedResponse(retryAfterSeconds: number): Response {
  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      message: `You have exceeded the rate limit. Please wait ${retryAfterSeconds} seconds before retrying.`,
      retryAfterSeconds,
    }),
    {
      status: 429,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfterSeconds),
      },
    },
  );
}

// ─── ALLOW-LIST INPUT VALIDATION ───────────────────────────────────────────────

/** Allow-list regex: letters, digits, spaces, basic punctuation. No angle brackets or SQL keywords. */
const SAFE_TEXT_RE = /^[\p{L}\p{N}\s.,;:!?'"\-()@#&+/=%_*~\[\]{}$^|\\`\n\r\t]+$/u;

/** Strict email regex (RFC 5322 simplified) */
const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/** URL allow-list: must start with http:// or https:// */
const URL_RE = /^https?:\/\/[a-zA-Z0-9][-a-zA-Z0-9.]*[a-zA-Z0-9](?:\/[^\s<>]*)?$/;

/** Dangerous patterns that should NEVER appear in any user input */
const INJECTION_PATTERNS = [
  /<script[\s>]/i,
  /javascript:/i,
  /on\w+\s*=/i,           // onclick=, onerror=, etc.
  /data:\s*text\/html/i,
  /\bUNION\s+SELECT\b/i,
  /\bDROP\s+TABLE\b/i,
  /\bINSERT\s+INTO\b/i,
  /\bDELETE\s+FROM\b/i,
  /--\s/,                 // SQL comment
  /;\s*(DROP|ALTER|TRUNCATE|EXEC)/i,
];

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a text field against the allow-list.
 * @param value     The input string
 * @param fieldName Human-readable field name for error messages
 * @param maxLen    Maximum allowed length
 * @param minLen    Minimum required length (default 1)
 */
export function validateText(
  value: unknown,
  fieldName: string,
  maxLen: number,
  minLen = 1,
): ValidationResult {
  if (value === null || value === undefined || typeof value !== 'string') {
    return { valid: false, error: `${fieldName} is required and must be a string.` };
  }
  const trimmed = value.trim();
  if (trimmed.length < minLen) {
    return { valid: false, error: `${fieldName} must be at least ${minLen} character(s).` };
  }
  if (trimmed.length > maxLen) {
    return { valid: false, error: `${fieldName} must be ${maxLen} characters or fewer.` };
  }
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { valid: false, error: `${fieldName} contains disallowed content.` };
    }
  }
  return { valid: true };
}

/**
 * Validates an email address.
 */
export function validateEmail(value: unknown, fieldName = 'Email'): ValidationResult {
  if (typeof value !== 'string') {
    return { valid: false, error: `${fieldName} is required.` };
  }
  const trimmed = value.trim();
  if (trimmed.length > 254) {
    return { valid: false, error: `${fieldName} must be 254 characters or fewer.` };
  }
  if (!EMAIL_RE.test(trimmed)) {
    return { valid: false, error: `${fieldName} format is invalid. Expected: user@example.com` };
  }
  return { valid: true };
}

/**
 * Validates a URL.
 */
export function validateUrl(value: unknown, fieldName = 'URL'): ValidationResult {
  if (typeof value !== 'string' || !value.trim()) {
    return { valid: false, error: `${fieldName} is required.` };
  }
  if (value.length > 2048) {
    return { valid: false, error: `${fieldName} must be 2048 characters or fewer.` };
  }
  if (!URL_RE.test(value.trim())) {
    return { valid: false, error: `${fieldName} must be a valid HTTP/HTTPS URL.` };
  }
  return { valid: true };
}

/**
 * Sanitize a string by stripping HTML tags and trimming.
 */
export function sanitize(value: string, maxLen = 5000): string {
  return value.replace(/<[^>]*>/g, '').trim().substring(0, maxLen);
}

/**
 * Returns a 400 response with a specific, actionable error message.
 */
export function validationError(message: string): Response {
  return new Response(
    JSON.stringify({ error: 'Validation failed', message }),
    { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
}

/**
 * Returns a structured error response with the given status.
 */
export function errorResponse(message: string, status: number): Response {
  return new Response(
    JSON.stringify({ error: message }),
    { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
}

/**
 * Extract client IP for rate limiting.
 */
export function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('cf-connecting-ip')
    || 'unknown';
}
