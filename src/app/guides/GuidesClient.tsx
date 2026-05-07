'use client';

import { useState } from 'react';

const TOPICS = ['All', 'Budget breakdowns', 'Deep-dives', 'FX & money', 'Flight deals', 'Visas', 'Product updates'];

const POSTS = [
  { href: '#', img: '1540959733332-eab4deabeeaf', cat: 'Destination',      time: '9 min',  title: 'Tokyo for $1,240: the actual breakdown, down to the coffee.', body: 'Six days in Tokyo for under $1,300, all-in. Every yen tracked, every konbini receipt kept.' },
  { href: '#', img: '1513735492246-483525079686', cat: 'Budget breakdown',  time: '6 min',  title: 'Lisbon on $612: what you get, what you skip', body: 'Five nights in Alfama, all the pasteis de nata, and one taxi we regretted.' },
  { href: '#', img: '1518638150340-f706e86654de', cat: 'Deep-dive',         time: '11 min', title: 'Mexico City is the most underrated food capital. We did the math.', body: '$40/day gets you two taquerias, a mezcal flight, and dessert at Rosetta.' },
  { href: '#', img: '1508009603885-50cf7c579365', cat: 'FX & money',        time: '4 min',  title: 'Why your no-foreign-transaction-fee card still charged you 3%', body: 'Dynamic currency conversion, explained, and how to say no at the terminal.' },
  { href: '#', img: '1597212618440-806262de4f6b', cat: 'Flight deals',      time: '5 min',  title: 'The 21-day trick for cheaper shoulder-season Europe', body: 'What the book-6-weeks-out rule gets wrong, and the actual data.' },
  { href: '#', img: '1580060839134-75a5edca2e99', cat: 'Visas',             time: '7 min',  title: "A U.S. passport's best-kept secret: 46 visa-on-arrival countries", body: 'The complete list, updated April 2026, with prices and processing times.' },
  { href: '#', img: '1541849546-216549ae216d',    cat: 'Product update',    time: '3 min',  title: "Shared wallets are live. Here's how they work.", body: 'Split a trip up to six ways, with one card, and auto-settle on landing.' },
  { href: '#', img: '1537996194471-e657df975ab4', cat: 'Deep-dive',         time: '13 min', title: "Bali at $810: the slight stretch that's worth it", body: "Two villages, one volcano, and why Canggu isn't as cheap as you've heard." },
  { href: '#', img: '1524231757912-21f4fe3a7200', cat: 'Deep-dive',         time: '8 min',  title: 'Istanbul is wildly cheap right now. A currency primer.', body: "TRY has moved 47% in 18 months. Here's what that means at the kebab stand." },
  { href: '#', img: '1589909202802-8f4aadce1849', cat: 'Budget breakdown',  time: '6 min',  title: 'Buenos Aires on $720: steak, tango, and the blue dollar', body: "How to navigate Argentina's parallel FX market without getting scammed." },
];

// Same repeating mosaic as Explore page
const MOSAIC_LAYOUT = [
  { col: 6, row: 3 },
  { col: 3, row: 3 },
  { col: 3, row: 3 },
  { col: 12, row: 2 },
  { col: 8, row: 3 },
  { col: 4, row: 3 },
];

const CAT_TO_TOPIC: Record<string, string> = {
  'Destination':      'Deep-dives',
  'Budget breakdown': 'Budget breakdowns',
  'Deep-dive':        'Deep-dives',
  'FX & money':       'FX & money',
  'Flight deals':     'Flight deals',
  'Visas':            'Visas',
  'Product update':   'Product updates',
};

