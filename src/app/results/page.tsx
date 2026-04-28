import { rankDestinations } from "@/lib/ranking";
import type { LiveCosts, Split } from "@/lib/ranking";
import { DEFAULT_SPLIT } from "@/lib/ranking";
import { getCheapestFlight, getDepartureDates } from "@/lib/duffel";
import { computeGroundCosts } from "@/lib/cost-engine";
import ResultsView from "@/components/ResultsView";
import WandrNavbar from "@/components/WandrNavbar";
import WandrFooter from "@/components/WandrFooter";
import Link from "next/link";
import destinationsRaw from "@/data/destinations.json";
import type { Destination } from "@/lib/ranking";

type Props = {
  searchParams: Promise<{
    budget?: string;
    origin?: string;
    tripLength?: string;
    month?: string;
    vibes?: string;
    party?: string;
    // Budget split encoded as integers (percentages) from PlanForm
    sFlights?: string;
    sHotel?: string;
    sFood?: string;
    sActivities?: string;
  }>;
};

const ORIGIN_LABELS: Record<string, string> = {
  JFK: "New York", LAX: "Los Angeles", ORD: "Chicago", YYZ: "Toronto",
  LHR: "London", SFO: "San Francisco", MIA: "Miami", BOS: "Boston",
  SEA: "Seattle", ATL: "Atlanta",
};

const TRIP_LENGTH_LABELS: Record<string, string> = {
  "3-4": "3–4 days", "5-7": "5–7 days", "8-10": "8–10 days", "11-14": "11–14 days",
};

export default async function ResultsPage({ searchParams }: Props) {
  const params = await searchParams;
  const budget = Number(params.budget) || 700;
  const origin = params.origin || "JFK";
  const tripLength = params.tripLength || "5-7";
  const month = params.month || "flexible";
  const vibes = params.vibes || "";
  const party = Number(params.party) || 1;

  // Reconstruct the budget split the user set on the Plan page.
  // Params are integers (percentages); we normalise so they always sum to 1.
  const rawFlights    = Number(params.sFlights)    || Math.round(DEFAULT_SPLIT.flights    * 100);
  const rawHotel      = Number(params.sHotel)      || Math.round(DEFAULT_SPLIT.hotel      * 100);
  const rawFood       = Number(params.sFood)        || Math.round(DEFAULT_SPLIT.food       * 100);
  const rawActivities = Number(params.sActivities)  || Math.round(DEFAULT_SPLIT.activities * 100);
  const rawTotal = rawFlights + rawHotel + rawFood + rawActivities;
  const split: Split = {
    flights:    rawFlights    / rawTotal,
    hotel:      rawHotel      / rawTotal,
    food:       rawFood       / rawTotal,
    activities: rawActivities / rawTotal,
  };

  const { departDate, returnDate } = getDepartureDates(tripLength, month);

  const destinations = destinationsRaw as Destination[];

  // ── Flights: live from Duffel in parallel ──────────────────────────────
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

  // ── Hotel / food / activities: seasonal algorithm (fast, no I/O) ───────
  const { hotels, foodPerDay, activitiesPerDay } = computeGroundCosts(
    destinations,
    month
  );

  const liveCosts: LiveCosts = { flights, hotels, foodPerDay, activitiesPerDay };
  const hasDuffelPrices = Object.keys(flights).length > 0;
  const results = rankDestinations(budget, origin, tripLength, undefined, liveCosts, vibes, party, split);

  return (
    <>
      <WandrNavbar />
      <main>
        <div className="wrap" style={{ paddingBottom: 80 }}>
          <div style={{ paddingTop: 24, paddingBottom: 12 }}>
            <Link
              href="/plan"
              className="wd-mono"
              style={{ fontSize: 13, color: 'var(--w-accent)', textDecoration: 'none' }}
            >
              ← Change search
            </Link>
          </div>
          <ResultsView
            trips={results}
            budget={budget}
            hasDuffelPrices={hasDuffelPrices}
            departDate={departDate}
            returnDate={returnDate}
            origin={ORIGIN_LABELS[origin] ?? origin}
            originCode={origin}
            tripLengthLabel={TRIP_LENGTH_LABELS[tripLength]}
            tripLength={tripLength}
            month={month}
            vibes={vibes}
            party={party}
          />
        </div>
      </main>
      <WandrFooter />
    </>
  );
}
