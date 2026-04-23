"use client";

import { useState } from "react";

type Props = {
  flightCost: number;
  hotelCost: number;
  foodCost: number;
  activitiesCost: number;
  budget: number;
  nights: number;
};

export default function BudgetSliders({
  flightCost,
  hotelCost,
  foodCost,
  activitiesCost,
  budget,
  nights,
}: Props) {
  const [hotel, setHotel] = useState(hotelCost);
  const [food, setFood] = useState(foodCost);
  const [activities, setActivities] = useState(activitiesCost);

  const total = flightCost + hotel + food + activities;
  const savings = budget - total;

  const hotelNightly = Math.round(hotel / nights);
  const foodDaily = Math.round(food / nights);
  const activitiesDaily = Math.round(activities / nights);

  const flightPct = Math.round((flightCost / total) * 100);
  const hotelPct = Math.round((hotel / total) * 100);
  const foodPct = Math.round((food / total) * 100);
  const activitiesPct = 100 - flightPct - hotelPct - foodPct;

  const hotelMin = Math.round(hotelCost * 0.4);
  const hotelMax = Math.round(hotelCost * 2.5);
  const foodMin = Math.round(foodCost * 0.4);
  const foodMax = Math.round(foodCost * 2.2);
  const activitiesMin = Math.round(activitiesCost * 0.3);
  const activitiesMax = Math.round(activitiesCost * 3);

  const hotelLabel = hotelNightly <= 40
    ? "Hostel / budget room"
    : hotelNightly <= 80
    ? "Mid-range hotel"
    : hotelNightly <= 150
    ? "Comfortable hotel"
    : "4-star hotel";

  const foodLabel = foodDaily <= 20
    ? "Street food & markets"
    : foodDaily <= 40
    ? "Mix of local spots"
    : foodDaily <= 70
    ? "Restaurants + drinks"
    : "Fine dining";

  return (
    <div className="bg-white border border-[#e7e7e7] rounded-2xl p-6 card-shadow">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-[rgba(0,0,0,0.87)]">Customize your budget</h3>
        <div className="text-xs text-[rgba(0,0,0,0.38)]">Drag to adjust</div>
      </div>

      {/* Live total bar */}
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-5">
        <div className="bg-[#006241] transition-all duration-200" style={{ width: `${flightPct}%` }} />
        <div className="bg-[#00754A] transition-all duration-200" style={{ width: `${hotelPct}%` }} />
        <div className="bg-[#1E3932] transition-all duration-200" style={{ width: `${foodPct}%` }} />
        <div className="bg-[#d4e9e2] transition-all duration-200" style={{ width: `${activitiesPct}%` }} />
      </div>

      {/* Flight (fixed) */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#006241]" />
            <span className="text-sm text-[rgba(0,0,0,0.58)]">Flights (fixed)</span>
          </div>
          <span className="font-mono font-semibold text-[rgba(0,0,0,0.87)]">${flightCost.toLocaleString()}</span>
        </div>
        <div className="h-2 bg-[#f2f0eb] rounded-full overflow-hidden">
          <div className="h-full bg-[#006241]/30 rounded-full" style={{ width: "100%" }} />
        </div>
      </div>

      {/* Hotel slider */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00754A]" />
            <span className="text-sm text-[rgba(0,0,0,0.58)]">Hotel</span>
          </div>
          <div className="text-right">
            <span className="font-mono font-semibold text-[rgba(0,0,0,0.87)]">${hotel.toLocaleString()}</span>
            <span className="text-xs text-[rgba(0,0,0,0.38)] ml-1">(${hotelNightly}/night)</span>
          </div>
        </div>
        <div className="text-xs text-[rgba(0,0,0,0.38)] mb-2">{hotelLabel}</div>
        <input
          type="range"
          min={hotelMin}
          max={hotelMax}
          step={10}
          value={hotel}
          onChange={(e) => setHotel(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#00754A]"
          style={{ background: `linear-gradient(to right, #00754A ${((hotel - hotelMin) / (hotelMax - hotelMin)) * 100}%, #e7e7e7 0%)` }}
        />
        <div className="flex justify-between text-xs text-[rgba(0,0,0,0.38)] mt-1">
          <span>Hostel</span>
          <span>Luxury</span>
        </div>
      </div>

      {/* Food slider */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#1E3932]" />
            <span className="text-sm text-[rgba(0,0,0,0.58)]">Food & drinks</span>
          </div>
          <div className="text-right">
            <span className="font-mono font-semibold text-[rgba(0,0,0,0.87)]">${food.toLocaleString()}</span>
            <span className="text-xs text-[rgba(0,0,0,0.38)] ml-1">(${foodDaily}/day)</span>
          </div>
        </div>
        <div className="text-xs text-[rgba(0,0,0,0.38)] mb-2">{foodLabel}</div>
        <input
          type="range"
          min={foodMin}
          max={foodMax}
          step={5}
          value={food}
          onChange={(e) => setFood(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#1E3932]"
          style={{ background: `linear-gradient(to right, #1E3932 ${((food - foodMin) / (foodMax - foodMin)) * 100}%, #e7e7e7 0%)` }}
        />
        <div className="flex justify-between text-xs text-[rgba(0,0,0,0.38)] mt-1">
          <span>Street food</span>
          <span>Fine dining</span>
        </div>
      </div>

      {/* Activities slider */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#2b5148]" />
            <span className="text-sm text-[rgba(0,0,0,0.58)]">Activities & transport</span>
          </div>
          <div className="text-right">
            <span className="font-mono font-semibold text-[rgba(0,0,0,0.87)]">${activities.toLocaleString()}</span>
            <span className="text-xs text-[rgba(0,0,0,0.38)] ml-1">(${activitiesDaily}/day)</span>
          </div>
        </div>
        <input
          type="range"
          min={activitiesMin}
          max={activitiesMax}
          step={5}
          value={activities}
          onChange={(e) => setActivities(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#2b5148]"
          style={{ background: `linear-gradient(to right, #2b5148 ${((activities - activitiesMin) / (activitiesMax - activitiesMin)) * 100}%, #e7e7e7 0%)` }}
        />
        <div className="flex justify-between text-xs text-[rgba(0,0,0,0.38)] mt-1">
          <span>Self-guided</span>
          <span>Guided tours</span>
        </div>
      </div>

      {/* Live total */}
      <div className={`rounded-xl p-4 border ${savings >= 0 ? "bg-[#d4e9e2] border-[#006241]/20" : "bg-[#fee2e2] border-red-300/20"}`}>
        <div className="flex justify-between items-center">
          <span className={`text-sm font-semibold ${savings >= 0 ? "text-[#006241]" : "text-red-700"}`}>
            {savings >= 0
              ? `✓ $${savings.toLocaleString()} under your $${budget.toLocaleString()} budget`
              : `$${Math.abs(savings).toLocaleString()} over your $${budget.toLocaleString()} budget`}
          </span>
          <span className="font-mono font-bold text-xl text-[rgba(0,0,0,0.87)]">${total.toLocaleString()}</span>
        </div>
        <div className="text-xs text-[rgba(0,0,0,0.58)] mt-1">
          {savings >= 0
            ? "Your custom breakdown fits the budget."
            : "Try sliding hotel or activities down to fit."}
        </div>
      </div>
    </div>
  );
}
