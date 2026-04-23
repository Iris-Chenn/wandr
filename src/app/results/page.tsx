import { rankDestinations } from "@/lib/ranking";
import { getCheapestFlight, getDepartureDates } from "@/lib/duffel";
import ResultsView from "@/components/ResultsView";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import destinationsRaw from "@/data/destinations.json";
import type { Destination } from "@/lib/ranking";

type Props = {
  searchParams: Promise<{
    budget?: string;
    origin?: string;
    tripLength?: string;
    month?: string;
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

  const { departDate, returnDate } = getDepartureDates(tripLength, month);

  // Fetch real prices in parallel for all destinations
  const destinations = destinationsRaw as Destination[];
  const priceResults = await Promise.allSettled(
    destinations.map((dest) =>
      getCheapestFlight(origin, dest.iataCode, departDate, returnDate)
    )
  );

  const realPrices: Record<string, number> = {};
  priceResults.forEach((result, i) => {
    if (result.status === "fulfilled" && result.value !== null) {
      realPrices[destinations[i].id] = result.value;
    }
  });

  const hasDuffelPrices = Object.keys(realPrices).length > 0;
  const results = rankDestinations(budget, origin, tripLength, undefined, realPrices);

  return (
    <div className="min-h-screen bg-[#f2f0eb]">
      <Navbar />
      <main className="pt-20 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="pt-6 pb-2">
            <Link href="/" className="text-sm text-[#00754A] hover:text-[#006241] hover:underline transition-colors">← Change budget</Link>
          </div>
          <ResultsView
            trips={results}
            budget={budget}
            hasDuffelPrices={hasDuffelPrices}
            departDate={departDate}
            returnDate={returnDate}
            origin={ORIGIN_LABELS[origin] ?? origin}
            tripLengthLabel={TRIP_LENGTH_LABELS[tripLength]}
            month={month}
          />
        </div>
      </main>
    </div>
  );
}
