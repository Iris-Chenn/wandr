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

const REGIONS = ['All', 'Europe', 'Asia', 'Americas', 'Africa', 'Oceania'];
const VIBE_FILTERS = ['All', '🏙️ City', '🏖️ Beach', '🍜 Food', '🏔️ Nature', '🎭 Culture', '💃 Nightlife'];
const SORTS = ['Best match', 'Cheapest', 'Most saved', 'New this week'];

const MATCH_PILL: Record<string, { label: string; pill: string; dot: string }> = {
  perfect: { label: 'Top pick',      pill: 'bg-[#F26B2D] text-white',                                            dot: 'bg-white' },
  great:   { label: 'Good fit',      pill: 'bg-white/90 text-[#0E3B2A] border border-[#0E3B2A] backdrop-blur-sm', dot: 'bg-[#1F8A5B]' },
  stretch: { label: 'Slight stretch', pill: 'bg-white/90 text-[#8B3A3A] border border-[#8B3A3A] backdrop-blur-sm', dot: 'bg-[#8B3A3A]' },
};

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
        <div className="filt-row" style={{ marginBottom: 28 }}>
          <span className="lbl">Vibe</span>
          {VIBE_FILTERS.map(v => (
            <button key={v} className={`fchip${vibe === v ? ' on' : ''}`} onClick={() => setVibe(v)}>{v}</button>
          ))}
        </div>

        {/* Destination grid — editorial card style */}
        <div className="dgrid">
          {filtered.map((t) => {
            const slug = t.c.toLowerCase().replace(/ /g, '-');
            const tripLength = t.n <= 4 ? '3-4' : t.n <= 7 ? '5-7' : t.n <= 10 ? '8-10' : '11-14';
            const params = new URLSearchParams({ budget: '700', origin: 'JFK', nights: String(t.n), tripLength, party: '1' });
            const pill = MATCH_PILL[t.m];
            const savings = t.s;

            return (
              <Link
                key={t.c}
                href={`/destination/${slug}?${params.toString()}`}
                className="block rounded overflow-hidden border border-[#e0d8c8] shadow-[0_1px_0_rgba(14,26,20,0.04)] flex flex-col group bg-white"
                style={{ textDecoration: 'none' }}
              >
                {/* Image */}
                <div className="relative" style={{ minHeight: 240 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://images.unsplash.com/photo-${t.ph}?auto=format&fit=crop&w=700&q=75`}
                    alt={t.c}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/0 from-30% to-black/55 pointer-events-none" />

                  {/* top: editorial tag + match pill */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
                    <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-white bg-black/55 backdrop-blur-sm px-2 py-1 rounded-sm">
                      {t.tag}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] tracking-[0.1em] uppercase font-semibold ${pill.pill}`}>
                      <span className={`w-[5px] h-[5px] rounded-full flex-shrink-0 ${pill.dot}`} />
                      {pill.label}
                    </span>
                  </div>

                  {/* bottom: city name + whisper */}
                  <div className="absolute bottom-4 left-[18px] right-[18px] text-white z-10">
                    <div className="font-serif italic leading-[0.95] tracking-[-0.02em] text-[36px]">
                      {t.c}
                    </div>
                    <div className="font-mono text-[11px] tracking-[0.08em] opacity-85 mt-1.5">
                      {t.fl} {t.cc.toUpperCase()} · {t.whisper}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between bg-white border-t border-[#e0d8c8] gap-2.5 px-3.5 py-3">
                  <div className="flex items-baseline gap-2">
                    <span className="font-sans font-semibold text-xl" style={{ color: '#0A0A0A' }}>${t.p}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.06em]" style={{ color: '#9A9A8A' }}>/ person</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`font-mono text-[11px] font-semibold px-2 py-1 rounded-sm ${savings > 0 ? 'text-[#2F6B5E] bg-[#2F6B5E]/10' : 'text-[#8B3A3A] bg-[#8B3A3A]/10'}`}>
                      {savings > 0 ? '−' : '+'}${Math.abs(savings).toLocaleString()}
                    </span>
                    {t.live && (
                      <span className="font-mono text-[10px] text-[#2F6B5E] bg-[#2F6B5E]/10 px-2 py-1 rounded-sm font-semibold">
                        LIVE
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
