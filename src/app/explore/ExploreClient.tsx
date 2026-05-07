'use client';

import { useState } from 'react';
import Link from 'next/link';

const TRIPS = [
  { c: 'Lisbon',        cc: 'Portugal',      fl: '🇵🇹', p: 612,  n: 5, m: 'perfect', live: true,  tags: ['city','culture','food'],   ph: '1585208798174-6cedd86e019a', s: 88,   region: 'europe',   vibes: ['city','culture','food'],     tag: 'Iberia',        whisper: 'pastel de nata · sunset trams' },
  { c: 'Mexico City',   cc: 'Mexico',        fl: '🇲🇽', p: 490,  n: 5, m: 'great',   live: false, tags: ['city','food','culture'],   ph: '1518638150340-f706e86654de', s: 210,  region: 'americas', vibes: ['city','food','culture'],     tag: 'Capital',       whisper: 'Roma Norte vibes' },
  { c: 'Bangkok',       cc: 'Thailand',      fl: '🇹🇭', p: 680,  n: 7, m: 'perfect', live: true,  tags: ['city','food','culture'],   ph: '1508009603885-50cf7c579365', s: 20,   region: 'asia',     vibes: ['city','food','culture'],     tag: 'Thailand',      whisper: 'temples · street food · chaos' },
  { c: 'Prague',        cc: 'Czechia',       fl: '🇨🇿', p: 650,  n: 5, m: 'perfect', live: false, tags: ['city','culture'],          ph: '1541849546-216549ae216d',    s: 50,   region: 'europe',   vibes: ['city','culture'],            tag: 'Bohemia',       whisper: 'cobblestones · castle views' },
  { c: 'Marrakech',     cc: 'Morocco',       fl: '🇲🇦', p: 695,  n: 5, m: 'perfect', live: true,  tags: ['culture','food'],          ph: '1597212618440-806262de4f6b', s: 5,    region: 'africa',   vibes: ['culture','food'],            tag: 'Morocco',       whisper: 'souks · spice · riads' },
  { c: 'Bali',          cc: 'Indonesia',     fl: '🇮🇩', p: 810,  n: 7, m: 'stretch', live: false, tags: ['beach','nature'],          ph: '1537996194471-e657df975ab4',  s: -110, region: 'asia',     vibes: ['beach','nature'],            tag: 'Indonesia',     whisper: 'rice fields · surf · spirit' },
  { c: 'Istanbul',      cc: 'Türkiye',       fl: '🇹🇷', p: 540,  n: 5, m: 'great',   live: true,  tags: ['city','culture','food'],   ph: '1524231757912-21f4fe3a7200', s: 160,  region: 'europe',   vibes: ['city','culture','food'],     tag: 'Bosphorus',     whisper: 'spices · minarets · çay' },
  { c: 'Tokyo',         cc: 'Japan',         fl: '🇯🇵', p: 1240, n: 6, m: 'stretch', live: true,  tags: ['city','food','culture'],   ph: '1540959733332-eab4deabeeaf',  s: -540, region: 'asia',     vibes: ['city','food','culture'],     tag: 'Far East',      whisper: 'neon + ramen' },
  { c: 'Buenos Aires',  cc: 'Argentina',     fl: '🇦🇷', p: 720,  n: 7, m: 'perfect', live: false, tags: ['city','food','nightlife'], ph: '1589909202802-8f4aadce1849', s: -20,  region: 'americas', vibes: ['city','food','nightlife'],   tag: 'Argentina',     whisper: 'steak · tango · Europe vibes' },
  { c: 'Cape Town',     cc: 'South Africa',  fl: '🇿🇦', p: 895,  n: 6, m: 'stretch', live: false, tags: ['nature','city','beach'],   ph: '1580060839134-75a5edca2e99',  s: -195, region: 'africa',   vibes: ['nature','city','beach'],     tag: 'South Africa',  whisper: 'mountain · wine · coast' },
  { c: 'Split',         cc: 'Croatia',       fl: '🇭🇷', p: 710,  n: 5, m: 'perfect', live: true,  tags: ['beach','culture'],         ph: '1629997865848-f4353a9296c9', s: -10,  region: 'europe',   vibes: ['beach','culture'],           tag: 'Dalmatia',      whisper: 'Diocletian palace · sailboats' },
  { c: 'Porto',         cc: 'Portugal',      fl: '🇵🇹', p: 595,  n: 5, m: 'great',   live: false, tags: ['city','food','culture'],   ph: '1555881400-74d7acaacd8b',    s: 105,  region: 'europe',   vibes: ['city','food','culture'],     tag: 'Portugal',      whisper: 'port wine · river views' },
];

type Trip = typeof TRIPS[number];
type Tier = 'under' | 'at' | 'splurge';

