"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFFCF7]/90 backdrop-blur-sm border-b border-[#E0D8C8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl font-bold text-[#1A1A1A] tracking-tight">
          wandr
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm text-[#5A5A5A] hover:text-[#1A1A1A] transition-colors"
          >
            Saved trips
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium bg-[#D4612A] text-white px-4 py-1.5 rounded-full hover:bg-[#A84A1E] transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </nav>
  );
}
