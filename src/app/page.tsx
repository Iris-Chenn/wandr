"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import BudgetInput from "@/components/BudgetInput";

const STATS = [
  { value: "60+", label: "Destinations" },
  { value: "Live", label: "Flight prices" },
  { value: "$200–$5K", label: "Budget range" },
  { value: "Free", label: "To use" },
];

const HOW_IT_WORKS = [
  { n: "01", title: "Enter your budget", desc: "One number covers everything — flights, hotel, food, and activities." },
  { n: "02", title: "See your world", desc: "A live map shows every destination you can actually afford right now." },
  { n: "03", title: "Book in one click", desc: "Flight and hotel in one flow. No 12 open tabs." },
];

const FEATURES = [
  {
    title: "Total trip cost",
    desc: "We break down every dollar — flights, hotel, food, activities. No hidden surprises when you land.",
    tag: "Unique",
    tagColor: "#D4612A",
    tagBg: "rgba(212,97,42,0.15)",
    borderFrom: "from-orange-500/25",
    borderTo: "to-cyan-500/10",
  },
  {
    title: "AI personalization",
    desc: "Two people with the same $800 budget get different trips. We match destinations to how you travel.",
    tag: "AI-powered",
    tagColor: "#22D3EE",
    tagBg: "rgba(6,182,212,0.12)",
    borderFrom: "from-cyan-500/25",
    borderTo: "to-violet-500/10",
  },
  {
    title: "Stretch & save",
    desc: "Every result shows a base trip, a +10% upgrade, and a budget-cut version. You decide how to spend.",
    tag: "Fintech",
    tagColor: "#A78BFA",
    tagBg: "rgba(139,92,246,0.15)",
    borderFrom: "from-violet-500/25",
    borderTo: "to-orange-500/10",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050A18]">
      <Navbar />

      {/* 1 — Hero */}
      <section className="relative bg-[#050A18] min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 text-center pt-14 overflow-hidden">
        <div className="absolute inset-0 dot-grid" />
        <div className="aurora-1" />
        <div className="aurora-2" />
        <div className="aurora-3" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-cyan-500/30 bg-cyan-500/5 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4612A] animate-pulse" />
            <span className="font-mono text-xs text-cyan-400/80 uppercase tracking-widest">Budget-first travel search</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] text-white mb-6 tracking-tight">
            Tell us your budget.<br />
            <span className="text-[#D4612A]">We&apos;ll find your</span><br />
            next adventure.
          </h1>

          <p className="text-lg sm:text-xl text-white/40 leading-relaxed mb-10 max-w-xl mx-auto">
            Stop searching destinations you can&apos;t afford. One number — your total budget — unlocks every trip you can actually take.
          </p>

          <a
            href="#search"
            className="inline-flex items-center gap-2 bg-[#D4612A] hover:bg-[#A84A1E] text-white font-semibold px-8 py-4 rounded-lg transition-colors text-base"
          >
            Find my trip →
          </a>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {["🇵🇹 Lisbon · $612", "🇲🇽 Mexico City · $490", "🇹🇭 Bangkok · $680"].map((item) => (
              <span
                key={item}
                className="text-sm font-mono text-cyan-300/70 bg-cyan-500/5 border border-cyan-500/20 rounded px-4 py-1.5 shadow-[0_0_14px_rgba(6,182,212,0.08)]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 2 — Search */}
      <section id="search" className="py-20 px-4 sm:px-6 bg-[#080F25] border-y border-white/5">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="font-mono text-xs text-cyan-400/60 uppercase tracking-widest mb-2">Start here</div>
            <h2 className="text-2xl font-bold text-white">How much do you have to spend?</h2>
          </div>
          <BudgetInput />
        </div>
      </section>

      {/* 3 — Stats strip */}
      <section className="py-12 px-4 sm:px-6 bg-[#050A18] border-b border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-white/[0.03] border border-white/8 rounded-xl py-5 px-4 backdrop-blur-sm hover:border-cyan-500/20 transition-colors"
            >
              <div className="font-mono text-2xl font-bold text-[#D4612A]">{s.value}</div>
              <div className="text-xs text-white/40 mt-1 font-mono uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 4 — How it works */}
      <section className="py-24 px-4 sm:px-6 bg-[#080F25] border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <div className="font-mono text-xs text-cyan-400/60 uppercase tracking-widest mb-3">How it works</div>
            <h2 className="text-3xl font-bold text-white">Three steps to your next trip.</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-12">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.n}>
                <div className="font-mono text-xs text-cyan-400 font-bold mb-4 tracking-widest">{step.n}</div>
                <h3 className="font-bold text-white text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Features */}
      <section className="py-24 px-4 sm:px-6 bg-[#050A18] border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <div className="font-mono text-xs text-cyan-400/60 uppercase tracking-widest mb-3">Why Wandr</div>
            <h2 className="text-3xl font-bold text-white">Nobody owns the full budget.<br />Until now.</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`relative p-px rounded-xl bg-gradient-to-br ${f.borderFrom} ${f.borderTo} hover:opacity-90 transition-opacity`}
              >
                <div className="bg-[#080F25] rounded-xl p-6 h-full">
                  <div className="mb-4">
                    <span
                      className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full"
                      style={{ color: f.tagColor, backgroundColor: f.tagBg }}
                    >
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 — The gap */}
      <section className="py-24 px-4 sm:px-6 bg-[#080F25] border-b border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="font-mono text-xs text-cyan-400/60 uppercase tracking-widest mb-6">The gap</div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
            Google Flights asks<br />&quot;Where to?&quot;
          </h2>
          <p className="text-2xl font-bold text-[#D4612A] mb-6">We ask &quot;How much?&quot;</p>
          <p className="text-white/40 leading-relaxed max-w-xl">
            Skyscanner, Expedia, and Google Flights assume you know where you&apos;re going.
            Wandr flips the model — your budget is the starting point, not an afterthought.
          </p>
        </div>
      </section>

      {/* 7 — Waitlist CTA */}
      <section className="relative bg-[#050A18] py-24 px-4 sm:px-6 overflow-hidden">
        <div className="aurora-waitlist" />
        <div className="relative z-10 max-w-xl mx-auto text-center">
          <div className="font-mono text-xs text-[#D4612A] uppercase tracking-widest mb-4">Early access</div>
          <h2 className="text-3xl font-bold text-white mb-3">Be first to know.</h2>
          <p className="text-white/40 mb-8">
            Get notified when price alerts and savings goals launch.
          </p>
          <WaitlistForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050A18] border-t border-white/5 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-mono font-bold text-white">wandr</span>
          <span className="text-sm text-white/20 font-mono">© 2026 Wandr · Travel made accessible</span>
        </div>
      </footer>
    </div>
  );
}

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const list = JSON.parse(localStorage.getItem("wandr_waitlist") || "[]");
      list.push({ email, savedAt: new Date().toISOString() });
      localStorage.setItem("wandr_waitlist", JSON.stringify(list));
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return <p className="text-[#D4612A] font-semibold font-mono">✓ You&apos;re on the list.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/40 font-mono"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-[#D4612A] hover:bg-[#A84A1E] text-white text-sm font-semibold px-5 py-3 rounded-lg transition-colors disabled:opacity-60 whitespace-nowrap"
      >
        {loading ? "…" : "Notify me"}
      </button>
    </form>
  );
}
