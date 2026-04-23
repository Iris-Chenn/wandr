import type { Metadata } from 'next';
import Link from 'next/link';
import WandrNavbar from '@/components/WandrNavbar';
import WandrFooter from '@/components/WandrFooter';

export const metadata: Metadata = {
  title: 'Pricing — Wandr',
  description:
    'Wandr runs on tokens. Pick a pack that fits your year. No subscriptions, no surprise overages.',
};

const TIERS = [
  {
    id: 'light',
    tier: 'Wandr light',
    glyph: '🔍',
    name: 'Light',
    desc: 'For the one-trip-a-year traveler.',
    price: '$4.99',
    tokens: '5,000',
    per1k: '$1.00',
    features: ['Destination search', 'Cost breakdowns', 'Itineraries up to 5 days', '1 savings goal'],
    hi: false,
  },
  {
    id: 'plan',
    tier: 'Most popular',
    glyph: '📋',
    name: 'Plan',
    desc: 'For a couple of trips and some daydreaming.',
    price: '$19.99',
    tokens: '25,000',
    per1k: '$0.80',
    features: ['Everything in Light', 'Full itineraries up to 10 days', 'AI chat refinement', '3 price alerts', 'Trip history'],
    hi: true,
  },
  {
    id: 'travel',
    tier: 'Wandr travel',
    glyph: '✈️',
    name: 'Travel',
    desc: 'For frequent flyers and group trips.',
    price: '$49.99',
    tokens: '75,000',
    per1k: '$0.67',
    features: ['Everything in Plan', 'Itineraries 14+ days', 'Group planning', 'Multi-destination routing', '10 price alerts', 'Priority AI speed'],
    hi: false,
  },
  {
    id: 'pro',
    tier: 'Wandr pro',
    glyph: '🌍',
    name: 'Pro',
    desc: 'For nomads, teams, and the always-booking.',
    price: '$129',
    tokens: '200,000',
    per1k: '$0.65',
    features: ['Everything in Travel', 'Unlimited price alerts', 'Team sharing', 'Early access to new features', '3 savings goals → unlimited'],
    hi: false,
  },
];

const EARN = [
  { act: 'Book a flight via Wandr',       tk: '+5,000', unit: 'tokens' },
  { act: 'Book a hotel via Wandr',         tk: '+3,000', unit: 'tokens' },
  { act: 'Refer a friend who signs up',    tk: '+10,000', unit: 'tokens' },
  { act: 'Complete your travel profile',   tk: '+1,000', unit: 'one-time' },
  { act: 'Write a trip review',            tk: '+500',   unit: 'tokens' },
];

const FAQS = [
  {
    q: 'What is a token, exactly?',
    a: 'One token is roughly the compute cost of one small AI action — a destination search, a line of itinerary, a price refresh. A typical two-week trip plan runs about 2,000–4,000 tokens. Full details are in your dashboard on every action.',
  },
  {
    q: 'Do tokens expire?',
    a: 'No. Once you buy a pack, the tokens sit in your account until you use them. If you skip a year of travel, they\'ll still be there when you come back.',
  },
  {
    q: 'What happens when I run out?',
    a: 'You can top up with another pack at any tier, or pay-as-you-go at the Light rate ($1.00 / 1K). We\'ll warn you at 10% remaining. Nothing auto-renews without your tap.',
  },
  {
    q: 'How does earn-back work?',
    a: 'When you complete a booking through a Wandr partner (flight, hotel, activity), we receive a commission — and pass a slice back as tokens into your balance, usually within 48 hours of check-in or take-off.',
  },
  {
    q: 'Can I move tokens between accounts?',
    a: 'On Pro, yes — team sharing lets you pool tokens across up to 6 accounts. On other tiers, tokens stay with the account that bought them.',
  },
  {
    q: 'Is there a free tier?',
    a: 'Every new account gets 500 free tokens to try Wandr — enough for a handful of searches and one short itinerary. No card on file required.',
  },
];

