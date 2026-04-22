"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import type { TripEstimate } from "@/lib/ranking";
import DestinationCard from "./DestinationCard";
import PreferenceQuiz, { type Preferences } from "./PreferenceQuiz";

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
  tripLengthLabel: string;
  month: string;
};

export default function ResultsView({
  trips,
  budget,
  hasDuffelPrices,
  departDate,
  returnDate,
  origin,
  tripLengthLabel,
  month,
}: Props) {
  const [view, setView] = useState<"list" | "map">("list");
  const [activeRegion, setActiveRegion] = useState("All");
  const [activeTag, setActiveTag] = useState("All");
  const [selectedTrip, setSelectedTrip] = useState<TripEstimate | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
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
    } else {
      const timer = setTimeout(() => setShowQuiz(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [trips]);

  // Region → tag double filter
  const regionFiltered = activeRegion === "All"
    ? rankedTrips
    : rankedTrips.filter((t) => t.region === activeRegion);

  const filteredTrips = activeTag === "All"
    ? regionFiltered
    : regionFiltered.filter((t) =>
        t.tags.some((tag) => tag.toLowerCase() === activeTag.toLowerCase())
      );

  const handleQuizComplete = (prefs: Preferences) => {
    setPreferences(prefs);
    setRankedTrips(applyPreferences(trips, prefs));
    setPersonalized(true);
    setShowQuiz(false);
  };

  const handleAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertEmail) return;
    // Send to Formspree via waitlist endpoint
    await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: alertEmail, note: `Price alert — budget $${budget}` }),
    });
    // localStorage backup
    const alerts = JSON.parse(localStorage.getItem("wandr_alerts") || "[]");
    alerts.push({ email: alertEmail, budget, savedAt: new Date().toISOString() });
    localStorage.setItem("wandr_alerts", JSON.stringify(alerts));
    setAlertSent(true);
  };

  const departDisplay = new Date(departDate + "T12:00:00").toLocaleDateString("en-US", {
    month: "short", day: "numeric",
  });

  // Region counts (from all ranked trips, not double-filtered)
  const regionCount = (r: string) =>
    r === "All" ? rankedTrips.length : rankedTrips.filter((t) => t.region === r).length;

  return (
    <div>
      {showQuiz && (
        <PreferenceQuiz
          onComplete={handleQuizComplete}
          onSkip={() => setShowQuiz(false)}
        />
      )}

      {/* Header */}
      <div className="py-8 border-b border-[#E0D8C8] mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="font-mono text-xs text-[#8A8A8A] uppercase tracking-widest mb-1">
              {origin} · {tripLengthLabel}{month !== "flexible" && ` · ${month}`} · Departing {departDisplay}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0A0A0A]">
              {filteredTrips.length} trips for{" "}
              <span className="text-[#D4612A]">${budget.toLocaleString()}</span>
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {hasDuffelPrices && (
              <div className="inline-flex items-center gap-1.5 bg-[#D0ECE7] text-[#1A7A6D] text-xs font-medium px-3 py-1.5 rounded-full">
                ✓ Live prices via Duffel
              </div>
            )}
            {personalized && preferences ? (
              <div className="inline-flex items-center gap-1.5 bg-[#FEE9DC] text-[#A84A1E] text-xs font-medium px-3 py-1.5 rounded-full">
                Personalized ·{" "}
                <button onClick={() => setShowQuiz(true)} className="underline">edit</button>
              </div>
            ) : !showQuiz && (
              <button
                onClick={() => setShowQuiz(true)}
                className="inline-flex items-center gap-1.5 bg-[#EDE9F8] text-[#6B4FA0] text-xs font-medium px-3 py-1.5 rounded-full hover:bg-[#D8CFF0] transition-colors"
              >
                ✦ Personalize
              </button>
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
                  ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                  : "bg-[#FFFCF7] text-[#5A5A5A] border-[#E0D8C8] hover:border-[#1A1A1A]"
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
                    ? "bg-[#D4612A] text-white border-[#D4612A]"
                    : "bg-[#FFFCF7] text-[#5A5A5A] border-[#E0D8C8] hover:border-[#D4612A]"
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

        <div className="flex items-center bg-[#FFFCF7] border border-[#E0D8C8] rounded-xl p-1 gap-1 flex-shrink-0">
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              view === "list" ? "bg-[#D4612A] text-white" : "text-[#5A5A5A] hover:text-[#1A1A1A]"
            }`}
          >
            ≡ List
          </button>
          <button
            onClick={() => setView("map")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              view === "map" ? "bg-[#D4612A] text-white" : "text-[#5A5A5A] hover:text-[#1A1A1A]"
            }`}
          >
            🗺 Map
          </button>
        </div>
      </div>

      {/* Map view */}
      {view === "map" && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-4 mb-3 text-xs text-[#8A8A8A]">
            {[
              { color: "#1A7A6D", label: "Within budget" },
              { color: "#D4612A", label: "Great value" },
              { color: "#6B4FA0", label: "Slight stretch" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                {label}
              </div>
            ))}
          </div>
          <div className="w-full h-[420px] sm:h-[500px] rounded-2xl overflow-hidden border border-[#E0D8C8] shadow-sm">
            <Suspense fallback={
              <div className="w-full h-full bg-[#FFFCF7] flex items-center justify-center">
                <div className="text-[#8A8A8A] text-sm animate-pulse">Loading map…</div>
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
              />
            </div>
          )}
        </div>
      )}

      {/* List view */}
      {view === "list" && (
        <>
          {filteredTrips.length === 0 ? (
            <div className="text-center py-16 bg-[#FFFCF7] rounded-2xl border border-[#E0D8C8]">
              <div className="text-4xl mb-3">🔍</div>
              <h2 className="font-serif text-xl font-bold text-[#1A1A1A] mb-2">
                No trips found
              </h2>
              <p className="text-[#5A5A5A] text-sm mb-4">
                Try a different filter or increase your budget.
              </p>
              <button
                onClick={() => { setActiveTag("All"); setActiveRegion("All"); }}
                className="text-sm text-[#D4612A] underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTrips.map((trip) => (
                <DestinationCard
                  key={trip.id}
                  trip={trip}
                  budget={budget}
                  isLivePrice={hasDuffelPrices}
                  departDate={departDate}
                  returnDate={returnDate}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Price alert / waitlist */}
      {filteredTrips.length > 0 && (
        <div className="mt-12 bg-[#E8DFF5] border border-[#6B4FA0]/20 rounded-2xl p-6 text-center">
          <div className="font-mono text-xs text-[#6B4FA0] uppercase tracking-widest mb-2">Coming soon</div>
          <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-2">
            Get notified when prices drop
          </h3>
          <p className="text-sm text-[#5A5A5A] mb-4">
            Set a price alert and we&apos;ll email you when any of these trips hits your sweet spot.
          </p>
          {alertSent ? (
            <div className="text-sm font-semibold text-[#6B4FA0]">
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
                className="flex-1 bg-white border border-[#6B4FA0]/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6B4FA0]"
              />
              <button
                type="submit"
                className="bg-[#6B4FA0] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#5a3f88] transition-colors"
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
