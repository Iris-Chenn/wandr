import Link from "next/link";
import WandrNavbar from "@/components/WandrNavbar";
import WandrFooter from "@/components/WandrFooter";
import RotatingHero from "@/components/RotatingHero";

export default function Home() {
  return (
    <>
      <WandrNavbar />

      <main>
        {/* ── Hero (rotating headline + live ticker) ── */}
        <RotatingHero />

        {/* ── How it works ── */}
        <section className="sec sec-sand" style={{ paddingTop: "88px" }}>
          <div className="wrap">
            <div className="sec-head">
              <span className="wd-eyebrow">How it works</span>
              <h2 className="head">
                Four steps.{" "}
                <span className="serif em">One honest number.</span>
              </h2>
              <p className="sub">
                Most travel sites start with &quot;where to?&quot; — which is a
                fine question if you already know. We start with what you
                actually have, and work backwards from there.
              </p>
            </div>

            <div className="how-grid">
              <div className="how-rail" />

              {/* Step 1 */}
              <div className="how-step">
                <div className="how-num"><span>01</span></div>
                <div className="how-ph how-ph-budget">
                  <div className="hp-tag">
                    <span className="hp-tag-dot" />
                    Step 1 · Budget
                  </div>
                  <div className="hp-body">
                    <div className="hp-row">
                      <span className="hp-lbl">Your budget</span>
                      <span className="hp-pill">USD</span>
                    </div>
                    <div className="hp-amt">
                      $<span>2,400</span>
                    </div>
                    <div className="hp-track">
                      <div className="hp-fill" />
                      <div className="hp-dot" />
                    </div>
                  </div>
                  <div className="hp-foot">
                    <span>$500</span>
                    <span>$10k+</span>
                  </div>
                </div>
                <h4>Tell us your number.</h4>
                <p>
                  Budget first. Always. One slider, total all-in — flights,
                  hotel, food, fun. No line-by-line yet.
                </p>
              </div>

              {/* Step 2 */}
              <div className="how-step">
                <div className="how-num"><span>02</span></div>
                <div className="how-ph how-ph-match">
                  <div className="hp-tag">
                    <span className="hp-tag-dot" />
                    Step 2 · Vibe
                  </div>
                  <div className="hp-body">
                    <div className="hp-chip-row">
                      <span className="hp-chip active">City</span>
                      <span className="hp-chip">Beach</span>
                      <span className="hp-chip">Nature</span>
                      <span className="hp-chip">Food</span>
                    </div>
                    <div className="hp-where">
                      <div className="hp-from">
                        <span className="hp-mono">JFK</span>
                        <span className="hp-arrow">→</span>
                        <span className="hp-mono hp-any">Anywhere</span>
                      </div>
                      <span className="hp-dates">Apr 14 · 5 nights</span>
                    </div>
                  </div>
                  <div className="hp-foot hp-foot-live">
                    <span className="hp-dot-live" />
                    42 trips match your number
                  </div>
                </div>
                <h4>Add a vibe.</h4>
                <p>
                  Where you&apos;re leaving from, when, and what kind of trip.
                  Cities, beaches, nature — or &quot;surprise me.&quot;
                </p>
              </div>

              {/* Step 3 */}
              <div className="how-step">
                <div className="how-num"><span>03</span></div>
                <div className="how-ph how-ph-results">
                  <div className="hp-tag">
                    <span className="hp-tag-dot" />
                    Step 3 · Matches
                  </div>
                  <div className="hp-body">
                    <div className="hp-result">
                      <span className="hp-flag">🇵🇹</span>
                      <div className="hp-result-txt">
                        <div className="hp-city">Lisbon</div>
                        <div className="hp-sub">5 nights · all-in</div>
                      </div>
                      <div className="hp-price">$1,940</div>
                    </div>
                    <div className="hp-result hp-best">
                      <span className="hp-flag">🇲🇽</span>
                      <div className="hp-result-txt">
                        <div className="hp-city">Mexico City</div>
                        <div className="hp-sub">5 nights · all-in</div>
                      </div>
                      <div className="hp-price">$1,620</div>
                    </div>
                    <div className="hp-result">
                      <span className="hp-flag">🇹🇭</span>
                      <div className="hp-result-txt">
                        <div className="hp-city">Bangkok</div>
                        <div className="hp-sub">7 nights · all-in</div>
                      </div>
                      <div className="hp-price">$2,280</div>
                    </div>
                  </div>
                  <div className="hp-foot">
                    <span>3 of 42</span>
                    <span>Ranked by fit</span>
                  </div>
                </div>
                <h4>See what&apos;s actually possible.</h4>
                <p>
                  Live flight + hotel + per-diem pricing across 60+
                  destinations.
                </p>
              </div>

              {/* Step 4 */}
              <div className="how-step">
                <div className="how-num"><span>04</span></div>
                <div className="how-ph how-ph-trip">
                  <div className="hp-tag">
                    <span className="hp-tag-dot" />
                    Step 4 · Itinerary
                  </div>
                  <div className="hp-body">
                    <div className="hp-trip-item">
                      <span className="hp-trip-ic hi-fl">✈</span>
                      <span className="hp-trip-lbl">Flight · JFK → LIS</span>
                      <span className="hp-trip-drag">⋮⋮</span>
                    </div>
                    <div className="hp-trip-item">
                      <span className="hp-trip-ic hi-ho">⌂</span>
                      <span className="hp-trip-lbl">Hotel · Alfama boutique</span>
                      <span className="hp-trip-drag">⋮⋮</span>
                    </div>
                    <div className="hp-trip-item hp-trip-drag-active">
                      <span className="hp-trip-ic hi-ac">◉</span>
                      <span className="hp-trip-lbl">Activities · Sintra day trip</span>
                      <span className="hp-trip-drag">⋮⋮</span>
                    </div>
                    <div className="hp-trip-item">
                      <span className="hp-trip-ic hi-re">◓</span>
                      <span className="hp-trip-lbl">Restaurants · 6 picks</span>
                      <span className="hp-trip-drag">⋮⋮</span>
                    </div>
                  </div>
                  <div className="hp-foot hp-foot-live">
                    <span className="hp-dot-live" />
                    Drag to swap anything
                  </div>
                </div>
                <h4>Book it. Tweak it. Done.</h4>
                <p>
                  Select the trip that includes flights, hotels, activities, and
                  restaurants in one click. Looking to add or switch something,
                  just drag.
                </p>
              </div>
            </div>

            <div className="how-cta">
              <Link href="/plan" className="btn btn-primary btn-lg">
                Start with your number →
              </Link>
              <span className="how-cta-note">
                No sign-up required · Takes about 40 seconds
              </span>
            </div>
          </div>
        </section>

        {/* ── Insights / Spending chart ── */}
        <section className="sec">
          <div className="wrap">
            <div className="split">
              <div>
                <div className="chart-card">
                  <div className="chart-title">Total spend · this trip</div>
                  <div className="chart-big">
                    $1,240.
                    <span style={{ fontSize: "28px", color: "var(--w-ink-muted)" }}>
                      80
                    </span>
                  </div>
                  <div className="bars">
                    <div className="bar" style={{ height: "45%" }}>
                      <span className="lbl">Mon</span>
                    </div>
                    <div className="bar" style={{ height: "62%" }}>
                      <span className="lbl">Tue</span>
                    </div>
                    <div className="bar" style={{ height: "38%" }}>
                      <span className="lbl">Wed</span>
                    </div>
                    <div className="bar" style={{ height: "72%" }}>
                      <span className="lbl">Thu</span>
                    </div>
                    <div className="bar hi" style={{ height: "92%" }}>
                      <span className="top">$264</span>
                      <span className="lbl">Fri</span>
                    </div>
                    <div className="bar" style={{ height: "55%" }}>
                      <span className="lbl">Sat</span>
                    </div>
                    <div className="bar" style={{ height: "48%" }}>
                      <span className="lbl">Sun</span>
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: "40px",
                      fontFamily: "var(--w-font-mono)",
                      fontSize: "11px",
                      color: "var(--w-ink-muted-2)",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>↗ 12% under budget</span>
                    <span>BUDGET · $1,400</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="wd-eyebrow">Insights</span>
                <h3
                  style={{
                    margin: "14px 0 16px",
                    fontSize: "40px",
                    fontWeight: 700,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.1,
                    color: "var(--w-ink)",
                    fontFamily: "var(--w-font-sans)",
                  }}
                >
                  Master your spending with{" "}
                  <span
                    style={{
                      fontFamily: "var(--w-font-serif)",
                      fontStyle: "italic",
                      fontWeight: 700,
                    }}
                  >
                    Insights
                  </span>
                  .
                </h3>
                <p
                  style={{
                    color: "var(--w-ink-muted)",
                    fontSize: "16px",
                    lineHeight: 1.65,
                    margin: "0 0 24px",
                  }}
                >
                  Every transaction on your Wandr card is auto-categorized, so
                  you know exactly how much of your budget went to flights,
                  hotels, food, and the fun stuff.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  {[
                    {
                      title: "Automatic transaction categorization",
                      body: "No manual tagging. A clear picture of where your money went, the moment you tap your card.",
                    },
                    {
                      title: "Daily budget vs. actual",
                      body: "See your pace at a glance — and get a gentle nudge before the overspend, not after.",
                    },
                    {
                      title: "Trip cost history",
                      body: "Every trip, stored and searchable. Know what Lisbon really cost you before you book the next one.",
                    },
                  ].map((item) => (
                    <div key={item.title}>
                      <div
                        style={{
                          fontWeight: 600,
                          marginBottom: "4px",
                          color: "var(--w-ink)",
                        }}
                      >
                        {item.title}
                      </div>
                      <p
                        style={{
                          margin: 0,
                          color: "var(--w-ink-muted)",
                          fontSize: "14px",
                          lineHeight: 1.55,
                        }}
                      >
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Why Wandr — bright feature block ── */}
        <section className="sec sec-sand" style={{ paddingTop: "64px" }}>
          <div className="wrap">
            <div className="bright-block">
              <div className="bb-orb bb-orb-1" />
              <div className="bb-orb bb-orb-2" />
              <div className="bb-orb bb-orb-3" />
              <div className="bb-dots" />
              <div className="bb-head">
                <span className="wd-eyebrow">Why Wandr</span>
                <h3 className="bh">
                  Start your journey to
                  <br />
                  <span className="serif em">financial freedom</span> abroad.
                </h3>
              </div>
              <div className="bright-grid">
                {[
                  {
                    cls: "bc-teal",
                    icon: "⌖",
                    title: "Manage your accounts",
                    body: "Our app integrates seamlessly with your bank accounts, so you can keep flights, hotels, and daily spend in one view.",
                  },
                  {
                    cls: "bc-sun",
                    icon: "⛨",
                    title: "Secure and reliable",
                    body: "Bank-grade encryption, per-trip virtual cards, and instant freeze. Rest assured — your money stays your money.",
                  },
                  {
                    cls: "bc-coral",
                    icon: "▭",
                    title: "Multi-device support",
                    body: "Start on your laptop, finish on your phone. Real-time sync across web, iOS, and Android.",
                  },
                  {
                    cls: "bc-teal",
                    icon: "☺",
                    title: "No app juggling",
                    body: "Book flights, send money, check balance. One Wandr login covers the whole trip, before and during.",
                  },
                  {
                    cls: "bc-coral",
                    icon: "◷",
                    title: "Offline, when you need it",
                    body: "Boarding passes, itineraries, and saved maps stay accessible without signal — because the worst moment to lose your trip is at immigration.",
                  },
                  {
                    cls: "bc-sun",
                    icon: "✦",
                    title: "Personalized alerts",
                    body: "Price drops, FX dips, and visa-window reminders — sent only when it actually matters.",
                  },
                ].map((card) => (
                  <div key={card.title} className={`bright-card ${card.cls}`}>
                    <div className="ic">{card.icon}</div>
                    <h4>{card.title}</h4>
                    <p>{card.body}</p>
                  </div>
                ))}
              </div>
              <div className="bright-footer">
                <p>
                  Wandr is a regulated fintech partnered with Duffel. We are on
                  a mission to make travel simpler, easier, and more accessible.
                </p>
                <Link
                  href="/pricing"
                  className="btn btn-primary"
                  style={{ flexShrink: 0 }}
                >
                  Explore more →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Destinations preview ── */}
        <section className="sec">
          <div className="wrap">
            <div className="sec-head">
              <span className="wd-eyebrow">What $700 gets you today</span>
              <h2 className="head">
                Real trips, <span className="em">live prices</span>.
              </h2>
            </div>
            <div className="dgrid">
              {([
                { ph: "1585208798174-6cedd86e019a", city: "Lisbon",      country: "Portugal", flag: "🇵🇹", tag: "Iberia",   whisper: "pastel de nata · sunset trams", match: "perfect", price: 612, savings: 88,  live: true  },
                { ph: "1518638150340-f706e86654de", city: "Mexico City", country: "Mexico",   flag: "🇲🇽", tag: "Capital",  whisper: "Roma Norte vibes",              match: "great",   price: 490, savings: 210, live: false },
                { ph: "1508009603885-50cf7c579365", city: "Bangkok",     country: "Thailand", flag: "🇹🇭", tag: "Thailand", whisper: "temples · street food · chaos", match: "perfect", price: 680, savings: 20,  live: true  },
              ] as const).map((dest) => {
                const isTop = dest.match === "perfect";
                const pillCls = isTop
                  ? "bg-[#F26B2D] text-white"
                  : "bg-white/90 text-[#0E3B2A] border border-[#0E3B2A] backdrop-blur-sm";
                const dotCls = isTop ? "bg-white" : "bg-[#1F8A5B]";
                const pillLabel = isTop ? "Top pick" : "Good fit";
                return (
                  <Link
                    key={dest.city}
                    href="/explore"
                    className="block rounded overflow-hidden border border-[#e0d8c8] shadow-[0_1px_0_rgba(14,26,20,0.04)] flex flex-col group bg-white"
                    style={{ textDecoration: "none" }}
                  >
                    {/* Image */}
                    <div className="relative" style={{ minHeight: 240 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://images.unsplash.com/photo-${dest.ph}?auto=format&fit=crop&w=700&q=75`}
                        alt={dest.city}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/0 from-30% to-black/55 pointer-events-none" />
                      {/* top row */}
                      <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
                        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-white bg-black/55 backdrop-blur-sm px-2 py-1 rounded-sm">
                          {dest.tag}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] tracking-[0.1em] uppercase font-semibold ${pillCls}`}>
                          <span className={`w-[5px] h-[5px] rounded-full flex-shrink-0 ${dotCls}`} />
                          {pillLabel}
                        </span>
                      </div>
                      {/* city + whisper */}
                      <div className="absolute bottom-4 left-[18px] right-[18px] text-white z-10">
                        <div className="font-serif italic leading-[0.95] tracking-[-0.02em] text-[36px]">{dest.city}</div>
                        <div className="font-mono text-[11px] tracking-[0.08em] opacity-85 mt-1.5">
                          {dest.flag} {dest.country.toUpperCase()} · {dest.whisper}
                        </div>
                      </div>
                    </div>
                    {/* Footer */}
                    <div className="flex items-center justify-between bg-white border-t border-[#e0d8c8] gap-2.5 px-3.5 py-3">
                      <div className="flex items-baseline gap-2">
                        <span className="font-sans font-semibold text-xl" style={{ color: "#0A0A0A" }}>${dest.price}</span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.06em]" style={{ color: "#9A9A8A" }}>/ person</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-mono text-[11px] font-semibold px-2 py-1 rounded-sm text-[#2F6B5E] bg-[#2F6B5E]/10">
                          −${dest.savings}
                        </span>
                        {dest.live && (
                          <span className="font-mono text-[10px] text-[#2F6B5E] bg-[#2F6B5E]/10 px-2 py-1 rounded-sm font-semibold">LIVE</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <Link href="/explore" className="btn btn-ghost">
                See all 60+ destinations →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <WandrFooter />
    </>
  );
}
