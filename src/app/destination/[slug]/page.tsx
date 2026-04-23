import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import SaveShareButtons from "@/components/SaveShareButtons";
import BudgetSliders from "@/components/BudgetSliders";
import destinationsRaw from "@/data/destinations.json";
import type { Destination } from "@/lib/ranking";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ budget?: string; origin?: string; nights?: string; depart?: string; return?: string; flight?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = (destinationsRaw as Destination[]).find((d) => d.id === slug);
  if (!destination) return {};
  return {
    title: `${destination.city}, ${destination.country} — Wandr`,
    description: `Plan a trip to ${destination.city} on a budget. See flight + hotel + food costs, best months to visit, and book with one click.`,
    openGraph: {
      title: `${destination.flag} ${destination.city} for less than you think`,
      description: destination.description,
      siteName: "Wandr",
    },
  };
}

const UNSPLASH_PHOTOS: Record<string, string> = {
  "lisbon":              "1555881400-74d7acaacd47",
  "paris":               "1499856845952-5870d4ab4cf7",
  "rome":                "1552832230-c0197dd311b5",
  "madrid":              "1543783207-ec64e4d95325",
  "barcelona":           "1539037116277-4db20889f2d4",
  "vienna":              "1516550893923-42d28e5677af",
  "berlin":              "1560969184-10fe8719e047",
  "amsterdam":           "1534351590666-13e3e96b5017",
  "prague":              "1541849546-216549ae216d",
  "budapest":            "1549144511-f099e773c147",
  "athens":              "1555993539-1732b0258235",
  "istanbul":            "1524231757912-21f4fe3a7200",
  "reykjavik":           "1531168087216-80de62b8b4e7",
  "porto":               "Jc4LH4jZsjM",
  "seville":             "1558618666-fcd25c85cd64",
  "valencia":            "1583153380367-75e285a06f06",
  "krakow":              "1577791658220-55f0c898ab86",
  "warsaw":              "1573455494060-c55b22587bcc",
  "florence":            "NN_vPCzkU3M",
  "naples":              "1516747773462-e1f7b1f14e8c",
  "dubrovnik":           "1508739773434-c26b3d09e071",
  "split":               "1533587851976-a8f14ccc7c16",
  "kotor":               "1555400150-01b5e01e3b70",
  "belgrade":            "1566481209441-bf1cedf35ab5",
  "bucharest":           "ogXPqfXoFD4",
  "sofia":               "1601134467661-3d775b999c8b",
  "vilnius":             "1554056648-d74af0a20e20",
  "tallinn":             "1587893904075-0e1a2b6cdf03",
  "dublin":              "1520698555132-e3b890d75f3b",
  "edinburgh":           "1558618047-2df7e76e2697",
  "valletta":            "1535040534350-4f68dc3aea3e",
  "tbilisi":             "1565008576344-b6a91cd7c4d1",
  "mexico-city":         "1518638150340-f706e86654de",
  "cancun":              "1510097467424-192d713fd8b2",
  "tulum":               "1518500335-7e822c9b4f3b",
  "oaxaca":              "rzdQcSNTCyU",
  "puerto-vallarta":     "1551004579-9a72f7cd9e0f",
  "san-juan":            "1559494007-dc9e50dcf7f5",
  "punta-cana":          "1584551246679-0daf3d275d0f",
  "havana":              "rSqq_JQOU4k",
  "antigua-guatemala":   "1555400038-63f5ba517a47",
  "san-jose-costa-rica": "1543702895-ac3e79bda095",
  "panama-city":         "1529073036-36f8c6aeaf11",
  "colombia-medellin":   "2RZJIMTfJkU",
  "cartagena":           "L6T_6Rp2iEk",
  "bogota":              "469Rvb5h0fk",
  "lima":                "1531769701891-9f8af54f8b8a",
  "cusco":               "1526392060635-9d6019884377",
  "buenos-aires":        "1612294105787-3c9d86b88b4f",
  "santiago":            "1554481923-a6918bd997bc",
  "rio-de-janeiro":      "1483729558449-99ef09a8c36d",
  "montevideo":          "1592861777091-f9d2dd0e6ff6",
  "quito":               "1531572753322-ad063cecc140",
  "nassau":              "1548504769-b93f8db14534",
  "marrakech":           "1597212720753-4d00e55eab4d",
  "cape-town":           "1580060839134-75a5edca2e99",
  "nairobi":             "IaJm3mq0F5o",
  "bangkok":             "1508009603885-50cf7c579365",
  "bali":                "1537996194471-e657df975ab4",
  "tokyo":               "1540959733332-eab4deabeeaf",
  "chiang-mai":          "1528360983277-13d401cdc186",
  "ho-chi-minh":         "1583417319070-4a69db38a482",
  "hanoi":               "1583417319070-4a69db38a482",
  "taipei":              "1570077788046-2a8e7b2f69c5",
  "singapore":           "1525625293386-2d66c8bc27b4",
  "kathmandu":           "1571085406820-b3c24f8c7a8a",
};

