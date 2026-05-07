'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ExploreTrip } from './page';

// Verified working Unsplash photo IDs (synced with DestinationCard.tsx)
const UNSPLASH_PHOTOS: Record<string, string> = {
  "lisbon":              "1585208798174-6cedd86e019a",
  "paris":               "1511739001486-6bfe10ce785f",
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
  "reykjavik":           "1606130503037-6a8ef67c9d2d",
  "porto":               "1555881400-74d7acaacd8b",
  "seville":             "1558618666-fcd25c85cd64",
  "valencia":            "1529437971227-3344caa48ce2",
  "krakow":              "1670166819528-aadfddc48070",
  "warsaw":              "1607078486875-a697a8a38e87",
  "florence":            "1533071271635-503f54d367d8",
  "naples":              "1609244283184-96db6d696573",
  "dubrovnik":           "1508739773434-c26b3d09e071",
  "split":               "1629997865848-f4353a9296c9",
  "kotor":               "1614122027743-50a9e6e8002f",
  "belgrade":            "1608816747977-4d303f476571",
  "bucharest":           "1654529046084-a38c42b6920f",
  "sofia":               "1601134467661-3d775b999c8b",
  "vilnius":             "1549891472-991e6bc75d1e",
  "tallinn":             "1564951537954-29dd59397b90",
  "dublin":              "1602061464448-5859b31eb1b8",
  "edinburgh":           "1535448033526-c0e85c9e6968",
  "valletta":            "1584348059301-bb1d44173050",
  "tbilisi":             "1565008576549-57569a49371d",
  "mexico-city":         "1518638150340-f706e86654de",
  "cancun":              "1510097467424-192d713fd8b2",
  "tulum":               "1605216663980-b7ca6e9f2451",
  "oaxaca":              "1696529990340-91966e97467f",
  "puerto-vallarta":     "1547047549-0d757aaa848a",
  "san-juan":            "1579687196544-08ae57ab5c11",
  "punta-cana":          "1584551246679-0daf3d275d0f",
  "havana":              "1570299437488-d430e1e677c7",
  "antigua-guatemala":   "1555400038-63f5ba517a47",
  "san-jose-costa-rica": "1682963847132-1923d1e7928a",
  "panama-city":         "1540610410855-b4c8877b761c",
  "colombia-medellin":   "1551282643-392c82ebb909",
  "cartagena":           "1583416750470-965b2707b355",
  "bogota":              "1568632234157-ce7aecd03d0d",
  "lima":                "1531968455001-5c5272a41129",
  "cusco":               "1526392060635-9d6019884377",
  "buenos-aires":        "1589909202802-8f4aadce1849",
  "santiago":            "1554481923-a6918bd997bc",
  "rio-de-janeiro":      "1731159623214-888a439ea7ea",
  "montevideo":          "1653919191750-4a65034cd9b7",
  "quito":               "1531572753322-ad063cecc140",
  "nassau":              "1589786161184-6d43d20526e2",
  "marrakech":           "1597212618440-806262de4f6b",
  "cape-town":           "1580060839134-75a5edca2e99",
  "nairobi":             "1611348524140-53c9a25263d6",
  "bangkok":             "1508009603885-50cf7c579365",
  "bali":                "1537996194471-e657df975ab4",
  "tokyo":               "1540959733332-eab4deabeeaf",
  "chiang-mai":          "1528360983277-13d401cdc186",
  "ho-chi-minh":         "1583417319070-4a69db38a482",
  "hanoi":               "1753939582094-3091a6e0891e",
  "taipei":              "1624951704146-3218e45d7629",
  "singapore":           "1508964942454-1a56651d54ac",
  "kathmandu":           "1605640840605-14ac1855827b",
};

