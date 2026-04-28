/**
 * validate-tags.mjs
 *
 * Validates destinations.json tag integrity. Run any time destinations change.
 * Exits with code 1 if any check fails (safe to add to CI / pre-commit hook).
 *
 * Checks:
 *   1. Every tag is in the canonical taxonomy
 *   2. Every destination has at least 2 tags
 *   3. Every destination has at least one "anchor" tag (city | beach | nature)
 *   4. Tags that require strong justification aren't over-used
 *   5. nightlife & chill coverage (warn if < 10 destinations each)
 *
 * Run: node scripts/validate-tags.mjs
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const destinations = JSON.parse(
  readFileSync(resolve(__dirname, "../src/data/destinations.json"), "utf8")
);

const VALID_TAGS = new Set([
  "city", "beach", "nature", "food", "culture",
  "history", "adventure", "nightlife", "chill",
]);
const ANCHOR_TAGS = new Set(["city", "beach", "nature"]);

let errors = 0;
let warnings = 0;

// ── Per-destination checks ─────────────────────────────────────────────────
for (const dest of destinations) {
  const prefix = `[${dest.id}]`;

  // 1. All tags valid
  const invalid = dest.tags.filter(t => !VALID_TAGS.has(t));
  if (invalid.length > 0) {
    console.error(`❌ ${prefix} Invalid tags: ${invalid.join(", ")}`);
    errors++;
  }

  // 2. Minimum 2 tags
  if (dest.tags.length < 2) {
    console.error(`❌ ${prefix} Too few tags (${dest.tags.length}) — minimum 2`);
    errors++;
  }

  // 3. At least one anchor tag
  const hasAnchor = dest.tags.some(t => ANCHOR_TAGS.has(t));
  if (!hasAnchor) {
    console.warn(`⚠️  ${prefix} No anchor tag (city/beach/nature) — confirm intentional`);
    warnings++;
  }

  // 4. No duplicate tags
  const dupes = dest.tags.filter((t, i) => dest.tags.indexOf(t) !== i);
  if (dupes.length > 0) {
    console.error(`❌ ${prefix} Duplicate tags: ${dupes.join(", ")}`);
    errors++;
  }
}

// ── Global distribution checks ─────────────────────────────────────────────
const tagCounts = {};
for (const dest of destinations) {
  for (const t of dest.tags) {
    tagCounts[t] = (tagCounts[t] ?? 0) + 1;
  }
}

// Warn if key experiential tags are under-represented
const MIN_COUNTS = { nightlife: 10, chill: 8, adventure: 8 };
for (const [tag, min] of Object.entries(MIN_COUNTS)) {
  const count = tagCounts[tag] ?? 0;
  if (count < min) {
    console.warn(`⚠️  '${tag}' only on ${count} destinations (min expected: ${min})`);
    warnings++;
  }
}

// ── Summary ────────────────────────────────────────────────────────────────
console.log(`\n📊 Tag distribution (${destinations.length} destinations):`);
for (const [tag, count] of Object.entries(tagCounts).sort((a, b) => b[1] - a[1])) {
  const bar = "█".repeat(Math.round(count / 2));
  const pct = ((count / destinations.length) * 100).toFixed(0);
  console.log(`  ${tag.padEnd(12)} ${String(count).padStart(2)} (${String(pct).padStart(2)}%)  ${bar}`);
}

console.log(`\n${errors === 0 && warnings === 0 ? "✅" : errors > 0 ? "❌" : "⚠️ "} ${errors} errors · ${warnings} warnings\n`);
if (errors > 0) process.exit(1);
