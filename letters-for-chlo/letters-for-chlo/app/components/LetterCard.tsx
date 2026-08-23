"use client";

import { DEFAULT_SIGN_OFF, type Letter } from "../data/letters";
import { SupportResources } from "./SupportResources";

export function LetterCard({
  letter,
  moodLabel,
  isSupportMood,
  hasMore,
  onAnother,
  onBack,
}: {
  letter: Letter | null;
  moodLabel: string;
  isSupportMood: boolean;
  hasMore: boolean;
  onAnother: () => void;
  onBack: () => void;
}) {
  return (
    <div className="relative w-full max-w-xl flex flex-col items-center gap-6">
      {isSupportMood && <SupportResources />}

      <div className="w-full bg-white rounded-[2rem] shadow-lg border-4 border-pink-100 px-6 py-10 sm:px-10 sm:py-12">
        {letter ? (
          <>
            <p className="whitespace-pre-line font-hand text-2xl leading-relaxed text-pink-900">
              {letter.text}
            </p>
            <p className="mt-8 font-hand text-2xl text-pink-700">
              {letter.signOff ?? DEFAULT_SIGN_OFF}
            </p>
          </>
        ) : !isSupportMood ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-4" aria-hidden="true">
              🌸
            </p>
            <p className="font-hand text-2xl text-pink-700">
              A letter for feeling {moodLabel.toLowerCase()} is still being
              written just for you...
            </p>
            <p className="mt-3 text-sm text-pink-400">check back soon 💌</p>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="font-hand text-xl text-pink-500">
              Noah hasn't written you a letter for this one yet — but the
              people above are real and ready to help right now.
            </p>
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          {hasMore && (
            <button
              type="button"
              onClick={onAnother}
              className="rounded-full bg-pink-500 text-white px-5 py-2 text-sm font-medium hover:bg-pink-600 transition-colors"
            >
              Read another 🌷
            </button>
          )}
          <button
            type="button"
            onClick={onBack}
            className="rounded-full bg-white border-2 border-pink-300 text-pink-600 px-5 py-2 text-sm font-medium hover:bg-pink-50 transition-colors"
          >
            ← Choose a different feeling
          </button>
        </div>
      </div>
    </div>
  );
}