const MATCH_TO_TIER: Record<string, Tier> = {
  perfect: 'under',
  great: 'at',
  stretch: 'splurge',
};

const TIER_META: Record<Tier, {
  num: string; word: string; tagline: string;
  accent: string; tint: string;
}> = {
  under:   { num: '01', word: 'Under',   tagline: 'Within budget. Surplus on the side.', accent: '#2F6B5E', tint: '#DCECE7' },
  at:      { num: '02', word: 'At',      tagline: 'On the number. Best vibe match.',     accent: '#C99A2E', tint: '#F6EBD4' },
  splurge: { num: '03', word: 'Splurge', tagline: 'Worth a stretch. Feature-grade.',     accent: '#8B3A3A', tint: '#F0DFDF' },
};

const MOSAIC_LAYOUTS: Record<Tier, Array<{ col: number; row: number }>> = {
  under:   [{ col: 6, row: 3 }, { col: 3, row: 3 }, { col: 3, row: 3 }, { col: 12, row: 2 }],
  at:      [{ col: 8, row: 3 }, { col: 4, row: 3 }, { col: 12, row: 2 }],
  splurge: [{ col: 5, row: 3 }, { col: 7, row: 3 }],
};

const REGIONS = ['All', 'Europe', 'Asia', 'Americas', 'Africa', 'Oceania'];
const VIBE_FILTERS = ['All', '🏙️ City', '🏖️ Beach', '🍜 Food', '🏔️ Nature', '🎭 Culture', '💃 Nightlife'];
const SORTS = ['Best match', 'Cheapest', 'Most saved'];

function avgPrice(items: Trip[]) {
  if (!items.length) return 0;
  return Math.round(items.reduce((s, t) => s + t.p, 0) / items.length);
}

