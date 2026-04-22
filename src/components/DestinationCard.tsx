"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { TripEstimate } from "@/lib/ranking";

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

const BUDGET_MATCH_STYLES = {
  perfect: { label: "Within budget", color: "#1A7A6D", bg: "#D0ECE7" },
  great:   { label: "Great value",   color: "#D4612A", bg: "#FEE9DC" },
  stretch: { label: "Slight stretch", color: "#6B4FA0", bg: "#EDE9F8" },
};

type Props = {
  trip: TripEstimate;
  budget: number;
  isLivePrice?: boolean;
  departDate?: string;
  returnDate?: string;
};

export default function DestinationCard({ trip, budget, isLivePrice, departDate, returnDate }: Props) {
  const [imgError, setImgError] = useState(false);
  const match = BUDGET_MATCH_STYLES[trip.budgetMatch];
  const savings = budget - trip.totalCost;
  const photoId = UNSPLASH_PHOTOS[trip.id];
  const photoUrl = photoId && !imgError
    ? `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=600&q=75`
    : null;

  return (
    <Link
      href={`/destination/${trip.id}?budget=${budget}&origin=JFK&nights=${trip.nights}&flight=${trip.flightCost}${departDate ? `&depart=${departDate}&return=${returnDate}` : ""}`}
      className="block bg-[#FFFCF7] border border-[#E0D8C8] rounded-xl overflow-hidden hover:shadow-lg hover:border-[#D4612A]/30 transition-all group"
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
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A]" />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* City name on photo */}
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
        <div className="flex flex-wrap gap-1 mb-3">
          {trip.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs text-[#8A8A8A] bg-[#F5F0E8] px-2 py-0.5 rounded-full capitalize">
              {tag}
            </span>
          ))}
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-[#D4612A] text-xl">${trip.totalCost.toLocaleString()}</span>
              {isLivePrice && (
                <span className="text-[10px] bg-[#D0ECE7] text-[#1A7A6D] font-mono font-semibold px-1.5 py-0.5 rounded">LIVE</span>
              )}
            </div>
            <div className="text-xs text-[#8A8A8A]">{trip.nights} nights all-in</div>
          </div>

          <div className="text-right">
            {savings > 0 && (
              <div className="text-xs text-[#1A7A6D] font-medium mb-1">${savings} under</div>
            )}
            <span className="text-[#D4612A] text-sm font-semibold group-hover:translate-x-0.5 transition-transform inline-block">
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
