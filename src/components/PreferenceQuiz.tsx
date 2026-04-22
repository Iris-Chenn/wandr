"use client";

import { useState } from "react";

export type Preferences = {
  travelStyle: string;
  priority: string;
  tripType: string;
};

type Props = {
  onComplete: (prefs: Preferences) => void;
  onSkip: () => void;
};

const QUESTIONS = [
  {
    key: "travelStyle" as const,
    question: "What kind of trip are you dreaming of?",
    options: [
      { value: "beach", label: "Beach", emoji: "🏖️", desc: "Sun, sand, and ocean" },
      { value: "city", label: "City", emoji: "🏙️", desc: "Culture and nightlife" },
      { value: "nature", label: "Nature", emoji: "🏔️", desc: "Hikes and landscapes" },
      { value: "adventure", label: "Adventure", emoji: "🧗", desc: "Thrills and activities" },
    ],
  },
  {
    key: "priority" as const,
    question: "What matters most to you on a trip?",
    options: [
      { value: "food", label: "Amazing food", emoji: "🍜", desc: "Restaurants and street eats" },
      { value: "comfort", label: "Great hotel", emoji: "🛏️", desc: "Comfort and location" },
      { value: "activities", label: "Experiences", emoji: "🎭", desc: "Tours and activities" },
      { value: "budget", label: "Max savings", emoji: "💰", desc: "Stretch every dollar" },
    ],
  },
  {
    key: "tripType" as const,
    question: "Who are you traveling with?",
    options: [
      { value: "solo", label: "Solo", emoji: "🧍", desc: "Just me" },
      { value: "couple", label: "Couple", emoji: "👫", desc: "Romantic getaway" },
      { value: "friends", label: "Friends", emoji: "👯", desc: "Group trip" },
      { value: "family", label: "Family", emoji: "👨‍👩‍👧", desc: "Kids in tow" },
    ],
  },
];

export default function PreferenceQuiz({ onComplete, onSkip }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Preferences>>({});

  const question = QUESTIONS[step];

  const handleSelect = (value: string) => {
    const updated = { ...answers, [question.key]: value };
    setAnswers(updated);

    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      // Save to localStorage so it persists across searches
      localStorage.setItem("wandr_prefs", JSON.stringify(updated));
      onComplete(updated as Preferences);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1A1A1A]/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-[#FFFCF7] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-[#E0D8C8]">
          <div
            className="h-1 bg-[#D4612A] transition-all duration-500"
            style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="font-mono text-xs text-[#D4612A] uppercase tracking-widest mb-1">
                {step + 1} of {QUESTIONS.length}
              </div>
              <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">
                {question.question}
              </h2>
            </div>
            <button
              onClick={onSkip}
              className="text-xs text-[#8A8A8A] hover:text-[#5A5A5A] transition-colors ml-4 flex-shrink-0"
            >
              Skip
            </button>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((opt) => {
              const isSelected = answers[question.key] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-[#D4612A] bg-[#F0D4C0]"
                      : "border-[#E0D8C8] bg-[#F5F0E8] hover:border-[#D4612A]/50 hover:bg-[#FFFCF7]"
                  }`}
                >
                  <div className="text-2xl mb-2">{opt.emoji}</div>
                  <div className="font-semibold text-[#1A1A1A] text-sm">{opt.label}</div>
                  <div className="text-xs text-[#8A8A8A] mt-0.5">{opt.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Back button */}
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="mt-4 text-sm text-[#8A8A8A] hover:text-[#5A5A5A] transition-colors"
            >
              ← Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
