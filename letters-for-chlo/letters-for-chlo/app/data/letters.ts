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
  {
    id: "sad-1787592126927",
    moodKey: "sad",
    text: `hey so this is the first letter im doing so not entirely sure what im doing but I heard from a bird that your feeling sad. that means you are not a happy bunny. Whatever it is your upset about, God is willing to listen, and I would be listening but I need my beauty sleep. Know that I am always here for you and I always wanna help u asm as I can. I think you should be reading this after im in bed, but if your not then TEXT ME I shall respond I think. If it is late at night, I think you should get some sleep, and if I was there I would definitely be giving you a hug because I like hugs and sad people always need a hug – even more than happy people. Personally, if I was in your situation I would go and get terry or whatever the massive teddys name is and hug the hell out of him because it would help both of you and terry is my man. I hope you feel better really soon and if this didn’t work then blame boris johnson or someone – channel the annoyance awayyy from me. Also a slight thing – every single one of these is programmed to end with love noah so uhh, I would change it but I actually don’t know how which is great but I love you as a friend asm as I can w out being weird. Hope your feeling a bit or a lot better and I will text you as soon as I can because you deserve better than feeling sad.`,
  },
