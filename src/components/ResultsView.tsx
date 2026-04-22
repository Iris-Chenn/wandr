"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import type { TripEstimate } from "@/lib/ranking";
import DestinationCard from "./DestinationCard";
import PreferenceQuiz, { type Preferences } from "./PreferenceQuiz";

const WorldMap = lazy(() => import("./WorldMap"));

const ALL_TAGS = ["All", "Beach", "City", "Nature", "Culture", "Adventure", "Food"];

// Client-side re-ranking based on preferences
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
  const [activeTag, setActiveTag] = useState("All");
  const [selectedTrip, setSelectedTrip] = useState<TripEstimate | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [rankedTrips, setRankedTrips] = useState(trips);
  const [personalized, setPersonalized] = useState(false);

  // Check for saved preferences on mount
  useEffect(() => {
    const saved = localStorage.getItem("wandr_prefs");
    if (saved) {
      const prefs = JSON.parse(saved) as Preferences;
      setPreferences(prefs);
      setRankedTrips(applyPreferences(trips, prefs));
      setPersonalized(true);
    } else {
      // Show quiz after 1.5s on first visit
      const timer = setTimeout(() => setShowQuiz(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [trips]);

  // Filter by tag
  const filteredTrips = activeTag === "All"
    ? rankedTrips
    : rankedTrips.filter((t) =>
        t.tags.some((tag) => tag.toLowerCase() === activeTag.toLowerCase())
      );

  const handleQuizComplete = (prefs: Preferences) => {
    setPreferences(prefs);
    setRankedTrips(applyPreferences(trips, prefs));
    setPersonalized(true);
    setShowQuiz(false);
  };

  const departDisplay = new Date(departDate + "T12:00:00").toLocaleDateString("en-US", {
    month: "short", day: "numeric",
  });

  return (
    <div>
      {/* Preference quiz overlay */}
      {showQuiz && (
        <PreferenceQuiz
          onComplete={handleQuizComplete}
          onSkip={() => setShowQuiz(false)}
        />
      )}

      {/* Header */}
      <div className="py-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-1">
          {filteredTrips.length} trips for{" "}
          <span className="text-[#D4612A]">${budget.toLocaleString()}</span>
        </h1>
        <p className="text-[#5A5A5A] text-sm">
          Flying from {origin} · {tripLengthLabel}
          {month !== "flexible" && ` · ${month}`}
          {" · "}
          <span className="text-[#8A8A8A]">Departing {departDisplay}</span>
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {hasDuffelPrices && (
            <div className="inline-flex items-center gap-1.5 bg-[#D0ECE7] text-[#1A7A6D] text-xs font-medium px-3 py-1 rounded-full">
              ✓ Live prices via Duffel
            </div>
          )}
          {personalized && preferences && (
            <div className="inline-flex items-center gap-1.5 bg-[#F0D4C0] text-[#A84A1E] text-xs font-medium px-3 py-1 rounded-full">
              ✨ Personalized for you ·{" "}
              <button
                onClick={() => setShowQuiz(true)}
                className="underline"
              >
                edit
              </button>
            </div>
          )}
          {!personalized && !showQuiz && (
            <button
              onClick={() => setShowQuiz(true)}
              className="inline-flex items-center gap-1.5 bg-[#E8DFF5] text-[#6B4FA0] text-xs font-medium px-3 py-1 rounded-full hover:bg-[#D8CFF0] transition-colors"
            >
              ✦ Personalize results
            </button>
          )}
        </div>
      </div>

      {/* Filters + view toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map((tag) => (
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
                <span className="ml-1 text-xs opacity-60">
                  {rankedTrips.filter((t) =>
                    t.tags.some((tg) => tg.toLowerCase() === tag.toLowerCase())
                  ).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Map / List toggle */}
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
          <div className="flex flex-wrap gap-4 mb-5 text-xs text-[#8A8A8A]">
            {[
              { color: "#D4612A", label: "Flight" },
              { color: "#1A7A6D", label: "Hotel" },
              { color: "#6B4FA0", label: "Food" },
              { color: "#E0D8C8", label: "Activities" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                {label}
              </div>
            ))}
          </div>

          {filteredTrips.length === 0 ? (
            <div className="text-center py-16 bg-[#FFFCF7] rounded-2xl border border-[#E0D8C8]">
              <div className="text-4xl mb-3">🔍</div>
              <h2 className="font-serif text-xl font-bold text-[#1A1A1A] mb-2">
                No {activeTag.toLowerCase()} trips found
              </h2>
              <p className="text-[#5A5A5A] text-sm mb-4">
                Try a different category or increase your budget.
              </p>
              <button
                onClick={() => setActiveTag("All")}
                className="text-sm text-[#D4612A] underline"
              >
                Show all trips
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

      {/* Upsell */}
      {filteredTrips.length > 0 && (
        <div className="mt-12 bg-[#E8DFF5] border border-[#6B4FA0]/20 rounded-2xl p-6 text-center">
          <div className="font-mono text-xs text-[#6B4FA0] uppercase tracking-widest mb-2">Coming soon</div>
          <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-2">
            Get notified when prices drop
          </h3>
          <p className="text-sm text-[#5A5A5A] mb-4">
            Set a price alert and we'll email you when any of these trips hits your sweet spot.
          </p>
          <div className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-white border border-[#6B4FA0]/30 rounded-lg px-3 py-2 text-sm focus:outline-none"
            />
            <button className="bg-[#6B4FA0] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#5a3f88] transition-colors">
              Alert me
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
