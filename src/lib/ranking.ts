import destinationsRaw from "@/data/destinations.json";

// ─── Core types ──────────────────────────────────────────────────────────────

export type Destination = {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  flag: string;
  iataCode: string;
  region: string;
  tags: string[];
  avgDailyCost: number;
  avgFlightCostFromJFK: number;
  avgHotelNightly: number;
  popularityScore: number;
  description: string;
  bestMonths: string[];
  visaRequired: boolean;
  unsplashId: string;
  lat: number;
  lng: number;
};

/**
 * How the user wants to split their budget across the four spend categories.
 * Values are fractions that must sum to 1.0.
 */
export type Split = {
  flights: number;
  hotel: number;
  food: number;
  activities: number;
};

export const DEFAULT_SPLIT: Split = {
  flights: 0.42,
  hotel: 0.28,
  food: 0.18,
  activities: 0.12,
};

/**
 * Live cost data from /api/plan-costs.
 * All fields are optional — missing entries fall back to static estimates
 * from destinations.json so the app works even when the API is unavailable.
 */
export type LiveCosts = {
  /** Live round-trip flight price per person (from Duffel) */
  flights?: Record<string, number>;
  /** Seasonally-adjusted per-night hotel rate */
  hotels?: Record<string, number>;
  /** Seasonally-adjusted per-day food cost per person */
  foodPerDay?: Record<string, number>;
  /** Seasonally-adjusted per-day activities cost per person */
  activitiesPerDay?: Record<string, number>;
};

export type UserPreferences = {
  travelStyle?: string;
  priority?: string;
  tripType?: string;
};

/**
 * A destination with full cost breakdown + unified best-fit score.
 *
 * Score breakdown (0–100 total, higher = better fit):
 *   scoreBudgetFit   0–30  How well the total cost uses the budget
 *   scoreHotelFit    0–30  How well the hotel allocation covers quality accommodation
 *   scoreVibeMatch   0–20  How many of the user's selected vibes match
 *   scoreExperience  0–12  Destination quality & popularity signal
 *   scoreFlightBonus 0–8   Reward cheap flights (freed budget)
 */
export type TripEstimate = Destination & {
  // Cost breakdown
  flightCost: number;
  hotelCost: number;
  foodCost: number;
  activitiesCost: number;
  totalCost: number;
  nights: number;

  // Budget position
  ratio: number;                                         // totalCost / budget
  tier: "perfect" | "great" | "stretch" | "over";       // for map colouring + counts
  budgetMatch: "great" | "perfect" | "stretch";          // for card label

  // Unified score
  totalScore: number;       // 0–100 — sort descending
  scoreBudgetFit: number;   // 0–30
  scoreHotelFit: number;    // 0–30
  scoreVibeMatch: number;   // 0–20
  scoreExperience: number;  // 0–12
  scoreFlightBonus: number; // 0–8
};

// ─── Origin multipliers ───────────────────────────────────────────────────────
// How much more / less than JFK prices a round-trip typically costs from each hub.
// Live Duffel prices make these irrelevant when available; they only apply to
// the static fallback estimate.

const ORIGIN_FLIGHT_MULTIPLIERS: Record<string, number> = {
  JFK: 1.0,
  LAX: 1.05,
  ORD: 1.02,
  YYZ: 0.98,
  LHR: 0.80,
  SFO: 1.05,
  MIA: 1.08,
  BOS: 1.01,
  SEA: 1.04,
  ATL: 1.03,
  SIN: 1.0,
};

// Mid-point of each range — must match duffel.ts nightsMap
const TRIP_LENGTH_NIGHTS: Record<string, number> = {
  "3-4": 4,
  "5-7": 6,
  "8-10": 9,
  "11-14": 12,
};

// ─── Scoring helpers ──────────────────────────────────────────────────────────

/**
 * How well does the total trip cost fit within the budget?
 *
 *  ≤ 80%   30 pts  — comfortable headroom, room to splurge in-trip
 *  ≤ 90%   26 pts  — solid fit
 *  ≤ 100%  20 pts  — exactly on budget
 *  ≤ 110%  12 pts  — slight stretch
 *  ≤ 120%   6 pts  — shown as "stretch", still recommended
 *   > 120%   0 pts  — excluded from results
 */
