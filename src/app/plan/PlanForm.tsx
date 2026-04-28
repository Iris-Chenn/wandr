"use client";

import { useState, useEffect, useRef, useMemo, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { computeTripEstimates } from "@/lib/ranking";
import type { Split, LiveCosts } from "@/lib/ranking";
import PlanWorldMap, { type MapDestination } from "./PlanWorldMap";
import "./plan-page.css";

// ─── Constants ───────────────────────────────────────────
const TRIP_LENGTHS = [
  { label: "3-4",   display: "3–4",   nights: 4  },
  { label: "5-7",   display: "5–7",   nights: 6  },
  { label: "8-10",  display: "8–10",  nights: 9  },
  { label: "11-14", display: "11–14", nights: 12 },
];

const AIRPORTS = [
  { c: "JFK", n: "New York"      },
  { c: "LAX", n: "Los Angeles"   },
  { c: "ORD", n: "Chicago"       },
  { c: "SFO", n: "San Francisco" },
  { c: "LHR", n: "London"        },
  { c: "YYZ", n: "Toronto"       },
  { c: "SIN", n: "Singapore"     },
];

const MONTHS = ["Flexible", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
const MONTH_PARAMS: Record<string, string> = {
  Flexible: "flexible",
  May: "may-2026", Jun: "june-2026", Jul: "july-2026",
  Aug: "august-2026", Sep: "september-2026",
  Oct: "october-2026", Nov: "november-2026",
};

const VIBES = [
  { k: "city",      label: "City",      icon: "◉" },
  { k: "beach",     label: "Beach",     icon: "≈"  },
  { k: "nature",    label: "Nature",    icon: "▲"  },
  { k: "food",      label: "Food",      icon: "◍"  },
  { k: "culture",   label: "Culture",   icon: "❋"  },
  { k: "history",   label: "History",   icon: "🏛"  },
  { k: "adventure", label: "Adventure", icon: "✕"  },
  { k: "chill",     label: "Chill",     icon: "◐"  },
  { k: "nightlife", label: "Nightlife", icon: "✦"  },
];

const BUDGET_TICKS = [300, 1000, 2000, 3000, 4000, 5000];

const DEFAULT_SPLIT: Split = { flights: 0.42, hotel: 0.28, food: 0.18, activities: 0.12 };

function fmt(n: number) { return "$" + Math.round(n).toLocaleString(); }

// ─── BudgetBar ───────────────────────────────────────────
function BudgetBar({ split, onChange, budget }: { split: Split; onChange: (s: Split) => void; budget: number }) {
  const [dragging, setDragging] = useState<number | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const seg = [
    { k: "flights",    label: "Flights",    color: "#5DA89A", frac: split.flights    },
    { k: "hotel",      label: "Hotel",      color: "#C48A3A", frac: split.hotel      },
    { k: "food",       label: "Food",       color: "#B97A7A", frac: split.food       },
    { k: "activities", label: "Activities", color: "#8A8A8A", frac: split.activities },
  ];

  const onDown = (i: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(i);
  };

  useEffect(() => {
    if (dragging == null) return;
    const move = (e: MouseEvent) => {
      if (!barRef.current) return;
      const r = barRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(r.width, e.clientX - r.left));
      const pos = x / r.width;
      const cum: [number, number, number] = [
        seg[0].frac,
        seg[0].frac + seg[1].frac,
        seg[0].frac + seg[1].frac + seg[2].frac,
      ];
      const newCum = [...cum] as [number, number, number];
      newCum[dragging] = Math.max(
        dragging > 0 ? cum[dragging - 1] + 0.05 : 0.08,
        Math.min(dragging < 2 ? cum[dragging + 1] - 0.05 : 0.95, pos)
      );
      onChange({
        flights:    newCum[0],
        hotel:      newCum[1] - newCum[0],
        food:       newCum[2] - newCum[1],
        activities: 1 - newCum[2],
      });
    };
    const up = () => setDragging(null);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, [dragging, seg, onChange]);

  return (
    <div className="budbar-wrap">
      <div className="budbar" ref={barRef}>
        {seg.map((s) => (
          <div key={s.k} className="budbar-seg" style={{ flex: s.frac, background: s.color }}>
            <span className="budbar-lbl">
              <span className="budbar-pct">{Math.round(s.frac * 100)}%</span>
              <span className="budbar-name">{s.label}</span>
            </span>
          </div>
        ))}
        {[0, 1, 2].map((i) => {
          const left = seg.slice(0, i + 1).reduce((a, s) => a + s.frac, 0) * 100;
          return (
            <div
              key={i}
              className={`budbar-handle${dragging === i ? " dragging" : ""}`}
              style={{ left: `${left}%` }}
              onMouseDown={onDown(i)}
            >
              <div className="budbar-handle-grip" />
            </div>
          );
        })}
      </div>
      <div className="budbar-help">
        <span style={{ fontFamily: "var(--w-font-mono)", fontSize: 10, letterSpacing: "0.12em", color: "var(--w-ink-lightest)", textTransform: "uppercase" }}>
          Drag handles to reallocate
        </span>
      </div>
    </div>
  );
}

// ─── Main PlanForm ────────────────────────────────────────
export default function PlanForm() {
  const router = useRouter();
  const [tone, setTone] = useState<"cream" | "dark">("cream");
  const [budget, setBudget] = useState(1800);
  const [origin, setOrigin] = useState("JFK");
  const [tripIdx, setTripIdx] = useState(1); // default 5–7
  const [month, setMonth] = useState("Flexible");
  const [party, setParty] = useState(2);
  const [vibes, setVibes] = useState<Set<string>>(new Set(["culture", "food"]));
  const [split, setSplit] = useState<Split>(DEFAULT_SPLIT);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [liveCosts, setLiveCosts] = useState<LiveCosts>({});
  const [pricesLoading, setpricesLoading] = useState(false);
  const [, startTransition] = useTransition();
  const fetchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Fetch live costs (flights + seasonal hotel/food/activities) ──────────
  // Debounced 400 ms so rapid filter changes don't fire many requests.
  // Falls back to static estimates when the API is slow or unavailable.
  useEffect(() => {
    if (fetchTimer.current) clearTimeout(fetchTimer.current);

    fetchTimer.current = setTimeout(async () => {
      setpricesLoading(true);
      try {
        const params = new URLSearchParams({
          origin,
          tripLength: trip.label,
          month: MONTH_PARAMS[month] ?? "flexible",
        });
        const res = await fetch(`/api/plan-costs?${params.toString()}`);
        if (res.ok) {
          const data = await res.json() as {
            flights: Record<string, number>;
            hotels: Record<string, number>;
            foodPerDay: Record<string, number>;
            activitiesPerDay: Record<string, number>;
          };
          startTransition(() => setLiveCosts(data));
        }
      } catch {
        // Silently fall back to static estimates — no disruption to UX
      } finally {
        setpricesLoading(false);
      }
    }, 400);

    return () => { if (fetchTimer.current) clearTimeout(fetchTimer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin, tripIdx, month]);

  const toggleVibe = useCallback((k: string) => {
    setVibes(prev => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else if (next.size < 3) next.add(k);
      return next;
    });
  }, []);

  const trip = TRIP_LENGTHS[tripIdx];

  // All destinations scored — same unified algorithm as the Results page.
  // Unsorted and unfiltered so the map can show every destination with its tier.
  const results = useMemo(() =>
    computeTripEstimates(budget, origin, trip.label, liveCosts, [...vibes].join(","), party, split),
  [budget, trip, origin, party, vibes, liveCosts, split]);

  // Preview list: within-budget destinations sorted best-fit first
  const ranked = useMemo(() =>
    [...results]
      .filter(d => d.tier !== "over")
      .sort((a, b) => b.totalScore - a.totalScore),
  [results]);

  const counts = useMemo(() => ({
    perfect: results.filter(r => r.tier === "perfect").length,
    great:   results.filter(r => r.tier === "great").length,
    stretch: results.filter(r => r.tier === "stretch").length,
    over:    results.filter(r => r.tier === "over").length,
  }), [results]);

  const topMatch = ranked[0];

  // Map data: pass lat/lng + tier to the map
  const mapDests: MapDestination[] = useMemo(() => results.map(d => ({
    id: d.id, city: d.city, lat: d.lat, lng: d.lng,
    total: d.totalCost, tier: d.tier, popularityScore: d.popularityScore,
  })), [results]);

  const handleSubmit = () => {
    const vibesParam = [...vibes].map(k => k.charAt(0).toUpperCase() + k.slice(1)).join(",");
    const params = new URLSearchParams({
      budget: String(budget),
      origin,
      tripLength: trip.label,
      month: MONTH_PARAMS[month] ?? "flexible",
      vibes: vibesParam,
      party: String(party),
      // Encode split as integers (percentages) to keep URLs clean
      sFlights:    String(Math.round(split.flights    * 100)),
      sHotel:      String(Math.round(split.hotel      * 100)),
      sFood:       String(Math.round(split.food       * 100)),
      sActivities: String(Math.round(split.activities * 100)),
    });
    router.push(`/results?${params.toString()}`);
  };

  return (
    <div className={`plan-split plan-tone-${tone}`}>
      {/* ── Top bar ── */}
      <div className="ps-topbar">
        <div className="ps-crumb">
          <Link href="/" className="ps-mark">W</Link>
          <span className="ps-crumb-txt">Wandr</span>
          <span className="ps-crumb-sep">/</span>
          <span className="ps-crumb-here">Plan a trip</span>
        </div>
        <div className="ps-top-meta">
          <span className="ps-live">
            <span className="ps-dot" style={{ opacity: pricesLoading ? 0.35 : 1 }} />
            {pricesLoading
              ? "Fetching live prices…"
              : Object.keys(liveCosts.flights ?? {}).length > 0
              ? `Live · ${Object.keys(liveCosts.flights ?? {}).length} flights · seasonal hotel & ground`
              : "Live prices · flights + seasonal estimates"}
          </span>
          <span className="ps-sep">·</span>
          <span style={{ fontFamily: "var(--w-font-mono)", fontSize: 11, color: "var(--w-ink-lightest)" }}>
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
          {/* Light / Dark toggle */}
          <div className="ps-theme-toggle" role="group" aria-label="Color theme">
            <button
              className={`ps-theme-btn${tone === "cream" ? " on" : ""}`}
              onClick={() => setTone("cream")}
              aria-label="Light mode"
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.4" />
                <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M3.5 12.5l1.4-1.4M11.1 4.9l1.4-1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <span>Light</span>
            </button>
            <button
              className={`ps-theme-btn${tone === "dark" ? " on" : ""}`}
              onClick={() => setTone("dark")}
              aria-label="Dark mode"
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M13.5 9.5A6 6 0 016.5 2.5a6 6 0 107 7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
              <span>Dark</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main grid (left: controls · right: map) ── */}
      <div className="ps-grid">
        {/* LEFT: controls */}
        <aside className="ps-controls">
          <header className="ps-hd">
            <span className="wd-eyebrow"></span>
            <h1>
              <span className="ps-serif">Every trip</span> that fits appears.
            </h1>
          </header>

          {/* Budget scrubber */}
          <div className="ps-budget">
            <div className="ps-budget-top">
              <span className="ps-budget-big">{fmt(budget)}</span>
              <span className="ps-budget-unit">per person · all-in</span>
            </div>
            <input
              type="range" min={300} max={5000} step={50}
              value={budget}
              onChange={e => setBudget(Number(e.target.value))}
              className="ps-range"
            />
            <div className="ps-range-ticks">
              {BUDGET_TICKS.map(t => (
                <button
                  key={t}
                  className={`ps-tick${Math.abs(budget - t) < 100 ? " on" : ""}`}
                  onClick={() => setBudget(t)}
                >
                  {t >= 1000 ? `$${t / 1000}k` : `$${t}`}
                </button>
              ))}
            </div>
          </div>

          {/* Allocation bar */}
          <div className="ps-alloc">
            <div className="ps-section-lbl">
              <span>How it splits</span>
              <span className="ps-hint">drag to reallocate</span>
            </div>
            <BudgetBar split={split} onChange={setSplit} budget={budget} />
          </div>

          {/* Flying from + When */}
          <div className="ps-row">
            <div className="ps-field">
              <label>Flying from</label>
              <select value={origin} onChange={e => setOrigin(e.target.value)} className="ps-select">
                {AIRPORTS.map(a => <option key={a.c} value={a.c}>{a.n} ({a.c})</option>)}
              </select>
            </div>
            <div className="ps-field">
              <label>When</label>
              <select value={month} onChange={e => setMonth(e.target.value)} className="ps-select">
                {MONTHS.map(m => <option key={m} value={m}>{m === "Flexible" ? "I'm flexible" : m}</option>)}
              </select>
            </div>
          </div>

          {/* Trip length */}
          <div className="ps-field">
            <label>Trip length</label>
            <div className="ps-seg">
              {TRIP_LENGTHS.map((t, i) => (
                <button
                  key={t.label}
                  className={`ps-seg-b${tripIdx === i ? " on" : ""}`}
                  onClick={() => setTripIdx(i)}
                >
                  {t.display}
                  <span className="ps-seg-u">days</span>
                </button>
              ))}
            </div>
          </div>

          {/* Party size */}
          <div className="ps-field">
            <label>
              Who&apos;s going?
              <span className="ps-mono-small">{party === 1 ? "solo" : `${party} travelers`}</span>
            </label>
            <div className="ps-party">
              <button className="ps-party-btn" onClick={() => setParty(p => Math.max(1, p - 1))}>−</button>
              <div className="ps-party-dots">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} className={`ps-party-dot${i < party ? " on" : ""}`} />
                ))}
                {party > 10 && (
                  <span style={{ fontFamily: "var(--w-font-mono)", fontSize: 10, color: "var(--w-accent)", marginLeft: 2 }}>
                    +{party - 10}
                  </span>
                )}
              </div>
              <button className="ps-party-btn" onClick={() => setParty(p => Math.min(15, p + 1))}>+</button>
            </div>
          </div>

          {/* Vibes */}
          <div className="ps-field">
            <label>Vibe <span className="ps-mono-small">pick up to 3</span></label>
            <div className="vibe-chips">
              {VIBES.map(v => (
                <button
                  key={v.k}
                  className={`vchip${vibes.has(v.k) ? " on" : ""}`}
                  onClick={() => toggleVibe(v.k)}
                >
                  <span className="vchip-icon">{v.icon}</span>
                  <span>{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button className="ps-cta" onClick={handleSubmit}>
            <span>Show me all {counts.perfect + counts.great + counts.stretch} matches</span>
            <span className="ps-cta-arrow">→</span>
          </button>
          <div className="ps-cta-note">
            No credit card · No loyalty upsell · Live prices from Duffel
          </div>
        </aside>

        {/* RIGHT: map + results */}
        <main className="ps-main">
          {/* Live fit counter strip */}
          <div className="ps-countstrip">
            <div className="ps-count">
              <div className="ps-count-v" style={{ color: "#5DA89A" }}>{counts.perfect}</div>
              <div className="ps-count-l">well under budget</div>
            </div>
            <div className="ps-count">
              <div className="ps-count-v" style={{ color: "#5DA89A" }}>{counts.great}</div>
              <div className="ps-count-l">within budget</div>
            </div>
            <div className="ps-count">
              <div className="ps-count-v" style={{ color: "#C48A3A" }}>{counts.stretch}</div>
              <div className="ps-count-l">slight stretch</div>
            </div>
            <div className="ps-count">
              <div className="ps-count-v" style={{ color: "var(--w-ink-lightest)" }}>{counts.over}</div>
              <div className="ps-count-l">over budget</div>
            </div>
            <div className="ps-countstrip-spacer" />
            {topMatch && (
              <div className="ps-top-pick">
                <span className="ps-top-pick-lbl">top match</span>
                <span className="ps-top-pick-flag">{topMatch.flag}</span>
                <span className="ps-top-pick-city">{topMatch.city}</span>
                <span className="ps-top-pick-price" style={{ fontFamily: "var(--w-font-mono)" }}>
                  {fmt(topMatch.totalCost)}
                </span>
              </div>
            )}
          </div>

          {/* World map */}
          <div className="ps-map-wrap">
            <PlanWorldMap
              destinations={mapDests}
              budget={budget}
              origin={origin}
              activeId={activeId}
              onHover={setActiveId}
              onSelect={setActiveId}
              tone={tone}
            />
            {/* Legend */}
            <div className="ps-legend">
              <div className="ps-legend-row">
                <span className="ps-legend-dot" style={{ background: "#5DA89A" }} /> fits budget
              </div>
              <div className="ps-legend-row">
                <span className="ps-legend-dot" style={{ background: "#C48A3A" }} /> slight stretch
              </div>
              <div className="ps-legend-row">
                <span className="ps-legend-dot" style={{ background: "#B97A7A", opacity: 0.5 }} /> over budget
              </div>
            </div>
            {/* Origin pill */}
            <div className="ps-origin-tag">
              <span className="ps-origin-dot" />
              <span className="ps-origin-label">
                Departing {AIRPORTS.find(a => a.c === origin)?.n}
              </span>
              <span className="ps-origin-code">{origin}</span>
            </div>
          </div>

          {/* Top results preview */}
          <div className="ps-results">
            <div className="ps-results-hd">
              <span className="wd-eyebrow">Best fits · ranked</span>
              <span className="ps-results-meta" style={{ fontFamily: "var(--w-font-mono)" }}>
                {trip.nights} nights · from {origin}
              </span>
            </div>
            <div className="reslist">
              {ranked.slice(0, 6).map((d, i) => (
                <div
                  key={d.id}
                  className={`resrow${d.id === activeId ? " active" : ""} tier-${d.tier}`}
                  onMouseEnter={() => setActiveId(d.id)}
                  onMouseLeave={() => setActiveId(null)}
                  onClick={handleSubmit}
                  style={{ cursor: "pointer" }}
                >
                  <div className="resrow-rank">{String(i + 1).padStart(2, "0")}</div>
                  <div className="resrow-flag">{d.flag}</div>
                  <div className="resrow-main">
                    <div className="resrow-city">
                      {d.city}
                      <span className="resrow-country">, {d.country}</span>
                    </div>
                    <div className="resrow-tags">{d.tags.slice(0, 3).join(" · ")}</div>
                  </div>
                  <div className="resrow-price">
                    <div className="resrow-total">{fmt(d.totalCost)}</div>
                    <div className={`resrow-tier tier-${d.tier}`}>
                      {d.tier === "perfect"
                        ? `↓ ${Math.round((1 - d.ratio) * 100)}% under`
                        : d.tier === "great"
                        ? "exact fit"
                        : d.tier === "stretch"
                        ? `↑ ${Math.round((d.ratio - 1) * 100)}% over`
                        : "over"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
