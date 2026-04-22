"use client";

import { useState } from "react";

type Trip = {
  id: string;
  city: string;
  country: string;
  flag: string;
  totalCost: number;
  nights: number;
  budget: number;
};

export default function SaveShareButtons({ trip }: { trip: Trip }) {
  const [saved, setSaved] = useState(() => {
    if (typeof window === "undefined") return false;
    const savedTrips = JSON.parse(localStorage.getItem("wandr_saved") || "[]");
    return savedTrips.some((t: Trip) => t.id === trip.id);
  });
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    const savedTrips: Trip[] = JSON.parse(localStorage.getItem("wandr_saved") || "[]");
    if (saved) {
      const updated = savedTrips.filter((t) => t.id !== trip.id);
      localStorage.setItem("wandr_saved", JSON.stringify(updated));
      setSaved(false);
    } else {
      savedTrips.push(trip);
      localStorage.setItem("wandr_saved", JSON.stringify(savedTrips));
      setSaved(true);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const text = `${trip.flag} ${trip.city}, ${trip.country} — ${trip.nights} nights for $${trip.totalCost.toLocaleString()} via Wandr`;

    if (navigator.share) {
      await navigator.share({ title: `Wandr — ${trip.city}`, text, url });
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="border-t border-[#E0D8C8] pt-4 space-y-2">
      <button
        onClick={handleSave}
        className={`w-full text-left text-sm py-2 px-3 rounded-lg flex items-center gap-2 transition-colors ${
          saved
            ? "bg-[#D0ECE7] text-[#1A7A6D] font-medium"
            : "text-[#5A5A5A] hover:bg-[#F5F0E8] hover:text-[#1A1A1A]"
        }`}
      >
        <span>{saved ? "✓" : "💾"}</span>
        {saved ? "Saved to your trips" : "Save this trip"}
      </button>

      <button
        onClick={handleShare}
        className="w-full text-left text-sm text-[#5A5A5A] hover:bg-[#F5F0E8] hover:text-[#1A1A1A] transition-colors py-2 px-3 rounded-lg flex items-center gap-2"
      >
        <span>🔗</span>
        {copied ? "Link copied!" : "Share with friends"}
      </button>
    </div>
  );
}
