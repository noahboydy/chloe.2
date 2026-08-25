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
  {
    id: "hurting-1787653248763",
    moodKey: "hurting",
    text: `Hey buddy, if you’re feeling this way at the moment then I’m so sorry cause you don’t deserve to. I am so proud of you for getting this far, and if you’ve come to this before you fall into self-harm then you are so strong but if you haven’t then I so understand. However dark it might seem, I’m still here, there’s always a light at the end of tunnel, in fact I can guarantee that there is something you are looking forward to tomorrow and if there’s not then you can look forward to me talking to you, I hope and if you can’t then I’ve definitely done something wrong. If I were you, I’d put on some lovely foo fighters and lie down with your favourite teddy. Imagine your favourite memory, and all the people in it around you, there to comfort you because you really are that loved. You are so so loved by so many people, and you deserve that because you’re just as loving to other people.`,
  },
  {
    id: "smile-1787653609428",
    moodKey: "smile",
    text: `It seems that you need to smile. You’re feeling sad but not sad enough to press the sad button so here I am. Woohoo!  Pick a person that you know. Could literally be anyone you have ever met, preferably not Grace or Izabella cause there just opps and a bit weird if you ask me. But whoever you have picked, think of something you’ve done with them, I could think of Ethan and the many poo jokes he’s made, or some old mate. I can’t remember your cheer coach’s name but whatever the cool one’s called, imagine him there in front of you talking to you because he wouldn’t want to see you like this, there are lots of people that if they saw you right now, would be jumping to cheer you up, me included. I hope this helped, and if it didn’t, here’s a cool video I found of cheerleading fails because you know, you’re a cheerleader and if these fails like internally hurt you then oops but it’s the thought that counts. 

https://www.tiktok.com/@kingkongswagg/video/7530671904995183903?is_from_webapp=1&sender_device=pc&web_id=7674969566283531798`,
  },
  {
    id: "sad-1787653994049",
    moodKey: "sad",
    text: `So the last sad letter didn’t do as well as I intended so I have researched the best ways to cheer up a teenage girl and it didn’t come up with very many useful things but there was a few and so I shall combine them with my usual charm and love to make you a lovely mix of happiness inducing sentences.

Firstly, I would like to formally remind you that you are genuinely such an amazing person. I know that when you're feeling rubbish, your brain probably isn't going to believe me when I say that, but unfortunately for your brain, I am correct.
You never have to pretend to be okay because someone asks. Apparently, not having to talk about anything is actually helpful according to the people who know what they're talking about, so there you go - I have accidentally become qualified.
Also, just in case you have forgotten, you are wanted. Your existence makes a difference to people. You make people and me - not that I am not a person but you get the idea - laugh, you make people feel comfortable, you have your own little ways of making things better without even realising you're doing it.
I also want you to know that I’m not only here when you're happy. I'm here when you're annoying, tired, quiet, overthinking, confused, sad, or just randomly staring at the wall questioning every decision you've ever made. You don't become less worth caring about just because you're having a bad day.
And I know I can't magically make whatever is upsetting you disappear. I wish I could, but apparently my cool person powers have limits. What I can do is remind you that you don't have to deal with everything completely alone. I'll listen, I'll distract you, I'll send you stupid things, I'll sit in silence if that's what you need – though it may be boring, and I'll keep checking in even if your first response is just “I'm fine” when we both know that's absolutely not true.
Side effects may include smiling slightly, feeling loved, receiving an unreasonable amount of nonsense from me, and possibly remembering that you have an annoying person who cares about you a lot.`,
  },
];
