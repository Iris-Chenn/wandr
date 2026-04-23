"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const WORDS = [
  "adventure.",
  "summer vacation.",
  "ski trip.",
  "honeymoon.",
  "weekend escape.",
  "city break.",
  "safari.",
  "road trip.",
];

const CITIES_DATA = [
  { flag: "🇵🇹", city: "Lisbon",        code: "LIS", price: 612 },
  { flag: "🇲🇽", city: "Mexico City",   code: "MEX", price: 490 },
  { flag: "🇹🇭", city: "Bangkok",       code: "BKK", price: 680 },
  { flag: "🇨🇿", city: "Prague",        code: "PRG", price: 650 },
  { flag: "🇯🇵", city: "Tokyo",         code: "NRT", price: 892 },
  { flag: "🇮🇹", city: "Rome",          code: "FCO", price: 588 },
  { flag: "🇪🇸", city: "Barcelona",     code: "BCN", price: 574 },
  { flag: "🇨🇴", city: "Medellín",      code: "MDE", price: 425 },
  { flag: "🇲🇦", city: "Marrakech",     code: "RAK", price: 702 },
  { flag: "🇮🇸", city: "Reykjavik",     code: "KEF", price: 418 },
  { flag: "🇹🇷", city: "Istanbul",      code: "IST", price: 621 },
  { flag: "🇬🇷", city: "Athens",        code: "ATH", price: 596 },
  { flag: "🇻🇳", city: "Hanoi",         code: "HAN", price: 865 },
  { flag: "🇿🇦", city: "Cape Town",     code: "CPT", price: 1140 },
  { flag: "🇵🇪", city: "Lima",          code: "LIM", price: 538 },
  { flag: "🇦🇷", city: "Buenos Aires",  code: "EZE", price: 712 },
  { flag: "🇮🇩", city: "Bali",          code: "DPS", price: 945 },
  { flag: "🇭🇷", city: "Split",         code: "SPU", price: 660 },
  { flag: "🇹🇼", city: "Taipei",        code: "TPE", price: 810 },
  { flag: "🇲🇽", city: "Oaxaca",        code: "OAX", price: 512 },
];

type CityState = (typeof CITIES_DATA)[0] & { flash?: "up" | "down" };

export default function RotatingHero() {
  const spanRef = useRef<HTMLSpanElement>(null);
  const wordIdxRef = useRef(0);

  const [cities, setCities] = useState<CityState[]>(() =>
    CITIES_DATA.map((c) => ({ ...c }))
  );

  // Rotating word
  useEffect(() => {
    const span = spanRef.current;
    if (!span) return;
    const id = setInterval(() => {
      wordIdxRef.current = (wordIdxRef.current + 1) % WORDS.length;
      span.classList.remove("is-in");
      span.classList.add("is-out");
      setTimeout(() => {
        span.textContent = WORDS[wordIdxRef.current];
        span.classList.remove("is-out");
        void span.offsetWidth; // force reflow for transition restart
        span.classList.add("is-in");
      }, 380);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  // Live price jitter
  useEffect(() => {
    const id = setInterval(() => {
      const idx = Math.floor(Math.random() * CITIES_DATA.length);
      const drift = Math.round((Math.random() - 0.5) * 24);
      if (drift === 0) return;
      setCities((prev) => {
        const next = [...prev];
        const c = { ...next[idx] };
        c.price = Math.max(120, c.price + drift);
        c.flash = drift < 0 ? "down" : "up";
        next[idx] = c;
        return next;
      });
      // Clear flash after 900ms
      setTimeout(() => {
        setCities((prev) => {
          const next = [...prev];
          next[idx] = { ...next[idx], flash: undefined };
          return next;
        });
      }, 900);
    }, 1400);
    return () => clearInterval(id);
  }, []);

  // Render ticker twice for seamless marquee
  const tickerItems = [...cities, ...cities];

  return (
    <section className="hero">
      <div className="dotgrid" />
      <div className="aurora aurora-1" />
      <div className="aurora aurora-2" />
      <div className="aurora aurora-3" />

      <div className="hero-inner">
        <h1 className="display">
          We&apos;ll find your next
          <br />
          <span className="rotator" aria-live="polite">
            <span ref={spanRef} className="rot-word is-in">
              adventure.
            </span>
          </span>
        </h1>
        <p className="lede">
          Wandr starts with one number — your desired spending — and shows every
          trip you are looking for: live flights, hotels, plans… all in one
          place. Just one click to book all you need.
        </p>
        <Link href="/plan" className="btn btn-primary btn-lg">
          Get started →
        </Link>
      </div>

      {/* Live ticker */}
      <div className="tape" aria-label="Live cheapest flight prices">
        <div className="tape-label">
          <span className="tape-dot" />
          Live · Cheapest flight from NYC
        </div>
        <div className="tape-viewport">
          <div className="tape-track">
            {tickerItems.map((c, i) => (
              <span key={`${c.code}-${i}`} className="tape-item">
                <span className="tcity">{c.city}</span>
                <span className="tcode">{c.code}</span>
                <span
                  className={`tprice${c.flash ? ` flash-${c.flash}` : ""}`}
                >
                  ${c.price}
                </span>
                <span className="tape-sep">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
