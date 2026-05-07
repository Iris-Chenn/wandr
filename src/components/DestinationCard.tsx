"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { TripEstimate } from "@/lib/ranking";

// Unsplash photo IDs — numeric IDs use `photo-{id}`, slugs are tried both ways.
const UNSPLASH_PHOTOS: Record<string, string> = {
  // ── Europe ──────────────────────────────────────────────────────────────────
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
  "porto":               "1555993539-1732b0258236",
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
  // ── Americas ────────────────────────────────────────────────────────────────
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
  // ── Africa ──────────────────────────────────────────────────────────────────
  "marrakech":           "1597212720753-4d00e55eab4d",
  "cape-town":           "1580060839134-75a5edca2e99",
  "nairobi":             "1553697384-bce7b6e7484f",
  // ── Asia ────────────────────────────────────────────────────────────────────
  "bangkok":             "1508009603885-50cf7c579365",
  "bali":                "1537996194471-e657df975ab4",
  "tokyo":               "1540959733332-eab4deabeeaf",
  "chiang-mai":          "1528360983277-13d401cdc186",
  "ho-chi-minh":         "1583417319070-4a69db38a482",
  "hanoi":               "1509391366636-9f70e20b6e56",
  "taipei":              "1570077788046-2a8e7b2f69c5",
  "singapore":           "1525625293386-2d66c8bc27b4",
  "kathmandu":           "1571085406820-b3c24f8c7a8a",
};

