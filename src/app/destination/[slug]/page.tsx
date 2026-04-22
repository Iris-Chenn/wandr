import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import destinationsRaw from "@/data/destinations.json";
import type { Destination } from "@/lib/ranking";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ budget?: string; origin?: string; nights?: string }>;
};

const TRIP_LENGTH_MAP: Record<string, number> = { "3-4": 3, "5-7": 5, "8-10": 8, "11-14": 11 };

export default async function DestinationPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  const destination = (destinationsRaw as Destination[]).find((d) => d.id === slug);
  if (!destination) notFound();

  const budget = Number(sp.budget) || 700;
  const nights = Number(sp.nights) || 5;
  const origin = sp.origin || "JFK";

  // Cost breakdown
  const flightCost = Math.round(destination.avgFlightCostFromJFK * 1.0);
  const hotelCost = destination.avgHotelNightly * nights;
  const foodCost = Math.round(destination.avgDailyCost * 0.45 * nights);
  const activitiesCost = Math.round(destination.avgDailyCost * 0.35 * nights);
  const totalCost = flightCost + hotelCost + foodCost + activitiesCost;
  const savings = budget - totalCost;

  const flightPct = Math.round((flightCost / totalCost) * 100);
  const hotelPct = Math.round((hotelCost / totalCost) * 100);
  const foodPct = Math.round((foodCost / totalCost) * 100);
  const activitiesPct = 100 - flightPct - hotelPct - foodPct;

  // Stretch / save
  const stretchTotal = Math.round(totalCost * 1.15);
  const saveTotal = Math.round(totalCost * 0.82);

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Navbar />

      <main className="pt-20 pb-16">
        {/* Hero banner */}
        <div className="bg-[#1A1A1A] text-white py-12 px-4 sm:px-6 mb-8">
          <div className="max-w-4xl mx-auto">
            <Link href={`/results?budget=${budget}&origin=${origin}&nights=${nights}`} className="text-sm text-[#8A8A8A] hover:text-white mb-4 inline-block">
              ← Back to results
            </Link>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-5xl">{destination.flag}</span>
              <div>
                <h1 className="font-serif text-4xl sm:text-5xl font-bold">{destination.city}</h1>
                <div className="text-[#8A8A8A] mt-1">{destination.country} · {destination.region}</div>
              </div>
            </div>
            <p className="text-[#E0D8C8] text-base leading-relaxed max-w-xl mt-3">{destination.description}</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Main: Budget breakdown */}
            <div className="lg:col-span-2 space-y-5">

              {/* Cost breakdown card */}
              <div className="bg-[#FFFCF7] border border-[#E0D8C8] rounded-2xl p-6">
                <div className="flex items-baseline justify-between mb-5">
                  <h2 className="font-semibold text-[#1A1A1A] text-lg">Your {nights}-night budget</h2>
                  <div className="font-mono font-bold text-2xl text-[#D4612A]">${totalCost.toLocaleString()}</div>
                </div>

                {/* Breakdown bar */}
                <div className="mb-5">
                  <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-3">
                    <div className="bg-[#D4612A]" style={{ width: `${flightPct}%` }} />
                    <div className="bg-[#1A7A6D]" style={{ width: `${hotelPct}%` }} />
                    <div className="bg-[#6B4FA0]" style={{ width: `${foodPct}%` }} />
                    <div className="bg-[#E0D8C8]" style={{ width: `${activitiesPct}%` }} />
                  </div>

                  <div className="space-y-3">
                    {[
                      { icon: "✈️", label: "Flights (round trip)", cost: flightCost, pct: flightPct, color: "#D4612A", bg: "#F0D4C0" },
                      { icon: "🏨", label: `Hotel (${nights} nights)`, cost: hotelCost, pct: hotelPct, color: "#1A7A6D", bg: "#D0ECE7" },
                      { icon: "🍽️", label: `Food & drinks (${nights} days)`, cost: foodCost, pct: foodPct, color: "#6B4FA0", bg: "#E8DFF5" },
                      { icon: "🎯", label: `Activities & transport (${nights} days)`, cost: activitiesCost, pct: activitiesPct, color: "#8A8A8A", bg: "#F5F0E8" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm text-[#5A5A5A]">{item.icon} {item.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className="text-xs font-mono px-2 py-0.5 rounded-full"
                            style={{ color: item.color, backgroundColor: item.bg }}
                          >
                            {item.pct}%
                          </span>
                          <span className="font-mono font-semibold text-[#1A1A1A] w-16 text-right">
                            ${item.cost.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget status */}
                {savings >= 0 ? (
                  <div className="bg-[#D0ECE7] border border-[#1A7A6D]/20 rounded-xl p-4">
                    <div className="text-sm font-semibold text-[#1A7A6D]">
                      ✓ ${savings.toLocaleString()} under your ${budget.toLocaleString()} budget
                    </div>
                    <div className="text-xs text-[#5A5A5A] mt-1">
                      You could upgrade your hotel or add another activity with what's left.
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#F0D4C0] border border-[#D4612A]/20 rounded-xl p-4">
                    <div className="text-sm font-semibold text-[#A84A1E]">
                      ${Math.abs(savings).toLocaleString()} over your ${budget.toLocaleString()} budget
                    </div>
                    <div className="text-xs text-[#5A5A5A] mt-1">
                      Try flexible dates or a slightly longer savings plan to make this work.
                    </div>
                  </div>
                )}
              </div>

              {/* Options: Stretch / Save */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-[#FFFCF7] border border-[#E0D8C8] rounded-2xl p-5">
                  <div className="font-mono text-xs text-[#6B4FA0] uppercase tracking-widest mb-2">Stretch option</div>
                  <div className="font-mono font-bold text-xl text-[#1A1A1A] mb-1">${stretchTotal.toLocaleString()}</div>
                  <p className="text-xs text-[#5A5A5A] leading-relaxed">
                    Upgrade to a 4-star hotel and add a guided excursion. ~${stretchTotal - budget > 0 ? stretchTotal - budget : 0} over budget — achievable with 4 weeks of saving.
                  </p>
                </div>
                <div className="bg-[#FFFCF7] border border-[#E0D8C8] rounded-2xl p-5">
                  <div className="font-mono text-xs text-[#1A7A6D] uppercase tracking-widest mb-2">Save option</div>
                  <div className="font-mono font-bold text-xl text-[#1A1A1A] mb-1">${saveTotal.toLocaleString()}</div>
                  <p className="text-xs text-[#5A5A5A] leading-relaxed">
                    Stay in a hostel private room and eat local street food. Same experience, lower cost.
                  </p>
                </div>
              </div>

              {/* Trip details */}
              <div className="bg-[#FFFCF7] border border-[#E0D8C8] rounded-2xl p-6">
                <h3 className="font-semibold text-[#1A1A1A] mb-4">Trip details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-mono text-[#8A8A8A] uppercase tracking-widest mb-1">Best months</div>
                    <div className="text-sm text-[#1A1A1A]">{destination.bestMonths.join(", ")}</div>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-[#8A8A8A] uppercase tracking-widest mb-1">Visa required</div>
                    <div className="text-sm text-[#1A1A1A]">
                      {destination.visaRequired ? "⚠️ Check requirements" : "✓ No visa needed for US citizens"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-[#8A8A8A] uppercase tracking-widest mb-1">Trip style</div>
                    <div className="flex flex-wrap gap-1">
                      {destination.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-[#F5F0E8] text-[#5A5A5A] px-2 py-0.5 rounded-full capitalize">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-[#8A8A8A] uppercase tracking-widest mb-1">Daily budget</div>
                    <div className="text-sm text-[#1A1A1A]">~${destination.avgDailyCost}/day incl. hotel</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar: CTA */}
            <div className="space-y-4">
              <div className="bg-[#FFFCF7] border border-[#E0D8C8] rounded-2xl p-5 sticky top-20">
                <div className="text-xs font-mono text-[#8A8A8A] uppercase tracking-widest mb-3">Ready to book?</div>
                <div className="font-mono font-bold text-2xl text-[#D4612A] mb-1">${totalCost.toLocaleString()}</div>
                <div className="text-xs text-[#8A8A8A] mb-4">All-in for {nights} nights</div>

                <a
                  href={`https://www.kiwi.com/en/search/results/${origin}/${destination.iataCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-[#D4612A] hover:bg-[#A84A1E] text-white font-semibold py-3 rounded-xl transition-colors text-center text-sm mb-3"
                >
                  Search flights ↗
                </a>
                <a
                  href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-[#F5F0E8] hover:bg-[#E8E0D0] text-[#1A1A1A] font-semibold py-3 rounded-xl transition-colors text-center text-sm mb-4 border border-[#E0D8C8]"
                >
                  Search hotels ↗
                </a>

                <div className="border-t border-[#E0D8C8] pt-4 space-y-2">
                  <button className="w-full text-left text-sm text-[#5A5A5A] hover:text-[#D4612A] transition-colors py-1 flex items-center gap-2">
                    <span>🔔</span> Set price alert
                  </button>
                  <button className="w-full text-left text-sm text-[#5A5A5A] hover:text-[#1A7A6D] transition-colors py-1 flex items-center gap-2">
                    <span>💾</span> Save this trip
                  </button>
                  <button className="w-full text-left text-sm text-[#5A5A5A] hover:text-[#6B4FA0] transition-colors py-1 flex items-center gap-2">
                    <span>🔗</span> Share with friends
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
