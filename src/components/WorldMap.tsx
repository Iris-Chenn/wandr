"use client";

import { useEffect, useRef } from "react";
import type { TripEstimate } from "@/lib/ranking";

type Props = {
  trips: TripEstimate[];
  budget: number;
  onSelect: (trip: TripEstimate) => void;
  selectedId?: string;
};

// Match the legend shown in ResultsView exactly
const DOT_COLORS: Record<string, string> = {
  great:   "#005c38",   // dark green  — ≥20% under budget
  perfect: "#4a9e7f",   // mid green   — within budget
  stretch: "#b59a4a",   // amber       — up to 20% over budget
};

export default function WorldMap({ trips, budget, onSelect, selectedId }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<ReturnType<typeof import("leaflet")["map"]> | null>(null);

  useEffect(() => {
    if (!mapRef.current || leafletRef.current) return;

    // Dynamic import — Leaflet is browser-only
    import("leaflet").then((L) => {
      // Fix default icon paths broken by webpack
      // @ts-expect-error – _getIconUrl is not typed
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [20, 10],
        zoom: 2,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      // Clean light tile layer matching Wandr's sand palette
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        { maxZoom: 18 }
      ).addTo(map);

      L.control.attribution({ prefix: false }).addTo(map);

      leafletRef.current = map;

      // Add dots
      trips.forEach((trip) => {
        if (!trip.lat || !trip.lng) return;
        const color = DOT_COLORS[trip.budgetMatch];
        const isSelected = trip.id === selectedId;

        const marker = L.circleMarker([trip.lat, trip.lng], {
          radius: isSelected ? 12 : 9,
          fillColor: color,
          color: "#FFFCF7",
          weight: 2,
          opacity: 1,
          fillOpacity: isSelected ? 1 : 0.85,
        }).addTo(map);

        const savings = budget - trip.totalCost;
        const savingsHtml = savings >= 0
          ? `<span style="color:#1A7A6D;font-size:11px;">$${savings} under budget</span>`
          : `<span style="color:#D4612A;font-size:11px;">$${Math.abs(savings)} over budget</span>`;

        marker.bindPopup(`
          <div style="font-family:'DM Sans',sans-serif;min-width:180px;padding:4px 0;">
            <div style="font-size:22px;margin-bottom:4px;">${trip.flag}</div>
            <div style="font-weight:700;font-size:15px;color:#1A1A1A;">${trip.city}</div>
            <div style="font-size:12px;color:#8A8A8A;margin-bottom:8px;">${trip.country}</div>
            <div style="font-weight:700;font-size:18px;color:#D4612A;margin-bottom:2px;">$${trip.totalCost.toLocaleString()}</div>
            <div style="font-size:11px;color:#5A5A5A;margin-bottom:6px;">${trip.nights} nights all-in</div>
            ${savingsHtml}
            <a href="/destination/${trip.id}?budget=${budget}&nights=${trip.nights}"
               style="display:block;margin-top:10px;background:#D4612A;color:#fff;text-align:center;padding:7px 0;border-radius:8px;font-size:12px;font-weight:600;text-decoration:none;">
              View details →
            </a>
          </div>
        `, { maxWidth: 220, className: "wandr-popup" });

        marker.on("click", () => onSelect(trip));
      });
    });

    return () => {
      leafletRef.current?.remove();
      leafletRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update selected marker size when selection changes
  useEffect(() => {
    // Simple approach: full re-render on selection handled by parent
  }, [selectedId]);

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <style>{`
        .wandr-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          border: 1px solid #E0D8C8;
          box-shadow: 0 4px 20px rgba(0,0,0,0.12);
          padding: 0;
        }
        .wandr-popup .leaflet-popup-content {
          margin: 14px 16px;
        }
        .wandr-popup .leaflet-popup-tip {
          background: #FFFCF7;
        }
      `}</style>
      <div ref={mapRef} className="w-full h-full rounded-xl" />
    </>
  );
}
