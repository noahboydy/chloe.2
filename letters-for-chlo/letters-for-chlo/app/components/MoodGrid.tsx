"use client";

import { moods } from "../data/letters";

export function MoodGrid({
  onSelect,
}: {
  onSelect: (moodKey: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:gap-4 w-full max-w-2xl">
      {moods.map((mood) => (
        <button
          key={mood.key}
          type="button"
          onClick={() => onSelect(mood.key)}
          className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-2xl sm:rounded-3xl bg-white/80 border-2 border-pink-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-pink-400 transition-all py-4 sm:py-6 px-1.5 sm:px-3 text-pink-700"
        >
          <span className="text-2xl sm:text-3xl" aria-hidden="true">
            {mood.emoji}
          </span>
          <span className="text-[11px] sm:text-sm font-medium text-center leading-tight">
            {mood.label}
          </span>
        </button>
      ))}
    </div>
  );
}