export default async function DestinationPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  const destination = (destinationsRaw as Destination[]).find((d) => d.id === slug);
  if (!destination) notFound();

  const budget = Number(sp.budget) || 700;
  const nights = Number(sp.nights) || 5;
  const origin = sp.origin || "JFK";
  const depart = sp.depart || "";
  const ret = sp.return || "";

  const isLiveFlight = !!sp.flight;
  const flightCost = sp.flight ? Number(sp.flight) : Math.round(destination.avgFlightCostFromJFK);
  const hotelCost = destination.avgHotelNightly * nights;
  const foodCost = Math.round(destination.avgDailyCost * 0.45 * nights);
  const activitiesCost = Math.round(destination.avgDailyCost * 0.35 * nights);
  const totalCost = flightCost + hotelCost + foodCost + activitiesCost;
  const savings = budget - totalCost;

  const flightPct = Math.round((flightCost / totalCost) * 100);
  const hotelPct = Math.round((hotelCost / totalCost) * 100);
  const foodPct = Math.round((foodCost / totalCost) * 100);
  const activitiesPct = 100 - flightPct - hotelPct - foodPct;

  const stretchTotal = Math.round(totalCost * 1.15);
  const saveTotal = Math.round(totalCost * 0.82);

  const hotelNightly = destination.avgHotelNightly;
  const hotelTiers = [
    {
      label: "Budget",
      type: "Hostel / guesthouse",
      nightly: Math.round(hotelNightly * 0.55),
      total: Math.round(hotelNightly * 0.55 * nights),
      stars: "★★",
    },
    {
      label: "Mid-range",
      type: "3-star hotel",
      nightly: hotelNightly,
      total: hotelNightly * nights,
      stars: "★★★",
    },
    {
      label: "Boutique",
      type: "4-star / boutique",
      nightly: Math.round(hotelNightly * 1.7),
      total: Math.round(hotelNightly * 1.7 * nights),
      stars: "★★★★",
    },
  ];

  const carriers: Record<string, string> = {
    Americas: "Delta, American, United",
    Europe: "Delta, American, TAP, Iberia",
    Asia: "United, Cathay Pacific, JAL",
    Africa: "Delta, Air France, Ethiopian",
  };
  const carrierHint = carriers[destination.region] || "Major carriers";

  const photoId = UNSPLASH_PHOTOS[slug];
  const unsplashUrl = photoId
    ? `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=1200&q=80`
    : null;

  const tripData = {
    id: destination.id,
    city: destination.city,
    country: destination.country,
    flag: destination.flag,
    totalCost,
    nights,
    budget,
  };

  return (
    <div className="min-h-screen bg-[#f2f0eb]">
      <Navbar />

      {/* Hero photo */}
      <div className="relative h-64 sm:h-80 bg-[#1E3932] mt-14">
        {unsplashUrl ? (
          <Image
            src={unsplashUrl}
            alt={destination.city}
            fill
            className="object-cover opacity-80"
            priority
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E3932] to-[#2b5148]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E3932] via-transparent to-transparent" />

        <div className="absolute top-4 left-4">
          <Link
            href={`/results?budget=${budget}&origin=${origin}&nights=${nights}`}
            className="text-white/80 hover:text-white text-sm bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full transition-colors"
          >
            ← Back to results
          </Link>
        </div>

        <div className="absolute bottom-6 left-4 sm:left-6 text-white">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-4xl">{destination.flag}</span>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">{destination.city}</h1>
              <div className="text-white/70 text-sm">{destination.country} · {destination.region}</div>
            </div>
          </div>
        </div>

        {unsplashUrl && (
          <div className="absolute bottom-2 right-3 text-[10px] text-white/40">
            Photo: Unsplash
          </div>
        )}
      </div>

      <main className="pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[rgba(0,0,0,0.58)] text-sm leading-relaxed py-5 max-w-xl">
            {destination.description}
          </p>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-5">

              {/* Cost breakdown */}
              <div className="bg-white border border-[#e7e7e7] rounded-2xl p-6 card-shadow">
                <div className="flex items-baseline justify-between mb-5">
                  <h2 className="font-semibold text-[rgba(0,0,0,0.87)] text-lg">Your {nights}-night budget</h2>
                  <div className="font-mono font-bold text-2xl text-[#006241]">${totalCost.toLocaleString()}</div>
                </div>

                <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-4">
                  <div className="bg-[#006241]" style={{ width: `${flightPct}%` }} />
                  <div className="bg-[#00754A]" style={{ width: `${hotelPct}%` }} />
                  <div className="bg-[#1E3932]" style={{ width: `${foodPct}%` }} />
                  <div className="bg-[#d4e9e2]" style={{ width: `${activitiesPct}%` }} />
                </div>

                <div className="space-y-3">
                  {[
                    { label: `Flights (round trip)${isLiveFlight ? " · live" : " · est."}`, cost: flightCost, pct: flightPct, color: "#006241", bg: "#d4e9e2" },
                    { label: `Hotel (${nights} nights)`, cost: hotelCost, pct: hotelPct, color: "#00754A", bg: "#d4e9e2" },
                    { label: `Food & drinks`, cost: foodCost, pct: foodPct, color: "#1E3932", bg: "#e8f0ec" },
                    { label: `Activities & transport`, cost: activitiesCost, pct: activitiesPct, color: "#2b5148", bg: "#f2f0eb" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-[rgba(0,0,0,0.58)]">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ color: item.color, backgroundColor: item.bg }}>
                          {item.pct}%
                        </span>
                        <span className="font-mono font-semibold text-[rgba(0,0,0,0.87)] w-16 text-right">
                          ${item.cost.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`mt-4 rounded-xl p-4 ${savings >= 0 ? "bg-[#d4e9e2] border border-[#006241]/20" : "bg-[#fee2e2] border border-red-300/20"}`}>
                  <div className={`text-sm font-semibold ${savings >= 0 ? "text-[#006241]" : "text-red-700"}`}>
                    {savings >= 0
                      ? `✓ $${savings.toLocaleString()} under your $${budget.toLocaleString()} budget`
                      : `$${Math.abs(savings).toLocaleString()} over your $${budget.toLocaleString()} budget`}
                  </div>
                  <div className="text-xs text-[rgba(0,0,0,0.58)] mt-1">
                    {savings >= 0
                      ? "You could upgrade your hotel or add another activity with what's left."
                      : "Try flexible dates or a slightly longer savings plan to make this work."}
                  </div>
                </div>
                <p className="text-[10px] text-[rgba(0,0,0,0.38)] mt-3 leading-relaxed">
                  {isLiveFlight ? "✈ Flight price is live from Duffel." : "✈ Flight price is an estimate."} Hotel, food & activity costs are averages — actual prices may vary.
                </p>
              </div>

              {/* Budget sliders */}
              <BudgetSliders
                flightCost={flightCost}
                hotelCost={hotelCost}
                foodCost={foodCost}
                activitiesCost={activitiesCost}
                budget={budget}
                nights={nights}
              />

              {/* Flights */}
              <div className="bg-white border border-[#e7e7e7] rounded-2xl p-6 card-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[rgba(0,0,0,0.87)]">Flights</h3>
                  {isLiveFlight
                    ? <span className="text-[10px] bg-[#d4e9e2] text-[#006241] font-mono font-semibold px-2 py-0.5 rounded">LIVE PRICE</span>
                    : <span className="text-[10px] bg-[#f2f0eb] text-[rgba(0,0,0,0.38)] font-mono px-2 py-0.5 rounded">ESTIMATE</span>}
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="text-center">
                    <div className="font-mono font-bold text-lg text-[rgba(0,0,0,0.87)]">{origin}</div>
                    <div className="text-xs text-[rgba(0,0,0,0.38)]">Origin</div>
                  </div>
                  <div className="flex-1 flex items-center gap-1">
                    <div className="flex-1 border-t border-dashed border-[#e7e7e7]" />
                    <span className="text-xs text-[#00754A]">✈</span>
                    <div className="flex-1 border-t border-dashed border-[#e7e7e7]" />
                  </div>
                  <div className="text-center">
                    <div className="font-mono font-bold text-lg text-[rgba(0,0,0,0.87)]">{destination.iataCode}</div>
                    <div className="text-xs text-[rgba(0,0,0,0.38)]">{destination.city}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  {depart && (
                    <div>
                      <div className="text-xs font-mono text-[rgba(0,0,0,0.38)] uppercase tracking-widest mb-0.5">Depart</div>
                      <div className="font-medium text-[rgba(0,0,0,0.87)]">{new Date(depart + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                    </div>
                  )}
                  {ret && (
                    <div>
                      <div className="text-xs font-mono text-[rgba(0,0,0,0.38)] uppercase tracking-widest mb-0.5">Return</div>
                      <div className="font-medium text-[rgba(0,0,0,0.87)]">{new Date(ret + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-mono text-[rgba(0,0,0,0.38)] uppercase tracking-widest mb-0.5">Round trip</div>
                    <div className="font-mono font-bold text-[#006241] text-lg">${flightCost.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-[rgba(0,0,0,0.38)] uppercase tracking-widest mb-0.5">Common carriers</div>
                    <div className="text-xs text-[rgba(0,0,0,0.58)]">{carrierHint}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://www.kiwi.com/en/search/results/${origin}/${destination.iataCode}/${depart || "anytime"}/${ret || "anytime"}`}
                    target="_blank" rel="noopener noreferrer"
                    className="block bg-[#00754A] hover:bg-[#006241] text-white font-semibold py-2.5 rounded-full active:scale-95 transition-all text-center text-xs"
                  >
                    Search Kiwi.com ↗
                  </a>
                  <a
                    href={`https://www.google.com/travel/flights/search?q=flights+from+${origin}+to+${destination.iataCode}${depart ? `+${depart}` : ""}`}
                    target="_blank" rel="noopener noreferrer"
                    className="block bg-[#f2f0eb] hover:bg-[#e8e4dc] text-[rgba(0,0,0,0.87)] font-semibold py-2.5 rounded-full active:scale-95 transition-all text-center text-xs border border-[#e7e7e7]"
                  >
                    Search Google Flights ↗
                  </a>
                </div>
              </div>

              {/* Hotels */}
              <div className="bg-white border border-[#e7e7e7] rounded-2xl p-6 card-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[rgba(0,0,0,0.87)]">Hotel options</h3>
                  <span className="text-xs text-[rgba(0,0,0,0.38)]">{nights} nights</span>
                </div>

                <div className="space-y-3 mb-4">
                  {hotelTiers.map((tier) => (
                    <a
                      key={tier.label}
                      href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination.city)}&checkin=${depart}&checkout=${ret}&price=1-${tier.nightly * 1.2}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 border border-[#e7e7e7] rounded-xl hover:border-[#00754A]/40 hover:bg-[#f2f0eb] transition-all group"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold text-[rgba(0,0,0,0.87)]">{tier.label}</span>
                          <span className="text-[10px] text-[#00754A]">{tier.stars}</span>
                        </div>
                        <div className="text-xs text-[rgba(0,0,0,0.38)]">{tier.type}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-[rgba(0,0,0,0.87)] text-sm">${tier.total.toLocaleString()}</div>
                        <div className="text-[10px] text-[rgba(0,0,0,0.38)]">${tier.nightly}/night · Browse ↗</div>
                      </div>
                    </a>
                  ))}
                </div>

                <p className="text-[10px] text-[rgba(0,0,0,0.38)]">
                  Prices are estimates. Click any tier to search live availability on Booking.com.
                </p>
              </div>

              {/* Stretch / Save */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white border border-[#e7e7e7] rounded-2xl p-5 card-shadow">
                  <div className="font-mono text-xs text-[#2b5148] uppercase tracking-widest mb-2">Stretch option</div>
                  <div className="font-mono font-bold text-xl text-[rgba(0,0,0,0.87)] mb-1">${stretchTotal.toLocaleString()}</div>
                  <p className="text-xs text-[rgba(0,0,0,0.58)] leading-relaxed">
                    4-star hotel + guided excursion.{stretchTotal > budget ? ` $${stretchTotal - budget} over budget — reachable with a short savings plan.` : " Still within budget!"}
                  </p>
                </div>
                <div className="bg-white border border-[#e7e7e7] rounded-2xl p-5 card-shadow">
                  <div className="font-mono text-xs text-[#006241] uppercase tracking-widest mb-2">Save option</div>
                  <div className="font-mono font-bold text-xl text-[rgba(0,0,0,0.87)] mb-1">${saveTotal.toLocaleString()}</div>
                  <p className="text-xs text-[rgba(0,0,0,0.58)] leading-relaxed">
                    Hostel private room + street food. Same experience, lower cost.
                  </p>
                </div>
              </div>

              {/* Trip details */}
              <div className="bg-white border border-[#e7e7e7] rounded-2xl p-6 card-shadow">
                <h3 className="font-semibold text-[rgba(0,0,0,0.87)] mb-4">Trip details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-mono text-[rgba(0,0,0,0.38)] uppercase tracking-widest mb-1">Best months</div>
                    <div className="text-sm text-[rgba(0,0,0,0.87)]">{destination.bestMonths.join(", ")}</div>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-[rgba(0,0,0,0.38)] uppercase tracking-widest mb-1">Visa (US citizens)</div>
                    <div className="text-sm">
                      {destination.visaRequired ? "Check requirements" : "No visa needed"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-[rgba(0,0,0,0.38)] uppercase tracking-widest mb-1">Trip style</div>
                    <div className="flex flex-wrap gap-1">
                      {destination.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-[#f2f0eb] text-[rgba(0,0,0,0.58)] px-2 py-0.5 rounded-full capitalize">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-[rgba(0,0,0,0.38)] uppercase tracking-widest mb-1">Daily budget</div>
                    <div className="text-sm text-[rgba(0,0,0,0.87)]">~${destination.avgDailyCost}/day incl. hotel</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-white border border-[#e7e7e7] rounded-2xl p-5 sticky top-20 card-shadow">
                <div className="text-xs font-mono text-[rgba(0,0,0,0.38)] uppercase tracking-widest mb-3">Ready to book?</div>
                <div className="font-mono font-bold text-2xl text-[#006241] mb-0.5">${totalCost.toLocaleString()}</div>
                <div className="text-xs text-[rgba(0,0,0,0.38)] mb-4">{nights} nights all-in</div>

                <a
                  href={`https://www.kiwi.com/en/search/results/${origin}/${destination.iataCode}/${depart || "anytime"}/${ret || "anytime"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-[#00754A] hover:bg-[#006241] text-white font-semibold py-3 rounded-full active:scale-95 transition-all text-center text-sm mb-3"
                >
                  Search flights ↗
                </a>
                <a
                  href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination.city)}&checkin=${depart}&checkout=${ret}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-[#f2f0eb] hover:bg-[#e8e4dc] text-[rgba(0,0,0,0.87)] font-semibold py-3 rounded-full active:scale-95 transition-all text-center text-sm mb-4 border border-[#e7e7e7]"
                >
                  Search hotels ↗
                </a>

                <SaveShareButtons trip={tripData} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