// Editorial tags (regional label) and whispers (one-liner) per destination.
const EDITORIAL_META: Record<string, { tag: string; whisper: string }> = {
  // Europe
  lisbon:              { tag: "Iberia",          whisper: "pastel de nata · sunset trams" },
  paris:               { tag: "France",          whisper: "cafés · couture · golden light" },
  rome:                { tag: "Italy",           whisper: "pasta · ruins · espresso" },
  madrid:              { tag: "Iberia",          whisper: "tapas after midnight" },
  barcelona:           { tag: "Catalonia",       whisper: "Gaudí + sea" },
  vienna:              { tag: "Austria",         whisper: "opera · coffee · art" },
  berlin:              { tag: "Germany",         whisper: "art · late nights · history" },
  amsterdam:           { tag: "Netherlands",     whisper: "canals · bikes · tulips" },
  prague:              { tag: "Bohemia",         whisper: "cobblestones · castle views" },
  budapest:            { tag: "Hungary",         whisper: "thermal baths · ruin bars" },
  athens:              { tag: "Greece",          whisper: "ruins · feta · the Aegean" },
  istanbul:            { tag: "Bosphorus",       whisper: "spices · minarets · çay" },
  reykjavik:           { tag: "North Atlantic",  whisper: "aurora season" },
  porto:               { tag: "Portugal",        whisper: "port wine · river views" },
  seville:             { tag: "Andalusia",       whisper: "flamenco · orange trees" },
  valencia:            { tag: "Spain",           whisper: "paella · beach · art city" },
  krakow:              { tag: "Poland",          whisper: "medieval charm · pierogies" },
  warsaw:              { tag: "Poland",          whisper: "rebuilt city · nightlife" },
  florence:            { tag: "Tuscany",         whisper: "renaissance art · gelato" },
  naples:              { tag: "Campania",        whisper: "pizza birthplace · beautiful chaos" },
  dubrovnik:           { tag: "Adriatic",        whisper: "old walls · Game of Thrones" },
  split:               { tag: "Dalmatia",        whisper: "Diocletian palace · sailboats" },
  kotor:               { tag: "Montenegro",      whisper: "bay · old town · hike up" },
  belgrade:            { tag: "Serbia",          whisper: "nightlife · history · šljivovica" },
  bucharest:           { tag: "Romania",         whisper: "art nouveau · cheap drinks" },
  sofia:               { tag: "Bulgaria",        whisper: "mountains · monasteries" },
  vilnius:             { tag: "Baltics",         whisper: "baroque · cosy · budget-kind" },
  tallinn:             { tag: "Estonia",         whisper: "medieval old town · digital city" },
  dublin:              { tag: "Ireland",         whisper: "pubs · craic · wild coast" },
  edinburgh:           { tag: "Scotland",        whisper: "castle · whisky · moors" },
  valletta:            { tag: "Malta",           whisper: "fortress city · harbour" },
  tbilisi:             { tag: "Caucasus",        whisper: "wine · baths · old town" },
  // Americas
  "mexico-city":       { tag: "Capital",         whisper: "Roma Norte vibes" },
  cancun:              { tag: "Caribbean",        whisper: "beach + tacos + budget" },
  tulum:               { tag: "Riviera Maya",     whisper: "cenotes · eco-chic" },
  oaxaca:              { tag: "Mexico",           whisper: "mezcal · mole · markets" },
  "puerto-vallarta":   { tag: "Pacific Coast",    whisper: "sunset cocktails" },
  "san-juan":          { tag: "Puerto Rico",      whisper: "Old City · plantains" },
  "punta-cana":        { tag: "Dominican Rep.",   whisper: "all-inclusive paradise" },
  havana:              { tag: "Cuba",             whisper: "vintage cars · salsa" },
  "antigua-guatemala": { tag: "Guatemala",        whisper: "volcanoes · cobblestones" },
  "san-jose-costa-rica": { tag: "Costa Rica",    whisper: "pura vida · biodiversity" },
  "panama-city":       { tag: "Panama",           whisper: "canal · skyscrapers · heat" },
  "colombia-medellin": { tag: "Colombia",         whisper: "eternal spring · street art" },
  cartagena:           { tag: "Caribbean Coast",  whisper: "walled city · heat" },
  bogota:              { tag: "Colombia",         whisper: "street art · altitude" },
  lima:                { tag: "Andes Coast",      whisper: "ceviche capital" },
  cusco:               { tag: "Peru",             whisper: "Machu Picchu gateway" },
  "buenos-aires":      { tag: "Argentina",        whisper: "steak · tango · Europe vibes" },
  santiago:            { tag: "Chile",            whisper: "Andes backdrop · wine country" },
  "rio-de-janeiro":    { tag: "Brazil",           whisper: "beaches · carnival · views" },
  montevideo:          { tag: "Uruguay",          whisper: "chill · steak · waterfront" },
  quito:               { tag: "Ecuador",          whisper: "equator · colonial old town" },
  nassau:              { tag: "Bahamas",          whisper: "turquoise · conch · reef" },
  // Africa
  marrakech:           { tag: "Morocco",          whisper: "souks · spice · riads" },
  "cape-town":         { tag: "South Africa",     whisper: "mountain · wine · coast" },
  nairobi:             { tag: "East Africa",      whisper: "safari gateway · tech hub" },
  // Asia
  bangkok:             { tag: "Thailand",         whisper: "temples · street food · chaos" },
  bali:                { tag: "Indonesia",        whisper: "rice fields · surf · spirit" },
  tokyo:               { tag: "Far East",         whisper: "neon + ramen" },
  "chiang-mai":        { tag: "N. Thailand",      whisper: "elephants · temples · chill" },
  "ho-chi-minh":       { tag: "Vietnam",          whisper: "pho · motorbikes · heat" },
  hanoi:               { tag: "Vietnam",          whisper: "Old Quarter · egg coffee" },
  taipei:              { tag: "Taiwan",           whisper: "night markets · tech · tea" },
  singapore:           { tag: "Southeast Asia",   whisper: "hawker centres · spotless" },
  kathmandu:           { tag: "Nepal",            whisper: "Himalayas gateway · chaos" },
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
  big?: boolean;
};