export default function GuidesClient() {
  const [topic, setTopic] = useState('All');
  const [subscribed, setSubscribed] = useState(false);

  const filtered = topic === 'All'
    ? POSTS
    : POSTS.filter(p => CAT_TO_TOPIC[p.cat] === topic);

  return (
    <section className="sec sec-sand" style={{ paddingTop: 48 }}>
      <div className="wrap">

        {/* Header row */}
        <div className="explore-hd" style={{ marginBottom: 0 }}>
          <div>
            <div className="wd-eyebrow" style={{ marginBottom: 6 }}>Budget travel · Real numbers · No fluff</div>
            <h2 style={{ margin: 0, fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em' }}>
              {filtered.length} guides
            </h2>
          </div>
        </div>

        {/* Topic filters */}
        <div className="filt-row" style={{ marginBottom: 32, marginTop: 20 }}>
          <span className="lbl">Topic</span>
          {TOPICS.map(t => (
            <button key={t} className={`fchip${topic === t ? ' on' : ''}`} onClick={() => setTopic(t)}>
              {t}
            </button>
          ))}
        </div>

        {/* Mosaic grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-[#e0d8c8]">
            <div className="text-4xl mb-3">📖</div>
            <p className="text-sm text-[#9A9A8A] mb-4">No guides in this topic yet.</p>
            <button
              onClick={() => setTopic('All')}
              className="text-sm text-[#2F6B5E] underline cursor-pointer bg-transparent border-0"
            >
              See all guides
            </button>
          </div>
        ) : (
          <div
            className="grid gap-3.5"
            style={{ gridTemplateColumns: 'repeat(12, 1fr)', gridAutoRows: '200px' }}
          >
            {filtered.map((p, i) => {
              const l = MOSAIC_LAYOUT[i % MOSAIC_LAYOUT.length];
              const big = l.col >= 6;
              return (
                <div
                  key={p.title}
                  style={{ gridColumn: `span ${l.col}`, gridRow: `span ${l.row}` }}
                >
                  <a
                    href={p.href}
                    className="block rounded overflow-hidden border border-[#e0d8c8] shadow-[0_1px_0_rgba(14,26,20,0.04)] flex flex-col group bg-white h-full"
                    style={{ textDecoration: 'none' }}
                  >
                    {/* Image */}
                    <div className="relative flex-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://images.unsplash.com/photo-${p.img}?auto=format&fit=crop&w=${big ? 1000 : 600}&q=75`}
                        alt={p.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/0 from-30% to-black/65 pointer-events-none" />

                      {/* Category + read time */}
                      <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
                        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-white bg-black/55 backdrop-blur-sm px-2 py-1 rounded-sm">
                          {p.cat}
                        </span>
                        <span className="font-mono text-[10px] text-white/70 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-sm">
                          {p.time}
                        </span>
                      </div>

                      {/* Title + excerpt */}
                      <div className="absolute bottom-4 left-[18px] right-[18px] text-white z-10">
                        <div className={`font-serif italic leading-[1.1] tracking-[-0.02em] ${big ? 'text-[28px]' : 'text-[18px]'}`}>
                          {p.title}
                        </div>
                        {big && (
                          <div className="font-mono text-[11px] tracking-[0.04em] opacity-75 mt-2 leading-relaxed">
                            {p.body}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between bg-white border-t border-[#e0d8c8] gap-2.5 px-3.5 py-3 flex-shrink-0">
                      <span className="font-mono text-[10px] uppercase tracking-[0.08em]" style={{ color: '#9A9A8A' }}>
                        {p.cat}
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.06em]" style={{ color: '#9A9A8A' }}>
                        {p.time} read
                      </span>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <a href="#" className="btn btn-ghost">Older posts &rarr;</a>
        </div>
      </div>

      {/* Newsletter strip */}
      <div className="news-strip" style={{ marginTop: 64 }}>
        <div className="wrap">
          <div className="ns-grid">
            <div>
              <span className="wd-eyebrow">The Wandr weekly</span>
              <h3>One email. Fridays. Zero fluff.</h3>
              <p style={{ color: 'var(--w-ink-muted)', fontSize: 15, lineHeight: 1.6, margin: 0 }}>
                Three flight deals, one destination deep-dive, and the FX chart that mattered this
                week. Unsubscribe in one click, no hard feelings.
              </p>
            </div>
            <form
              className="news-form"
              onSubmit={e => { e.preventDefault(); setSubscribed(true); }}
            >
              <input type="email" placeholder="you@example.com" required />
              <button type="submit" className="btn btn-primary">
                {subscribed ? "You're on the list." : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