export default function PricingPage() {
  return (
    <>
      <WandrNavbar />

      <main>
        {/* Page header */}
        <header className="pghead">
          <span className="wd-eyebrow">Pricing</span>
          <h1>
            Pay for what you{' '}
            <span style={{ fontFamily: 'var(--w-font-serif)', fontStyle: 'italic' }}>actually</span>{' '}
            plan.
          </h1>
          <p>
            Wandr runs on tokens — little credits you spend on searches, itineraries, alerts, and AI
            chat. Pick a pack that fits your year. No subscriptions, no surprise overages, and every
            booking earns tokens back.
          </p>
        </header>

        {/* Token packs */}
        <section className="sec sec-sand" style={{ paddingTop: 48 }}>
          <div className="wrap">
            <div className="sec-head">
              <span className="wd-eyebrow">Token packs</span>
              <h2 className="head">
                Four tiers. <span className="serif em">One currency.</span>
              </h2>
              <p className="sub">Tokens never expire. Upgrade, downgrade, or skip a year — we don&apos;t mind.</p>
            </div>

            <div className="pgrid-4">
              {TIERS.map(t => (
                <div key={t.id} className={`pcard${t.hi ? ' hi' : ''}`}>
                  <div className="ptier">{t.tier}</div>
                  <span className="glyph">{t.glyph}</span>
                  <h3>{t.name}</h3>
                  <p className="desc">{t.desc}</p>
                  <div className="pprice"><span className="big">{t.price}</span></div>
                  <div className="tok-meta">
                    <div><div className="k">Tokens</div><div className="v">{t.tokens}</div></div>
                    <div style={{ textAlign: 'right' }}><div className="k">Per 1K</div><div className="v">{t.per1k}</div></div>
                  </div>
                  <ul className="plist">
                    {t.features.map(f => <li key={f}>{f}</li>)}
                  </ul>
                  <Link
                    href="/plan"
                    className={`btn cta${t.hi ? ' btn-accent btn-pill' : ' btn-ghost'}`}
                  >
                    Get {t.name} →
                  </Link>
                </div>
              ))}
            </div>

            <p className="wd-mono" style={{ marginTop: 32, fontSize: 12, color: 'var(--w-ink-muted-2)', letterSpacing: '0.05em', textAlign: 'center' }}>
              Tokens never expire · Top up anytime · Earn tokens back on every booking
            </p>
          </div>
        </section>

        {/* Feature gates */}
        <section className="sec">
          <div className="wrap">
            <div className="sec-head">
              <span className="wd-eyebrow">Feature gates</span>
              <h2 className="head">What unlocks at each tier.</h2>
              <p className="sub">The whole picture, laid out flat. No asterisks.</p>
            </div>
            <table className="ctable gates">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Light</th>
                  <th>Plan</th>
                  <th>Travel</th>
                  <th>Pro</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="grp" colSpan={5}>Search &amp; planning</td></tr>
                <tr><td className="feat">Destination search</td><td><span className="check">✓</span></td><td><span className="check">✓</span></td><td><span className="check">✓</span></td><td><span className="check">✓</span></td></tr>
                <tr><td className="feat">Cost breakdowns</td><td><span className="check">✓</span></td><td><span className="check">✓</span></td><td><span className="check">✓</span></td><td><span className="check">✓</span></td></tr>
                <tr><td className="feat">Itineraries (up to 5 days)</td><td><span className="check">✓</span></td><td><span className="check">✓</span></td><td><span className="check">✓</span></td><td><span className="check">✓</span></td></tr>
                <tr><td className="feat">Itineraries (up to 10 days)</td><td><span className="dash">—</span></td><td><span className="check">✓</span></td><td><span className="check">✓</span></td><td><span className="check">✓</span></td></tr>
                <tr><td className="feat">Itineraries (14+ days)</td><td><span className="dash">—</span></td><td><span className="dash">—</span></td><td><span className="check">✓</span></td><td><span className="check">✓</span></td></tr>
                <tr><td className="feat">AI chat refinement</td><td><span className="dash">—</span></td><td><span className="check">✓</span></td><td><span className="check">✓</span></td><td><span className="check">✓</span></td></tr>
                <tr><td className="feat">Priority AI speed</td><td><span className="dash">—</span></td><td><span className="dash">—</span></td><td><span className="check">✓</span></td><td><span className="check">✓</span></td></tr>

                <tr><td className="grp" colSpan={5}>Tracking</td></tr>
                <tr><td className="feat">Savings goals</td><td>1</td><td>1</td><td>3</td><td><span className="check">Unlimited</span></td></tr>
                <tr><td className="feat">Price alerts</td><td><span className="dash">—</span></td><td>3</td><td>10</td><td><span className="check">Unlimited</span></td></tr>
                <tr><td className="feat">Trip history</td><td><span className="dash">—</span></td><td><span className="check">✓</span></td><td><span className="check">✓</span></td><td><span className="check">✓</span></td></tr>

                <tr><td className="grp" colSpan={5}>Collaboration</td></tr>
                <tr><td className="feat">Group planning</td><td><span className="dash">—</span></td><td><span className="dash">—</span></td><td><span className="check">✓</span></td><td><span className="check">✓</span></td></tr>
                <tr><td className="feat">Multi-destination</td><td><span className="dash">—</span></td><td><span className="dash">—</span></td><td><span className="check">✓</span></td><td><span className="check">✓</span></td></tr>
                <tr><td className="feat">Team sharing</td><td><span className="dash">—</span></td><td><span className="dash">—</span></td><td><span className="dash">—</span></td><td><span className="check">✓</span></td></tr>
                <tr><td className="feat">Early access features</td><td><span className="dash">—</span></td><td><span className="dash">—</span></td><td><span className="dash">—</span></td><td><span className="check">✓</span></td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Earn-back */}
        <section className="sec sec-sand">
          <div className="wrap">
            <div className="sec-head">
              <span className="wd-eyebrow">Token earn-back</span>
              <h2 className="head">
                Book through Wandr,{' '}
                <span className="serif em">top yourself up.</span>
              </h2>
              <p className="sub">
                Every time you actually book something — or bring a friend along — we drop tokens
                back into your balance. The heaviest planners end up spending nearly nothing.
              </p>
            </div>
            <div className="earn-grid">
              {EARN.map(e => (
                <div key={e.act} className="earn-card">
                  <p className="act">{e.act}</p>
                  <div>
                    <span className="tk">{e.tk}</span>
                    <span className="tk-l">{e.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="sec">
          <div className="wrap-sm">
            <div className="sec-head">
              <span className="wd-eyebrow">Common questions</span>
              <h2 className="head">The short answer is usually &ldquo;yes.&rdquo;</h2>
            </div>
            <div className="faq">
              {FAQS.map((f, i) => (
                <details key={i} open={i === 0}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section className="cta-band">
          <div className="aurora-waitlist" />
          <div className="wrap-sm">
            <h2 className="head" style={{ fontSize: 'clamp(32px,4.5vw,52px)', margin: '0 0 20px' }}>
              Start with 500 free tokens.<br />
              <span className="em">Top up only when it&apos;s worth it.</span>
            </h2>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 }}>
              <Link href="/plan" className="btn btn-primary btn-lg">Create my account →</Link>
            </div>
          </div>
        </section>
      </main>

      <WandrFooter />
    </>
  );
}
