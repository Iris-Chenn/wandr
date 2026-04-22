"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function Navbar() {
  const { user, signIn, signOut, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email);
    setSubmitting(false);
    if (!error) setSent(true);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050A18]/95 backdrop-blur-md border-b border-cyan-500/15 shadow-[0_1px_24px_rgba(6,182,212,0.06)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-white tracking-tight">
            wandr
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm text-white/60 hover:text-white transition-colors">
              Saved trips
            </Link>
            {loading ? null : user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/40 hidden sm:block">{user.email}</span>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setShowModal(true); setSent(false); setEmail(""); }}
                className="text-sm font-semibold bg-[#D4612A] text-white px-4 py-1.5 rounded-lg hover:bg-[#A84A1E] transition-colors"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </nav>

      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-[#080F25] border border-white/10 rounded-xl p-7 w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-white mb-1">Sign in to Wandr</h2>
            <p className="text-sm text-white/40 mb-5">We&apos;ll email you a magic link — no password needed.</p>

            {sent ? (
              <div className="text-center py-4">
                <div className="font-mono text-cyan-400 text-2xl mb-3">✓</div>
                <div className="font-semibold text-white mb-1">Check your inbox</div>
                <p className="text-sm text-white/40">We sent a link to <strong className="text-white">{email}</strong>. Click it to sign in.</p>
              </div>
            ) : (
              <form onSubmit={handleSignIn} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/40 font-mono"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#D4612A] text-white font-semibold py-3 rounded-lg hover:bg-[#A84A1E] transition-colors disabled:opacity-60 text-sm"
                >
                  {submitting ? "Sending…" : "Send magic link"}
                </button>
              </form>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full text-center text-xs text-white/30 hover:text-white/60 transition-colors font-mono"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
