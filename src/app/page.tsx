"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import BudgetInput from "@/components/BudgetInput";

const SOCIAL_PROOF = [
  { emoji: "🇵🇹", text: "Lisbon for 5 nights · $612 total" },
  { emoji: "🇲🇽", text: "Mexico City for 7 nights · $490 total" },
  { emoji: "🇹🇭", text: "Bangkok for 10 nights · $680 total" },
];

const HOW_IT_WORKS = [
  { n: "01", title: "Enter your budget", desc: "One number. Flights + hotel + food all included." },
  { n: "02", title: "See your world", desc: "A map lights up with every trip you can afford." },
  { n: "03", title: "Book in one click", desc: "Flight and hotel combined. No tab-switching." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Dark hero */}
      <section className="bg-[#0D0D0D] pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Left: copy */}
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-3 py-1 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4612A] animate-pulse" />
                <span className="font-mono text-xs text-white/60 uppercase tracking-widest">Budget-first travel search</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6">
                Tell us your budget.
                <br />
                <span className="text-[#D4612A]">We&apos;ll find your</span>
                <br />
                next adventure.
              </h1>

              <p className="text-lg text-white/50 leading-relaxed mb-8 max-w-md">
                Stop searching destinations you can&apos;t afford. Enter one number — your total budget — and see every trip you can actually take.
              </p>

              {/* Social proof chips */}
              <div className="flex flex-wrap gap-2 mb-12">
                {SOCIAL_PROOF.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-sm text-white/50"
                  >
                    <span>{item.emoji}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* How it works */}
              <div className="hidden lg:block border-t border-white/10 pt-8">
                <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-5">How it works</div>
                <div className="space-y-5">
                  {HOW_IT_WORKS.map((step) => (
                    <div key={step.n} className="flex items-start gap-4">
                      <div className="font-mono text-xs text-[#D4612A] font-bold w-6 flex-shrink-0 mt-0.5">{step.n}</div>
                      <div>
                        <div className="font-semibold text-white text-sm">{step.title}</div>
                        <div className="text-sm text-white/40">{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: search widget */}
            <div>
              <BudgetInput />

              <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-xs font-mono text-[#D4612A] uppercase tracking-widest mb-1">Early access</div>
                <p className="text-sm text-white/70 font-medium mb-3">
                  Get notified when price alerts and savings goals launch
                </p>
                <WaitlistForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — mobile only */}
      <section className="lg:hidden border-b border-[#E5E7EB] bg-[#F9FAFB] py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-xs font-mono text-[#9CA3AF] uppercase tracking-widest mb-6">How it works</div>
          <div className="space-y-5">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.n} className="flex items-start gap-4">
                <div className="font-mono text-xs text-[#D4612A] font-bold w-6 flex-shrink-0 mt-0.5">{step.n}</div>
                <div>
                  <div className="font-semibold text-[#0A0A0A] text-sm">{step.title}</div>
                  <div className="text-sm text-[#6B7280]">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="border-b border-[#E5E7EB] py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="font-mono text-xs text-[#9CA3AF] uppercase tracking-widest mb-3">Why Wandr</div>
            <h2 className="text-3xl font-bold text-[#0A0A0A]">Nobody owns the full budget. Until now.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: "✈️",
                title: "Total trip cost, not just flights",
                desc: "We break down your budget across flights, hotel, food, and activities — so there are no surprises on the ground.",
                tag: "Unique",
                tagColor: "#D4612A",
                tagBg: "#FEE9DC",
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
                tagBg: "#EDE9F8",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white border border-[#E5E7EB] rounded-xl p-6 hover:border-[#D4612A]/30 transition-colors"
              >
                <div className="text-2xl mb-4">{f.icon}</div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-[#0A0A0A] text-sm leading-snug">{f.title}</h3>
                  <span
                    className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ color: f.tagColor, backgroundColor: f.tagBg }}
                  >
                    {f.tag}
                  </span>
                </div>
                <p className="text-sm text-[#6B7280] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitor callout */}
      <section className="py-16 px-4 sm:px-6 bg-[#F9FAFB] border-b border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="font-mono text-xs text-[#9CA3AF] uppercase tracking-widest mb-3">The gap</div>
          <h2 className="text-3xl font-bold text-[#0A0A0A] mb-4">
            Google Flights asks &quot;Where to?&quot;<br />
            <span className="text-[#D4612A]">We ask &quot;How much?&quot;</span>
          </h2>
          <p className="text-[#6B7280] leading-relaxed">
            Skyscanner, Expedia, and Google Flights all assume you know where you&apos;re going.
            Wandr flips the model — your budget is the starting point, not an afterthought.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] bg-[#0D0D0D] py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-lg text-white">wandr</span>
          <span className="text-sm text-white/30">© 2026 Wandr · Travel made accessible</span>
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
    return (
      <div className="text-sm font-semibold text-[#D4612A]">
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
        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#D4612A]/40"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-[#D4612A] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#A84A1E] transition-colors disabled:opacity-60"
      >
        {loading ? "…" : "Notify me"}
      </button>
    </form>
  );
}
