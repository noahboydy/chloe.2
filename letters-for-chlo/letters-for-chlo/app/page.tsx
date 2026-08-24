"use client";

import { useEffect, useMemo, useState } from "react";
import { moods, letters, type Letter } from "./data/letters";
import { getRandomVerse } from "./data/verses";
import {
  notifyNoah,
  logActivity,
  NOTIFY_ON_SITE_OPEN,
  NOTIFY_ON_HURTING_MOOD,
} from "./lib/notify";
import { MoodGrid } from "./components/MoodGrid";
import { LetterCard } from "./components/LetterCard";
import { FlowerCorner } from "./components/Flowers";
import { VerseCard } from "./components/VerseCard";
import { LetterBuilder } from "./components/LetterBuilder";

function pickRandom(pool: Letter[], excludeId?: string | null): Letter | null {
  const filtered = excludeId
    ? pool.filter((item) => item.id !== excludeId)
    : pool;
  const source = filtered.length > 0 ? filtered : pool;
  if (source.length === 0) return null;
  return source[Math.floor(Math.random() * source.length)];
}

// Quietly logs which letter (or "no letter yet") Chlo was just shown, so
// the "Letters" summary in the hidden panel can flag ones being reused a
// lot. History-only — never triggers a real phone push.
function logLetterView(moodLabel: string, letter: Letter | null) {
  logActivity(
    letter
      ? `Read: ${letter.id} (${moodLabel})`
      : `No letter yet: ${moodLabel}`
  );
}

// Set (in LetterBuilder.tsx) the moment Noah unlocks the hidden 🌸 panel
// with the passphrase in this browser tab — the site has no real login,
// so this is the closest signal we've got to "this is Noah testing, not
// Chlo actually visiting." If you want to test the mood picker WITHOUT
// triggering the notify-and-delete below, unlock the hidden panel first
// (even without doing anything else in it), then go try the moods.
const NOAH_TESTING_KEY = "noah-testing-session";

function isNoahTestingSession(): boolean {
  try {
    return sessionStorage.getItem(NOAH_TESTING_KEY) === "1";
  } catch {
    return false;
  }
}

// Tells Noah's phone to replace this letter, and deletes it from the live
// site's source on GitHub — so it can't be shown again until he writes a
// new one. Only fires for real visits, never while Noah's testing (see
// isNoahTestingSession above), and only when a letter actually existed to
// consume — the "still being written" placeholder isn't a letter to burn.
function consumeLetter(moodLabel: string, letter: Letter | null) {
  if (!letter) return;
  if (isNoahTestingSession()) return;
  fetch("/api/consume-letter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ letterId: letter.id, moodLabel }),
  }).catch(() => {});
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

  // Pings Noah once per visit when Chlo opens the site — not tied to any
  // specific mood, just lets him know she's using it.
  useEffect(() => {
    if (!NOTIFY_ON_SITE_OPEN) return;
    try {
      if (sessionStorage.getItem("chlo-open-notified")) return;
      sessionStorage.setItem("chlo-open-notified", "1");
    } catch {
      // sessionStorage can be unavailable (private browsing etc) — fall
      // through and notify anyway rather than silently skip it
    }
    notifyNoah("Chlo opened the letters site.", { title: "Chlo Chlo 🌸" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelectMood(moodKey: string) {
    setSelectedMood(moodKey);
    const pool = letters.filter((l) => l.moodKey === moodKey);
    const pick = pickRandom(pool);
    setCurrentLetterId(pick?.id ?? null);
    setVerse((v) => getRandomVerse(v.text));

    // Only the "hurting" mood gets its own always-on alert — see the note
    // in lib/notify.ts and the README for why every other mood does NOT
    // silently notify Noah. Want per-mood notifications anyway? Add:
    //   notifyNoah(`Chlo picked "${moods.find(m => m.key === moodKey)?.label}"`, { title: "Chlo Chlo 🌸" });
    const moodInfo = moods.find((m) => m.key === moodKey);
    if (NOTIFY_ON_HURTING_MOOD && moodInfo?.isSupport) {
      notifyNoah(
        `Chlo just picked "${moodInfo.label}".`,
        { title: "Chlo needs you 💙", urgent: true }
      );
    }

    logLetterView(moodInfo?.label ?? moodKey, pick);
    consumeLetter(moodInfo?.label ?? moodKey, pick);
  }

  function handleAnother() {
    const pick = pickRandom(moodLetters, currentLetterId);
    setCurrentLetterId(pick?.id ?? null);
    setVerse((v) => getRandomVerse(v.text));
    logLetterView(moodLabel, pick);
    consumeLetter(moodLabel, pick);
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

      <LetterBuilder />

      <p className="relative z-10 mt-10 max-w-md text-center text-[10px] leading-relaxed text-pink-300">
        Scripture quotations from the Holy Bible, New International
        Version® (NIV®). Copyright © 1973, 1978, 1984, 2011 by Biblica,
        Inc.™ Used by permission. All rights reserved worldwide.
      </p>
    </main>
  );
}

