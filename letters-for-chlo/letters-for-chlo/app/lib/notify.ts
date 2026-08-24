// Two things happen when something worth telling Noah about happens:
//
// 1. A real push notification goes to his phone via our own /api/notify
//    route (no app install needed — see app/lib/push-client.ts for the
//    "Enable phone notifications" setup, done from the hidden panel).
// 2. A copy also gets posted to a free ntfy.sh "topic", used ONLY as a
//    lightweight history log the "Recent activity" tab can read back —
//    Noah never needs to install anything for this part, it's just a
//    free place to briefly cache recent messages.
//
// Both are best-effort and fire in parallel: if one fails (or isn't set
// up yet) it never blocks the other, and neither ever breaks the site
// for Chlo.
//
// ── One-time setup for the actual phone notifications ───────────────────
// Use the "Enable phone notifications" button in the hidden 🌸 panel
// (Add to your phone's home screen first — see the README) and follow
// what it tells you to paste into Vercel's environment variables.
//
// ── Changing the ntfy topic (history log only, optional) ────────────────
// Change NTFY_TOPIC below to your own random string before deploying —
// anyone who knows the exact name could read this history log too, so
// don't leave it as the example and don't make it guessable.
//
// Turn notifications on/off entirely any time by flipping the booleans
// below and redeploying.

export const NTFY_TOPIC = "chlo-hist-x9q2mv6t4k";

export const NOTIFY_ON_SITE_OPEN = true;
export const NOTIFY_ON_HURTING_MOOD = true;

// History-only entry — posts to the same ntfy history log as notifyNoah,
// but does NOT trigger a real phone push. Used to quietly log which letter
// Chlo was shown each time, so the "Letters" summary in the hidden panel
// can tell Noah which ones are getting reused a lot (candidates to add
// more variety for) and which moods still have no letter written at all.
// If this fails, it's silent and never affects the site for Chlo.
export async function logActivity(message: string) {
  await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
    method: "POST",
    body: message,
  }).catch(() => {});
}

export async function notifyNoah(
  message: string,
  opts?: { title?: string; urgent?: boolean }
) {
  const pushReal = fetch("/api/notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      title: opts?.title,
      urgent: opts?.urgent,
    }),
  }).catch(() => {});

  const pushHistory = fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
    method: "POST",
    body: message,
    headers: {
      ...(opts?.title ? { Title: opts.title } : {}),
      ...(opts?.urgent ? { Priority: "urgent" } : {}),
    },
  }).catch(() => {});

  // Best-effort — never let either request block the caller or throw.
  await Promise.allSettled([pushReal, pushHistory]);
}

export type NotificationLogEntry = {
  time: number; // unix seconds
  message: string;
  title?: string;
};

// Reads ntfy's own short-term cache for this topic, so the "Recent
// activity" panel works from any device — it's not reading anything
// stored by this browser, it's asking ntfy's server what it's seen
// recently on this topic. Only used for the in-website history view,
// unrelated to whether real phone push notifications are working.
export async function fetchRecentNotifications(): Promise<NotificationLogEntry[]> {
  const res = await fetch(`https://ntfy.sh/${NTFY_TOPIC}/json?poll=1&since=all`);
  if (!res.ok) throw new Error(`ntfy returned ${res.status}`);
  const text = await res.text();
  const entries: NotificationLogEntry[] = [];
  for (const line of text.split("\n")) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      if (obj.event === "message") {
        entries.push({
          time: obj.time,
          message: obj.message ?? "",
          title: obj.title,
        });
      }
    } catch {
      // skip a malformed line rather than failing the whole fetch
    }
  }
  return entries.sort((a, b) => b.time - a.time);
}
