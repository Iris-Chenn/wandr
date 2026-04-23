'use client';

import { useState } from 'react';

const TOPICS = ['All', 'Budget breakdowns', 'Destination deep-dives', 'FX & money', 'Flight deals', 'Visas & paperwork', 'Product updates'];

const POSTS = [
  { href: '#', img: 'photo-1513735492246-483525079686', cat: 'Budget breakdown', time: '6 min', title: 'Lisbon on $612: what you get, what you skip', body: 'Five nights in Alfama, all the pasteis de nata, and one taxi we regretted.' },
  { href: '#', img: 'photo-1518638150340-f706e86654de', cat: 'Deep-dive',          time: '11 min', title: 'Mexico City is the most underrated food capital. We did the math.', body: '$40/day gets you two taquerias, a mezcal flight, and dessert at Rosetta.' },
  { href: '#', img: 'photo-1508009603885-50cf7c579365', cat: 'FX & money',          time: '4 min',  title: 'Why your "no foreign transaction fee" card still charged you 3%', body: 'Dynamic currency conversion, explained, and how to say no at the terminal.' },
  { href: '#', img: 'photo-1597212720753-4d00e55eab4d', cat: 'Flight deals',        time: '5 min',  title: 'The 21-day trick for cheaper shoulder-season Europe', body: 'What the "book 6 weeks out" rule gets wrong, and the actual data.' },
  { href: '#', img: 'photo-1580060839134-75a5edca2e99', cat: 'Visas',               time: '7 min',  title: 'A U.S. passport\'s best-kept secret: 46 visa-on-arrival countries', body: 'The complete list, updated April 2026, with prices and processing times.' },
  { href: '#', img: 'photo-1541849546-216549ae216d', cat: 'Product update',         time: '3 min',  title: 'Shared wallets are live. Here\'s how they work.', body: 'Split a trip up to six ways, with one card, and auto-settle on landing.' },
  { href: '#', img: 'photo-1537996194471-e657df975ab4', cat: 'Deep-dive',           time: '13 min', title: 'Bali at $810: the "slight stretch" that\'s worth it', body: 'Two villages, one volcano, and why Canggu isn\'t as cheap as you\'ve heard.' },
  { href: '#', img: 'photo-1524231757912-21f4fe3a7200', cat: 'Deep-dive',           time: '8 min',  title: 'Istanbul is wildly cheap right now. A currency primer.', body: 'TRY has moved 47% in 18 months. Here\'s what that actually means at the kebab stand.' },
  { href: '#', img: 'photo-1589909202802-8f4aadce1849', cat: 'Budget breakdown',    time: '6 min',  title: 'Buenos Aires on $720: steak, tango, and the "blue dollar"', body: 'How to navigate Argentina\'s parallel FX market without getting scammed.' },
];

export default function GuidesClient() {
  const [topic, setTopic] = useState('All');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section className="sec">
      <div className="wrap">
        {/* Topic filters */}
        <div className="topic-row">
          {TOPICS.map(t => (
            <button key={t} className={`fchip${topic === t ? ' on' : ''}`} onClick={() => setTopic(t)}>
              {t}
            </button>
          ))}
        </div>

        {/* Featured article */}
        <div className="b-feature">
          <div className="ph">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=75"
              alt="Tokyo"
            />
          </div>
          <div className="body">
            <div className="b-meta">
              <span>Destination</span>
              <span className="dot">·</span>
              <span>Apr 22 · 9 min</span>
            </div>
            <h3>Tokyo for $1,240: the actual breakdown, down to the coffee.</h3>
            <p>
              Six days in Tokyo for under $1,300, all-in. Every yen tracked, every konbini receipt
              kept, and the three &ldquo;deals&rdquo; that turned out to be traps.
            </p>
            <div className="b-meta" style={{ marginTop: 20 }}>
              <span className="avatar">PR</span>
              <span style={{ color: 'var(--w-ink)', textTransform: 'none', letterSpacing: 0, fontFamily: 'var(--w-font-sans)', fontSize: 13.5, fontWeight: 500 }}>
                Priya Rao
              </span>
            </div>
          </div>
        </div>

        {/* Post grid */}
        <div className="bgrid">
          {POSTS.map(p => (
            <a key={p.title} className="bcard" href={p.href}>
              <div className="ph">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://images.unsplash.com/${p.img}?auto=format&fit=crop&w=700&q=75`}
                  alt={p.title}
                  loading="lazy"
                />
              </div>
              <div className="body">
                <div className="b-meta">
                  <span>{p.cat}</span>
                  <span className="dot">·</span>
                  <span>{p.time}</span>
                </div>
                <h4>{p.title}</h4>
                <p>{p.body}</p>
              </div>
            </a>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <a href="#" className="btn btn-ghost">Older posts →</a>
        </div>
      </div>

      {/* Newsletter strip */}
      <div className="news-strip">
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
                {subscribed ? '✓ You\'re on the list.' : 'Subscribe →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
