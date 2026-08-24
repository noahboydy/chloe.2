// ─────────────────────────────────────────────────────────────────────────
// This file is the entire "content" of the site. Everything Chlo Chlo sees
// comes from the `letters` array at the bottom. No coding knowledge needed
// to add more — just copy the shape of one entry and change the text.
// ─────────────────────────────────────────────────────────────────────────

export type Mood = {
  key: string;
  label: string;
  emoji: string;
  // Set this on a mood that's about self-harm / crisis feelings. That mood
  // always shows real support helplines, whether or not a letter has been
  // written for it yet — see SupportResources.tsx.
  isSupport?: boolean;
};

export type Letter = {
  id: string; // must be unique across the whole file
  moodKey: string; // must match one of the "key" values in `moods` below
  text: string; // use \n\n to start a new paragraph
  signOff?: string; // optional — leave it out to use DEFAULT_SIGN_OFF
};

export const DEFAULT_SIGN_OFF = "Love, Noah";

export const moods: Mood[] = [
  { key: "sad", label: "I'm sad", emoji: "😢" },
  {
    key: "hurting",
    label: "I'm thinking about hurting myself",
    emoji: "💙",
    isSupport: true,
  },
  { key: "missing", label: "I miss someone", emoji: "🌷" },
  { key: "smile", label: "I just need a smile", emoji: "🌼" },
];

// ─────────────────────────────────────────────────────────────────────────
// ADD YOUR LETTERS BELOW. One object per letter. You can add as many
// letters as you want to the same mood — the site picks one at random,
// and "Read another" shows a different one if there's more than one.
//
// Example of the shape to copy (this one is commented out so it won't
// show up on the site until you fill it in for real):
//
// {
//   id: "sad-1",
//   moodKey: "sad",
//   text: `First paragraph goes here.\n\nSecond paragraph goes here.`,
//   signOff: "Love, Noah",
// },
//
// Until you add a real letter for a mood, the site will show a gentle
// "still being written" message instead of a blank page — so it's safe
// to deploy this before you've written anything.
//
// The "hurting" mood (isSupport: true) is different: it ALWAYS shows real
// helpline info (Childline / Shout / Samaritans), letter or no letter. If
// you write one for it, it shows underneath the helplines, not instead of
// them — see components/SupportResources.tsx.
// ─────────────────────────────────────────────────────────────────────────

export const letters: Letter[] = [
  // 👇 add your letters here, one object per letter, separated by commas
];
