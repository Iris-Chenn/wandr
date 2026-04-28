"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import type { TripEstimate } from "@/lib/ranking";
import DestinationCard from "./DestinationCard";
import type { Preferences } from "./PreferenceQuiz";

const WorldMap = lazy(() => import("./WorldMap"));

const REGIONS = ["All", "Americas", "Europe", "Asia", "Africa"];
const ALL_TAGS = ["All", "City", "Beach", "Nature", "Food", "Culture", "History", "Adventure", "Nightlife", "Chill"];

type SortOption = "value" | "price-asc" | "price-desc";

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
  const [view, setView] = useState<"list" | "map">("list");
  const [activeRegion, setActiveRegion] = useState("All");
  const [activeTag, setActiveTag] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("value");
  const [selectedTrip, setSelectedTrip] = useState<TripEstimate | null>(null);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [rankedTrips, setRankedTrips] = useState(trips);
  const [personalized, setPersonalized] = useState(false);
  const [alertEmail, setAlertEmail] = useState("");
  const [alertSent, setAlertSent] = useState(false);

  // Parse vibes from plan form into a Set for fast lookup
  const vibeSet = new Set(
    vibes.split(",").map(v => v.trim().toLowerCase()).filter(Boolean)
  );

  useEffect(() => {
    const saved = localStorage.getItem("wandr_prefs");
    if (saved) {
      const prefs = JSON.parse(saved) as Preferences;
      setPreferences(prefs);
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

  // Sort within each group (value = already sorted by rankDestinations)
  function applySort(arr: TripEstimate[]) {
    if (sortBy === "value") return arr;
    return [...arr].sort((a, b) =>
      sortBy === "price-asc" ? a.totalCost - b.totalCost : b.totalCost - a.totalCost
    );
  }

  const handleAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertEmail) return;
    await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: alertEmail, note: `Price alert — budget $${budget}` }),
    });
    const alerts = JSON.parse(localStorage.getItem("wandr_alerts") || "[]");
    alerts.push({ email: alertEmail, budget, savedAt: new Date().toISOString() });
    localStorage.setItem("wandr_alerts", JSON.stringify(alerts));
    setAlertSent(true);
  };

  const departDisplay = new Date(departDate + "T12:00:00").toLocaleDateString("en-US", {
    month: "short", day: "numeric",
  });

  const regionCount = (r: string) =>
    r === "All" ? rankedTrips.length : rankedTrips.filter(t => t.region === r).length;

  const withinBudgetCount = filteredTrips.filter(t => t.totalCost <= budget).length;
  const overBudgetCount   = filteredTrips.filter(t => t.totalCost > budget).length;

  const cardProps = {
    budget, isLivePrice: hasDuffelPrices, departDate, returnDate,
    party, originCode, tripLength, vibes,
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className="pt-6 pb-5 border-b border-[#ebe9e3]">
        {/* Meta line */}
        <div className="font-mono text-xs text-[rgba(0,0,0,0.35)] uppercase tracking-widest mb-2">
          {origin} · {tripLengthLabel} · Departing {departDisplay}
          {party > 1 && ` · ${party} travelers`}
          {month !== "flexible" && ` · ${month.replace(/-\d{4}$/, "")}`}
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[rgba(0,0,0,0.87)] leading-tight mb-1">
          {withinBudgetCount} trips within{" "}
          <span className="text-[#006241]">${budget.toLocaleString()}</span>
        </h1>

        {/* Sub-line */}
        <p className="text-sm text-[rgba(0,0,0,0.52)] mb-3">
          {party === 1
            ? "Per person · all-in (flights + hotel + food + activities)"
            : `$${budget.toLocaleString()}/person · $${(budget * party).toLocaleString()} total for ${party} travelers · hotel shared`}
          {overBudgetCount > 0 && (
            <span className="ml-1.5 text-[rgba(0,0,0,0.35)]">
              · +{overBudgetCount} slightly over budget also shown
            </span>
          )}
        </p>

        {/* Badge row — live price · personalized · selected vibes */}
        <div className="flex flex-wrap gap-2">
          {hasDuffelPrices && (
            <span className="inline-flex items-center gap-1 bg-[#d4e9e2] text-[#006241] text-xs font-semibold px-2.5 py-1 rounded-full">
              ✓ Live prices via Duffel
            </span>
          )}
          {personalized && (
            <span className="inline-flex items-center gap-1 bg-[#d4e9e2] text-[#006241] text-xs font-semibold px-2.5 py-1 rounded-full">
              ✦ Personalized
            </span>
          )}
          {vibeSet.size > 0 && (
            <>
              <span className="text-xs text-[rgba(0,0,0,0.35)] self-center">Vibes:</span>
              {[...vibeSet].map(v => (
                <span
                  key={v}
                  className="inline-flex items-center gap-1 bg-[#f2f0eb] text-[rgba(0,0,0,0.65)] text-xs font-medium px-2.5 py-1 rounded-full capitalize"
                >
                  {v}
                </span>
              ))}
            </>
          )}
        </div>
      </div>

      {/* ── Sticky filter bar ── */}
      <div className="sticky top-0 z-20 bg-[#f9f8f5]/96 backdrop-blur-md border-b border-[#ebe9e3] -mx-7 px-7 pt-3 pb-2.5 mb-6">
        {/* Region tabs */}
        <div className="flex gap-2 mb-2.5 overflow-x-auto scrollbar-hide">
          {REGIONS.map(r => {
            const count = regionCount(r);
            if (count === 0 && r !== "All") return null;
            return (
              <button
                key={r}
                onClick={() => { setActiveRegion(r); setActiveTag("All"); }}
                className={`flex-shrink-0 px-3.5 py-1 rounded-full text-sm font-medium border transition-all ${
                  activeRegion === r
                    ? "bg-[#1E3932] text-white border-[#1E3932]"
                    : "bg-white text-[rgba(0,0,0,0.55)] border-[#e0ded8] hover:border-[#1E3932] hover:text-[rgba(0,0,0,0.87)]"
                }`}
              >
                {r}
                {r !== "All" && <span className="ml-1 text-xs opacity-60">{count}</span>}
              </button>
            );
          })}
        </div>

        {/* Tag filters + sort + view toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Tag chips — vibe-matching ones are highlighted */}
          <div className="flex flex-wrap gap-1.5">
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
                  className={`px-3 py-1 rounded-full text-sm border transition-all ${
                    isActive
                      ? "bg-[#00754A] text-white border-[#00754A]"
                      : isVibe
                      ? "bg-[#edf7f2] text-[#006241] border-[#a8d5be] hover:border-[#00754A] font-medium"
                      : "bg-white text-[rgba(0,0,0,0.55)] border-[#e0ded8] hover:border-[#00754A] hover:text-[rgba(0,0,0,0.87)]"
                  }`}
                >
                  {isVibe && !isActive && <span className="mr-0.5 text-[10px]">✦</span>}
                  {tag}
                  {tag !== "All" && <span className="ml-1 text-xs opacity-55">{count}</span>}
                </button>
              );
            })}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="text-xs border border-[#e0ded8] rounded-full px-3 py-1.5 bg-white text-[rgba(0,0,0,0.58)] focus:outline-none focus:border-[#00754A] cursor-pointer"
            >
              <option value="value">Best match</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>

            {/* List / Map toggle */}
            <div className="flex items-center bg-white border border-[#e0ded8] rounded-xl p-1 gap-1">
              <button
                onClick={() => setView("list")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  view === "list" ? "bg-[#00754A] text-white" : "text-[rgba(0,0,0,0.55)] hover:text-[rgba(0,0,0,0.87)]"
                }`}
              >
                ≡ List
              </button>
              <button
                onClick={() => setView("map")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  view === "map" ? "bg-[#00754A] text-white" : "text-[rgba(0,0,0,0.55)] hover:text-[rgba(0,0,0,0.87)]"
                }`}
              >
                🗺 Map
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Map view ── */}
      {view === "map" && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-4 mb-3 text-xs text-[rgba(0,0,0,0.52)]">
            {[
              { color: "#005c38", label: "Great value" },
              { color: "#006241", label: "Within budget" },
              { color: "#b59a4a", label: "Slight stretch" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                {label}
              </div>
            ))}
          </div>
          <div className="w-full h-[420px] sm:h-[500px] rounded-2xl overflow-hidden border border-[#e7e7e7] shadow-sm">
            <Suspense fallback={
              <div className="w-full h-full bg-white flex items-center justify-center">
                <div className="text-[rgba(0,0,0,0.38)] text-sm animate-pulse">Loading map…</div>
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
            <div className="mt-4">
              <DestinationCard trip={selectedTrip} {...cardProps} />
            </div>
          )}
        </div>
      )}

      {/* ── List view ── */}
      {view === "list" && (() => {
        // Mirror the three map categories exactly
        const sections = [
          {
            key: "great",
            color: "#005c38",
            bg: "#c3e6d5",
            label: "Great value",
            sub: "≥20% under budget",
            trips: applySort(filteredTrips.filter(t => t.budgetMatch === "great")),
          },
          {
            key: "perfect",
            color: "#006241",
            bg: "#d4e9e2",
            label: "Within budget",
            sub: "within your budget",
            trips: applySort(filteredTrips.filter(t => t.budgetMatch === "perfect")),
          },
          {
            key: "stretch",
            color: "#7a5c00",
            bg: "#f6ebd4",
            label: "Slight stretch",
            sub: "up to 20% over budget",
            trips: applySort(filteredTrips.filter(t => t.budgetMatch === "stretch")),
          },
        ].filter(s => s.trips.length > 0);

        if (sections.length === 0) {
          return (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#e7e7e7]">
              <div className="text-4xl mb-3">🔍</div>
              <h2 className="text-xl font-bold text-[rgba(0,0,0,0.87)] mb-2">No trips found</h2>
              <p className="text-[rgba(0,0,0,0.52)] text-sm mb-4">
                Try a different filter or increase your budget.
              </p>
              <button
                onClick={() => { setActiveTag("All"); setActiveRegion("All"); }}
                className="text-sm text-[#00754A] underline"
              >
                Clear filters
              </button>
            </div>
          );
        }

        return (
          <>
            {sections.map((section, idx) => (
              <div key={section.key} className={idx > 0 ? "mt-12" : ""}>
                {/* Section header — matches map legend */}
                <div className="flex items-center gap-2.5 mb-5">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0 ring-2 ring-white"
                    style={{ backgroundColor: section.color }}
                  />
                  <span
                    className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                    style={{ color: section.color, backgroundColor: section.bg }}
                  >
                    {section.label}
                  </span>
                  <span className="text-xs text-[rgba(0,0,0,0.35)]">
                    {section.sub} · {section.trips.length} destination{section.trips.length !== 1 ? "s" : ""}
                  </span>
                  <div className="flex-1 border-t border-[#ebe9e3]" />
                </div>

                {/* Cards grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {section.trips.map(trip => (
                    <DestinationCard key={trip.id} trip={trip} {...cardProps} />
                  ))}
                </div>
              </div>
            ))}
          </>
        );
      })()}

      {/* ── Price alert / waitlist ── */}
      {filteredTrips.length > 0 && (
        <div className="mt-14 bg-[#1E3932] rounded-2xl p-8 text-center">
          <div className="font-mono text-xs text-[#d4e9e2] uppercase tracking-widest mb-2">
            Coming soon
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Get notified when prices drop
          </h3>
          <p className="text-sm text-[rgba(255,255,255,0.65)] mb-5 max-w-sm mx-auto">
            Set a price alert and we&apos;ll email you when any of these trips hits your sweet spot.
          </p>
          {alertSent ? (
            <div className="text-sm font-semibold text-[#d4e9e2]">
              ✓ You&apos;re on the list! We&apos;ll email you when prices drop.
            </div>
          ) : (
            <form onSubmit={handleAlertSubmit} className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                value={alertEmail}
                onChange={e => setAlertEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#d4e9e2]"
              />
              <button
                type="submit"
                className="bg-[#00754A] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#006241] active:scale-95 transition-all"
              >
                Alert me
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
