import { NextRequest, NextResponse } from "next/server";
import { getCheapestFlight, getDepartureDates } from "@/lib/duffel";
import destinationsRaw from "@/data/destinations.json";
import type { Destination } from "@/lib/ranking";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const origin     = searchParams.get("origin")     || "JFK";
  const tripLength = searchParams.get("tripLength")  || "5-7";
  const month      = searchParams.get("month")       || "flexible";

  const { departDate, returnDate } = getDepartureDates(tripLength, month);
  const destinations = destinationsRaw as Destination[];

  // Fetch all destinations in parallel — duffel.ts has a 2-hour in-memory cache
  // so repeated calls for the same origin+dates are instant
  const priceResults = await Promise.allSettled(
    destinations.map((dest) =>
      getCheapestFlight(origin, dest.iataCode, departDate, returnDate)
    )
  );

  const prices: Record<string, number> = {};
  priceResults.forEach((result, i) => {
    if (result.status === "fulfilled" && result.value !== null) {
      prices[destinations[i].id] = result.value;
    }
  });

  return NextResponse.json(
    { prices, departDate, returnDate, origin },
    {
      headers: {
        // Browser can cache for 30 min; CDN/edge for 2 hours (matches Duffel cache TTL)
        "Cache-Control": "public, s-maxage=7200, stale-while-revalidate=1800",
      },
    }
  );
}
