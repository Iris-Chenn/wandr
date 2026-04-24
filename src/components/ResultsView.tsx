"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import type { TripEstimate } from "@/lib/ranking";
import DestinationCard from "./DestinationCard";
import type { Preferences } from "./PreferenceQuiz";

const WorldMap = lazy(() => import("./WorldMap"));

const REGIONS = ["All", "Americas", "Europe", "Asia", "Africa"];
const ALL_TAGS = ["All", "Beach", "City", "Nature", "Culture", "Adventure", "Food"];

function applyPreferences(trips: TripEstimate[], prefs: Preferences): TripEstimate[] {
  return [...trips].sort((a, b) => {
    let scoreA = a.valueScore;
    let scoreB = b.valueScore;

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
  const [selectedTrip, setSelectedTrip] = useState<TripEstimate | null>(null);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [rankedTrips, setRankedTrips] = useState(trips);
  const [personalized, setPersonalized] = useState(false);
  const [alertEmail, setAlertEmail] = useState("");
  const [alertSent, setAlertSent] = useState(false);

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
    : rankedTrips.filter((t) => t.region === activeRegion);

  const filteredTrips = activeTag === "All"
    ? regionFiltered
    : regionFiltered.filter((t) =>
        t.tags.some((tag) => tag.toLowerCase() === activeTag.toLowerCase())
      );

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
    r === "All" ? rankedTrips.length : rankedTrips.filter((t) => t.region === r).length;

  return (
    <div>
      {/* Header */}
      <div className="py-8 border-b border-[#e7e7e7] mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="font-mono text-xs text-[rgba(0,0,0,0.38)] uppercase tracking-widest mb-1">
              {origin} · {tripLengthLabel} · Departing {departDisplay}
              {party > 1 && ` · ${party} travelers`}
              {month !== "flexible" && ` · ${month.replace(/-\d{4}$/, "")}`}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[rgba(0,0,0,0.87)]">
              {filteredTrips.filter(t => t.totalCost <= budget).length} trips within{" "}
              <span className="text-[#006241]">${budget.toLocaleString()}</span>
            </h1>
            <div className="text-sm text-[rgba(0,0,0,0.58)] mt-1">
              {party === 1
                ? `Budget is per person · all-in (flights + hotel + food + activities)`
                : `$${budget.toLocaleString()}/person · $${(budget * party).toLocaleString()} total for ${party} travelers · hotel costs split`}
            </div>
            {filteredTrips.filter(t => t.totalCost > budget).length > 0 && (
              <div className="text-xs text-[rgba(0,0,0,0.38)] mt-1">
                +{filteredTrips.filter(t => t.totalCost > budget).length} trips slightly over budget also shown below
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {hasDuffelPrices && (
              <div className="inline-flex items-center gap-1.5 bg-[#d4e9e2] text-[#006241] text-xs font-medium px-3 py-1.5 rounded-full">
                ✓ Live prices via Duffel
              </div>
            )}
            {personalized && (
              <div className="inline-flex items-center gap-1.5 bg-[#d4e9e2] text-[#006241] text-xs font-medium px-3 py-1.5 rounded-full">
                ✦ Personalized
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Region tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        {REGIONS.map((r) => {
          const count = regionCount(r);
          if (count === 0 && r !== "All") return null;
          return (
            <button
              key={r}
              onClick={() => { setActiveRegion(r); setActiveTag("All"); }}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeRegion === r
                  ? "bg-[#1E3932] text-white border-[#1E3932]"
                  : "bg-white text-[rgba(0,0,0,0.58)] border-[#e7e7e7] hover:border-[#1E3932]"
              }`}
            >
              {r}
              {r !== "All" && <span className="ml-1.5 text-xs opacity-60">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Style filters + view toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map((tag) => {
            const count = regionFiltered.filter((t) =>
              t.tags.some((tg) => tg.toLowerCase() === tag.toLowerCase())
            ).length;
            if (count === 0 && tag !== "All") return null;
            return (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  activeTag === tag
                    ? "bg-[#00754A] text-white border-[#00754A]"
                    : "bg-white text-[rgba(0,0,0,0.58)] border-[#e7e7e7] hover:border-[#00754A]"
                }`}
              >
                {tag}
                {tag !== "All" && (
                  <span className="ml-1 text-xs opacity-60">{count}</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center bg-white border border-[#e7e7e7] rounded-xl p-1 gap-1 flex-shrink-0">
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              view === "list" ? "bg-[#00754A] text-white" : "text-[rgba(0,0,0,0.58)] hover:text-[rgba(0,0,0,0.87)]"
            }`}
          >
            ≡ List
          </button>
          <button
            onClick={() => setView("map")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              view === "map" ? "bg-[#00754A] text-white" : "text-[rgba(0,0,0,0.58)] hover:text-[rgba(0,0,0,0.87)]"
            }`}
          >
            🗺 Map
          </button>
        </div>
      </div>

      {/* Map view */}
      {view === "map" && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-4 mb-3 text-xs text-[rgba(0,0,0,0.58)]">
            {[
              { color: "#006241", label: "Within budget" },
              { color: "#00754A", label: "Great value" },
              { color: "#2b5148", label: "Slight stretch" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
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
              <DestinationCard
                trip={selectedTrip}
                budget={budget}
                isLivePrice={hasDuffelPrices}
                departDate={departDate}
                returnDate={returnDate}
                party={party}
                originCode={originCode}
                tripLength={tripLength}
                vibes={vibes}
              />
            </div>
          )}
        </div>
      )}

      {/* List view */}
      {view === "list" && (() => {
        const withinBudget = filteredTrips.filter(t => t.totalCost <= budget);
        const overBudget   = filteredTrips.filter(t => t.totalCost >  budget);
        const cardProps = { budget, isLivePrice: hasDuffelPrices, departDate, returnDate, party, originCode, tripLength, vibes };

        if (filteredTrips.length === 0) {
          return (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#e7e7e7]">
              <div className="text-4xl mb-3">🔍</div>
              <h2 className="text-xl font-bold text-[rgba(0,0,0,0.87)] mb-2">No trips found</h2>
              <p className="text-[rgba(0,0,0,0.58)] text-sm mb-4">Try a different filter or increase your budget.</p>
              <button onClick={() => { setActiveTag("All"); setActiveRegion("All"); }} className="text-sm text-[#00754A] underline">
                Clear filters
              </button>
            </div>
          );
        }

        return (
          <>
            {/* Within-budget trips */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {withinBudget.map((trip) => (
                <DestinationCard key={trip.id} trip={trip} {...cardProps} />
              ))}
            </div>

            {/* Over-budget trips — with divider */}
            {overBudget.length > 0 && (
              <>
                <div className="flex items-center gap-3 mt-10 mb-5">
                  <div className="flex-1 border-t border-dashed border-[#e7e7e7]" />
                  <span className="text-xs font-mono text-[rgba(0,0,0,0.38)] uppercase tracking-widest whitespace-nowrap px-2">
                    Slight stretch · up to 20% over your budget
                  </span>
                  <div className="flex-1 border-t border-dashed border-[#e7e7e7]" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {overBudget.map((trip) => (
                    <DestinationCard key={trip.id} trip={trip} {...cardProps} />
                  ))}
                </div>
              </>
            )}
          </>
        );
      })()}

      {/* Price alert / waitlist — House Green band */}
      {filteredTrips.length > 0 && (
        <div className="mt-12 bg-[#1E3932] rounded-2xl p-6 text-center">
          <div className="font-mono text-xs text-[#d4e9e2] uppercase tracking-widest mb-2">Coming soon</div>
          <h3 className="text-xl font-bold text-white mb-2">
            Get notified when prices drop
          </h3>
          <p className="text-sm text-[rgba(255,255,255,0.70)] mb-4">
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
                onChange={(e) => setAlertEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 bg-white/10 border border-white/20 rounded-full px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#d4e9e2]"
              />
              <button
                type="submit"
                className="bg-[#00754A] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#006241] active:scale-95 transition-all"
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
