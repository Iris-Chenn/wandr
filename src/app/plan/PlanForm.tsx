'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// nights = mid-point of range, must match TRIP_LENGTH_NIGHTS in ranking.ts + duffel.ts
const TRIP_LENGTHS = [
  { label: '3–4 days', icon: '⏱', nights: 4,  days: 4  },
  { label: '5–7 days', icon: '✦', nights: 6,  days: 6  },
  { label: '8–10 days', icon: '☀', nights: 9,  days: 9  },
  { label: '11–14',    icon: '∞', nights: 12, days: 12 },
];

const VIBES = [
  { label: 'City', icon: '🏙️' },
  { label: 'Beach', icon: '🏖️' },
  { label: 'Nature', icon: '🏔️' },
  { label: 'Food', icon: '🍜' },
  { label: 'Culture', icon: '🎭' },
  { label: 'Adventure', icon: '🧗' },
  { label: 'Chill', icon: '🛏️' },
  { label: 'Nightlife', icon: '💃' },
];

const AIRPORTS = [
  { label: 'New York (JFK)',      code: 'JFK' },
  { label: 'Los Angeles (LAX)',   code: 'LAX' },
  { label: 'Chicago (ORD)',       code: 'ORD' },
  { label: 'London (LHR)',        code: 'LHR' },
  { label: 'San Francisco (SFO)', code: 'SFO' },
  { label: 'Toronto (YYZ)',       code: 'YYZ' },
  { label: 'Singapore (SIN)',     code: 'SIN' },
];

const MONTHS = [
  { label: "I'm flexible (best price)", value: 'flexible' },
  { label: 'May 2026',    value: 'may-2026' },
  { label: 'June 2026',   value: 'june-2026' },
  { label: 'July 2026',   value: 'july-2026' },
  { label: 'August 2026', value: 'august-2026' },
  { label: 'September 2026', value: 'september-2026' },
];

// Map tripIdx → tripLength param format for /results
const TRIP_LENGTH_PARAMS = ['3-4', '5-7', '8-10', '11-14'];

function fmt(n: number) {
  return '$' + Math.round(n).toLocaleString();
}

