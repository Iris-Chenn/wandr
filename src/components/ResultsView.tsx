"use client";

import { useState, lazy, Suspense } from "react";
import type { TripEstimate } from "@/lib/ranking";
import DestinationCard from "./DestinationCard";

const WorldMap = lazy(() => import("./WorldMap"));

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
  const [selectedTrip, setSelectedTrip] = useState<TripEstimate | null>(null);

  const departDisplay = new Date(departDate + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div>
      {/* Header */}
      <div className="py-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-1">
          {trips.length} trips for <span className="text-[#D4612A]">${budget.toLocaleString()}</span>
        </h1>
        <p className="text-[#5A5A5A] text-sm">
          Flying from {origin} · {tripLengthLabel}
          {month !== "flexible" && ` · ${month}`}
          {" · "}
          <span className="text-[#8A8A8A]">Departing {departDisplay}</span>
        </p>
        {hasDuffelPrices && (
          <div className="inline-flex items-center gap-1.5 mt-2 bg-[#D0ECE7] text-[#1A7A6D] text-xs font-medium px-3 py-1 rounded-full">
            <span>✓</span> Live flight prices via Duffel
          </div>
        )}
      </div>

      {/* View toggle + filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          {["All", "Beach", "City", "Nature", "Culture", "Adventure", "Food"].map((tag) => (
            <button
              key={tag}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                tag === "All"
                  ? "bg-[#D4612A] text-white border-[#D4612A]"
                  : "bg-[#FFFCF7] text-[#5A5A5A] border-[#E0D8C8] hover:border-[#D4612A]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Map / List toggle */}
        <div className="flex items-center bg-[#FFFCF7] border border-[#E0D8C8] rounded-xl p-1 gap-1 flex-shrink-0">
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              view === "list"
                ? "bg-[#D4612A] text-white"
                : "text-[#5A5A5A] hover:text-[#1A1A1A]"
            }`}
          >
            <span>≡</span> List
          </button>
          <button
            onClick={() => setView("map")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              view === "map"
                ? "bg-[#D4612A] text-white"
                : "text-[#5A5A5A] hover:text-[#1A1A1A]"
            }`}
          >
            <span>🗺</span> Map
          </button>
        </div>
      </div>

      {/* Map view */}
      {view === "map" && (
        <div className="mb-6">
          {/* Legend */}
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
                trips={trips}
                budget={budget}
                onSelect={setSelectedTrip}
                selectedId={selectedTrip?.id}
              />
            </Suspense>
          </div>

          {/* Selected destination mini-card below map */}
          {selectedTrip && (
            <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
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
          {/* Legend */}
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

          {trips.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">😅</div>
              <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-2">No trips found</h2>
              <p className="text-[#5A5A5A] mb-6">Try increasing your budget or adjusting your trip length.</p>
              <a
                href="/"
                className="bg-[#D4612A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#A84A1E] transition-colors inline-block"
              >
                Adjust my budget
              </a>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {trips.map((trip) => (
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

      {/* Upsell strip */}
      {trips.length > 0 && (
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
