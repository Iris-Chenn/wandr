"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import BudgetInput from "@/components/BudgetInput";

const SOCIAL_PROOF = [
  { emoji: "🇵🇹", text: "Lisbon for 5 nights · $612 total" },
  { emoji: "🇲🇽", text: "Mexico City for 7 nights · $490 total" },
  { emoji: "🇹🇭", text: "Bangkok for 10 nights · $680 total" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Navbar />

      {/* Hero */}
      <main className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Left: copy */}
            <div className="pt-4">
              <div className="inline-block font-mono text-xs text-[#D4612A] uppercase tracking-widest mb-4">
                Budget-first travel search
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-[#1A1A1A] mb-6">
                Tell us your budget.
                <br />
                <span className="text-[#D4612A]">We'll find your</span>
                <br />
                next adventure.
              </h1>
              <p className="text-lg text-[#5A5A5A] leading-relaxed mb-8 max-w-md">
                Stop searching destinations you can't afford. Enter one number — your total budget — and see every trip you can actually take.
              </p>

              {/* Social proof chips */}
              <div className="flex flex-wrap gap-2">
                {SOCIAL_PROOF.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-[#FFFCF7] border border-[#E0D8C8] rounded-full px-3 py-1.5 text-sm text-[#5A5A5A]"
                  >
                    <span>{item.emoji}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* How it works */}
              <div className="mt-12 hidden lg:block">
                <div className="text-xs font-mono text-[#8A8A8A] uppercase tracking-widest mb-4">How it works</div>
                <div className="space-y-4">
                  {[
                    { n: "1", title: "Enter your budget", desc: "One number. Flights + hotel + food all included." },
                    { n: "2", title: "See your world", desc: "A map lights up with every trip you can afford." },
                    { n: "3", title: "Book in one click", desc: "Flight and hotel combined. No tab-switching." },
                  ].map((step) => (
                    <div key={step.n} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#D4612A] text-white text-xs font-mono font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {step.n}
                      </div>
                      <div>
                        <div className="font-semibold text-[#1A1A1A] text-sm">{step.title}</div>
                        <div className="text-sm text-[#5A5A5A]">{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: search widget */}
            <div>
              <BudgetInput />

              {/* Waitlist for early access */}
              <div className="mt-4 bg-[#E8DFF5] border border-[#6B4FA0]/20 rounded-xl p-4">
                <div className="text-xs font-mono text-[#6B4FA0] uppercase tracking-widest mb-1">Early access</div>
                <p className="text-sm text-[#1A1A1A] font-medium mb-3">
                  Get notified when price alerts and savings goals launch
                </p>
                <WaitlistForm />
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Features strip */}
      <section className="border-t border-[#E0D8C8] bg-[#FFFCF7] py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="font-mono text-xs text-[#8A8A8A] uppercase tracking-widest mb-2">Why Wandr</div>
            <h2 className="font-serif text-3xl font-bold text-[#1A1A1A]">Nobody owns the full budget. Until now.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "✈️",
                title: "Total trip cost, not just flights",
                desc: "We break down your budget across flights, hotel, food, and activities — so there are no surprises on the ground.",
                tag: "Unique",
                tagColor: "#D4612A",
                tagBg: "#F0D4C0",
              },
              {
                icon: "🧠",
                title: "AI personalization",
                desc: "Tell us you're a foodie or an adventurer. Two people with the same $800 get very different, perfectly-matched trips.",
                tag: "AI-powered",
                tagColor: "#1A7A6D",
                tagBg: "#D0ECE7",
              },
              {
                icon: "💰",
                title: "Stretch & save options",
                desc: "Every destination shows a base option, a 10% stretch with a savings plan, and a deep-save budget version.",
                tag: "Fintech",
                tagColor: "#6B4FA0",
                tagBg: "#E8DFF5",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-[#FFFCF7] border border-[#E0D8C8] rounded-xl p-6"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-[#1A1A1A] text-base leading-snug">{f.title}</h3>
                  <span
                    className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ color: f.tagColor, backgroundColor: f.tagBg }}
                  >
                    {f.tag}
                  </span>
                </div>
                <p className="text-sm text-[#5A5A5A] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitor callout */}
      <section className="py-16 px-4 sm:px-6 bg-[#F5F0E8]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="font-mono text-xs text-[#8A8A8A] uppercase tracking-widest mb-3">The gap</div>
          <h2 className="font-serif text-3xl font-bold text-[#1A1A1A] mb-4">
            Google Flights asks "Where to?"<br />
            <span className="text-[#D4612A]">We ask "How much?"</span>
          </h2>
          <p className="text-[#5A5A5A] leading-relaxed">
            Skyscanner, Expedia, and Google Flights all assume you know where you're going.
            Wandr flips the model — your budget is the starting point, not an afterthought.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E0D8C8] bg-[#FFFCF7] py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-serif text-lg font-bold text-[#1A1A1A]">wandr</span>
          <span className="text-sm text-[#8A8A8A]">© 2026 Wandr · Travel made accessible</span>
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
      // Also save locally as backup
      const list = JSON.parse(localStorage.getItem("wandr_waitlist") || "[]");
      list.push({ email, savedAt: new Date().toISOString() });
      localStorage.setItem("wandr_waitlist", JSON.stringify(list));
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-sm font-semibold text-[#6B4FA0]">
        ✓ You&apos;re on the list! We&apos;ll notify you when it&apos;s ready.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 bg-white border border-[#6B4FA0]/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B4FA0]/30"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-[#6B4FA0] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#5a3f88] transition-colors disabled:opacity-60"
      >
        {loading ? "…" : "Notify me"}
      </button>
    </form>
  );
}
