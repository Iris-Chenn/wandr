import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  const body = await req.json();
  const {
    city,
    country,
    flag,
    nights,
    budget,
    flightCost,
    hotelCost,
    foodCost,
    activitiesCost,
    vibes,
    origin,
    party = 1,
  } = body;

  if (!city || !country) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const vibeList = vibes
    ? (vibes as string).split(",").map((v: string) => v.trim()).filter(Boolean)
    : [];

  const partyLabel = party === 1 ? "solo traveler" : party === 2 ? "a couple (2 travelers)" : `a group of ${party} travelers`;
  const totalTripBudget = budget * party;

  const prompt = `You are Wandr's AI travel planner. Generate a detailed, practical day-by-day itinerary for a trip to ${city}, ${country} ${flag}.

Trip details:
- Travelers: ${partyLabel}
- Duration: ${nights} nights / ${nights + 1} days
- Budget: $${budget} per person ($${totalTripBudget.toLocaleString()} total for the group)
- Flying from: ${origin}
- Budget breakdown per person: Flights $${flightCost}, Hotel $${hotelCost} total, Food $${foodCost} total, Activities $${activitiesCost} total
- Vibes / interests: ${vibeList.length ? vibeList.join(", ") : "general exploration"}

Create a day-by-day itinerary with this format for each day:

## Day [N] — [Theme or Neighbourhood]

**Morning:** [2-3 specific activities with real place names, brief why it's worth it]

**Afternoon:** [2-3 activities. Include at least one practical tip like opening hours, best time to visit, or a money-saving note]

**Evening:** [Dinner recommendation with approximate cost per person, plus optional nightlife if relevant]

**Daily spend:** ~$[food+activities estimate] (excluding hotel)

---

Rules:
- Use REAL, specific place names (museums, restaurants, neighborhoods, markets — not generic descriptions)
- Keep food recommendations honest to the budget — street food if it's a budget trip, mid-range if the budget allows
- Include one practical "local tip" per day (best way to get around, a free attraction, a tourist trap to avoid, etc.)
- Total activity spend across all days should stay within the $${activitiesCost} activities budget per person
- ${party > 1 ? `Tailor recommendations for ${partyLabel} — mention group-friendly spots, shared experiences, and note when splitting costs makes sense` : "Tailor for a solo traveler — mention hostels, solo-friendly activities, and safe neighborhoods"}
- Write conversationally — like a well-traveled friend, not a travel brochure
- End with a brief **Packing tips** section (3-4 bullets specific to ${city}) and a **Getting around** section (2-3 sentences on the best local transport)

Keep it detailed but scannable. Use markdown formatting.`;

  const stream = await client.messages.stream({
    model: "claude-opus-4-5",
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
    cancel() {
      stream.controller.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
