import Navbar from "@/components/Navbar";

function SkeletonCard() {
  return (
    <div className="bg-[#FFFCF7] border border-[#E0D8C8] rounded-2xl overflow-hidden animate-pulse">
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#E8E0D0]" />
            <div>
              <div className="w-24 h-4 bg-[#E8E0D0] rounded mb-1" />
              <div className="w-16 h-3 bg-[#E8E0D0] rounded" />
            </div>
          </div>
          <div className="w-20 h-6 bg-[#E8E0D0] rounded-full" />
        </div>
        <div className="w-full h-3 bg-[#E8E0D0] rounded mb-1" />
        <div className="w-3/4 h-3 bg-[#E8E0D0] rounded mb-3" />
        <div className="flex gap-1 mb-3">
          <div className="w-12 h-5 bg-[#E8E0D0] rounded-full" />
          <div className="w-14 h-5 bg-[#E8E0D0] rounded-full" />
        </div>
        <div className="w-full h-2 bg-[#E8E0D0] rounded-full mb-2" />
        <div className="flex justify-between">
          <div className="w-12 h-3 bg-[#E8E0D0] rounded" />
          <div className="w-12 h-3 bg-[#E8E0D0] rounded" />
          <div className="w-12 h-3 bg-[#E8E0D0] rounded" />
          <div className="w-12 h-3 bg-[#E8E0D0] rounded" />
        </div>
      </div>
      <div className="px-5 py-3 bg-[#F5F0E8] border-t border-[#E0D8C8] flex justify-between">
        <div>
          <div className="w-16 h-6 bg-[#E8E0D0] rounded mb-1" />
          <div className="w-20 h-3 bg-[#E8E0D0] rounded" />
        </div>
        <div className="w-20 h-4 bg-[#E8E0D0] rounded self-center" />
      </div>
    </div>
  );
}

export default function ResultsLoading() {
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Navbar />
      <main className="pt-20 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="py-8">
            <div className="w-48 h-8 bg-[#E8E0D0] rounded animate-pulse mb-2" />
            <div className="w-64 h-4 bg-[#E8E0D0] rounded animate-pulse mb-3" />
            <div className="inline-flex items-center gap-1.5 bg-[#D0ECE7] text-[#1A7A6D] text-xs font-medium px-3 py-1 rounded-full">
              <span className="animate-pulse">⟳</span> Fetching live flight prices…
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </main>
    </div>
  );
}
