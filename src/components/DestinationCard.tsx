"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { TripEstimate } from "@/lib/ranking";

// Photo IDs from Unsplash. Numeric IDs (starting with a digit) are fetched as
// `photo-{id}`; short slug IDs are fetched as `{id}` without the prefix.
// A secondary URL format is tried automatically on error — see buildPhotoUrls().
const UNSPLASH_PHOTOS: Record<string, string> = {
  // ── Europe ─────────────────────────────────────────────────────────────────
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
  "porto":               "1555993539-1732b0258236",   // fallback to slug below
  "seville":             "1558618666-fcd25c85cd64",
  "valencia":            "1583153380367-75e285a06f06",
  "krakow":              "1584346401-33e16cfa5cfa",
  "warsaw":              "1573455494060-c55b22587bcc",
  "florence":            "1560423314-e7b14f9af46e",
  "naples":              "1516747773462-e1f7b1f14e8c",
  "dubrovnik":           "1508739773434-c26b3d09e071",
  "split":               "1533587851976-a8f14ccc7c16",
  "kotor":               "1555400150-01b5e01e3b70",
  "belgrade":            "1566481209441-bf1cedf35ab5",
  "bucharest":           "1587919879888-c3851ea1e48f",
  "sofia":               "1601134467661-3d775b999c8b",
  "vilnius":             "1554056648-d74af0a20e20",
  "tallinn":             "1587893904075-0e1a2b6cdf03",
  "dublin":              "1520698555132-e3b890d75f3b",
  "edinburgh":           "1558618047-2df7e76e2697",
  "valletta":            "1535040534350-4f68dc3aea3e",
  "tbilisi":             "1565008576344-b6a91cd7c4d1",

  // ── Americas ───────────────────────────────────────────────────────────────
  "mexico-city":         "1518638150340-f706e86654de",
  "cancun":              "1510097467424-192d713fd8b2",
  "tulum":               "1518500335-7e822c9b4f3b",
  "oaxaca":              "1516939879335-1c0a4e30a0ba",
  "puerto-vallarta":     "1551004579-9a72f7cd9e0f",
  "san-juan":            "1559494007-dc9e50dcf7f5",
  "punta-cana":          "1584551246679-0daf3d275d0f",
  "havana":              "1508007944-6b71ae0cfe54",
  "antigua-guatemala":   "1555400038-63f5ba517a47",
  "san-jose-costa-rica": "1543702895-ac3e79bda095",
  "panama-city":         "1529073036-36f8c6aeaf11",
  "colombia-medellin":   "1509840803082-4d7c31b22f24",
  "cartagena":           "1583416750470-965b2707b355",
  "bogota":              "1610563166559-7e4f5a62d2d6",
  "lima":                "1531769701891-9f8af54f8b8a",
  "cusco":               "1526392060635-9d6019884377",
  "buenos-aires":        "1612294105787-3c9d86b88b4f",
  "santiago":            "1554481923-a6918bd997bc",
  "rio-de-janeiro":      "1483729558449-99ef09a8c36d",
  "montevideo":          "1592861777091-f9d2dd0e6ff6",
  "quito":               "1531572753322-ad063cecc140",
  "nassau":              "1548504769-b93f8db14534",

  // ── Africa ─────────────────────────────────────────────────────────────────
  "marrakech":           "1597212720753-4d00e55eab4d",
  "cape-town":           "1580060839134-75a5edca2e99",
  "nairobi":             "1553697384-bce7b6e7484f",

  // ── Asia ───────────────────────────────────────────────────────────────────
  "bangkok":             "1508009603885-50cf7c579365",
  "bali":                "1537996194471-e657df975ab4",
  "tokyo":               "1540959733332-eab4deabeeaf",
  "chiang-mai":          "1528360983277-13d401cdc186",
  "ho-chi-minh":         "1583417319070-4a69db38a482",
  "hanoi":               "1509391366636-9f70e20b6e56",   // distinct from Ho Chi Minh
  "taipei":              "1570077788046-2a8e7b2f69c5",
  "singapore":           "1525625293386-2d66c8bc27b4",
  "kathmandu":           "1571085406820-b3c24f8c7a8a",
};

const MATCH_TIER_STYLES = {
  top:     { label: "Top pick",  color: "#a33d10", bg: "#fde8db" }, // orange
  good:    { label: "Good fit",  color: "#0d4f47", bg: "#d3ecea" }, // teal
  explore: { label: "Explore",   color: "#3d2870", bg: "#ece8f5" }, // purple
};

type Props = {
  trip: TripEstimate;
  budget: number;
  isLivePrice?: boolean;
  departDate?: string;
  returnDate?: string;
  party?: number;
  originCode?: string;
  tripLength?: string;
  vibes?: string;
};

