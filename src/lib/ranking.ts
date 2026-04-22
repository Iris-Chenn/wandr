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

const TRIP_LENGTH_NIGHTS: Record<string, number> = {
  "3-4": 3,
  "5-7": 5,
  "8-10": 8,
  "11-14": 11,
};

export type UserPreferences = {
  travelStyle?: string;
  priority?: string;
  tripType?: string;
};

// realPrices: map of destination id → actual flight cost from Duffel
export function rankDestinations(
  budget: number,
  origin: string,
  tripLength: string,
  preferences?: UserPreferences,
  realPrices?: Record<string, number>
): TripEstimate[] {
  const nights = TRIP_LENGTH_NIGHTS[tripLength] ?? 5;
  const flightMultiplier = ORIGIN_FLIGHT_MULTIPLIERS[origin] ?? 1.0;

  const destinations = destinationsRaw as Destination[];

  const estimates: TripEstimate[] = destinations.map((dest) => {
    const flightCost = realPrices?.[dest.id]
      ?? Math.round(dest.avgFlightCostFromJFK * flightMultiplier);
    const hotelCost = dest.avgHotelNightly * nights;
    const foodCost = Math.round(dest.avgDailyCost * 0.45 * nights);
    const activitiesCost = Math.round(dest.avgDailyCost * 0.35 * nights);
    const totalCost = flightCost + hotelCost + foodCost + activitiesCost;

    const budgetMatch: TripEstimate["budgetMatch"] =
      totalCost <= budget ? "perfect" :
      totalCost <= budget * 1.15 ? "great" : "stretch";

    // Base value score: how good a trip you get per dollar
    let valueScore = (dest.popularityScore / totalCost) * 1000;

    // Preference boosts
    if (preferences?.travelStyle) {
      const style = preferences.travelStyle.toLowerCase();
      if (dest.tags.some((t) => t.toLowerCase() === style)) {
        valueScore *= 1.25;
      }
    }

    // Boost trips well within budget
    const budgetHeadroom = budget - totalCost;
    if (budgetHeadroom > 0) {
      valueScore *= 1 + (budgetHeadroom / budget) * 0.3;
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

  // Filter: only show trips at or within 20% over budget
  const affordable = estimates.filter((d) => d.totalCost <= budget * 1.2);

  // Sort by value score descending
  return affordable.sort((a, b) => b.valueScore - a.valueScore);
}
