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

## Easier way to add letters — the hidden button

There's a tiny, near-invisible 🌸 in the bottom-right corner of the live
site. Tap it and type the passphrase (default is `flowers4chlo` — change
it by editing `PASSPHRASE` near the top of
`app/components/LetterBuilder.tsx`). Fill in the mood and your letter, hit
**Generate code**, then **Copy to clipboard**.

That gives you the exact object to paste into the `letters` array in
`app/data/letters.ts` — no more hand-typing the id/moodKey/text shape
yourself. Paste it in on GitHub, commit to main, and Vercel redeploys
automatically.

Heads up: this passphrase is a soft "keep Chlo from stumbling into my
writing tool" gate, not real security — it's plain text sitting in the
website's code, so anyone who opens browser devtools could technically
find it. Don't reuse it anywhere that actually matters, and don't rely on
it to keep out anyone determined. If you ever want a version where adding
a letter through the site actually publishes it live (instead of giving
you code to paste), that's possible too, but needs a bit more setup — a
GitHub access token stored as a secret on Vercel. Ask if you want that
upgrade.

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

## Notifications — knowing when Chlo visits (no app install needed)

The site can ping your phone when Chlo opens it, and specifically (with an
urgent alert) when she taps the "thinking about hurting myself" mood. It
does NOT notify you for every individual mood she picks (sad, lonely,
etc.) — that's deliberate, see the note in `app/lib/notify.ts` for why. If
you decide you want that anyway, there's a commented example right there
in `app/page.tsx` showing exactly what to add.

This uses real browser push notifications (the same tech a site like your
bank's uses), tied to adding the site to your phone's home screen — no
separate app to install. Two things happen behind the scenes: a real push
straight to your phone, plus a copy logged to a free service called ntfy
purely so the "Recent activity" tab in the hidden panel can show you a
short history — you never need to install anything for that part either,
it's just read over the web.

Setup (free, one-time, takes a few minutes):

1. **VAPID keys** — these are the cryptographic keys that let your site
   prove to Apple/Google's push services that it's really your site
   sending the notification. Claude already generated a real key pair for
   this project:
   - Public key: already placed in `app/lib/push-client.ts` and
     `app/api/notify/route.ts` — nothing to do here.
   - Private key (**keep this secret, never commit it to GitHub**):
     ```
     WsJuNFQaZjQYSPV3gsWmE-BDyomT_XgUaUiCHtJXzWA
     ```
     Add it as a Vercel environment variable: **Project Settings →
     Environment Variables → Add New** → Name: `VAPID_PRIVATE_KEY` →
     Value: the string above → Save.
2. **Deploy first** with that env var set, so the site is live with
   push support built in.
3. **On your phone**, open Safari, go to the live site, tap **Share →
   Add to Home Screen**. This step is required — iOS only allows push
   notifications from a site installed this way, not from a normal
   Safari tab.
4. **Open the site from that new home screen icon** (not from Safari),
   tap the hidden 🌸, unlock with the passphrase, go to the
   **Notifications** tab, and tap **Enable phone notifications**. Allow
   the permission prompt.
5. It'll show you a block of text (your subscription). Copy it, then in
   Vercel: **Project Settings → Environment Variables → Add New** → Name:
   `PUSH_SUBSCRIPTION` → paste the text as the value → Save.
6. **Redeploy** (Deployments → latest → ⋯ → Redeploy) so the new env var
   takes effect.

After that, next time Chlo opens the site, a real notification lands on
your phone — no ntfy, no separate app.

Turn notifications off entirely any time by setting
`NOTIFY_ON_SITE_OPEN` and/or `NOTIFY_ON_HURTING_MOOD` to `false` in
`app/lib/notify.ts`.

**Limitation to know about:** push subscriptions can occasionally expire
or change (phone reset, PWA reinstalled, iOS update). If notifications
quietly stop working, redo steps 4–6 to get a fresh subscription. There's
no way around this with the zero-database setup this project uses — a
"real" fix would need a small database to auto-detect and handle expired
subscriptions, which is more infrastructure than this project needs for
one recipient.

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

## Troubleshooting a broken deploy

Things that have come up while setting this up, in case they happen again:

- **`npm error ERESOLVE ... peer react`** — `next@15.0.3`'s package.json
  pins an exact pre-release build of React 19 as its "required" peer,
  even though the real stable React 19 works with it fine. Fixed by a
  `.npmrc` file (at the same level as `package.json`, **not** inside
  `app/`) containing `legacy-peer-deps=true`.
- **404 on every page after a successful-looking deploy** — almost always
  means the project's files aren't actually at the root of what Vercel is
  building from. Check your GitHub repo: `package.json`, `app/`, etc.
  should be visible the moment you open the repo, not one or more folders
  deep. If they *are* nested (easy to happen when dragging an unzipped
  folder into GitHub's uploader), either move everything up a level, or
  set **Vercel → Settings → General → Root Directory** to match the
  nested path.
- **"No Output Directory named 'public' found"** — Vercel's Framework
  Preset got set to something other than "Next.js" (usually because it
  mis-detected the project during the folder-nesting confusion above). Fix
  in **Vercel → Settings → General → Build & Development Settings →
  Framework Preset → Next.js**, and turn off any manual "Output Directory"
  override.
- **Deprecation warning about next@15.0.3 / CVE-2025-66478** — worth
  knowing about, not urgent for a private just-us site with no user
  accounts or sensitive data flowing through it, but if you want to clear
  the warning later: bump the `next` version in `package.json` to a newer
  patch release and redeploy.
