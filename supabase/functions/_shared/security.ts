/**
 * Shared security utilities for all edge functions.
 * - Tier-aware token-bucket rate limiter with Retry-After headers
 * - Allow-list input validation (portfolio names, custom domains, etc.)
 * - Pro-tier secret gate
 * - Consistent error responses
 */

import {
  SUBSCRIPTION_TIERS,
  SECURITY_CONFIG,
  type TierKey,
  type TierConfig,
} from './constants.ts';
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

/**
 * Token-bucket rate limiter. Returns { allowed, retryAfterSeconds }.
 * @param key       Unique identifier (e.g. "endpoint:ip")
 * @param max       Max tokens in the bucket
 * @param windowMs  Refill window in ms
 */
export function checkRateLimit(
  key: string,
  max = SUBSCRIPTION_TIERS.PRO.rateLimitMax,
  windowMs = SUBSCRIPTION_TIERS.PRO.rateLimitWindowMs,
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
 * Tier-aware rate limiter. Resolves the user's tier and applies the correct limits.
 * @param key    Unique identifier (e.g. "endpoint:ip" or "endpoint:userId")
 * @param tier   The user's subscription tier key
 */
export function checkTieredRateLimit(
  key: string,
  tier: TierKey,
): { allowed: boolean; retryAfterSeconds: number } {
  const config: TierConfig = SUBSCRIPTION_TIERS[tier];
  return checkRateLimit(key, config.rateLimitMax, config.rateLimitWindowMs);
}

/**
 * Resolve a user's tier from their profile flags.
 */
export function resolveTier(isPro: boolean | null, planType?: string | null): TierKey {
  if (isPro) {
    return planType === 'basic' ? 'BASIC' : 'PRO';
  }
  return 'FREE';
}

/**
 * Returns a 429 response with Retry-After header and actionable JSON message.
 */
export function rateLimitedResponse(retryAfterSeconds: number, tierName?: string): Response {
  const tierMsg = tierName ? ` Your ${tierName} plan allows limited requests.` : '';
  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      message: `You have exceeded the rate limit.${tierMsg} Please wait ${retryAfterSeconds} seconds before retrying.`,
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

// ─── PRO SECRET GATE ───────────────────────────────────────────────────────────

/**
 * Verifies that all required secrets for Pro features are present.
 * Returns null if all secrets are available, or an error Response if any are missing.
 */
export function requireProSecrets(): Response | null {
  for (const secretName of SECURITY_CONFIG.PRO_REQUIRED_SECRETS) {
    if (!Deno.env.get(secretName)) {
      console.error(`Missing required secret for Pro feature: ${secretName}`);
      return errorResponse('This feature is temporarily unavailable. Please contact support.', 503);
    }
  }
  return null;
}

/**
 * Gate that blocks Free-tier users from Pro-only endpoints.
 * Returns null if access is allowed, or a 403 Response if denied.
 */
export function requireMinimumTier(
  userTier: TierKey,
  minimumTier: 'BASIC' | 'PRO',
): Response | null {
  const tierOrder: Record<TierKey, number> = { FREE: 0, BASIC: 1, PRO: 2 };
  if (tierOrder[userTier] < tierOrder[minimumTier]) {
    const tierConfig = SUBSCRIPTION_TIERS[minimumTier];
    return new Response(
      JSON.stringify({
        error: 'Upgrade required',
        message: `This feature requires the ${tierConfig.name} plan (₹${tierConfig.price}). Please upgrade to continue.`,
        requiredTier: minimumTier,
      }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
  return null;
}

// ─── ALLOW-LIST INPUT VALIDATION ───────────────────────────────────────────────

/** Strict email regex (RFC 5322 simplified) */
const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/** URL allow-list: must start with http:// or https:// */
const URL_RE = /^https?:\/\/[a-zA-Z0-9][-a-zA-Z0-9.]*[a-zA-Z0-9](?:\/[^\s<>]*)?$/;

/** Dangerous patterns that should NEVER appear in any user input */
const INJECTION_PATTERNS = [
  /<script[\s>]/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /data:\s*text\/html/i,
  /\bUNION\s+SELECT\b/i,
  /\bDROP\s+TABLE\b/i,
  /\bINSERT\s+INTO\b/i,
  /\bDELETE\s+FROM\b/i,
  /--\s/,
  /;\s*(DROP|ALTER|TRUNCATE|EXEC)/i,
];

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a text field against the allow-list.
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
 * Validates a portfolio name using a strict allow-list (alphanumeric, spaces, hyphens).
 */
export function validatePortfolioName(value: unknown): ValidationResult {
  if (typeof value !== 'string' || !value.trim()) {
    return { valid: false, error: 'Portfolio name is required.' };
  }
  const trimmed = value.trim();
  if (trimmed.length > 100) {
    return { valid: false, error: 'Portfolio name must be 100 characters or fewer.' };
  }
  if (!SECURITY_CONFIG.PORTFOLIO_NAME_RE.test(trimmed)) {
    return { valid: false, error: 'Portfolio name must contain only letters, numbers, spaces, and hyphens.' };
  }
  return { valid: true };
}

/**
 * Validates a custom domain (Pro tier only).
 * Must follow standard domain format: subdomain.domain.tld
 */
export function validateCustomDomain(value: unknown): ValidationResult {
  if (typeof value !== 'string' || !value.trim()) {
    return { valid: false, error: 'Custom domain is required.' };
  }
  const trimmed = value.trim().toLowerCase();
  if (trimmed.length > 253) {
    return { valid: false, error: 'Domain must be 253 characters or fewer.' };
  }
  if (!SECURITY_CONFIG.CUSTOM_DOMAIN_RE.test(trimmed)) {
    return { valid: false, error: 'Custom domain format is invalid. Expected: example.com or sub.example.com' };
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
/**
 * Log security-critical events to the security_audit_logs table.
 */
export async function logSecurityEvent(
  eventType: 'auth_attempt' | 'api_error' | 'rate_limit_hit' | 'suspicious_activity',
  severity: 'info' | 'warning' | 'critical',
  component: string,
  metadata: Record<string, any> = {},
  userId?: string,
  req?: Request
) {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const ipAddress = req ? getClientIP(req) : 'unknown';
    const userAgent = req ? req.headers.get('user-agent') : 'unknown';

    await adminClient.from('security_audit_logs').insert({
      user_id: userId,
      event_type: eventType,
      severity,
      component,
      metadata,
      ip_address: ipAddress,
      user_agent: userAgent,
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}