export default function PlanForm() {
  const router = useRouter();
  const [budget, setBudget] = useState(1200);
  const [tripIdx, setTripIdx] = useState(1); // default: 5–7 days
  const [vibes, setVibes] = useState<Set<number>>(new Set([1, 4])); // Beach, Culture
  const [airportCode, setAirportCode] = useState('JFK');
  const [month, setMonth] = useState('flexible');
  const [party, setParty] = useState(2); // default: couple

  const trip = TRIP_LENGTHS[tripIdx];

  // Flights: per person (doesn't change with party)
  const flights = Math.round(budget * 0.42);

  // Hotel: shared rooms — 2 people per room
  const rooms = Math.ceil(party / 2);
  const hotelSolo = Math.round(budget * 0.28); // what 1 person pays solo
  const hotel = party === 1
    ? hotelSolo
    : Math.round(hotelSolo * rooms / party);

  // Food + activities: redistribute hotel savings
  const remaining = budget - flights - hotel;
  const food = Math.round(remaining * 0.60);  // ~60% of non-flight/hotel
  const activities = remaining - food;
  const foodPerDay = Math.round(food / trip.days);

  // Group totals
  const totalTrip = budget * party;

  const toggleVibe = useCallback((i: number) => {
    setVibes(prev => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else if (next.size < 3) {
        next.add(i);
      }
      return next;
    });
  }, []);

  const handleSubmit = () => {
    const params = new URLSearchParams({
      budget: String(budget),
      origin: airportCode,
      tripLength: TRIP_LENGTH_PARAMS[tripIdx],
      month,
      vibes: [...vibes].map(i => VIBES[i].label).join(','),
      party: String(party),
    });
    router.push(`/results?${params.toString()}`);
  };

  return (
    <section className="sec sec-sand" style={{ paddingTop: 56 }}>
      <div className="wrap">
        <div className="plan-grid">
          {/* ── Left: form card ── */}
          <div className="plan-card">
            {/* Budget slider */}
            <div className="plan-field">
              <div className="plan-label">
                <span>My total budget</span>
                <span style={{ color: 'var(--w-ink-lightest)' }}>all-in · per person</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <span className="plan-big">{fmt(budget)}</span>
                <span className="wd-mono" style={{ fontSize: 12, color: 'var(--w-ink-muted-2)' }}>
                  Flights + hotel + food + fun
                </span>
              </div>
              <input
                type="range"
                min={200}
                max={5000}
                step={50}
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="plan-range"
              />
              <div className="plan-range-lbls">
                <span>$200</span>
                <span>$2,600</span>
                <span>$5,000</span>
              </div>
            </div>

            {/* Airport */}
            <div className="plan-field">
              <div className="plan-label"><span>Flying from</span></div>
              <select
                className="plan-select"
                value={airportCode}
                onChange={e => setAirportCode(e.target.value)}
              >
                {AIRPORTS.map(a => <option key={a.code} value={a.code}>{a.label}</option>)}
              </select>
            </div>

            {/* Party size slider */}
            <div className="plan-field">
              <div className="plan-label">
                <span>Who&apos;s going?</span>
                <span style={{ color: 'var(--w-ink-lightest)' }}>travelers</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <span className="plan-big">
                  {party === 1 ? 'Solo' : party === 2 ? '2 people' : `${party} people`}
                </span>
                <span className="wd-mono" style={{ fontSize: 12, color: 'var(--w-ink-muted-2)' }}>
                  {party === 1 ? 'Just me' : `${Math.ceil(party / 2)} ${Math.ceil(party / 2) === 1 ? 'room' : 'rooms'} · hotel shared`}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={15}
                step={1}
                value={party}
                onChange={e => setParty(Number(e.target.value))}
                className="plan-range"
              />
              <div className="plan-range-lbls">
                <span>Solo</span>
                <span>8</span>
                <span>15</span>
              </div>
            </div>

            {/* Trip length chips */}
            <div className="plan-field">
              <div className="plan-label"><span>Trip length</span></div>
              <div className="plan-chips">
                {TRIP_LENGTHS.map((t, i) => (
                  <button
                    key={t.label}
                    className={`plan-chip${tripIdx === i ? ' on' : ''}`}
                    onClick={() => setTripIdx(i)}
                  >
                    <span className="ic">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Vibe chips */}
            <div className="plan-field">
              <div className="plan-label">
                <span>Vibe</span>
                <span style={{ color: 'var(--w-ink-lightest)' }}>pick up to 3</span>
              </div>
              <div className="plan-chips">
                {VIBES.map((v, i) => (
                  <button
                    key={v.label}
                    className={`plan-chip${vibes.has(i) ? ' on' : ''}`}
                    onClick={() => toggleVibe(i)}
                  >
                    <span className="ic">{v.icon}</span>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* When */}
            <div className="plan-field">
              <div className="plan-label">
                <span>When</span>
                <span style={{ color: 'var(--w-ink-lightest)' }}>optional</span>
              </div>
              <select
                className="plan-select"
                value={month}
                onChange={e => setMonth(e.target.value)}
              >
                {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>

            <button className="plan-cta" onClick={handleSubmit}>
              Show me where I can go →
            </button>
            <div className="plan-help">
              No credit card needed · 60+ destinations · Live flight prices from Duffel
            </div>
          </div>

          {/* ── Right: budget breakdown ── */}
          <div className="planside">
            <h3>How Wandr splits your budget</h3>
            <p>
              {party === 1
                ? 'Solo trip breakdown — all per-person. Flights are live (Duffel). Hotel, food, and activities use our median-spend data from 60+ cities.'
                : `Breakdown for ${party} travelers. Hotel costs split across shared rooms. Flights are live (Duffel).`
              }
            </p>
            <div className="breakdown">
              {/* Stacked bar — widths proportional to per-person spend */}
              <div className="bar-break">
                <span style={{ width: `${Math.round(flights / budget * 100)}%`, background: 'var(--w-accent)' }} />
                <span style={{ width: `${Math.round(hotel / budget * 100)}%`, background: 'var(--w-amber)' }} />
                <span style={{ width: `${Math.round(food / budget * 100)}%`, background: 'var(--w-rose)' }} />
                <span style={{ width: `${Math.round(activities / budget * 100)}%`, background: '#8A8A8A' }} />
              </div>
              <div className="row flights">
                <span className="c">Flights · round trip</span>
                <span className="v">{fmt(flights)}</span>
              </div>
              <div className="row hotel">
                <span className="c">
                  Hotel · {trip.nights} nights
                  {party > 1 && (
                    <span style={{ fontSize: 11, color: 'var(--w-ink-lightest)', marginLeft: 6 }}>
                      ({rooms} {rooms === 1 ? 'room' : 'rooms'}, shared)
                    </span>
                  )}
                </span>
                <span className="v">{fmt(hotel)}</span>
              </div>
              <div className="row food">
                <span className="c">Food · ~{fmt(foodPerDay)}/day</span>
                <span className="v">{fmt(food)}</span>
              </div>
              <div className="row activities">
                <span className="c">Activities &amp; transit</span>
                <span className="v">{fmt(activities)}</span>
              </div>
              <div className="row" style={{ borderTop: '1px solid var(--w-border-warm)', paddingTop: 10, marginTop: 4 }}>
                <span style={{ color: 'var(--w-ink-muted)' }}>Per person</span>
                <span className="v">{fmt(budget)}</span>
              </div>
              {party > 1 && (
                <div className="row" style={{ marginTop: 2 }}>
                  <span style={{ fontWeight: 600 }}>Total for {party} travelers</span>
                  <span className="v" style={{ color: 'var(--w-accent)', fontWeight: 700 }}>{fmt(totalTrip)}</span>
                </div>
              )}
            </div>

            <div style={{
              marginTop: 24,
              background: 'var(--w-canvas-sand)',
              border: '1px dashed var(--w-border-warm)',
              borderRadius: 14,
              padding: 18,
            }}>
              <div className="wd-mono" style={{
                fontSize: 11,
                color: 'var(--w-ink-muted-2)',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                marginBottom: 8,
              }}>
                Price match guarantee
              </div>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--w-ink-muted)', lineHeight: 1.55 }}>
                Find a cheaper flight+hotel combo within 24 hours of booking? We refund the
                difference, full stop.
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom: how it works steps ── */}
        <div className="plan-steps">
          <div className="plan-step">
            <div className="n">01 Enter your budget</div>
            <h4>One number — that&apos;s it.</h4>
            <p>Your whole-trip total. Wandr figures out the rest.</p>
          </div>
          <div className="plan-step">
            <div className="n">02 See your world</div>
            <h4>A live map of the possible.</h4>
            <p>Every destination you can actually afford, color-coded by fit.</p>
          </div>
          <div className="plan-step">
            <div className="n">03 Book in one click</div>
            <h4>Flight + hotel in one flow.</h4>
            <p>No 12 tabs. Paid from your Wandr wallet at the mid-market rate.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