function scoreBudgetFit(ratio: number): number {
  if (ratio <= 0.80) return 30;
  if (ratio <= 0.90) return 26;
  if (ratio <= 1.00) return 20;
  if (ratio <= 1.10) return 12;
  if (ratio <= 1.20) return 6;
  return 0;
}

/**
 * How well does the hotel budget allocation let the traveller stay somewhere
 * actually good at this destination?
 *
 * Key insight: cheapest-ever accommodation ≠ best recommendation.
 * A traveller who allocates $133/night shouldn't be sent somewhere
 * where hotels cost $30/night (budget massively wasted) nor $300/night
 * (unaffordable). The sweet spot is 90–130% of the actual nightly rate.
 *
 *  0.90–1.30  30 pts  sweet spot — budget covers a quality room
 *  0.70–0.89  22 pts  slightly tight — budget-end accommodation
 *  1.30–2.00  18 pts  can upgrade, hotel budget slightly over-allocated
 *  0.50–0.69  10 pts  budget forces very basic accommodation
 *     > 2.00   8 pts  hotel is so cheap the hotel budget is wasted
 *     < 0.50   2 pts  can't comfortably afford decent lodging
 */
function scoreHotelFit(hotelBudgetPerNight: number, hotelNightly: number): number {
  if (hotelNightly <= 0) return 15; // no data, neutral
  const ratio = hotelBudgetPerNight / hotelNightly;
  if (ratio >= 0.90 && ratio <= 1.30) return 30;
  if (ratio >= 0.70 && ratio <  0.90) return 22;
  if (ratio >  1.30 && ratio <= 2.00) return 18;
  if (ratio >= 0.50 && ratio <  0.70) return 10;
  if (ratio >  2.00)                  return 8;
  return 2;
}

/**
 * Vibe alignment — how many of the user's selected vibes match this
 * destination's tags. 7 pts per match, capped at 20.
 */
function scoreVibeMatch(destTags: string[], vibeSet: Set<string>): number {
  if (vibeSet.size === 0) return 10; // neutral when no vibes selected
  const matches = destTags.filter(t => vibeSet.has(t.toLowerCase())).length;
  return Math.min(20, matches * 7);
}

/**
 * Experience quality — how rich and popular is the destination?
 * popularityScore is 0–100, scaled to 0–12.
 */
function scoreExperience(popularityScore: number): number {
  return Math.round((popularityScore / 100) * 12 * 10) / 10;
}

/**
 * Flight efficiency bonus — reward destinations with cheap flights.
 * Cheap flights free up budget for experiences; over-allocation on flights
 * is a signal the allocation bar needs adjusting.
 *
 *  ≤ 60% of flight budget   8 pts
 *  ≤ 80%                    6 pts
 *  ≤ 100%                   3 pts
 *    > 100%                  0 pts
 */
function scoreFlightBonus(flightCost: number, flightBudget: number): number {
  if (flightBudget <= 0) return 4; // neutral
  const ratio = flightCost / flightBudget;
  if (ratio <= 0.60) return 8;
  if (ratio <= 0.80) return 6;
  if (ratio <= 1.00) return 3;
  return 0;
}

// ─── Tier helpers ─────────────────────────────────────────────────────────────

function toTier(ratio: number): TripEstimate["tier"] {
  if (ratio <= 0.85) return "perfect";
  if (ratio <= 1.00) return "great";
  if (ratio <= 1.20) return "stretch";
  return "over";
}

function toBudgetMatch(ratio: number): TripEstimate["budgetMatch"] {
  if (ratio <= 0.80) return "great";
  if (ratio <= 1.00) return "perfect";
  return "stretch";
}

// ─── Main functions ───────────────────────────────────────────────────────────

/**
 * Compute full cost estimates + best-fit scores for EVERY destination.
 * No filtering, no sorting — suitable for the Plan-page map where all
 * destinations (including over-budget) are displayed with tier colours.
 */
