import destinationsRaw from "@/data/destinations.json";

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

export type TripEstimate = Destination & {
  flightCost: number;
  hotelCost: number;
  foodCost: number;
  activitiesCost: number;
  totalCost: number;
  valueScore: number;
  budgetMatch: "perfect" | "great" | "stretch";
  nights: number;
};

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
};

// Mid-point of each range — must match duffel.ts nightsMap
const TRIP_LENGTH_NIGHTS: Record<string, number> = {
  "3-4": 4,
  "5-7": 6,
  "8-10": 9,
  "11-14": 12,
};

export type UserPreferences = {
  travelStyle?: string;
  priority?: string;
  tripType?: string;
};

// realPrices: map of destination id → actual flight cost from Duffel
// vibes: comma-separated string from /plan form e.g. "Beach,Food,Culture"
// party: number of travelers (hotel cost split across shared rooms)
export function rankDestinations(
  budget: number,
  origin: string,
  tripLength: string,
  preferences?: UserPreferences,
  realPrices?: Record<string, number>,
  vibes?: string,
  party: number = 1
): TripEstimate[] {
  const nights = TRIP_LENGTH_NIGHTS[tripLength] ?? 6;
  const flightMultiplier = ORIGIN_FLIGHT_MULTIPLIERS[origin] ?? 1.0;

  // Hotel room sharing: 2 people per room
  const rooms = Math.ceil(party / 2);
  const hotelShareFactor = party === 1 ? 1 : rooms / party;

  // Parse vibes into a lowercase set for fast matching
  const vibeSet = vibes
    ? new Set(vibes.split(",").map((v) => v.trim().toLowerCase()).filter(Boolean))
    : new Set<string>();

  const destinations = destinationsRaw as Destination[];

  const estimates: TripEstimate[] = destinations.map((dest) => {
    const flightCost = realPrices?.[dest.id]
      ?? Math.round(dest.avgFlightCostFromJFK * flightMultiplier);

    // Hotel per person: adjusted for room sharing
    const hotelCost = Math.round(dest.avgHotelNightly * nights * hotelShareFactor);
    const foodCost = Math.round(dest.avgDailyCost * 0.45 * nights);
    const activitiesCost = Math.round(dest.avgDailyCost * 0.35 * nights);
    const totalCost = flightCost + hotelCost + foodCost + activitiesCost;

    // Budget match labels:
    //   "great"   → Great value: ≥20% under budget (genuinely cheap)
    //   "perfect" → Within budget: up to budget
    //   "stretch" → Slight stretch: up to 20% over budget
    const budgetMatch: TripEstimate["budgetMatch"] =
      totalCost <= budget * 0.80 ? "great" :
      totalCost <= budget        ? "perfect" : "stretch";

    // Base value score: popularity per dollar spent
    let valueScore = (dest.popularityScore / totalCost) * 1000;

    // Vibe boost: +25% per matching tag (max 2 matches = +50%)
    if (vibeSet.size > 0) {
      const matchCount = dest.tags.filter((t) =>
        vibeSet.has(t.toLowerCase())
      ).length;
      if (matchCount > 0) {
        valueScore *= 1 + Math.min(matchCount, 2) * 0.25;
      }
    }

    // Personalisation quiz boosts
    if (preferences?.travelStyle) {
      const style = preferences.travelStyle.toLowerCase();
      if (dest.tags.some((t) => t.toLowerCase() === style)) {
        valueScore *= 1.25;
      }
    }

    // Slight boost for trips well under budget (budget headroom = room to upgrade)
    const budgetHeadroom = budget - totalCost;
    if (budgetHeadroom > 0) {
      valueScore *= 1 + (budgetHeadroom / budget) * 0.2;
    }

    return {
      ...dest,
      flightCost,
      hotelCost,
      foodCost,
      activitiesCost,
      totalCost,
      valueScore: Math.round(valueScore * 10) / 10,
      budgetMatch,
      nights,
    };
  });

  // Show trips within budget AND up to 20% over (labelled "Slight stretch")
  const withinRange = estimates.filter((d) => d.totalCost <= budget * 1.2);

  // Sort: within-budget trips first (by value score), then over-budget by value score
  return withinRange.sort((a, b) => {
    const aOver = a.totalCost > budget;
    const bOver = b.totalCost > budget;
    if (aOver !== bOver) return aOver ? 1 : -1; // within-budget always before over-budget
    return b.valueScore - a.valueScore;
  });
}
