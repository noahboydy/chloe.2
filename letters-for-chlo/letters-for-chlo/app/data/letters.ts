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
    {
    id: "missing-1787594629053",
    moodKey: "missing",
    text: `hey so i’m here in spirit ooooh spooky but i really want you to know that im still here. I know sometimes you can feel really lonely, and I’m sorry if you’re feeling like that right now. i’m obvs not always the best at knowing what to say, and I’ll probably make things awkward somehow coz i’m a superhero like that but I genuinely care about you and I don’t ever want you to feel like you have nobody. You can talk to me about literally anything, anytime (except for now which isn’t great mb), whether it’s something serious, something stupid, or you just want someone to listen. Even if I’m not there at this exact moment, that doesn’t mean I’ve stopped caring. You matter to me, and you’re not a burden for needing someone. Just get through tonight, and whenever I’m around again, I’m going to be doing my best to make you a happy bunny. whoever it is specifically your missing, maybe i cant make up for their absence - like zach - but they wouldnt want you being upset over them so maybe text them if you can or if you cant or dont want to then im hfy and so is the big Jesus`,
  },
];
