"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const POPULAR_ORIGINS = [
  { code: "JFK", label: "New York (JFK)" },
  { code: "LAX", label: "Los Angeles (LAX)" },
  { code: "ORD", label: "Chicago (ORD)" },
  { code: "YYZ", label: "Toronto (YYZ)" },
  { code: "LHR", label: "London (LHR)" },
  { code: "SFO", label: "San Francisco (SFO)" },
  { code: "MIA", label: "Miami (MIA)" },
  { code: "BOS", label: "Boston (BOS)" },
  { code: "SEA", label: "Seattle (SEA)" },
  { code: "ATL", label: "Atlanta (ATL)" },
];

const TRIP_LENGTHS = [
  { value: "3-4", label: "3–4 days" },
  { value: "5-7", label: "5–7 days" },
  { value: "8-10", label: "8–10 days" },
  { value: "11-14", label: "11–14 days" },
];

export default function BudgetInput() {
  const router = useRouter();
  const [budget, setBudget] = useState(700);
  const [origin, setOrigin] = useState("JFK");
  const [tripLength, setTripLength] = useState("5-7");
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const handleSearch = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      budget: budget.toString(),
      origin,
      tripLength,
      month: month || "flexible",
    });
    router.push(`/results?${params.toString()}`);
  };

  return (
    <div className="bg-[#FFFCF7] border border-[#E0D8C8] rounded-2xl p-6 sm:p-8 shadow-sm w-full max-w-xl">
      {/* Budget slider */}
      <div className="mb-6">
        <div className="flex items-baseline justify-between mb-3">
          <label className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-widest font-mono">
            My budget
          </label>
          <span className="font-serif text-3xl font-bold text-[#D4612A]">
            ${budget.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min={200}
          max={5000}
          step={50}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full accent-[#D4612A] cursor-pointer"
        />
        <div className="flex justify-between text-xs text-[#8A8A8A] font-mono mt-1">
          <span>$200</span>
          <span>$5,000</span>
        </div>
      </div>

      {/* Origin */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-[#1A1A1A] uppercase tracking-widest font-mono mb-2">
          Flying from
        </label>
        <select
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="w-full bg-[#F5F0E8] border border-[#E0D8C8] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4612A]/30"
        >
          {POPULAR_ORIGINS.map((o) => (
            <option key={o.code} value={o.code}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Trip length */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-[#1A1A1A] uppercase tracking-widest font-mono mb-2">
          Trip length
        </label>
        <div className="grid grid-cols-4 gap-2">
          {TRIP_LENGTHS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTripLength(t.value)}
              className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all ${
                tripLength === t.value
                  ? "bg-[#D4612A] text-white border-[#D4612A]"
                  : "bg-[#F5F0E8] text-[#5A5A5A] border-[#E0D8C8] hover:border-[#D4612A]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Month (optional) */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#1A1A1A] uppercase tracking-widest font-mono mb-2">
          When <span className="text-[#8A8A8A] normal-case font-normal tracking-normal">(optional)</span>
        </label>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full bg-[#F5F0E8] border border-[#E0D8C8] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4612A]/30"
        >
          <option value="">I'm flexible</option>
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* CTA */}
      <button
        onClick={handleSearch}
        disabled={loading}
        className="w-full bg-[#D4612A] hover:bg-[#A84A1E] text-white font-semibold py-4 rounded-xl transition-colors disabled:opacity-60 text-base"
      >
        {loading ? "Finding your trips..." : "Show me where I can go →"}
      </button>

      <p className="text-center text-xs text-[#8A8A8A] mt-3">
        No credit card needed · Free to use
      </p>
    </div>
  );
}
