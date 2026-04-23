import type { Metadata } from 'next';
import WandrNavbar from '@/components/WandrNavbar';
import WandrFooter from '@/components/WandrFooter';
import ExploreClient from './ExploreClient';

export const metadata: Metadata = {
  title: 'Explore destinations — Wandr',
  description:
    'Filter by budget, region, vibe, or visa-free access. Prices are live and per person, all-in — flights, hotel, food, and the fun stuff.',
};

export default function ExplorePage() {
  return (
    <>
      <WandrNavbar />

      <main>
        <header className="pghead">
          <span className="wd-eyebrow">Explore</span>
          <h1>Every place you can actually go.</h1>
          <p>
            Filter by budget, region, vibe, or visa-free access. Prices are live and per person,
            all-in — flights, hotel, food, and the fun stuff.
          </p>
        </header>

        <ExploreClient />

        {/* Curated collections */}
        <section className="sec">
          <div className="wrap">
            <div className="sec-head">
              <span className="wd-eyebrow">Trip inspiration</span>
              <h2 className="head">
                Curated collections{' '}
                <span className="serif em">for the curious</span>.
              </h2>
            </div>
            <div className="fgrid">
              <div className="fcard">
                <div className="ic">🍜</div>
                <h4>Under $600 food capitals</h4>
                <p>Eight cities where the street food is the headline act. From Hanoi to Lima.</p>
                <div style={{ marginTop: 14, fontFamily: 'var(--w-font-mono)', fontSize: 12, color: 'var(--w-accent)' }}>
                  8 trips · from $420 →
                </div>
              </div>
              <div className="fcard">
                <div className="ic">🏖️</div>
                <h4>Shoulder-season beaches</h4>
                <p>Warm water, empty beaches, prices that aren&apos;t a punishment.</p>
                <div style={{ marginTop: 14, fontFamily: 'var(--w-font-mono)', fontSize: 12, color: 'var(--w-accent)' }}>
                  12 trips · from $540 →
                </div>
              </div>
              <div className="fcard">
                <div className="ic">🎭</div>
                <h4>Weekend city-breaks</h4>
                <p>Three days, under $500, direct flight. The Friday-to-Sunday special.</p>
                <div style={{ marginTop: 14, fontFamily: 'var(--w-font-mono)', fontSize: 12, color: 'var(--w-accent)' }}>
                  9 trips · from $310 →
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <WandrFooter />
    </>
  );
}
