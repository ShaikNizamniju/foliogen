/**
 * ──────────────────────────────────────────────────────────────────────────────
 * Sequential Slug Engine
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * Generates professional, ultra-short portfolio URLs using a deterministic
 * alphabetic sequence:
 *
 *   Phase 1 (26):     a, b, c, … z
 *   Phase 2 (676):    aa, ab, … az, ba, bb, … zz
 *   Phase 3 (∞):      a1, a2, a3, … a999, b1, b2, …
 *
 * The engine queries the `portfolios.custom_slug` column (unique index)
 * to find the next available slot, starting from the current global count.
 */

import { supabase } from '@/lib/supabase_v2';

// ── Pure helpers ────────────────────────────────────────────────────────────

/** Converts a zero-based index into the corresponding slug string. */
export function indexToSlug(index: number): string {
  if (index < 0) return 'a';

  // Phase 1: single letter  (0–25 → a–z)
  if (index < 26) {
    return String.fromCharCode(97 + index);
  }

  // Phase 2: double letter  (26–701 → aa–zz)
  if (index < 702) {
    const offset = index - 26;
    const first = Math.floor(offset / 26);
    const second = offset % 26;
    return String.fromCharCode(97 + first) + String.fromCharCode(97 + second);
  }

  // Phase 3: letter + number (702+ → a1, a2, … a999, b1, b2, …)
  const numericOffset = index - 702;
  const letterIndex = Math.floor(numericOffset / 999);
  const numPart = (numericOffset % 999) + 1;

  // Wrap letters cyclically for extreme edge-cases
  const letter = String.fromCharCode(97 + (letterIndex % 26));
  const prefix = letterIndex >= 26
    ? String.fromCharCode(97 + Math.floor(letterIndex / 26) - 1) + letter
    : letter;

  return `${prefix}${numPart}`;
}

// ── Database-aware generator ────────────────────────────────────────────────

/**
 * Finds the next available sequential slug that doesn't collide with an
 * existing `custom_slug` in the `portfolios` table.
 *
 * Strategy:
 *   1. Get approximate total count to skip to the right neighbourhood fast.
 *   2. Generate a candidate slug from that index.
 *   3. If the candidate is taken, increment and retry.
 */
export async function generateNextSequentialSlug(): Promise<string> {
  // Get approximate starting point from total row count
  const { count } = await supabase
    .from('portfolios')
    .select('*', { count: 'exact', head: true });

  let cursor = count ?? 0;

  // Safety: limit retries to prevent infinite loops in pathological cases
  const MAX_RETRIES = 200;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const candidate = indexToSlug(cursor);

    const { data } = await supabase
      .from('portfolios')
      .select('id')
      .eq('custom_slug', candidate)
      .maybeSingle();

    if (!data) {
      return candidate; // 🎉 Available
    }

    cursor++;
  }

  // Extremely unlikely fallback: use timestamp-based slug
  return `p${Date.now().toString(36)}`;
}
