import { NextRequest, NextResponse } from "next/server";
import { getCheapestFlight, getDepartureDates } from "@/lib/duffel";
import { computeGroundCosts } from "@/lib/cost-engine";
import destinationsRaw from "@/data/destinations.json";
import type { Destination } from "@/lib/ranking";

export const runtime = "nodejs";

/**
 * GET /api/plan-costs
 *
 * Returns a complete cost breakdown for every destination:
 *   - flights     : live round-trip price from Duffel (per person)
 *   - hotels      : seasonally-adjusted per-night hotel rate
 *   - foodPerDay  : seasonally-adjusted food cost per person per day
 *   - activitiesPerDay : seasonally-adjusted activities cost per person per day
 *
 * Query params:
 *   origin      – IATA code (default: JFK)
 *   tripLength  – "3-4" | "5-7" | "8-10" | "11-14" (default: "5-7")
 *   month       – "may-2026" | "flexible" etc. (default: "flexible")
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const origin     = searchParams.get("origin")     || "JFK";
  const tripLength = searchParams.get("tripLength")  || "5-7";
  const month      = searchParams.get("month")       || "flexible";

  const { departDate, returnDate } = getDepartureDates(tripLength, month);
  const destinations = destinationsRaw as Destination[];

  // ── Flights: live from Duffel (2-hour in-memory cache) ──────────────────
  const flightResults = await Promise.allSettled(
    destinations.map((dest) =>
      getCheapestFlight(origin, dest.iataCode, departDate, returnDate)
    )
  );

  const flights: Record<string, number> = {};
  flightResults.forEach((result, i) => {
    if (result.status === "fulfilled" && result.value !== null) {
      flights[destinations[i].id] = result.value;
    }
  });

  // ── Hotel / food / activities: seasonal algorithm (cost-engine) ──────────
  const { hotels, foodPerDay, activitiesPerDay } = computeGroundCosts(
    destinations,
    month
  );

  return NextResponse.json(
    { flights, hotels, foodPerDay, activitiesPerDay, departDate, returnDate, origin },
    {
      headers: {
        // Browser: 30 min; CDN/edge: 2 hours (matches Duffel cache TTL)
        "Cache-Control": "public, s-maxage=7200, stale-while-revalidate=1800",
      },
    }
  );
}
