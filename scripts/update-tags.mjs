/**
 * update-tags.mjs
 *
 * One-time script to apply a curated, research-backed tag set to every
 * destination in destinations.json.
 *
 * Taxonomy (9 canonical tags):
 *   city       — urban streets, architecture, markets
 *   beach      — coastal swimming / sunbathing
 *   nature     — hiking, wildlife, dramatic landscapes
 *   food       — destination-defining cuisine scenes
 *   culture    — museums, arts, local traditions
 *   history    — ancient/significant historical sites
 *   adventure  — outdoor sports, trekking, unique experiences
 *   nightlife  — clubs, bar scenes, live music
 *   chill      — relaxed pace, wellness, slow travel
 *
 * Criteria applied:
 *   nightlife  → globally or regionally renowned for after-dark scene
 *   chill      → known as a slow-travel, beach-resort, or wellness destination
 *   history    → has UNESCO-listed or widely recognised historic sites/old towns
 *   food       → destination-level food reputation (not just "has restaurants")
 *   adventure  → primary draw includes outdoor or physical activities
 *
 * Run: node scripts/update-tags.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath = resolve(__dirname, "../src/data/destinations.json");

// ── Curated tag sets (id → canonical tags, order: city > beach > nature > food > culture > history > adventure > nightlife > chill) ──

const TAG_MAP = {
  // ─── Europe ───────────────────────────────────────────────────────────────
  "lisbon":        ["city", "beach", "food", "culture", "history", "nightlife", "chill"],
  "paris":         ["city", "food", "culture", "history"],
  "rome":          ["city", "food", "culture", "history"],
  "madrid":        ["city", "food", "culture", "history", "nightlife"],
  "barcelona":     ["city", "beach", "food", "culture", "history", "nightlife"],
  "vienna":        ["city", "food", "culture", "history"],
  "berlin":        ["city", "culture", "history", "nightlife"],
  "amsterdam":     ["city", "food", "culture", "history", "nightlife"],
  "prague":        ["city", "food", "culture", "history", "nightlife"],
  "budapest":      ["city", "food", "culture", "history", "nightlife"],
  "athens":        ["city", "beach", "food", "culture", "history"],
  "istanbul":      ["city", "food", "culture", "history"],
  "reykjavik":     ["city", "nature", "culture", "adventure"],
  "porto":         ["city", "beach", "food", "culture", "history", "chill"],
  "seville":       ["city", "food", "culture", "history", "nightlife"],
  "valencia":      ["city", "beach", "food", "culture", "history"],
  "krakow":        ["city", "food", "culture", "history", "nightlife"],
  "warsaw":        ["city", "food", "culture", "history"],
  "florence":      ["city", "food", "culture", "history"],
  "naples":        ["city", "beach", "food", "culture", "history", "adventure"],
  "dubrovnik":     ["city", "beach", "food", "culture", "history"],
  "split":         ["city", "beach", "culture", "history", "chill"],
  "kotor":         ["city", "beach", "nature", "culture", "history", "chill"],
  "belgrade":      ["city", "food", "culture", "history", "nightlife"],
  "bucharest":     ["city", "food", "culture", "history", "nightlife"],
  "sofia":         ["city", "food", "culture", "history"],
  "vilnius":       ["city", "food", "culture", "history"],
  "tallinn":       ["city", "culture", "history"],
  "dublin":        ["city", "food", "culture", "history", "nightlife"],
  "edinburgh":     ["city", "nature", "food", "culture", "history"],
  "valletta":      ["city", "beach", "culture", "history", "chill"],
  "tbilisi":       ["city", "food", "culture", "history", "adventure"],

  // ─── Americas ─────────────────────────────────────────────────────────────
  "mexico-city":       ["city", "food", "culture", "history", "nightlife"],
  "cancun":            ["beach", "culture", "food", "nightlife", "chill"],
  "tulum":             ["beach", "nature", "culture", "adventure", "chill"],
  "oaxaca":            ["food", "culture", "history", "nature"],
  "puerto-vallarta":   ["beach", "food", "culture", "nightlife", "chill"],
  "san-juan":          ["city", "beach", "food", "culture", "history", "nightlife", "chill"],
  "punta-cana":        ["beach", "nature", "chill"],
  "havana":            ["city", "beach", "culture", "history", "nightlife"],
  "antigua-guatemala": ["city", "culture", "history", "nature", "adventure"],
  "san-jose-costa-rica": ["city", "nature", "culture", "adventure"],
  "panama-city":       ["city", "culture", "history", "nature"],
  "colombia-medellin": ["city", "food", "culture", "adventure", "nightlife"],
  "cartagena":         ["city", "beach", "culture", "history", "chill"],
  "bogota":            ["city", "food", "culture", "history"],
  "lima":              ["city", "food", "culture", "history"],
  "cusco":             ["culture", "history", "nature", "adventure"],
  "buenos-aires":      ["city", "food", "culture", "nightlife"],
  "santiago":          ["city", "food", "culture", "nature", "adventure"],
  "rio-de-janeiro":    ["city", "beach", "culture", "nature", "nightlife"],
  "montevideo":        ["city", "beach", "food", "culture", "chill"],
  "quito":             ["city", "culture", "history", "nature", "adventure"],
  "nassau":            ["beach", "culture", "nightlife", "chill"],

  // ─── Africa ───────────────────────────────────────────────────────────────
  "marrakech":  ["city", "food", "culture", "history", "adventure"],
  "cape-town":  ["city", "beach", "food", "nature", "adventure"],
  "nairobi":    ["city", "culture", "nature", "adventure"],

  // ─── Asia ─────────────────────────────────────────────────────────────────
  "bangkok":     ["city", "food", "culture", "history", "adventure", "nightlife"],
  "bali":        ["beach", "nature", "culture", "adventure", "chill"],
  "tokyo":       ["city", "food", "culture", "history", "nightlife"],
  "chiang-mai":  ["city", "food", "culture", "nature", "adventure", "chill"],
  "ho-chi-minh": ["city", "food", "culture", "history", "nightlife"],
  "hanoi":       ["city", "food", "culture", "history"],
  "taipei":      ["city", "food", "culture", "nature", "nightlife"],
  "singapore":   ["city", "food", "culture", "nightlife"],
  "kathmandu":   ["culture", "history", "nature", "adventure"],
};

const VALID_TAGS = new Set([
  "city", "beach", "nature", "food", "culture",
  "history", "adventure", "nightlife", "chill",
]);

// ── Apply ──────────────────────────────────────────────────────────────────

const destinations = JSON.parse(readFileSync(jsonPath, "utf8"));
const results = { updated: [], skipped: [], unknown: [] };

for (const dest of destinations) {
  const newTags = TAG_MAP[dest.id];
  if (!newTags) {
    results.unknown.push(dest.id);
    continue;
  }

  // Validate tags
  const invalid = newTags.filter(t => !VALID_TAGS.has(t));
  if (invalid.length > 0) {
    console.error(`❌ Invalid tags for ${dest.id}: ${invalid.join(", ")}`);
    process.exit(1);
  }

  const before = dest.tags.join(", ");
  dest.tags = newTags;
  const after = dest.tags.join(", ");

  if (before !== after) {
    results.updated.push({ id: dest.id, before, after });
  } else {
    results.skipped.push(dest.id);
  }
}

writeFileSync(jsonPath, JSON.stringify(destinations, null, 2) + "\n");

// ── Report ─────────────────────────────────────────────────────────────────

console.log(`\n✅ Tags updated — ${results.updated.length} destinations changed\n`);
for (const r of results.updated) {
  console.log(`  ${r.id}`);
  console.log(`    before: ${r.before}`);
  console.log(`    after:  ${r.after}`);
}

if (results.skipped.length > 0) {
  console.log(`\n⏭  Unchanged: ${results.skipped.join(", ")}`);
}
if (results.unknown.length > 0) {
  console.log(`\n⚠️  Not in TAG_MAP (not updated): ${results.unknown.join(", ")}`);
}

// Final distribution
const tagCounts = {};
for (const dest of destinations) {
  for (const t of dest.tags) {
    tagCounts[t] = (tagCounts[t] ?? 0) + 1;
  }
}
console.log("\n📊 Final tag distribution:");
for (const [tag, count] of Object.entries(tagCounts).sort((a, b) => b[1] - a[1])) {
  const bar = "█".repeat(Math.round(count / 2));
  console.log(`  ${tag.padEnd(12)} ${String(count).padStart(2)}  ${bar}`);
}
