# For Chlo Chlo 🌸

A private little site: Chlo picks how she's feeling, and gets a letter you
wrote for that feeling. No login, no database, no cost — it's just a
website that only the people with the link can see.

## Adding letters (do this before you send Chlo the link!)

Open `app/data/letters.ts`. Near the bottom you'll see:

```ts
export const letters: Letter[] = [
  // 👇 add your letters here, one object per letter, separated by commas
];
```

Add letters like this, one per mood (or more than one — the site picks a
random one and "Read another" gives a different one):

```ts
export const letters: Letter[] = [
  {
    id: "sad-1",
    moodKey: "sad",
    text: `Hey Chlo,\n\nI know things feel heavy right now...\n\nYou've got this, and I've got you.`,
    signOff: "Love, Noah",
  },
  {
    id: "sad-2",
    moodKey: "sad",
    text: `Second letter for the same mood...`,
  },
];
```

Rules:
- `id` — anything, just make sure no two letters share the same one.
- `moodKey` — must exactly match one of the mood keys from the `moods` list
  above it in the same file (`sad`, `anxious`, `lonely`, `stressed`,
  `angry`, `down`, `missing`, `smile`, `hurting`). Feel free to rename the
  mood `label`s or add your own moods entirely — just give each a unique
  `key`.
- `text` — use `\n\n` where you want a new paragraph.
- `signOff` — optional. Leave it out and it'll default to "Love, Noah".

Any mood with no letters yet just shows a gentle "still being written"
message instead of breaking, so it's safe to deploy this before every
mood has a letter.

## The "hurting" mood is handled differently — on purpose

`hurting` ("Thinking about hurting myself") is marked `isSupport: true` in
`app/data/letters.ts`. That mood always shows real UK helplines (Childline,
Shout, Samaritans, and 999/A&E for immediate danger) at the top, whether or
not you've written a letter for it. If you do write one, it shows
underneath the helplines as an extra, not a replacement.

Don't remove `isSupport: true` from that mood or delete the
`SupportResources` component — the point of it is that if Chlo's ever in
that headspace, she gets pointed to real help straight away, not just your
message. Please also make sure a trusted adult in her life actually knows
if this is a real, current worry — a website is a nice extra, not a
substitute for that.

## Bible verses

`app/data/verses.ts` holds a small pool of KJV verses (public domain, so
no API or cost). One shows at random in a little card on every screen, and
changes each time Chlo picks a mood, hits "Read another", or goes back —
so it feels like it's sprinkled in randomly rather than fixed. Add more by
copying the `{ text: "...", reference: "..." }` shape in that file.

## Putting it online (GitHub → Vercel, same as your other projects)

1. **Create a GitHub repo.** Go to github.com → New repository → name it
   something like `letters-for-chlo` → keep it **Private** → Create.
2. **Push this code to it.** In a terminal, inside this folder:
   ```
   git init
   git add .
   git commit -m "first version"
   git branch -M main
   git remote add origin <the URL GitHub gave you>
   git push -u origin main
   ```
3. **Deploy on Vercel.** Go to vercel.com → sign in with GitHub → Add New
   → Project → pick this repo → Deploy. No settings or environment
   variables needed — just click Deploy.
4. Vercel gives you a live link. Every time you `git push` again (e.g.
   after adding more letters), it automatically redeploys.

## Keeping it private

You chose "no passcode, just a link only Chlo has" — a couple of tips to
keep it that way:
- When you create the Vercel project, change the project name (in Vercel's
  project settings → General) to something random rather than
  `letters-for-chlo`, so the URL itself doesn't hint at what it is or who
  it's for. Something like `soft-petal-3821` works fine.
- Only ever send the link directly to Chlo (text/DM), never post it
  anywhere public.
- Keep the GitHub repo **Private** (step 1 above) so the source/letters
  aren't visible to anyone browsing GitHub.

This won't stop someone who has the exact link from opening it, but
nobody will be able to find it by guessing or searching.