export function computeTripEstimates(
  budget: number,
  origin: string,
  tripLength: string,
  liveCosts?: LiveCosts,
  vibes?: string,
  party: number = 1,
  split: Split = DEFAULT_SPLIT
): TripEstimate[] {
  const nights = TRIP_LENGTH_NIGHTS[tripLength] ?? 6;
  const flightMultiplier = ORIGIN_FLIGHT_MULTIPLIERS[origin] ?? 1.0;

  // Hotel room sharing: 2 people per room
  const rooms = Math.ceil(party / 2);
  const hotelShareFactor = party === 1 ? 1 : rooms / party;

  // Vibe set for fast matching
  const vibeSet = vibes
    ? new Set(vibes.split(",").map(v => v.trim().toLowerCase()).filter(Boolean))
    : new Set<string>();

  // Per-category budget caps from the allocation bar
  const flightBudget = budget * split.flights;
  const hotelBudget  = budget * split.hotel;
  // Hotel budget per night — used for hotel-fit scoring
  const hotelBudgetPerNight = hotelBudget / nights;

  return (destinationsRaw as Destination[]).map(dest => {
    // ── Costs ──────────────────────────────────────────────────────────────

    // Flights: live Duffel price → static estimate fallback
    const flightCost = liveCosts?.flights?.[dest.id]
      ?? Math.round(dest.avgFlightCostFromJFK * flightMultiplier);

    // Hotels: seasonal rate → static fallback, then split by party/rooms
    const hotelNightly = liveCosts?.hotels?.[dest.id] ?? dest.avgHotelNightly;
    const hotelCost    = Math.round(hotelNightly * nights * hotelShareFactor);

    // Food: seasonal per-day rate → static fallback (45% of daily spend)
    const foodRate = liveCosts?.foodPerDay?.[dest.id]
      ?? Math.round(dest.avgDailyCost * 0.45);
    const foodCost = Math.round(foodRate * nights);

    // Activities: seasonal per-day rate → static fallback (35% of daily spend)
    const actRate       = liveCosts?.activitiesPerDay?.[dest.id]
      ?? Math.round(dest.avgDailyCost * 0.35);
    const activitiesCost = Math.round(actRate * nights);

    const totalCost = flightCost + hotelCost + foodCost + activitiesCost;
    const ratio     = totalCost / budget;

    // ── Scoring ─────────────────────────────────────────────────────────────

    const sBudget   = scoreBudgetFit(ratio);
    const sHotel    = scoreHotelFit(hotelBudgetPerNight, hotelNightly);
    const sVibe     = scoreVibeMatch(dest.tags, vibeSet);
    const sExp      = scoreExperience(dest.popularityScore);
    const sFlight   = scoreFlightBonus(flightCost, flightBudget);
    const totalScore = Math.round((sBudget + sHotel + sVibe + sExp + sFlight) * 10) / 10;

    return {
      ...dest,
      flightCost,
      hotelCost,
      foodCost,
      activitiesCost,
      totalCost,
      nights,
      ratio,
      tier:        toTier(ratio),
      budgetMatch: toBudgetMatch(ratio),
      totalScore,
      scoreBudgetFit:   sBudget,
      scoreHotelFit:    sHotel,
      scoreVibeMatch:   sVibe,
      scoreExperience:  sExp,
      scoreFlightBonus: sFlight,
    };
  });
}

/**
 * Rank destinations for the Results page.
 * Applies the same scoring as computeTripEstimates, then:
 *   1. Excludes trips more than 20% over budget
 *   2. Sorts descending by totalScore (best fit first)
 *   3. Applies optional personalisation preferences on top
 */
export function rankDestinations(
  budget: number,
  origin: string,
  tripLength: string,
  preferences?: UserPreferences,
  liveCosts?: LiveCosts,
  vibes?: string,
  party: number = 1,
  split: Split = DEFAULT_SPLIT
): TripEstimate[] {
  const all = computeTripEstimates(budget, origin, tripLength, liveCosts, vibes, party, split);

  // Exclude trips more than 20% over budget
  const inRange = all.filter(d => d.ratio <= 1.20);

  // Sort by totalScore descending — best fit first regardless of tier
  inRange.sort((a, b) => b.totalScore - a.totalScore);

  // Optional: apply quiz preferences as a secondary re-rank
  if (preferences?.travelStyle) {
    const style = preferences.travelStyle.toLowerCase();
    inRange.sort((a, b) => {
      const aBoost = a.tags.includes(style) ? a.totalScore * 1.25 : a.totalScore;
      const bBoost = b.tags.includes(style) ? b.totalScore * 1.25 : b.totalScore;
      return bBoost - aBoost;
    });
  }

  return inRange;
}
