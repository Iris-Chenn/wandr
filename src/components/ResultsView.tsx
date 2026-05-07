"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import type { TripEstimate } from "@/lib/ranking";
import DestinationCard from "./DestinationCard";
import type { Preferences } from "./PreferenceQuiz";

const WorldMap = lazy(() => import("./WorldMap"));

const REGIONS = ["All", "Americas", "Europe", "Asia", "Africa"];
const ALL_TAGS = ["All", "City", "Beach", "Nature", "Food", "Culture", "History", "Adventure", "Nightlife", "Chill"];

type SortOption = "value" | "price-asc" | "price-desc";
type EditorialTier = "under" | "at" | "splurge";

function getEditorialTier(ratio: number): EditorialTier {
  if (ratio < 1.0) return "under";
  if (ratio <= 1.10) return "at";
  return "splurge";
}

const TIER_META: Record<EditorialTier, {
  num: string; word: string; tagline: string;
  accent: string; tint: string;
}> = {
  under:   { num: "01", word: "Under",   tagline: "Within budget. Surplus on the side.", accent: "#2F6B5E", tint: "#DCECE7" },
  at:      { num: "02", word: "At",      tagline: "On the number. Best vibe match.",     accent: "#C99A2E", tint: "#F6EBD4" },
  splurge: { num: "03", word: "Splurge", tagline: "Worth a stretch. Feature-grade.",     accent: "#8B3A3A", tint: "#F0DFDF" },
};

// 12-col mosaic grid: cycles when a tier has more items than layout slots.
const MOSAIC_LAYOUTS: Record<EditorialTier, Array<{ col: number; row: number }>> = {
  under:   [{ col: 6, row: 3 }, { col: 3, row: 3 }, { col: 3, row: 3 }, { col: 12, row: 2 }],
  at:      [{ col: 8, row: 3 }, { col: 4, row: 3 }, { col: 12, row: 2 }],
  splurge: [{ col: 5, row: 3 }, { col: 7, row: 3 }],
};

function avg(arr: TripEstimate[]) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((s, d) => s + d.totalCost, 0) / arr.length);
}

function applyPreferences(trips: TripEstimate[], prefs: Preferences): TripEstimate[] {
  return [...trips].sort((a, b) => {
    let scoreA = a.totalScore;
    let scoreB = b.totalScore;
    const style = prefs.travelStyle.toLowerCase();
    if (a.tags.includes(style)) scoreA *= 1.3;
    if (b.tags.includes(style)) scoreB *= 1.3;
    if (prefs.priority === "food") {
      if (a.tags.includes("food")) scoreA *= 1.2;
      if (b.tags.includes("food")) scoreB *= 1.2;
    }
    if (prefs.priority === "budget") {
      scoreA *= 1 + (1 - a.totalCost / (a.totalCost + 100)) * 0.2;
      scoreB *= 1 + (1 - b.totalCost / (b.totalCost + 100)) * 0.2;
    }
    return scoreB - scoreA;
  });
}