const EDITORIAL_META: Record<string, { tag: string; whisper: string }> = {
  "lisbon":              { tag: "Iberia",         whisper: "pastel de nata · sunset trams" },
  "paris":               { tag: "France",         whisper: "cafés · couture · golden light" },
  "rome":                { tag: "Italy",          whisper: "pasta · ruins · espresso" },
  "madrid":              { tag: "Iberia",         whisper: "tapas after midnight" },
  "barcelona":           { tag: "Catalonia",      whisper: "Gaudí + sea" },
  "vienna":              { tag: "Austria",        whisper: "opera · coffee · art" },
  "berlin":              { tag: "Germany",        whisper: "art · late nights · history" },
  "amsterdam":           { tag: "Netherlands",    whisper: "canals · bikes · tulips" },
  "prague":              { tag: "Bohemia",        whisper: "cobblestones · castle views" },
  "budapest":            { tag: "Hungary",        whisper: "thermal baths · ruin bars" },
  "athens":              { tag: "Greece",         whisper: "ruins · feta · the Aegean" },
  "istanbul":            { tag: "Bosphorus",      whisper: "spices · minarets · çay" },
  "reykjavik":           { tag: "North Atlantic", whisper: "aurora season" },
  "porto":               { tag: "Portugal",       whisper: "port wine · river views" },
  "seville":             { tag: "Andalusia",      whisper: "flamenco · orange trees" },
  "valencia":            { tag: "Spain",          whisper: "paella · beach · art city" },
  "krakow":              { tag: "Poland",         whisper: "medieval charm · pierogies" },
  "warsaw":              { tag: "Poland",         whisper: "rebuilt city · nightlife" },
  "florence":            { tag: "Tuscany",        whisper: "renaissance art · gelato" },
  "naples":              { tag: "Campania",       whisper: "pizza birthplace · beautiful chaos" },
  "dubrovnik":           { tag: "Adriatic",       whisper: "old walls · Game of Thrones" },
  "split":               { tag: "Dalmatia",       whisper: "Diocletian palace · sailboats" },
  "kotor":               { tag: "Montenegro",     whisper: "bay · old town · hike up" },
  "belgrade":            { tag: "Serbia",         whisper: "nightlife · history · šljivovica" },
  "bucharest":           { tag: "Romania",        whisper: "art nouveau · cheap drinks" },
  "sofia":               { tag: "Bulgaria",       whisper: "mountains · monasteries" },
  "vilnius":             { tag: "Baltics",        whisper: "baroque · cosy · budget-kind" },
  "tallinn":             { tag: "Estonia",        whisper: "medieval old town · digital city" },
  "dublin":              { tag: "Ireland",        whisper: "pubs · craic · wild coast" },
  "edinburgh":           { tag: "Scotland",       whisper: "castle · whisky · moors" },
  "valletta":            { tag: "Malta",          whisper: "fortress city · harbour" },
  "tbilisi":             { tag: "Caucasus",       whisper: "wine · baths · old town" },
  "mexico-city":         { tag: "Capital",        whisper: "Roma Norte vibes" },
  "cancun":              { tag: "Caribbean",      whisper: "beach + tacos + budget" },
  "tulum":               { tag: "Riviera Maya",   whisper: "cenotes · eco-chic" },
  "oaxaca":              { tag: "Mexico",         whisper: "mezcal · mole · markets" },
  "puerto-vallarta":     { tag: "Pacific Coast",  whisper: "sunset cocktails" },
  "san-juan":            { tag: "Puerto Rico",    whisper: "Old City · plantains" },
  "punta-cana":          { tag: "Dominican Rep.", whisper: "all-inclusive paradise" },
  "havana":              { tag: "Cuba",           whisper: "vintage cars · salsa" },
  "antigua-guatemala":   { tag: "Guatemala",      whisper: "volcanoes · cobblestones" },
  "san-jose-costa-rica": { tag: "Costa Rica",     whisper: "pura vida · biodiversity" },
  "panama-city":         { tag: "Panama",         whisper: "canal · skyscrapers · heat" },
  "colombia-medellin":   { tag: "Colombia",       whisper: "eternal spring · street art" },
  "cartagena":           { tag: "Caribbean Coast",whisper: "walled city · heat" },
  "bogota":              { tag: "Colombia",       whisper: "street art · altitude" },
  "lima":                { tag: "Andes Coast",    whisper: "ceviche capital" },
  "cusco":               { tag: "Peru",           whisper: "Machu Picchu gateway" },
  "buenos-aires":        { tag: "Argentina",      whisper: "steak · tango · Europe vibes" },
  "santiago":            { tag: "Chile",          whisper: "Andes backdrop · wine country" },
  "rio-de-janeiro":      { tag: "Brazil",         whisper: "beaches · carnival · views" },
  "montevideo":          { tag: "Uruguay",        whisper: "chill · steak · waterfront" },
  "quito":               { tag: "Ecuador",        whisper: "equator · colonial old town" },
  "nassau":              { tag: "Bahamas",        whisper: "turquoise · conch · reef" },
  "marrakech":           { tag: "Morocco",        whisper: "souks · spice · riads" },
  "cape-town":           { tag: "South Africa",   whisper: "mountain · wine · coast" },
  "nairobi":             { tag: "East Africa",    whisper: "safari gateway · tech hub" },
  "bangkok":             { tag: "Thailand",       whisper: "temples · street food · chaos" },
  "bali":                { tag: "Indonesia",      whisper: "rice fields · surf · spirit" },
  "tokyo":               { tag: "Far East",       whisper: "neon + ramen" },
  "chiang-mai":          { tag: "N. Thailand",    whisper: "elephants · temples · chill" },
  "ho-chi-minh":         { tag: "Vietnam",        whisper: "pho · motorbikes · heat" },
  "hanoi":               { tag: "Vietnam",        whisper: "Old Quarter · egg coffee" },
  "taipei":              { tag: "Taiwan",         whisper: "night markets · tech · tea" },
  "singapore":           { tag: "Southeast Asia", whisper: "hawker centres · spotless" },
  "kathmandu":           { tag: "Nepal",          whisper: "Himalayas gateway · chaos" },
};

