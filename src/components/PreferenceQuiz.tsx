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
      localStorage.setItem("wandr_prefs", JSON.stringify(updated));
      onComplete(updated as Preferences);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1A1A1A]/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md card-shadow overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-[#e7e7e7]">
          <div
            className="h-1 bg-[#00754A] transition-all duration-500"
            style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="font-mono text-xs text-[#00754A] uppercase tracking-widest mb-1">
                {step + 1} of {QUESTIONS.length}
              </div>
              <h2 className="text-xl font-bold text-[rgba(0,0,0,0.87)]">
                {question.question}
              </h2>
            </div>
            <button
              onClick={onSkip}
              className="text-xs text-[rgba(0,0,0,0.38)] hover:text-[rgba(0,0,0,0.58)] transition-colors ml-4 flex-shrink-0"
            >
              Skip
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {question.options.map((opt) => {
              const isSelected = answers[question.key] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 active:scale-95 ${
                    isSelected
                      ? "border-[#00754A] bg-[#d4e9e2]"
                      : "border-[#e7e7e7] bg-[#f2f0eb] hover:border-[#00754A]/50 hover:bg-white"
                  }`}
                >
                  <div className="text-2xl mb-2">{opt.emoji}</div>
                  <div className="font-semibold text-[rgba(0,0,0,0.87)] text-sm">{opt.label}</div>
                  <div className="text-xs text-[rgba(0,0,0,0.58)] mt-0.5">{opt.desc}</div>
                </button>
              );
            })}
          </div>

          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="mt-4 text-sm text-[rgba(0,0,0,0.38)] hover:text-[rgba(0,0,0,0.58)] transition-colors"
            >
              ← Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
