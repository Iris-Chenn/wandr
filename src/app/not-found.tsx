import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Navbar />
      <main className="flex flex-col items-center justify-center px-4 pt-40 pb-20 text-center">
        <div className="text-6xl mb-6">🗺️</div>
        <h1 className="font-serif text-4xl font-bold text-[#1A1A1A] mb-3">Page not found</h1>
        <p className="text-[#5A5A5A] mb-8 max-w-sm">
          This destination doesn&apos;t exist — yet. Try searching for a trip within your budget.
        </p>
        <Link
          href="/"
          className="bg-[#D4612A] hover:bg-[#A84A1E] text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
        >
          Back to search
        </Link>
      </main>
    </div>
  );
}
