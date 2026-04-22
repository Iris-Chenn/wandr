"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";

type SavedTrip = {
  id: string;
  city: string;
  country: string;
  flag: string;
  totalCost: number;
  nights: number;
  budget: number;
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [saved, setSaved] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (user && supabase) {
      // Pull from Supabase
      supabase
        .from("saved_trips")
        .select("*")
        .eq("user_id", user.id)
        .order("saved_at", { ascending: false })
        .then(({ data }) => {
          if (data) {
            setSaved(
              data.map((row) => ({
                id: row.destination_id,
                city: row.city,
                country: row.country,
                flag: row.flag,
                totalCost: row.total_cost,
                nights: row.nights,
                budget: row.budget,
              }))
            );
          }
          setLoading(false);
        });
    } else {
      // Fall back to localStorage (no Supabase keys, or not signed in)
      const trips = JSON.parse(localStorage.getItem("wandr_saved") || "[]");
      setSaved(trips);
      setLoading(false);
    }
  }, [user, authLoading]);

  const removeTrip = async (id: string) => {
    const updated = saved.filter((t) => t.id !== id);
    setSaved(updated);
    localStorage.setItem("wandr_saved", JSON.stringify(updated));
    if (user && supabase) {
      await supabase.from("saved_trips").delete().eq("user_id", user.id).eq("destination_id", id);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A] mb-1">Saved trips</h1>
          <p className="text-[#5A5A5A] text-sm">
            {loading
              ? "Loading…"
              : saved.length === 0
              ? "No trips saved yet."
              : `${saved.length} trip${saved.length !== 1 ? "s" : ""} saved`}
          </p>
        </div>

        {!user && !authLoading && (
          <div className="bg-[#E8DFF5] border border-[#6B4FA0]/20 rounded-xl p-4 mb-6 text-sm text-[#1A1A1A]">
            <strong className="text-[#6B4FA0]">Sign in</strong> to sync your saved trips across devices and never lose them.
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#FFFCF7] border border-[#E0D8C8] rounded-2xl p-5 animate-pulse h-20" />
            ))}
          </div>
        ) : saved.length === 0 ? (
          <div className="bg-[#FFFCF7] border border-[#E0D8C8] rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">🗺️</div>
            <h2 className="font-serif text-xl font-bold text-[#1A1A1A] mb-2">Start exploring</h2>
            <p className="text-[#5A5A5A] text-sm mb-6">
              Save trips from the results page and they&apos;ll appear here.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#D4612A] hover:bg-[#A84A1E] text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Search trips
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {saved.map((trip) => {
              const savings = trip.budget - trip.totalCost;
              return (
                <div
                  key={trip.id}
                  className="bg-[#FFFCF7] border border-[#E0D8C8] rounded-2xl p-5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className="text-3xl flex-shrink-0">{trip.flag}</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-[#1A1A1A]">{trip.city}</div>
                      <div className="text-xs text-[#8A8A8A]">
                        {trip.country} · {trip.nights} nights
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono font-bold text-[#D4612A]">
                          ${trip.totalCost.toLocaleString()}
                        </span>
                        {savings >= 0 ? (
                          <span className="text-xs text-[#1A7A6D]">${savings.toLocaleString()} under budget</span>
                        ) : (
                          <span className="text-xs text-[#A84A1E]">${Math.abs(savings).toLocaleString()} over budget</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href={`/destination/${trip.id}?budget=${trip.budget}&nights=${trip.nights}`}
                      className="text-sm text-[#D4612A] font-semibold hover:underline"
                    >
                      View →
                    </Link>
                    <button
                      onClick={() => removeTrip(trip.id)}
                      className="text-xs text-[#8A8A8A] hover:text-[#A84A1E] transition-colors ml-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="pt-4 text-center">
              <Link href="/" className="text-sm text-[#D4612A] hover:underline">
                + Search more trips
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
