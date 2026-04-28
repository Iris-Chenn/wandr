/**
 * cost-engine.ts
 *
 * Dynamic pricing algorithm for hotel, food, and activity costs.
 *
 * Flights are fetched live via Duffel (duffel.ts).
 * Hotel / food / activity costs use research-backed base rates from
 * destinations.json and apply regional seasonal demand multipliers so the
 * totals shift realistically when the user picks a travel month.
 *
 * Seasonal logic:
 *   - Peak months   → hotels +38%, food +8%, activities +15%
 *   - Off-peak      → hotels -26%, food -7%, activities -12%
 *   - Shoulder      → 1.0× (no adjustment)
 */

import type { Destination } from "./ranking";

// ── Regional season definitions (months are 1-indexed) ──────────────────────
const REGION_SEASONS: Record<string, { peak: number[]; offPeak: number[] }> = {
  // European summer + Christmas holidays are peak; deep winter is quiet
  Europe: {
    peak:    [6, 7, 8, 12],
    offPeak: [1, 2, 11],
  },
  // SE/East Asia: cool dry season (Nov–Mar) is peak; monsoon/hot is off-peak
  Asia: {
    peak:    [11, 12, 1, 2, 3],
    offPeak: [5, 6, 9, 10],
  },
  // Americas: northern-hemisphere summer + winter holidays peak; spring/fall quiet
  Americas: {
    peak:    [6, 7, 8, 12, 1],
    offPeak: [4, 9, 10],
  },
  // Africa: safari high season (Jul–Aug) + Christmas; rainy season off-peak
  Africa: {
    peak:    [7, 8, 12, 1],
    offPeak: [3, 4, 5, 10],
  },
  // Oceania: southern-hemisphere summer (Dec–Feb) peak; their winter quiet
  Oceania: {
    peak:    [12, 1, 2],
    offPeak: [5, 6, 7, 8],
  },
};

const MONTH_NAMES = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Parse "may-2026" → 5, "june-2026" → 6, "flexible" / invalid → null */
export function parseMonthIndex(month: string): number | null {
  if (!month || month === "flexible") return null;
  const name = month.split("-")[0].toLowerCase();
  const idx = MONTH_NAMES.indexOf(name);
  return idx === -1 ? null : idx + 1;
}

export type SeasonalMultipliers = {
  hotel: number;
  food: number;
  activities: number;
};

/**
 * Returns price multipliers for a given travel month and destination region.
 *
 *   Peak     → { hotel: 1.38, food: 1.08, activities: 1.15 }
 *   Off-peak → { hotel: 0.74, food: 0.93, activities: 0.88 }
 *   Shoulder → { hotel: 1.00, food: 1.00, activities: 1.00 }
 */
export function getSeasonalMultipliers(
  monthIndex: number | null,
  region: string
): SeasonalMultipliers {
  if (monthIndex === null) {
    return { hotel: 1.0, food: 1.0, activities: 1.0 };
  }
  const seasons = REGION_SEASONS[region] ?? REGION_SEASONS.Europe;
  const isPeak    = seasons.peak.includes(monthIndex);
  const isOffPeak = seasons.offPeak.includes(monthIndex);

  return {
    hotel:      isPeak ? 1.38 : isOffPeak ? 0.74 : 1.0,
    food:       isPeak ? 1.08 : isOffPeak ? 0.93 : 1.0,
    activities: isPeak ? 1.15 : isOffPeak ? 0.88 : 1.0,
  };
}

// ── Per-destination calculators ──────────────────────────────────────────────

/**
 * Seasonally-adjusted hotel rate per night (per room, before party splitting).
 * Base: `dest.avgHotelNightly` (mid-range research rate).
 */
export function getHotelNightly(dest: Destination, month: string): number {
  const m = getSeasonalMultipliers(parseMonthIndex(month), dest.region);
  return Math.round(dest.avgHotelNightly * m.hotel);
}

/**
 * Seasonally-adjusted food cost per person per day.
 * Food ≈ 45% of a destination's average daily spend (meals + drinks).
 */
export function getFoodPerDay(dest: Destination, month: string): number {
  const m = getSeasonalMultipliers(parseMonthIndex(month), dest.region);
  return Math.round(dest.avgDailyCost * 0.45 * m.food);
}

/**
 * Seasonally-adjusted activities cost per person per day.
 * Activities ≈ 35% of average daily spend (entrance fees, tours, experiences).
 */
export function getActivitiesPerDay(dest: Destination, month: string): number {
  const m = getSeasonalMultipliers(parseMonthIndex(month), dest.region);
  return Math.round(dest.avgDailyCost * 0.35 * m.activities);
}

// ── Batch helper ─────────────────────────────────────────────────────────────

export type GroundCosts = {
  /** Per-night hotel rate (mid-range, seasonal). Multiply by nights × hotelShareFactor. */
  hotels: Record<string, number>;
  /** Per-day food cost per person. Multiply by nights. */
  foodPerDay: Record<string, number>;
  /** Per-day activities cost per person. Multiply by nights. */
  activitiesPerDay: Record<string, number>;
};

/**
 * Compute seasonal hotel / food / activity rates for every destination.
 * Called once per search (fast — pure arithmetic, no I/O).
 */
export function computeGroundCosts(
  destinations: Destination[],
  month: string
): GroundCosts {
  const hotels: Record<string, number>         = {};
  const foodPerDay: Record<string, number>     = {};
  const activitiesPerDay: Record<string, number> = {};

  for (const dest of destinations) {
    hotels[dest.id]           = getHotelNightly(dest, month);
    foodPerDay[dest.id]       = getFoodPerDay(dest, month);
    activitiesPerDay[dest.id] = getActivitiesPerDay(dest, month);
  }

  return { hotels, foodPerDay, activitiesPerDay };
}