export default function DestinationCard({
  trip, budget, isLivePrice, departDate, returnDate,
  party = 1, originCode = "JFK", tripLength = "5-7", vibes = "",
}: Props) {
  // Track how many URL formats we've tried (0 = none, 1 = tried primary, 2 = tried both)
  const [urlAttempt, setUrlAttempt] = useState(0);
  const match = MATCH_TIER_STYLES[trip.matchTier];
  const savings = budget - trip.totalCost;
  const photoId = UNSPLASH_PHOTOS[trip.id];

  // Unsplash has two CDN formats:
  //   numeric IDs  → https://images.unsplash.com/photo-1555881400-74d7acaacd47
  //   slug IDs     → https://images.unsplash.com/photo-Jc4LH4jZsjM  (also works with prefix)
  // If the primary URL fails (deleted / restricted photo) we try the alternate format.
  const Q = "?auto=format&fit=crop&w=600&q=75";
  const photoUrls = photoId ? [
    `https://images.unsplash.com/photo-${photoId}${Q}`,   // primary — works for most IDs
    `https://images.unsplash.com/${photoId}${Q}`,          // fallback — slug-only format
  ] : [];
  const photoUrl = photoUrls[urlAttempt] ?? null;

  const handleImgError = useCallback(() => {
    setUrlAttempt(prev => prev + 1);   // try next format; if exhausted, photoUrl → null
  }, []);

  const destParams = new URLSearchParams({
    budget: String(budget),
    origin: originCode,
    nights: String(trip.nights),
    party: String(party),
    tripLength,
    // Only pass the flight cost as a URL param when it's a confirmed live Duffel price.
    // The destination page uses !!sp.flight to decide whether to show "Live price" badge.
    ...(isLivePrice ? { flight: String(trip.flightCost) } : {}),
    ...(vibes ? { vibes } : {}),
    ...(departDate ? { depart: departDate, return: returnDate ?? "" } : {}),
  });

  return (
    <Link
      href={`/destination/${trip.id}?${destParams.toString()}`}
      className="block bg-white border border-[#e7e7e7] rounded-2xl overflow-hidden card-shadow hover:border-[#00754A]/30 hover:shadow-lg transition-all group"
    >
      {/* Photo */}
      <div className="relative h-44 bg-[#1A1A1A] overflow-hidden">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={trip.city}
            fill
            className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
            unoptimized
            onError={handleImgError}
          />
        ) : (
          // Graceful fallback — shows flag + city name on a branded gradient
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E3932] via-[#22453c] to-[#1a3028] flex flex-col items-center justify-center gap-2">
            <span className="text-5xl drop-shadow-md">{trip.flag}</span>
            <span className="text-white/80 text-sm font-semibold tracking-wide">{trip.city}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{trip.flag}</span>
            <div>
              <div className="font-bold text-white text-base leading-tight">{trip.city}</div>
              <div className="text-white/60 text-xs">{trip.country}</div>
            </div>
          </div>
          <span
            className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full"
            style={{ color: match.color, backgroundColor: match.bg }}
          >
            {match.label}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2.5">
          {trip.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs text-[rgba(0,0,0,0.50)] bg-[#f2f0eb] px-2 py-0.5 rounded-full capitalize">
              {tag}
            </span>
          ))}
        </div>

        {/* Flight cost hint */}
        <div className="flex items-center gap-2 text-xs text-[rgba(0,0,0,0.38)] mb-2.5 font-mono">
          <span>✈ ${trip.flightCost.toLocaleString()} flight</span>
          <span>·</span>
          <span>🏨 ${Math.round(trip.hotelCost / trip.nights).toLocaleString()}/night</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono font-bold text-[#006241] text-xl">${trip.totalCost.toLocaleString()}</span>
              {isLivePrice && (
                <span className="text-[10px] bg-[#d4e9e2] text-[#006241] font-mono font-semibold px-1.5 py-0.5 rounded">LIVE</span>
              )}
            </div>
            <div className="text-xs text-[rgba(0,0,0,0.50)]">
              {trip.nights} nights · per person
              {party > 1 && (
                <span className="ml-1 text-[#006241] font-medium">
                  · ${(trip.totalCost * party).toLocaleString()} total
                </span>
              )}
            </div>
          </div>

          <div className="text-right pb-0.5">
            {savings > 0 ? (
              <div className="text-[11px] text-[#005c38] font-medium mb-1">
                ${savings.toLocaleString()} under
              </div>
            ) : (
              <div className="text-[11px] text-[#7a5c00] font-medium mb-1">
                ${Math.abs(savings).toLocaleString()} over
              </div>
            )}
            <span className="text-[#00754A] text-sm font-semibold group-hover:translate-x-0.5 transition-transform inline-block">
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
