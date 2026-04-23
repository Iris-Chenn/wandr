import type { Metadata } from 'next';
import Link from 'next/link';
import WandrNavbar from '@/components/WandrNavbar';
import WandrFooter from '@/components/WandrFooter';

export const metadata: Metadata = {
  title: 'About — Wandr',
  description:
    'Wandr is rebuilding the trip-planning stack around a simple idea: the most honest question a travel app can ask is "how much?"',
};

export default function AboutPage() {
  return (
    <>
      <WandrNavbar />

      <main>
        {/* Page header */}
        <header className="pghead">
          <span className="wd-eyebrow">About Wandr</span>
          <h1>
            We think travel tools should{' '}
            <span style={{ fontFamily: 'var(--w-font-serif)', fontStyle: 'italic' }}>
              start with the budget
            </span>
            , not the destination.
          </h1>
          <p>
            Wandr is a small team of ex-travel, ex-fintech folks rebuilding the trip-planning stack
            around a simple idea: the most honest question a travel app can ask is &ldquo;how much?&rdquo;
          </p>
        </header>

        {/* Manifesto */}
        <section className="sec">
          <div className="wrap-sm">
            <span className="wd-eyebrow">The manifesto</span>
            <h2 className="head" style={{ margin: '14px 0 20px' }}>
              Others ask &ldquo;Where to?&rdquo;<br />
              <span className="em">We ask &ldquo;How much?&rdquo;</span>
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--w-ink-muted)', margin: '0 0 18px' }}>
              Every travel site assumes you already know the destination. That&apos;s a nice assumption
              for the 10% of travelers who do. For the rest of us — the ones with a number in our head
              and a gap on the calendar — it&apos;s backwards.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--w-ink-muted)', margin: '0 0 18px' }}>
              We built Wandr because we were tired of opening 14 tabs, running the conversion math on
              the back of a napkin, and still ending up $300 over. A trip should start with what you
              have, not what they want you to spend.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--w-ink-muted)', margin: 0 }}>
              And because travel spending is financial — FX, cards, transfers, insurance — we decided
              to build the fintech ourselves, rather than tack a partner logo on and take a cut. If
              we&apos;re going to fix it, we fix the whole thing.
            </p>
          </div>
        </section>

        {/* Three promises */}
        <section className="sec sec-sand">
          <div className="wrap">
            <div className="sec-head">
              <span className="wd-eyebrow">How we work</span>
              <h2 className="head">Three things we promise.</h2>
            </div>
            <div className="values">
              <div className="value">
                <div className="n">01</div>
                <h4>The real rate. Always.</h4>
                <p>No hidden FX spread. No &ldquo;preferred&rdquo; rate. If we can&apos;t give you mid-market, we tell you the markup upfront. Every time.</p>
              </div>
              <div className="value">
                <div className="n">02</div>
                <h4>Every fee, in plain English.</h4>
                <p>We list every charge on every screen. If you have to dig through a PDF to find it, it shouldn&apos;t exist. So we removed it.</p>
              </div>
              <div className="value">
                <div className="n">03</div>
                <h4>Your data, your trip.</h4>
                <p>We never sell your browsing history to airlines. No price-hiking based on the device you&apos;re on. No ad network. Period.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="sec">
          <div className="wrap-sm">
            <div style={{ marginBottom: 24 }}>
              <span className="wd-eyebrow">Our story</span>
              <h2 className="head" style={{ marginTop: 14 }}>A short history.</h2>
            </div>
            <p style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--w-ink-muted)', margin: 0 }}>
              Wandr started in 2025 as a weekend prototype and a stubborn hunch — that the first
              question a travel app asks shouldn&apos;t be &ldquo;where to?&rdquo; but &ldquo;how much?&rdquo; Seven advisors
              said nobody wanted it. We built it anyway, started with a public beta that briefly broke
              our flight-data provider, and are currently building toward a Mastercard debit card
              partnered with Evolve Bank &amp; Trust. Today we&apos;re a lean team working across Brooklyn
              and elsewhere — and still answering email from the same inbox we started with.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="sec sec-sand">
          <div className="wrap-sm" style={{ textAlign: 'center' }}>
            <span className="wd-eyebrow">Try it</span>
            <h2 className="head" style={{ margin: '14px 0 16px' }}>
              Start planning for free.
            </h2>
            <p className="sub" style={{ margin: '0 auto 32px' }}>
              500 tokens on us. No credit card. Just tell us your budget.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/plan" className="btn btn-primary btn-lg">Plan a trip →</Link>
              <Link href="/pricing" className="btn btn-ghost btn-lg">See pricing</Link>
            </div>
          </div>
        </section>
      </main>

      <WandrFooter />
    </>
  );
}
