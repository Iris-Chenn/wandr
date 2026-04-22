import { rankDestinations } from "@/lib/ranking";
import DestinationCard from "@/components/DestinationCard";
import Navbar from "@/components/Navbar";
import Link from "next/link";

type Props = {
  searchParams: Promise<{
    budget?: string;
    origin?: string;
    tripLength?: string;
    month?: string;
  }>;
};

export default async function ResultsPage({ searchParams }: Props) {
  const params = await searchParams;
  const budget = Number(params.budget) || 700;
  const origin = params.origin || "JFK";
  const tripLength = params.tripLength || "5-7";
  const month = params.month || "flexible";

  const results = rankDestinations(budget, origin, tripLength);

  const originLabel =
    origin === "JFK" ? "New York" :
    origin === "LAX" ? "Los Angeles" :
    origin === "YYZ" ? "Toronto" :
    origin === "LHR" ? "London" : origin;

  const tripLengthLabel =
    tripLength === "3-4" ? "3–4 days" :
    tripLength === "5-7" ? "5–7 days" :
    tripLength === "8-10" ? "8–10 days" : "11–14 days";

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Navbar />

      <main className="pt-20 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">

          {/* Summary header */}
          <div className="py-8">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <Link href="/" className="text-sm text-[#D4612A] hover:underline">← Change budget</Link>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-1">
              {results.length} trips for <span className="text-[#D4612A]">${budget.toLocaleString()}</span>
            </h1>
            <p className="text-[#5A5A5A] text-sm">
              Flying from {originLabel} · {tripLengthLabel}
              {month !== "flexible" && ` · ${month}`}
            </p>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["All", "Beach", "City", "Nature", "Culture", "Adventure", "Food"].map((tag) => (
              <button
                key={tag}
                className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                  tag === "All"
                    ? "bg-[#D4612A] text-white border-[#D4612A]"
                    : "bg-[#FFFCF7] text-[#5A5A5A] border-[#E0D8C8] hover:border-[#D4612A]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-6 text-xs text-[#8A8A8A]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#D4612A]" /> Flight
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#1A7A6D]" /> Hotel
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#6B4FA0]" /> Food
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#E0D8C8]" /> Activities
            </div>
          </div>

          {/* Results grid */}
          {results.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">😅</div>
              <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-2">No trips found</h2>
              <p className="text-[#5A5A5A] mb-6">Try increasing your budget or adjusting your trip length.</p>
              <Link
                href="/"
                className="bg-[#D4612A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#A84A1E] transition-colors"
              >
                Adjust my budget
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((trip) => (
                <DestinationCard key={trip.id} trip={trip} budget={budget} />
              ))}
            </div>
          )}

          {/* Upsell strip */}
          {results.length > 0 && (
            <div className="mt-12 bg-[#E8DFF5] border border-[#6B4FA0]/20 rounded-2xl p-6 text-center">
              <div className="font-mono text-xs text-[#6B4FA0] uppercase tracking-widest mb-2">Coming soon</div>
              <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-2">
                Get notified when prices drop
              </h3>
              <p className="text-sm text-[#5A5A5A] mb-4">
                Set a price alert and we'll email you when any of these trips hits your sweet spot.
              </p>
              <div className="flex gap-2 max-w-sm mx-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-white border border-[#6B4FA0]/30 rounded-lg px-3 py-2 text-sm focus:outline-none"
                />
                <button className="bg-[#6B4FA0] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#5a3f88] transition-colors">
                  Alert me
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
