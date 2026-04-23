'use client';

import { useState } from 'react';
import Link from 'next/link';

const TRIPS = [
  { c: 'Lisbon',        cc: 'Portugal',      fl: '🇵🇹', p: 612,  n: 5, m: 'perfect', live: true,  tags: ['city','culture','food'],           ph: 'photo-1513735492246-483525079686', s: 88,   region: 'europe',   vibes: ['city','culture','food'] },
  { c: 'Mexico City',   cc: 'Mexico',        fl: '🇲🇽', p: 490,  n: 5, m: 'great',   live: false, tags: ['city','food','culture'],           ph: 'photo-1518638150340-f706e86654de', s: 210,  region: 'americas', vibes: ['city','food','culture'] },
  { c: 'Bangkok',       cc: 'Thailand',      fl: '🇹🇭', p: 680,  n: 7, m: 'perfect', live: true,  tags: ['city','food','culture'],           ph: 'photo-1508009603885-50cf7c579365', s: 20,   region: 'asia',     vibes: ['city','food','culture'] },
  { c: 'Prague',        cc: 'Czechia',       fl: '🇨🇿', p: 650,  n: 5, m: 'perfect', live: false, tags: ['city','culture'],                  ph: 'photo-1541849546-216549ae216d',    s: 50,   region: 'europe',   vibes: ['city','culture'] },
  { c: 'Marrakech',     cc: 'Morocco',       fl: '🇲🇦', p: 695,  n: 5, m: 'perfect', live: true,  tags: ['culture','food'],                  ph: 'photo-1597212720753-4d00e55eab4d', s: 5,    region: 'africa',   vibes: ['culture','food'] },
  { c: 'Bali',          cc: 'Indonesia',     fl: '🇮🇩', p: 810,  n: 7, m: 'stretch', live: false, tags: ['beach','nature'],                  ph: 'photo-1537996194471-e657df975ab4',  s: -110, region: 'asia',     vibes: ['beach','nature'] },
  { c: 'Istanbul',      cc: 'Türkiye',       fl: '🇹🇷', p: 540,  n: 5, m: 'great',   live: true,  tags: ['city','culture','food'],           ph: 'photo-1524231757912-21f4fe3a7200', s: 160,  region: 'europe',   vibes: ['city','culture','food'] },
  { c: 'Tokyo',         cc: 'Japan',         fl: '🇯🇵', p: 1240, n: 6, m: 'stretch', live: true,  tags: ['city','food','culture'],           ph: 'photo-1540959733332-eab4deabeeaf',  s: -540, region: 'asia',     vibes: ['city','food','culture'] },
  { c: 'Buenos Aires',  cc: 'Argentina',     fl: '🇦🇷', p: 720,  n: 7, m: 'perfect', live: false, tags: ['city','food','nightlife'],         ph: 'photo-1589909202802-8f4aadce1849', s: -20,  region: 'americas', vibes: ['city','food','nightlife'] },
  { c: 'Cape Town',     cc: 'South Africa',  fl: '🇿🇦', p: 895,  n: 6, m: 'stretch', live: false, tags: ['nature','city','beach'],           ph: 'photo-1580060839134-75a5edca2e99',  s: -195, region: 'africa',   vibes: ['nature','city','beach'] },
  { c: 'Split',         cc: 'Croatia',       fl: '🇭🇷', p: 710,  n: 5, m: 'perfect', live: true,  tags: ['beach','culture'],                 ph: 'photo-1555990538-17392c2d7b8d',    s: -10,  region: 'europe',   vibes: ['beach','culture'] },
  { c: 'Porto',         cc: 'Portugal',      fl: '🇵🇹', p: 595,  n: 5, m: 'great',   live: false, tags: ['city','food','culture'],           ph: 'photo-1513735492246-483525079686', s: 105,  region: 'europe',   vibes: ['city','food','culture'] },
];

const REGIONS = ['All', 'Europe', 'Asia', 'Americas', 'Africa', 'Oceania'];
const VIBE_FILTERS = ['All', '🏙️ City', '🏖️ Beach', '🍜 Food', '🏔️ Nature', '🎭 Culture', '💃 Nightlife'];
const SORTS = ['Best match', 'Cheapest', 'Most saved', 'New this week'];

const MATCH_LABELS: Record<string, string> = { perfect: 'Within budget', great: 'Great value', stretch: 'Slight stretch' };

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

        {/* Destination grid */}
        <div className="dgrid">
          {filtered.map((t) => (
            <Link key={t.c} href={`/destination/${t.c.toLowerCase().replace(/ /g, '-')}`} className="dcard">
              <div className="ph">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://images.unsplash.com/${t.ph}?auto=format&fit=crop&w=700&q=75`}
                  alt={t.c}
                  loading="lazy"
                />
                <div className="ovr" />
                <div className="tag">
                  <div>
                    <span className="flag">{t.fl}</span>
                    <div style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 6 }}>
                      <div className="city">{t.c}</div>
                      <div className="cc">{t.cc}</div>
                    </div>
                  </div>
                  <span className={`match ${t.m}`}>{MATCH_LABELS[t.m]}</span>
                </div>
              </div>
              <div className="body">
                {t.tags.map(tag => <span key={tag} className="chip-pill">{tag}</span>)}
                <div className="foot">
                  <div>
                    <span className="price">${t.p}</span>
                    {t.live && <span className="live-badge">LIVE</span>}
                    <div className="nights">{t.n} nights all-in</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {t.s > 0 && <div style={{ fontSize: 11, color: 'var(--w-accent)', fontWeight: 500 }}>${t.s} under</div>}
                    {t.s < 0 && <div style={{ fontSize: 11, color: 'var(--w-rose-dark)', fontWeight: 500 }}>${-t.s} over</div>}
                    <span className="view">View →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
