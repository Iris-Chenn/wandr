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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFFCF7]/90 backdrop-blur-sm border-b border-[#E0D8C8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold text-[#1A1A1A] tracking-tight">
            wandr
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-[#5A5A5A] hover:text-[#1A1A1A] transition-colors">
              Saved trips
            </Link>
            {loading ? null : user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#8A8A8A] hidden sm:block">{user.email}</span>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-[#5A5A5A] hover:text-[#1A1A1A] transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setShowModal(true); setSent(false); setEmail(""); }}
                className="text-sm font-medium bg-[#D4612A] text-white px-4 py-1.5 rounded-full hover:bg-[#A84A1E] transition-colors"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Magic link modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-[#FFFCF7] rounded-2xl p-7 w-full max-w-sm shadow-xl border border-[#E0D8C8]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-1">Sign in to Wandr</h2>
            <p className="text-sm text-[#5A5A5A] mb-5">We&apos;ll email you a magic link — no password needed.</p>

            {sent ? (
              <div className="text-center py-4">
                <div className="text-3xl mb-3">✉️</div>
                <div className="font-semibold text-[#1A1A1A] mb-1">Check your inbox</div>
                <p className="text-sm text-[#5A5A5A]">We sent a link to <strong>{email}</strong>. Click it to sign in.</p>
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
                  className="w-full border border-[#E0D8C8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4612A]/30"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#D4612A] text-white font-semibold py-3 rounded-xl hover:bg-[#A84A1E] transition-colors disabled:opacity-60 text-sm"
                >
                  {submitting ? "Sending…" : "Send magic link"}
                </button>
              </form>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full text-center text-xs text-[#8A8A8A] hover:text-[#5A5A5A]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
