const DUFFEL_API = "https://api.duffel.com";
const DUFFEL_VERSION = "v2";

// Simple in-memory cache: key → { price, cachedAt }
const priceCache = new Map<string, { price: number; cachedAt: number }>();
const CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

export async function getCheapestFlight(
  origin: string,
  destination: string,
  departDate: string, // YYYY-MM-DD
  returnDate: string  // YYYY-MM-DD
): Promise<number | null> {
  const cacheKey = `${origin}-${destination}-${departDate}-${returnDate}`;
  const cached = priceCache.get(cacheKey);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return cached.price;
  }

  try {
    // ?return_offers=true tells Duffel to embed offers in the response
    // (without it the response is just an offer_request ID and offers must be fetched separately)
    const res = await fetch(`${DUFFEL_API}/air/offer_requests?return_offers=true`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.DUFFEL_API_KEY}`,
        "Duffel-Version": DUFFEL_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          slices: [
            { origin, destination, departure_date: departDate },
            { origin: destination, destination: origin, departure_date: returnDate },
          ],
          passengers: [{ type: "adult" }],
          cabin_class: "economy",
        },
      }),
      next: { revalidate: 7200 }, // Next.js cache 2h
    });

    if (!res.ok) return null;

    const json = await res.json();
    const offers: Array<{ total_amount: string; total_currency: string }> =
      json?.data?.offers ?? [];

    if (offers.length === 0) return null;

    // Find cheapest USD offer
    const usdOffers = offers.filter((o) => o.total_currency === "USD");
    const source = usdOffers.length > 0 ? usdOffers : offers;
    const cheapest = source.reduce((min, o) =>
      parseFloat(o.total_amount) < parseFloat(min.total_amount) ? o : min
    );

    const price = Math.round(parseFloat(cheapest.total_amount));
    priceCache.set(cacheKey, { price, cachedAt: Date.now() });
    return price;
  } catch {
    return null;
  }
}

export function getDepartureDates(
  tripLength: string,
  month: string
): { departDate: string; returnDate: string } {
  const today = new Date();

  let depart: Date;
  if (!month || month === "flexible") {
    // 6 weeks from today
    depart = new Date(today);
    depart.setDate(today.getDate() + 42);
  } else {
    // Month values come in as "may-2026", "june-2026", etc.
    // Extract the month name and optional year
    const parts = month.split("-");
    const monthName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    const yearOverride = parts[1] ? parseInt(parts[1]) : null;

    const monthIndex = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ].indexOf(monthName);

    if (monthIndex === -1) {
      // Fallback: 6 weeks out
      depart = new Date(today);
      depart.setDate(today.getDate() + 42);
    } else {
      const year = yearOverride ?? today.getFullYear();
      depart = new Date(year, monthIndex, 15);
      // If that date is in the past, push to next year
      if (depart < today) {
        depart = new Date(year + 1, monthIndex, 15);
      }
    }
  }

  const nightsMap: Record<string, number> = {
    "3-4": 4, "5-7": 6, "8-10": 9, "11-14": 12,
  };
  const nights = nightsMap[tripLength] ?? 6;

  const ret = new Date(depart);
  ret.setDate(depart.getDate() + nights);

  const fmt = (d: Date) => d.toISOString().split("T")[0];
  return { departDate: fmt(depart), returnDate: fmt(ret) };
}