function TierBreak({ tier, count, avgCost }: { tier: EditorialTier; count: number; avgCost: number }) {
  const m = TIER_META[tier];
  return (
    <div
      className="rounded border-t-2 mb-[18px]"
      style={{
        borderTopColor: m.accent,
        backgroundColor: m.tint,
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: "32px",
        alignItems: "end",
        padding: "28px 32px",
      }}
    >
      <div className="font-mono text-sm font-semibold tracking-[0.1em] uppercase" style={{ color: m.accent }}>
        TIER / {m.num}
      </div>
      <div>
        <div
          className="font-serif italic font-normal tracking-[-0.03em] leading-[0.95] text-ink"
          style={{ fontSize: "clamp(40px,5vw,64px)" }}
        >
          {m.word} <span className="not-italic">budget.</span>
        </div>
        <div className="text-sm text-ink-muted mt-1.5">{m.tagline}</div>
      </div>
      <div className="flex gap-6 items-end">
        <div>
          <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-light">Destinations</div>
          <div className="font-mono text-[22px] font-medium text-ink">{String(count).padStart(2, "0")}</div>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-light">Avg / person</div>
          <div className="font-mono text-[22px] font-medium text-ink">${avgCost.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}

type SharedCardProps = Omit<Parameters<typeof DestinationCard>[0], "trip" | "big">;

function Mosaic({ items, tier, cardProps }: {
  items: TripEstimate[];
  tier: EditorialTier;
  cardProps: SharedCardProps;
}) {
  const layout = MOSAIC_LAYOUTS[tier];
  return (
    <div
      className="grid gap-3.5 mb-9"
      style={{ gridTemplateColumns: "repeat(12, 1fr)", gridAutoRows: "200px" }}
    >
      {items.map((trip, i) => {
        const l = layout[i % layout.length];
        const big = l.col >= 6;
        return (
          <div
            key={trip.id}
            style={{ gridColumn: `span ${l.col}`, gridRow: `span ${l.row}` }}
          >
            <DestinationCard trip={trip} big={big} {...cardProps} />
          </div>
        );
      })}
    </div>
  );
}

type Props = {
  trips: TripEstimate[];
  budget: number;
  hasDuffelPrices: boolean;
  departDate: string;
  returnDate: string;
  origin: string;
  originCode?: string;
  tripLengthLabel: string;
  tripLength?: string;
  month: string;
  vibes?: string;
  party?: number;
};

export default function ResultsView({
  trips,
  budget,
  hasDuffelPrices,
  departDate,
  returnDate,
  origin,
  originCode = "JFK",
  tripLengthLabel,
  tripLength = "5-7",
  month,
  vibes = "",
  party = 1,
}: Props) {
  const router = useRouter();
  const [view, setView] = useState<"list" | "map">("list");
  const [activeRegion, setActiveRegion] = useState("All");
  const [activeTag, setActiveTag] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("value");
  const [selectedTrip, setSelectedTrip] = useState<TripEstimate | null>(null);
  const [rankedTrips, setRankedTrips] = useState(trips);
  const [personalized, setPersonalized] = useState(false);

  const vibeSet = new Set(
    vibes.split(",").map(v => v.trim().toLowerCase()).filter(Boolean)
  );

  useEffect(() => {
    const saved = localStorage.getItem("wandr_prefs");
    if (saved) {
      const prefs = JSON.parse(saved) as Preferences;
      setRankedTrips(applyPreferences(trips, prefs));
      setPersonalized(true);
    }
  }, [trips]);

  const regionFiltered = activeRegion === "All"
    ? rankedTrips
    : rankedTrips.filter(t => t.region === activeRegion);

  const filteredTrips = activeTag === "All"
    ? regionFiltered
    : regionFiltered.filter(t =>
        t.tags.some(tag => tag.toLowerCase() === activeTag.toLowerCase())
      );

  function applySort(arr: TripEstimate[]) {
    if (sortBy === "value") return arr;
    return [...arr].sort((a, b) =>
      sortBy === "price-asc" ? a.totalCost - b.totalCost : b.totalCost - a.totalCost
    );
  }

  const departDisplay = new Date(departDate + "T12:00:00").toLocaleDateString("en-US", {
    month: "short", day: "numeric",
  });

  const regionCount = (r: string) =>
    r === "All" ? rankedTrips.length : rankedTrips.filter(t => t.region === r).length;

  const totalShown = filteredTrips.length;
  const topCount   = filteredTrips.filter(t => t.matchTier === "top").length;
  const goodCount  = filteredTrips.filter(t => t.matchTier === "good").length;
  const bestDeal   = totalShown > 0 ? Math.min(...filteredTrips.map(t => t.totalCost)) : 0;

  const vibesDisplay = [...vibeSet].map(v => v.charAt(0).toUpperCase() + v.slice(1)).join(" · ");

  const cardProps = {
    budget, isLivePrice: hasDuffelPrices, departDate, returnDate,
    party, originCode, tripLength, vibes,
  };

  // Group filtered trips by editorial tier (under / at / splurge)
  const tierGroups: Record<EditorialTier, TripEstimate[]> = {
    under:   applySort(filteredTrips.filter(t => getEditorialTier(t.ratio) === "under")),
    at:      applySort(filteredTrips.filter(t => getEditorialTier(t.ratio) === "at")),
    splurge: applySort(filteredTrips.filter(t => getEditorialTier(t.ratio) === "splurge")),
  };

  return (
    <div className="pb-20">
      {/* ── Masthead ── */}
      <section
        className="pt-7 pb-6 border-b border-[#e0d8c8]"
        style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "40px", alignItems: "center" }}
      >
        <div>
          {/* Meta line */}
          <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-light flex gap-3 items-center flex-wrap mb-3">
            <button
              onClick={() => router.back()}
              className="text-accent-dark cursor-pointer hover:underline bg-transparent border-0 p-0 font-mono text-[11px] tracking-[0.14em] uppercase"
            >
              ← Change search
            </button>
            <span className="w-1 h-1 rounded-full bg-[#e0d8c8]" />
            <span>{origin} · {tripLengthLabel} · Departing {departDisplay}</span>
            {party > 1 && (
              <>
                <span className="w-1 h-1 rounded-full bg-[#e0d8c8]" />
                <span>{party} travelers</span>
              </>
            )}
            {month !== "flexible" && (
              <>
                <span className="w-1 h-1 rounded-full bg-[#e0d8c8]" />
                <span>{month.replace(/-\d{4}$/, "")}</span>
              </>
            )}
          </div>

          {/* Headline */}
          <h1
            className="font-serif font-normal italic tracking-[-0.03em] leading-[0.92] text-ink m-0"
            style={{ fontSize: "clamp(40px, 6.5vw, 76px)" }}
          >
            {totalShown.toLocaleString()} destinations
            <br />
            <em>under</em>{" "}
            <span className="not-italic" style={{ color: "#2F6B5E" }}>
              ${budget.toLocaleString()}
            </span>.
          </h1>
        </div>

        {/* Summary aside */}
        <aside className="flex flex-col gap-3.5 p-5 bg-white border border-[#e0d8c8] rounded min-w-[260px] self-center">
          <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-ink-light">
            Search summary
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="font-mono text-[9px] tracking-[0.08em] uppercase text-ink-light">Top picks</div>
              <div className="font-serif text-[28px] font-medium leading-none mt-0.5">{topCount}</div>
            </div>
            <div>
              <div className="font-mono text-[9px] tracking-[0.08em] uppercase text-ink-light">Good fit</div>
              <div className="font-serif text-[28px] font-medium leading-none mt-0.5">{goodCount}</div>
            </div>
            <div>
              <div className="font-mono text-[9px] tracking-[0.08em] uppercase text-ink-light">Best deal</div>
              <div className="font-serif text-[28px] font-medium leading-none mt-0.5" style={{ color: "#2F6B5E" }}>
                {bestDeal > 0 ? `$${bestDeal.toLocaleString()}` : "—"}
              </div>
            </div>
            <div>
              <div className="font-mono text-[9px] tracking-[0.08em] uppercase text-ink-light">Vibes</div>
              <div className="text-sm mt-1.5 leading-snug">{vibesDisplay || "Any"}</div>
            </div>
          </div>
          {(hasDuffelPrices || personalized) && (
            <div className="flex flex-col gap-1.5 border-t border-[#e0d8c8] pt-3">
              {hasDuffelPrices && (
                <div className="font-mono text-[10px] text-[#2F6B5E] tracking-[0.06em]">
                  ✓ Live prices via Duffel
                </div>
              )}
              {personalized && (
                <div className="font-mono text-[10px] text-[#C99A2E] tracking-[0.06em]">
                  ✦ Personalized for you
                </div>
              )}
            </div>
          )}
        </aside>
      </section>

      {/* ── Filter shelf (sticky) ── */}
      <div className="sticky top-0 z-20 bg-[#F5F0E8]/95 backdrop-blur-md border-b border-[#e0d8c8] -mx-7 px-7 py-3">
        {/* Region chips */}
        <div className="flex gap-2 mb-2 overflow-x-auto scrollbar-hide">
          {REGIONS.map(r => {
            const count = regionCount(r);
            if (count === 0 && r !== "All") return null;
            return (
              <button
                key={r}
                onClick={() => { setActiveRegion(r); setActiveTag("All"); }}
                className={`flex-shrink-0 font-mono text-[11px] tracking-[0.04em] px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  activeRegion === r
                    ? "bg-ink text-white border-transparent"
                    : "bg-transparent text-ink-muted border-[#e0d8c8] hover:border-ink hover:text-ink"
                }`}
              >
                {r}{r !== "All" && <span className="ml-1 opacity-60">{count}</span>}
              </button>
            );
          })}

          <span className="w-px h-[18px] bg-[#e0d8c8] self-center mx-1.5 flex-shrink-0" />

          {/* Tag chips */}
          {ALL_TAGS.map(tag => {
            const count = regionFiltered.filter(t =>
              t.tags.some(tg => tg.toLowerCase() === tag.toLowerCase())
            ).length;
            if (count === 0 && tag !== "All") return null;
            const isVibe = tag !== "All" && vibeSet.has(tag.toLowerCase());
            const isActive = activeTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`flex-shrink-0 font-mono text-[11px] tracking-[0.04em] px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#2F6B5E] text-white border-transparent"
                    : isVibe
                    ? "bg-[#2F6B5E]/10 text-[#2F6B5E] border-[#2F6B5E]/40 font-semibold hover:border-[#2F6B5E]"
                    : "bg-transparent text-ink-muted border-[#e0d8c8] hover:border-ink hover:text-ink"
                }`}
              >
                {isVibe && !isActive && <span className="mr-0.5 text-[9px]">+</span>}
                {tag}
                {tag !== "All" && <span className="ml-1 opacity-55">{count}</span>}
              </button>
            );
          })}

          <span className="flex-1" />

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
            className="font-mono text-[11px] tracking-[0.04em] border border-[#e0d8c8] rounded-full px-3 py-1.5 bg-transparent text-ink-muted focus:outline-none focus:border-ink cursor-pointer flex-shrink-0"
          >
            <option value="value">Best match ▾</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>

          {/* List / Map toggle */}
          <div className="flex items-center border border-[#e0d8c8] rounded-full overflow-hidden flex-shrink-0">
            <button
              onClick={() => setView("list")}
              className={`font-mono text-[11px] tracking-[0.04em] px-3.5 py-1.5 transition-all cursor-pointer ${
                view === "list" ? "bg-[#2F6B5E] text-white" : "bg-transparent text-ink-muted hover:text-ink"
              }`}
            >
              ≡ List
            </button>
            <button
              onClick={() => setView("map")}
              className={`font-mono text-[11px] tracking-[0.04em] px-3.5 py-1.5 border-l border-[#e0d8c8] transition-all cursor-pointer ${
                view === "map" ? "bg-[#2F6B5E] text-white border-transparent" : "bg-transparent text-ink-muted hover:text-ink"
              }`}
            >
              🗺 Map
            </button>
          </div>
        </div>
      </div>

      {/* ── Map view ── */}
      {view === "map" && (
        <div className="mt-6 mb-6">
          <div className="flex flex-wrap gap-4 mb-3 text-xs text-ink-muted">
            {[
              { color: "#D4612A", label: "Top pick" },
              { color: "#1A7A6D", label: "Good fit" },
              { color: "#6B4FA0", label: "Explore" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                {label}
              </div>
            ))}
          </div>
          <div className="w-full h-[420px] sm:h-[500px] rounded-xl overflow-hidden border border-[#e0d8c8] shadow-sm">
            <Suspense fallback={
              <div className="w-full h-full bg-white flex items-center justify-center">
                <div className="text-ink-light text-sm animate-pulse">Loading map…</div>
              </div>
            }>
              <WorldMap
                trips={filteredTrips}
                budget={budget}
                onSelect={setSelectedTrip}
                selectedId={selectedTrip?.id}
              />
            </Suspense>
          </div>
          {selectedTrip && (
            <div className="mt-4 max-w-sm">
              <DestinationCard trip={selectedTrip} {...cardProps} />
            </div>
          )}
        </div>
      )}

      {/* ── List view: editorial tier sections with mosaic grids ── */}
      {view === "list" && (() => {
        const activeTiers = (["under", "at", "splurge"] as EditorialTier[])
          .filter(t => tierGroups[t].length > 0);

        if (activeTiers.length === 0) {
          return (
            <div className="text-center py-16 bg-white rounded-xl border border-[#e0d8c8] mt-6">
              <div className="text-4xl mb-3">🔍</div>
              <h2 className="text-xl font-bold text-ink mb-2">No trips found</h2>
              <p className="text-ink-muted text-sm mb-4">
                Try a different filter or increase your budget.
              </p>
              <button
                onClick={() => { setActiveTag("All"); setActiveRegion("All"); }}
                className="text-sm text-accent-dark underline cursor-pointer bg-transparent border-0"
              >
                Clear filters
              </button>
            </div>
          );
        }

        return (
          <div className="pt-8">
            {activeTiers.map(tier => (
              <div key={tier}>
                <TierBreak
                  tier={tier}
                  count={tierGroups[tier].length}
                  avgCost={avg(tierGroups[tier])}
                />
                <Mosaic items={tierGroups[tier]} tier={tier} cardProps={cardProps} />
              </div>
            ))}
          </div>
        );
      })()}

      {/* ── Price alert ── */}
      {filteredTrips.length > 0 && view === "list" && (
        <PriceAlert budget={budget} />
      )}
    </div>
  );
}

function PriceAlert({ budget }: { budget: number }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, note: `Price alert — budget $${budget}` }),
    });
    const alerts = JSON.parse(localStorage.getItem("wandr_alerts") || "[]");
    alerts.push({ email, budget, savedAt: new Date().toISOString() });
    localStorage.setItem("wandr_alerts", JSON.stringify(alerts));
    setSent(true);
  };

  return (
    <div className="mt-14 bg-ink rounded-xl p-8 text-center">
      <div className="font-mono text-[10px] text-[#DCECE7] uppercase tracking-[0.15em] mb-2">
        Coming soon
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Get notified when prices drop</h3>
      <p className="text-sm text-white/60 mb-5 max-w-sm mx-auto">
        Set a price alert and we&apos;ll email you when any of these trips hits your sweet spot.
      </p>
      {sent ? (
        <div className="text-sm font-semibold text-[#DCECE7]">
          ✓ You&apos;re on the list! We&apos;ll email you when prices drop.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#DCECE7]"
          />
          <button
            type="submit"
            className="bg-[#2F6B5E] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#3F8577] active:scale-95 transition-all cursor-pointer border-0"
          >
            Alert me
          </button>
        </form>
      )}
    </div>
  );
}
