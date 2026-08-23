"use client";

import { useMemo, useState } from "react";
import { moods, letters, type Letter } from "./data/letters";
import { getRandomVerse } from "./data/verses";
import { MoodGrid } from "./components/MoodGrid";
import { LetterCard } from "./components/LetterCard";
import { FlowerCorner } from "./components/Flowers";
import { VerseCard } from "./components/VerseCard";

function pickRandom(pool: Letter[], excludeId?: string | null): Letter | null {
  const filtered = excludeId
    ? pool.filter((item) => item.id !== excludeId)
    : pool;
  const source = filtered.length > 0 ? filtered : pool;
  if (source.length === 0) return null;
  return source[Math.floor(Math.random() * source.length)];
}

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [currentLetterId, setCurrentLetterId] = useState<string | null>(null);
  const [verse, setVerse] = useState(() => getRandomVerse());

  const moodLetters = useMemo(
    () =>
      selectedMood ? letters.filter((l) => l.moodKey === selectedMood) : [],
    [selectedMood]
  );

  const currentLetter =
    moodLetters.find((l) => l.id === currentLetterId) ?? null;
  const selectedMoodInfo = moods.find((m) => m.key === selectedMood);
  const moodLabel = selectedMoodInfo?.label ?? "";
  const isSupportMood = selectedMoodInfo?.isSupport ?? false;

  function handleSelectMood(moodKey: string) {
    setSelectedMood(moodKey);
    const pool = letters.filter((l) => l.moodKey === moodKey);
    const pick = pickRandom(pool);
    setCurrentLetterId(pick?.id ?? null);
    setVerse((v) => getRandomVerse(v.text));
  }

  function handleAnother() {
    const pick = pickRandom(moodLetters, currentLetterId);
    setCurrentLetterId(pick?.id ?? null);
    setVerse((v) => getRandomVerse(v.text));
  }

  function handleBack() {
    setSelectedMood(null);
    setCurrentLetterId(null);
    setVerse((v) => getRandomVerse(v.text));
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 flex flex-col items-center px-4 py-12 relative overflow-hidden">
      <FlowerCorner className="absolute -top-6 -left-6 w-28 h-28 opacity-70 pointer-events-none" />
      <FlowerCorner className="absolute -bottom-8 -right-8 w-32 h-32 opacity-70 pointer-events-none rotate-45" />

      <div className="text-center mb-10 max-w-xl relative z-10">
        <h1 className="font-hand text-4xl sm:text-5xl text-pink-600 leading-tight">
          Hey Chlo Chlo, I&apos;m here for you
        </h1>
        {!selectedMood && (
          <p className="mt-4 text-pink-500 text-lg">
            How are you feeling right now?
          </p>
        )}
      </div>

      <div className="relative z-10 w-full flex flex-col items-center gap-8">
        {selectedMood ? (
          <LetterCard
            letter={currentLetter}
            moodLabel={moodLabel}
            isSupportMood={isSupportMood}
            hasMore={moodLetters.length > 1}
            onAnother={handleAnother}
            onBack={handleBack}
          />
        ) : (
          <MoodGrid onSelect={handleSelectMood} />
        )}

        <VerseCard verse={verse} />
      </div>
    </main>
  );
}
