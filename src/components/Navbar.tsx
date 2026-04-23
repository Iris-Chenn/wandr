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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f2f0eb]/95 backdrop-blur-md border-b border-[#e7e7e7] nav-shadow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-[#1E3932] tracking-tight">
            wandr
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm text-[rgba(0,0,0,0.58)] hover:text-[rgba(0,0,0,0.87)] transition-colors">
              Saved trips
            </Link>
            {loading ? null : user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-[rgba(0,0,0,0.38)] hidden sm:block">{user.email}</span>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-[rgba(0,0,0,0.58)] hover:text-[rgba(0,0,0,0.87)] transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setShowModal(true); setSent(false); setEmail(""); }}
                className="text-sm font-semibold border border-[#00754A] text-[#00754A] px-5 py-1.5 rounded-full hover:bg-[#00754A] hover:text-white active:scale-95 transition-all"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </nav>

      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white border border-[#e7e7e7] rounded-2xl p-7 w-full max-w-sm card-shadow"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-[rgba(0,0,0,0.87)] mb-1">Sign in to Wandr</h2>
            <p className="text-sm text-[rgba(0,0,0,0.58)] mb-5">We&apos;ll email you a magic link — no password needed.</p>

            {sent ? (
              <div className="text-center py-4">
                <div className="font-mono text-[#006241] text-2xl mb-3">✓</div>
                <div className="font-semibold text-[rgba(0,0,0,0.87)] mb-1">Check your inbox</div>
                <p className="text-sm text-[rgba(0,0,0,0.58)]">We sent a link to <strong className="text-[rgba(0,0,0,0.87)]">{email}</strong>. Click it to sign in.</p>
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
                  className="w-full bg-[#f2f0eb] border border-[#e7e7e7] rounded-xl px-4 py-3 text-sm text-[rgba(0,0,0,0.87)] placeholder-[rgba(0,0,0,0.38)] focus:outline-none focus:ring-2 focus:ring-[#00754A]/30 focus:border-[#00754A]/40 font-mono"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#00754A] text-white font-semibold py-3 rounded-full hover:bg-[#006241] active:scale-95 transition-all disabled:opacity-60 text-sm"
                >
                  {submitting ? "Sending…" : "Send magic link"}
                </button>
              </form>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full text-center text-xs text-[rgba(0,0,0,0.38)] hover:text-[rgba(0,0,0,0.58)] transition-colors font-mono"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
