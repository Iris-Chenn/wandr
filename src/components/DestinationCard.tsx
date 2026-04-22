"use client";

import Link from "next/link";
import type { TripEstimate } from "@/lib/ranking";

type Props = {
  trip: TripEstimate;
  budget: number;
  isLivePrice?: boolean;
  departDate?: string;
  returnDate?: string;
};

const BUDGET_MATCH_STYLES = {
  perfect: { label: "Within budget", color: "#1A7A6D", bg: "#D0ECE7" },
  great: { label: "Great value", color: "#D4612A", bg: "#F0D4C0" },
  stretch: { label: "Slight stretch", color: "#6B4FA0", bg: "#E8DFF5" },
};

export default function DestinationCard({ trip, budget, isLivePrice, departDate, returnDate }: Props) {
  const match = BUDGET_MATCH_STYLES[trip.budgetMatch];
  const flightPct = Math.round((trip.flightCost / trip.totalCost) * 100);
  const hotelPct = Math.round((trip.hotelCost / trip.totalCost) * 100);
  const foodPct = Math.round((trip.foodCost / trip.totalCost) * 100);
  const activitiesPct = 100 - flightPct - hotelPct - foodPct;
  const savings = budget - trip.totalCost;

  return (
    <Link
      href={`/destination/${trip.id}?budget=${budget}&origin=JFK&nights=${trip.nights}${departDate ? `&depart=${departDate}&return=${returnDate}` : ""}`}
      className="block bg-[#FFFCF7] border border-[#E0D8C8] rounded-2xl overflow-hidden hover:shadow-md hover:border-[#D4612A]/40 transition-all group"
    >
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{trip.flag}</span>
            <div>
              <div className="font-semibold text-[#1A1A1A] text-base leading-tight">{trip.city}</div>
              <div className="text-xs text-[#8A8A8A]">{trip.country}</div>
            </div>
          </div>
          <span
            className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full"
            style={{ color: match.color, backgroundColor: match.bg }}
          >
            {match.label}
          </span>
        </div>

        <p className="text-xs text-[#5A5A5A] leading-relaxed mb-3 line-clamp-2">{trip.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {trip.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-[#F5F0E8] text-[#5A5A5A] px-2 py-0.5 rounded-full capitalize"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Budget breakdown bar */}
        <div className="mb-3">
          <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
            <div className="bg-[#D4612A]" style={{ width: `${flightPct}%` }} title="Flight" />
            <div className="bg-[#1A7A6D]" style={{ width: `${hotelPct}%` }} title="Hotel" />
            <div className="bg-[#6B4FA0]" style={{ width: `${foodPct}%` }} title="Food" />
            <div className="bg-[#E0D8C8]" style={{ width: `${activitiesPct}%` }} title="Activities" />
          </div>
          <div className="flex justify-between text-xs text-[#8A8A8A] font-mono mt-1">
            <span>✈ ${trip.flightCost}</span>
            <span>🏨 ${trip.hotelCost}</span>
            <span>🍽 ${trip.foodCost}</span>
            <span>🎯 ${trip.activitiesCost}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-[#F5F0E8] border-t border-[#E0D8C8] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <div className="font-mono font-bold text-[#D4612A] text-lg">${trip.totalCost.toLocaleString()}</div>
            {isLivePrice && (
              <span className="text-[10px] bg-[#D0ECE7] text-[#1A7A6D] font-mono font-semibold px-1.5 py-0.5 rounded">LIVE</span>
            )}
          </div>
          <div className="text-xs text-[#8A8A8A]">{trip.nights} nights all-in</div>
        </div>
        {savings > 0 && (
          <div className="text-xs text-[#1A7A6D] font-semibold">${savings} under</div>
        )}
        <span className="text-[#D4612A] text-sm font-medium group-hover:translate-x-0.5 transition-transform">
          View details →
        </span>
      </div>
    </Link>
  );
}
