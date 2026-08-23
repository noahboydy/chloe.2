"use client";

import type { Verse } from "../data/verses";

export function VerseCard({ verse }: { verse: Verse }) {
  return (
    <div className="w-full max-w-md rounded-2xl bg-pink-50/80 border border-pink-200 px-5 py-4 text-center">
      <p className="font-hand text-xl text-pink-800 leading-snug">
        "{verse.text}"
      </p>
      <p className="mt-2 text-xs tracking-wide uppercase text-pink-400">
        {verse.reference}
      </p>
    </div>
  );
}