export default function DestinationCard({
  trip, budget, isLivePrice, departDate, returnDate,
  party = 1, originCode = "JFK", tripLength = "5-7", vibes = "",
  big = false,
}: Props) {
  const [urlAttempt, setUrlAttempt] = useState(0);
  const savings = budget - trip.totalCost;
  const photoId = UNSPLASH_PHOTOS[trip.id];
  const meta = EDITORIAL_META[trip.id] ?? {
    tag: trip.region,
    whisper: trip.tags.slice(0, 2).join(" · "),
  };

  const Q = "?auto=format&fit=crop&w=800&q=75";
  const photoUrls = photoId ? [
    `https://images.unsplash.com/photo-${photoId}${Q}`,
    `https://images.unsplash.com/${photoId}${Q}`,
  ] : [];
  const photoUrl = photoUrls[urlAttempt] ?? null;

  const handleImgError = useCallback(() => {
    setUrlAttempt(prev => prev + 1);
  }, []);

  const destParams = new URLSearchParams({
    budget: String(budget),
    origin: originCode,
    nights: String(trip.nights),
    party: String(party),
    tripLength,
    ...(isLivePrice ? { flight: String(trip.flightCost) } : {}),
    ...(vibes ? { vibes } : {}),
    ...(departDate ? { depart: departDate, return: returnDate ?? "" } : {}),
  });

  const isTopPick = trip.matchTier === "top";

  return (
    <Link
      href={`/destination/${trip.id}?${destParams.toString()}`}
      className="block h-full rounded overflow-hidden border border-[#e0d8c8] shadow-[0_1px_0_rgba(14,26,20,0.04)] flex flex-col group bg-white"
    >
      {/* Image */}
      <div
        className="relative flex-1"
        style={{ minHeight: big ? 360 : 220 }}
      >
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={trip.city}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
            onError={handleImgError}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E3932] via-[#22453c] to-[#1a3028] flex flex-col items-center justify-center gap-2">
            <span className="text-5xl drop-shadow-md">{trip.flag}</span>
            <span className="text-white/70 text-sm font-semibold tracking-wide">{trip.city}</span>
          </div>
        )}

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 from-30% to-black/55 pointer-events-none" />

        {/* Top row: editorial tag + pick pill */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-white bg-black/55 backdrop-blur-sm px-2 py-1 rounded-sm">
            {meta.tag}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] tracking-[0.1em] uppercase font-semibold ${
              isTopPick
                ? "bg-[#F26B2D] text-white"
                : "bg-white/90 text-[#0E3B2A] border border-[#0E3B2A] backdrop-blur-sm"
            }`}
          >
            <span
              className={`w-[5px] h-[5px] rounded-full flex-shrink-0 ${
                isTopPick ? "bg-white" : "bg-[#1F8A5B]"
              }`}
            />
            {isTopPick ? "Top pick" : "Good fit"}
          </span>
        </div>

        {/* Bottom: city name + whisper */}
        <div className="absolute bottom-4 left-[18px] right-[18px] text-white z-10">
          <div
            className={`font-serif italic leading-[0.95] tracking-[-0.02em] ${
              big ? "text-[56px]" : "text-[36px]"
            }`}
          >
            {trip.city}
          </div>
          <div className="font-mono text-[11px] tracking-[0.08em] opacity-85 mt-1.5">
            {trip.flag} {trip.country.toUpperCase()} · {meta.whisper}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className={`flex items-center justify-between bg-white border-t border-[#e0d8c8] gap-2.5 ${
          big ? "px-[18px] py-4" : "px-3.5 py-3"
        }`}
      >
        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className={`font-sans font-semibold text-ink ${big ? "text-2xl" : "text-xl"}`}>
            ${trip.totalCost.toLocaleString()}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-light">
            / person
          </span>
        </div>

        {/* Savings delta + breakdown */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`font-mono text-[11px] font-semibold px-2 py-1 rounded-sm ${
              savings > 0
                ? "text-[#2F6B5E] bg-[#2F6B5E]/10"
                : "text-[#8B3A3A] bg-[#8B3A3A]/10"
            }`}
          >
            {savings > 0 ? "−" : "+"}${Math.abs(savings).toLocaleString()}
          </span>
          <span className="font-mono text-[10px] text-ink-light hidden sm:block">
            ✈${trip.flightCost.toLocaleString()} · ${Math.round(trip.hotelCost / trip.nights)}/n
          </span>
        </div>
      </div>
    </Link>
  );
}