function TierBreak({ tier, count, avgCost }: { tier: Tier; count: number; avgCost: number }) {
  const m = TIER_META[tier];
  return (
    <div
      className="rounded border-t-2 mb-[18px]"
      style={{
        borderTopColor: m.accent,
        backgroundColor: m.tint,
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        gap: '32px',
        alignItems: 'end',
        padding: '28px 32px',
      }}
    >
      <div className="font-mono text-sm font-semibold tracking-[0.1em] uppercase" style={{ color: m.accent }}>
        TIER / {m.num}
      </div>
      <div>
        <div
          className="font-serif italic font-normal tracking-[-0.03em] leading-[0.95] text-ink"
          style={{ fontSize: 'clamp(40px,5vw,64px)' }}
        >
          {m.word} <span className="not-italic">budget.</span>
        </div>
        <div className="text-sm text-ink-muted mt-1.5">{m.tagline}</div>
      </div>
      <div className="flex gap-6 items-end">
        <div>
          <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-light">Destinations</div>
          <div className="font-mono text-[22px] font-medium text-ink">{String(count).padStart(2, '0')}</div>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-light">Avg / person</div>
          <div className="font-mono text-[22px] font-medium text-ink">${avgCost.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}

function ExploreCard({ t, big }: { t: Trip; big: boolean }) {
  const slug = t.c.toLowerCase().replace(/ /g, '-');
  const tripLength = t.n <= 4 ? '3-4' : t.n <= 7 ? '5-7' : t.n <= 10 ? '8-10' : '11-14';
  const params = new URLSearchParams({ budget: '700', origin: 'JFK', nights: String(t.n), tripLength, party: '1' });
  const savings = t.s;

  return (
    <Link
      href={`/destination/${slug}?${params.toString()}`}
      className="block rounded overflow-hidden border border-[#e0d8c8] shadow-[0_1px_0_rgba(14,26,20,0.04)] flex flex-col group bg-white h-full"
      style={{ textDecoration: 'none' }}
    >
      {/* Image */}
      <div className="relative flex-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://images.unsplash.com/photo-${t.ph}?auto=format&fit=crop&w=${big ? 1000 : 600}&q=75`}
          alt={t.c}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 from-30% to-black/55 pointer-events-none" />

        {/* top: editorial tag + live badge */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-white bg-black/55 backdrop-blur-sm px-2 py-1 rounded-sm">
            {t.tag}
          </span>
          {t.live && (
            <span className="font-mono text-[10px] text-[#2F6B5E] bg-white/90 backdrop-blur-sm px-2 py-1 rounded-sm font-semibold">
              LIVE
            </span>
          )}
        </div>

        {/* bottom: city name + whisper */}
        <div className={`absolute bottom-4 left-[18px] right-[18px] text-white z-10`}>
          <div className={`font-serif italic leading-[0.95] tracking-[-0.02em] ${big ? 'text-[48px]' : 'text-[32px]'}`}>
            {t.c}
          </div>
          <div className="font-mono text-[11px] tracking-[0.08em] opacity-85 mt-1.5">
            {t.fl} {t.cc.toUpperCase()} · {t.whisper}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between bg-white border-t border-[#e0d8c8] gap-2.5 px-3.5 py-3 flex-shrink-0">
        <div className="flex items-baseline gap-2">
          <span className="font-sans font-semibold text-xl" style={{ color: '#0A0A0A' }}>${t.p}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.06em]" style={{ color: '#9A9A8A' }}>/ person</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`font-mono text-[11px] font-semibold px-2 py-1 rounded-sm ${savings > 0 ? 'text-[#2F6B5E] bg-[#2F6B5E]/10' : 'text-[#8B3A3A] bg-[#8B3A3A]/10'}`}>
            {savings > 0 ? '−' : '+'}${Math.abs(savings).toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}

function Mosaic({ items, tier }: { items: Trip[]; tier: Tier }) {
  const layout = MOSAIC_LAYOUTS[tier];
  return (
    <div
      className="grid gap-3.5 mb-9"
      style={{ gridTemplateColumns: 'repeat(12, 1fr)', gridAutoRows: '200px' }}
    >
      {items.map((t, i) => {
        const l = layout[i % layout.length];
        const big = l.col >= 6;
        return (
          <div
            key={t.c}
            style={{ gridColumn: `span ${l.col}`, gridRow: `span ${l.row}` }}
          >
            <ExploreCard t={t} big={big} />
          </div>
        );
      })}
    </div>
  );
}

export default function ExploreClient() {
  const [region, setRegion] = useState('All');
  const [vibe, setVibe] = useState('All');
  const [sort, setSort] = useState('Best match');

  const vibeKey = vibe === 'All' ? 'All' : vibe.replace(/^[^\s]+\s/, '').toLowerCase();

  const filtered = TRIPS.filter(t => {
    const regionOk = region === 'All' || t.region === region.toLowerCase();
    const vibeOk = vibeKey === 'All' || t.vibes.includes(vibeKey);
    return regionOk && vibeOk;
  }).sort((a, b) => {
    if (sort === 'Cheapest') return a.p - b.p;
    if (sort === 'Most saved') return b.s - a.s;
    return 0;
  });

  const tierGroups: Record<Tier, Trip[]> = {
    under:   filtered.filter(t => MATCH_TO_TIER[t.m] === 'under'),
    at:      filtered.filter(t => MATCH_TO_TIER[t.m] === 'at'),
    splurge: filtered.filter(t => MATCH_TO_TIER[t.m] === 'splurge'),
  };

  const activeTiers = (['under', 'at', 'splurge'] as Tier[]).filter(t => tierGroups[t].length > 0);

  return (
    <section className="sec sec-sand" style={{ paddingTop: 48 }}>
      <div className="wrap">
        {/* Header row */}
        <div className="explore-hd">
          <div>
            <div className="wd-eyebrow" style={{ marginBottom: 6 }}>All budgets · All lengths · All airports</div>
            <h2 style={{ margin: 0, fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em' }}>
              {filtered.length} trips within reach
            </h2>
          </div>
          <div className="sort">
            {SORTS.map(s => (
              <button key={s} className={sort === s ? 'on' : ''} onClick={() => setSort(s)}>{s}</button>
            ))}
          </div>
        </div>

        {/* Region filter */}
        <div className="filt-row">
          <span className="lbl">Region</span>
          {REGIONS.map(r => (
            <button key={r} className={`fchip${region === r ? ' on' : ''}`} onClick={() => setRegion(r)}>
              {r}{r !== 'All' && r !== 'Oceania' ? ` · ${TRIPS.filter(t => t.region === r.toLowerCase()).length}` : r === 'All' ? ` · ${TRIPS.length}` : ' · 0'}
            </button>
          ))}
        </div>

        {/* Vibe filter */}
        <div className="filt-row" style={{ marginBottom: 32 }}>
          <span className="lbl">Vibe</span>
          {VIBE_FILTERS.map(v => (
            <button key={v} className={`fchip${vibe === v ? ' on' : ''}`} onClick={() => setVibe(v)}>{v}</button>
          ))}
        </div>

        {/* Tier sections */}
        {activeTiers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-[#e0d8c8]">
            <div className="text-4xl mb-3">🔍</div>
            <h2 className="text-xl font-bold mb-2">No trips found</h2>
            <p className="text-sm text-[#9A9A8A] mb-4">Try a different filter.</p>
            <button
              onClick={() => { setRegion('All'); setVibe('All'); }}
              className="text-sm text-[#2F6B5E] underline cursor-pointer bg-transparent border-0"
            >
              Clear filters
            </button>
          </div>
        ) : (
          activeTiers.map(tier => (
            <div key={tier}>
              <TierBreak tier={tier} count={tierGroups[tier].length} avgCost={avgPrice(tierGroups[tier])} />
              <Mosaic items={tierGroups[tier]} tier={tier} />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