// Repeating mosaic layout: cycles across all destinations
const MOSAIC_LAYOUT = [
  { col: 6, row: 3 },
  { col: 3, row: 3 },
  { col: 3, row: 3 },
  { col: 12, row: 2 },
  { col: 8, row: 3 },
  { col: 4, row: 3 },
];

const REGIONS = ['All', 'Europe', 'Asia', 'Americas', 'Africa'];
const VIBE_FILTERS = [
  { label: 'All',       key: 'all' },
  { label: '🏙️ City',   key: 'city' },
  { label: '🏖️ Beach',  key: 'beach' },
  { label: '🍜 Food',   key: 'food' },
  { label: '🏔️ Nature', key: 'nature' },
  { label: '🎭 Culture',key: 'culture' },
  { label: '💃 Nightlife', key: 'nightlife' },
];

export default function ExploreClient({ trips }: { trips: ExploreTrip[] }) {
  const [region, setRegion] = useState('All');
  const [vibe, setVibe] = useState('all');

  const filtered = trips.filter(t => {
    const regionOk = region === 'All' || t.region === region;
    const vibeOk = vibe === 'all' || t.tags.includes(vibe);
    return regionOk && vibeOk;
  });

  return (
    <section className="sec sec-sand" style={{ paddingTop: 48 }}>
      <div className="wrap">
        {/* Header row */}
        <div className="explore-hd">
          <div>
            <div className="wd-eyebrow" style={{ marginBottom: 6 }}>
              Estimated cost · 5 nights · from JFK · per person
            </div>
            <h2 style={{ margin: 0, fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em' }}>
              {filtered.length} destinations, cheapest first
            </h2>
          </div>
        </div>

        {/* Region filter */}
        <div className="filt-row">
          <span className="lbl">Region</span>
          {REGIONS.map(r => {
            const count = r === 'All' ? trips.length : trips.filter(t => t.region === r).length;
            return (
              <button
                key={r}
                className={`fchip${region === r ? ' on' : ''}`}
                onClick={() => setRegion(r)}
              >
                {r} · {count}
              </button>
            );
          })}
        </div>

        {/* Vibe filter */}
        <div className="filt-row" style={{ marginBottom: 32 }}>
          <span className="lbl">Vibe</span>
          {VIBE_FILTERS.map(v => (
            <button
              key={v.key}
              className={`fchip${vibe === v.key ? ' on' : ''}`}
              onClick={() => setVibe(v.key)}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Flat mosaic grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-[#e0d8c8]">
            <div className="text-4xl mb-3">🔍</div>
            <h2 className="text-xl font-bold mb-2">No trips found</h2>
            <p className="text-sm text-[#9A9A8A] mb-4">Try a different filter.</p>
            <button
              onClick={() => { setRegion('All'); setVibe('all'); }}
              className="text-sm text-[#2F6B5E] underline cursor-pointer bg-transparent border-0"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div
            className="grid gap-3.5"
            style={{ gridTemplateColumns: 'repeat(12, 1fr)', gridAutoRows: '200px' }}
          >
            {filtered.map((t, i) => {
              const l = MOSAIC_LAYOUT[i % MOSAIC_LAYOUT.length];
              const big = l.col >= 6;
              const photo = UNSPLASH_PHOTOS[t.id];
              const meta = EDITORIAL_META[t.id];
              const params = new URLSearchParams({
                budget: String(t.totalCost + 100),
                origin: 'JFK',
                nights: String(t.nights),
                tripLength: '5-7',
                party: '1',
              });

              return (
                <div
                  key={t.id}
                  style={{ gridColumn: `span ${l.col}`, gridRow: `span ${l.row}` }}
                >
                  <Link
                    href={`/destination/${t.id}?${params.toString()}`}
                    className="block rounded overflow-hidden border border-[#e0d8c8] shadow-[0_1px_0_rgba(14,26,20,0.04)] flex flex-col group bg-white h-full"
                    style={{ textDecoration: 'none' }}
                  >
                    {/* Image */}
                    <div className="relative flex-1">
                      {photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=${big ? 1000 : 600}&q=75`}
                          alt={t.city}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3932] to-[#2b5148]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/0 from-30% to-black/55 pointer-events-none" />

                      {/* Editorial tag */}
                      {meta && (
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
                          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-white bg-black/55 backdrop-blur-sm px-2 py-1 rounded-sm">
                            {meta.tag}
                          </span>
                        </div>
                      )}

                      {/* City name + whisper */}
                      <div className="absolute bottom-4 left-[18px] right-[18px] text-white z-10">
                        <div className={`font-serif italic leading-[0.95] tracking-[-0.02em] ${big ? 'text-[48px]' : 'text-[32px]'}`}>
                          {t.city}
                        </div>
                        {meta && (
                          <div className="font-mono text-[11px] tracking-[0.08em] opacity-85 mt-1.5">
                            {t.flag} {t.country.toUpperCase()} · {meta.whisper}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer: price */}
                    <div className="flex items-center justify-between bg-white border-t border-[#e0d8c8] gap-2.5 px-3.5 py-3 flex-shrink-0">
                      <div className="flex items-baseline gap-2">
                        <span className="font-sans font-semibold text-xl" style={{ color: '#0A0A0A' }}>
                          ${t.totalCost.toLocaleString()}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.06em]" style={{ color: '#9A9A8A' }}>
                          / person · {t.nights} nights
                        </span>
                      </div>
                      <span className="font-mono text-[10px] tracking-[0.06em] uppercase text-[#9A9A8A]">
                        {t.region}
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
