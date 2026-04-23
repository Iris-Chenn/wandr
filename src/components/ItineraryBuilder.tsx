"use client";

import { useState, useRef } from "react";

type Props = {
  city: string;
  country: string;
  flag: string;
  nights: number;
  budget: number;
  flightCost: number;
  hotelCost: number;
  foodCost: number;
  activitiesCost: number;
  origin: string;
  vibes?: string;
};

// Very lightweight markdown → HTML (headings, bold, bullets, hr, paragraphs)
function renderMarkdown(text: string): string {
  return text
    .replace(/^## (.+)$/gm, '<h3 class="itn-day-title">$1</h3>')
    .replace(/^### (.+)$/gm, '<h4 class="itn-sub">$1</h4>')
    .replace(/^\*\*(.+?)\*\*: (.+)$/gm, '<p class="itn-section"><span class="itn-label">$1:</span> $2</p>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^---$/gm, '<hr class="itn-divider" />')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul class="itn-list">${match}</ul>`)
    .replace(/\n\n/g, '</p><p class="itn-p">')
    .replace(/^(?!<[h|u|p|h|l])/gm, '')
    .trim();
}

export default function ItineraryBuilder({
  city,
  country,
  flag,
  nights,
  budget,
  flightCost,
  hotelCost,
  foodCost,
  activitiesCost,
  origin,
  vibes,
}: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "streaming" | "done" | "error">("idle");
  const [itinerary, setItinerary] = useState("");
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const generate = async () => {
    setStatus("loading");
    setItinerary("");
    setError("");

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          city,
          country,
          flag,
          nights,
          budget,
          flightCost,
          hotelCost,
          foodCost,
          activitiesCost,
          origin,
          vibes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate itinerary");
      }

      if (!res.body) throw new Error("No response body");

      setStatus("streaming");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setItinerary((prev) => prev + decoder.decode(value, { stream: true }));
      }

      setStatus("done");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError((err as Error).message || "Something went wrong");
      setStatus("error");
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setStatus("idle");
    setItinerary("");
    setError("");
  };

  return (
    <div className="itn-wrap">
      {/* Header */}
      <div className="itn-header">
        <div>
          <div className="wd-eyebrow" style={{ marginBottom: 4 }}>AI Itinerary</div>
          <h3 className="itn-title">
            {nights + 1} days in {city} {flag}
          </h3>
          <p className="itn-desc">
            A day-by-day plan built around your ${budget.toLocaleString()} budget — real places, real prices.
          </p>
        </div>

        {status === "idle" && (
          <button className="btn btn-primary" onClick={generate}>
            Generate itinerary →
          </button>
        )}
        {(status === "loading" || status === "streaming") && (
          <button className="btn btn-ghost" onClick={reset}>
            Cancel
          </button>
        )}
        {(status === "done" || status === "error") && (
          <button className="btn btn-ghost" onClick={reset} style={{ fontSize: 13 }}>
            Regenerate
          </button>
        )}
      </div>

      {/* Loading skeleton */}
      {status === "loading" && (
        <div className="itn-skeleton">
          <div className="itn-pulse" style={{ width: "60%", height: 22, marginBottom: 16 }} />
          <div className="itn-pulse" style={{ width: "100%", height: 14, marginBottom: 8 }} />
          <div className="itn-pulse" style={{ width: "90%", height: 14, marginBottom: 8 }} />
          <div className="itn-pulse" style={{ width: "80%", height: 14, marginBottom: 24 }} />
          <div className="itn-pulse" style={{ width: "55%", height: 22, marginBottom: 16 }} />
          <div className="itn-pulse" style={{ width: "100%", height: 14, marginBottom: 8 }} />
          <div className="itn-pulse" style={{ width: "95%", height: 14 }} />
          <div className="itn-thinking">
            <span className="itn-dot" />
            Planning your {city} trip…
          </div>
        </div>
      )}

      {/* Streaming / done output */}
      {(status === "streaming" || status === "done") && itinerary && (
        <div className="itn-body">
          {/* Streaming indicator */}
          {status === "streaming" && (
            <div className="itn-thinking itn-thinking-top">
              <span className="itn-dot" />
              Writing your itinerary…
            </div>
          )}
          <div
            className="itn-content"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(itinerary) }}
          />
          {status === "done" && (
            <div className="itn-done-bar">
              <span>✓ Itinerary complete</span>
              <button
                className="btn btn-ghost"
                style={{ fontSize: 12, padding: "6px 14px" }}
                onClick={() => {
                  navigator.clipboard.writeText(itinerary);
                }}
              >
                Copy text
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="itn-error">
          <strong>Couldn&apos;t generate itinerary:</strong> {error}
          <br />
          <span style={{ fontSize: 13, color: "var(--w-ink-muted)", marginTop: 6, display: "block" }}>
            Make sure ANTHROPIC_API_KEY is set in your environment variables.
          </span>
        </div>
      )}
    </div>
  );
}
