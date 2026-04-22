"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";

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
  const { user } = useAuth();

  const [saved, setSaved] = useState(() => {
    if (typeof window === "undefined") return false;
    const savedTrips = JSON.parse(localStorage.getItem("wandr_saved") || "[]");
    return savedTrips.some((t: Trip) => t.id === trip.id);
  });
  const [copied, setCopied] = useState(false);

  const handleSave = async () => {
    if (saved) {
      // Remove
      const savedTrips: Trip[] = JSON.parse(localStorage.getItem("wandr_saved") || "[]");
      localStorage.setItem("wandr_saved", JSON.stringify(savedTrips.filter((t) => t.id !== trip.id)));
      if (user && supabase) {
        await supabase.from("saved_trips").delete().eq("user_id", user.id).eq("destination_id", trip.id);
      }
      setSaved(false);
    } else {
      // Save
      const savedTrips: Trip[] = JSON.parse(localStorage.getItem("wandr_saved") || "[]");
      savedTrips.push(trip);
      localStorage.setItem("wandr_saved", JSON.stringify(savedTrips));
      if (user && supabase) {
        await supabase.from("saved_trips").upsert({
          user_id: user.id,
          destination_id: trip.id,
          city: trip.city,
          country: trip.country,
          flag: trip.flag,
          total_cost: trip.totalCost,
          nights: trip.nights,
          budget: trip.budget,
          saved_at: new Date().toISOString(),
        });
      }
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

      {!user && saved && (
        <p className="text-[10px] text-[#8A8A8A] px-3">
          Sign in to sync your saved trips across devices.
        </p>
      )}

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
