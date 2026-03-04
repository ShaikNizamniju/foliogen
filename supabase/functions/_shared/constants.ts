/**
 * Foliogen Subscription & Security Constants
 * Single source of truth — never hardcode pricing or tier logic elsewhere.
 */

// ─── SUBSCRIPTION TIERS ────────────────────────────────────────────────────────

export type TierKey = 'FREE' | 'BASIC' | 'PRO';

export interface TierConfig {
  name: string;
  price: number;           // INR
  rateLimitMax: number;    // max requests in the window
  rateLimitWindowMs: number; // window duration in ms
  features: string[];
}

export const SUBSCRIPTION_TIERS: Record<TierKey, TierConfig> = {
  FREE: {
    name: 'Free',
    price: 0,
    rateLimitMax: 5,
    rateLimitWindowMs: 60 * 60 * 1000, // 1 hour
    features: ['1 Standard Template', 'Basic Resume Parsing'],
  },
  BASIC: {
    name: 'Basic',
    price: 199,
    rateLimitMax: 50,
    rateLimitWindowMs: 60 * 60 * 1000, // 1 hour
    features: ['4 Portfolio Templates', 'AI Portfolio Scoring', 'Email Support'],
  },
  PRO: {
    name: 'Pro',
    price: 999,
    rateLimitMax: 200,
    rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes (anti-spam)
    features: ['Unlimited Portfolios', 'Custom Domain', 'AI Interview Coach', 'LinkedIn Import'],
  },
};

// ─── PLAN AMOUNTS (Razorpay uses paise) ────────────────────────────────────────

export const PLAN_AMOUNT_CONFIG: Record<number, { planType: string; renewalDays: number }> = {
  19900: { planType: 'basic', renewalDays: 30 },   // ₹199 monthly
  99900: { planType: 'pro', renewalDays: 365 },     // ₹999 yearly
};

// ─── SECURITY CONFIG ───────────────────────────────────────────────────────────

export const SECURITY_CONFIG = {
  /** Allow-list for portfolio names: alphanumeric, spaces, hyphens only */
  PORTFOLIO_NAME_RE: /^[a-zA-Z0-9\s-]+$/,

  /** Custom domain validation for Pro tier */
  CUSTOM_DOMAIN_RE: /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,

  /** Max file upload size in MB */
  MAX_FILE_SIZE_MB: 5,

  /** Pro-only features that require specific backend secrets */
  PRO_REQUIRED_SECRETS: ['LOVABLE_API_KEY'] as const,
};

// ─── PRO-ONLY ENDPOINTS ────────────────────────────────────────────────────────
// Edge function names that require Pro or Basic subscription.
// Free-tier users must NOT be able to call these even if they discover the URL.

export const PRO_ONLY_ENDPOINTS = [
  'enhance-project',
  'analyze-job-match',
  'generate-interview-prep',
] as const;

export const BASIC_OR_PRO_ENDPOINTS = [
  'parse-resume',
] as const;
