"use client";

import { useState } from "react";
import { moods } from "../data/letters";
import {
  fetchRecentNotifications,
  type NotificationLogEntry,
} from "../lib/notify";
import {
  getPushSupportStatus,
  subscribeToPush,
  type PushSetupStatus,
} from "../lib/push-client";
import { escapeForTemplateLiteral } from "../lib/letter-source";

// Change this to whatever you want — it's just a soft "keep Chlo out of my
// writing tool" gate, not real security. Anyone who opens devtools and reads
// the page source could find it, so never reuse this passphrase anywhere
// that actually matters. If you change this, also update the matching
// constant in app/api/add-letter/route.ts — that one checks it too, since
// publishing now has a real effect (a commit to your repo).
const PASSPHRASE = "flowers4chlo";

type LetterViewSummary = {
  key: string;
  label: string;
  count: number;
  missing: boolean;
};

// Reads the "Read: <id> (<mood>)" / "No letter yet: <mood>" entries that
// page.tsx logs every time Chlo's shown a letter, and tallies them up —
// so it's obvious which letters keep coming up (worth adding more variety
// for) and which moods still have nothing written for them at all.
// Only covers what's still in ntfy's short-term log, same limit as the
// raw activity feed below.
function summarizeLetterViews(
  entries: NotificationLogEntry[]
): LetterViewSummary[] {
  const counts = new Map<string, LetterViewSummary>();
  for (const entry of entries) {
    const read = entry.message.match(/^Read: (.+?) \((.+)\)$/);
    const missing = entry.message.match(/^No letter yet: (.+)$/);
    if (read) {
      const [, id, mood] = read;
      const existing = counts.get(id);
      counts.set(id, {
        key: id,
        label: `${mood} — ${id}`,
        count: (existing?.count ?? 0) + 1,
        missing: false,
      });
    } else if (missing) {
      const mood = missing[1];
      const key = `missing:${mood}`;
      const existing = counts.get(key);
      counts.set(key, {
        key,
        label: `${mood} (no letter written yet)`,
        count: (existing?.count ?? 0) + 1,
        missing: true,
      });
    }
  }
  return Array.from(counts.values()).sort((a, b) => b.count - a.count);
}

export function LetterBuilder() {
  const [open, setOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(false);

  const [tab, setTab] = useState<"write" | "activity">("write");

  const [moodKey, setMoodKey] = useState(moods[0]?.key ?? "sad");
  const [text, setText] = useState("");
  const [signOff, setSignOff] = useState("");
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);

  const [publishLoading, setPublishLoading] = useState(false);
  const [publishError, setPublishError] = useState("");
  const [publishSuccess, setPublishSuccess] = useState(false);

  const [log, setLog] = useState<NotificationLogEntry[] | null>(null);
  const [logLoading, setLogLoading] = useState(false);
  const [logError, setLogError] = useState(false);

  const [pushStatus, setPushStatus] = useState<PushSetupStatus | null>(null);
  const [pushSubscriptionJson, setPushSubscriptionJson] = useState("");
  const [pushError, setPushError] = useState("");
  const [pushLoading, setPushLoading] = useState(false);
  const [subCopied, setSubCopied] = useState(false);

  const letterSummary = log ? summarizeLetterViews(log) : [];

  function refreshPushStatus() {
    setPushStatus(getPushSupportStatus());
  }

  async function handleEnablePush() {
    setPushLoading(true);
    setPushError("");
    try {
      const subJson = await subscribeToPush();
      setPushSubscriptionJson(subJson);
    } catch (e) {
      setPushError((e as Error).message || "Something went wrong.");
    } finally {
      setPushLoading(false);
      refreshPushStatus();
    }
  }

  async function handleCopySubscription() {
    try {
      await navigator.clipboard.writeText(pushSubscriptionJson);
      setSubCopied(true);
      setTimeout(() => setSubCopied(false), 2000);
    } catch {
      // text is still visible/selectable, nothing lost
    }
  }

  async function handleLoadActivity() {
    setLogLoading(true);
    setLogError(false);
    try {
      const entries = await fetchRecentNotifications();
      setLog(entries);
    } catch {
      setLogError(true);
    } finally {
      setLogLoading(false);
    }
  }

  function tryUnlock() {
    if (passInput === PASSPHRASE) {
      setUnlocked(true);
      setPassError(false);
      // Marks this browser tab as "Noah testing" for the rest of the
      // visit, so page.tsx skips the notify-and-delete-from-GitHub
      // behaviour when he's the one clicking through moods, not Chlo.
      // See the note above isNoahTestingSession() in app/page.tsx.
      try {
        sessionStorage.setItem("noah-testing-session", "1");
      } catch {
        // sessionStorage unavailable — worst case this device's testing
        // still triggers a real notify+delete, which is the safe-for-Chlo
        // default anyway.
      }
    } else {
      setPassError(true);
    }
  }

  function handleGenerate() {
    const id = `${moodKey}-${Date.now()}`;
    const bodyText = escapeForTemplateLiteral(text.trim());
    const signOffLine = signOff.trim()
      ? `\n    signOff: \`${escapeForTemplateLiteral(signOff.trim())}\`,`
      : "";
    const code = `  {
    id: "${id}",
    moodKey: "${moodKey}",
    text: \`${bodyText}\`,${signOffLine}
  },`;
    setGenerated(code);
    setCopied(false);
  }

  // Publishes straight to the live site via /api/add-letter — commits the
  // new letter into letters.ts on GitHub directly, no copy/pasting code
  // needed. Falls back to the old "generate code to paste in yourself"
  // flow if that's not set up yet or something goes wrong, so there's
  // always a way to actually add the letter.
  async function handlePublish() {
    setPublishError("");
    setPublishSuccess(false);
    setPublishLoading(true);
    try {
      const res = await fetch("/api/add-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passphrase: passInput,
          moodKey,
          text: text.trim(),
          signOff: signOff.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setPublishSuccess(true);
        setText("");
        setSignOff("");
        setGenerated("");
      } else if (data.reason === "not-configured") {
        setPublishError(
          "GitHub publishing isn't set up yet — here's the code to paste in yourself instead:"
        );
        handleGenerate();
      } else {
        setPublishError(
          `Couldn't publish automatically (${data.reason}) — here's the code to paste in yourself instead:`
        );
        handleGenerate();
      }
    } catch {
      setPublishError(
        "Couldn't reach the site to publish — here's the code to paste in yourself instead:"
      );
      handleGenerate();
    } finally {
      setPublishLoading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(generated);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail (older browser, non-https, permissions).
      // The text is still selectable/visible below, so nothing is lost.
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Letter tools"
        className="fixed bottom-3 right-3 text-xl opacity-20 hover:opacity-60 transition-opacity"
      >
        🌸
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl p-6 sm:p-8">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute top-4 right-4 text-pink-400 hover:text-pink-600 text-xl"
        >
          ✕
        </button>

        {!unlocked ? (
          <div className="text-center py-6">
            <p className="font-hand text-2xl text-pink-700 mb-4">
              Letter tools 🌸
            </p>
            <input
              type="password"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && tryUnlock()}
              placeholder="passphrase"
              className="w-full rounded-xl border-2 border-pink-200 px-4 py-2 text-center focus:outline-none focus:border-pink-400"
              autoFocus
            />
            {passError && (
              <p className="text-red-500 text-sm mt-2">
                Nope, try again.
              </p>
            )}
            <button
              type="button"
              onClick={tryUnlock}
              className="mt-4 rounded-full bg-pink-500 text-white px-5 py-2 text-sm font-medium hover:bg-pink-600 transition-colors"
            >
              Unlock
            </button>
          </div>
        ) : (
          <div>
            <p className="font-hand text-2xl text-pink-700 mb-4 text-center">
              Letter tools 🌸
            </p>

            <div className="flex gap-2 mb-5 justify-center">
              <button
                type="button"
                onClick={() => setTab("write")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  tab === "write"
                    ? "bg-pink-500 text-white"
                    : "bg-pink-50 text-pink-600 hover:bg-pink-100"
                }`}
              >
                Add a letter
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("activity");
                  if (!log) handleLoadActivity();
                  refreshPushStatus();
                }}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  tab === "activity"
                    ? "bg-pink-500 text-white"
                    : "bg-pink-50 text-pink-600 hover:bg-pink-100"
                }`}
              >
                Notifications
              </button>
            </div>

            {tab === "activity" ? (
              <div>
                <div className="rounded-2xl bg-pink-50 px-4 py-4 mb-5">
                  <p className="font-medium text-pink-800 text-sm mb-2">
                    Phone notifications
                  </p>

                  {pushStatus === "unsupported" && (
                    <p className="text-pink-500 text-xs">
                      This browser doesn't support push notifications.
                    </p>
                  )}

                  {pushStatus === "needs-home-screen" && (
                    <p className="text-pink-500 text-xs">
                      Add this site to your home screen first (Share →
                      Add to Home Screen), then open it from that home
                      screen icon and come back to this button.
                    </p>
                  )}

                  {pushStatus === "denied" && (
                    <p className="text-pink-500 text-xs">
                      Notifications are blocked for this site — you'll
                      need to allow them in your phone's settings for this
                      app, then try again.
                    </p>
                  )}

                  {(pushStatus === "ready" || pushStatus === null) && (
                    <button
                      type="button"
                      onClick={handleEnablePush}
                      disabled={pushLoading}
                      className="w-full rounded-full bg-pink-500 text-white px-5 py-2 text-sm font-medium hover:bg-pink-600 disabled:opacity-40 transition-colors"
                    >
                      {pushLoading
                        ? "Setting up..."
                        : "Enable phone notifications"}
                    </button>
                  )}

                  {pushError && (
                    <p className="text-red-500 text-xs mt-2">{pushError}</p>
                  )}

                  {pushSubscriptionJson && (
                    <div className="mt-3">
                      <p className="text-xs text-pink-500 mb-1">
                        Copy this and paste it as a new Vercel environment
                        variable called{" "}
                        <code className="bg-white px-1 rounded">
                          PUSH_SUBSCRIPTION
                        </code>{" "}
                        (Project Settings → Environment Variables), plus
                        add{" "}
                        <code className="bg-white px-1 rounded">
                          VAPID_PRIVATE_KEY
                        </code>{" "}
                        (the one Claude gave you in chat) if you haven't
                        already. Redeploy after saving.
                      </p>
                      <textarea
                        readOnly
                        value={pushSubscriptionJson}
                        rows={4}
                        className="w-full rounded-xl border-2 border-pink-200 px-3 py-2 text-xs font-mono bg-white"
                        onFocus={(e) => e.currentTarget.select()}
                      />
                      <button
                        type="button"
                        onClick={handleCopySubscription}
                        className="mt-2 rounded-full bg-white border-2 border-pink-300 text-pink-600 px-4 py-1.5 text-xs font-medium hover:bg-pink-50 transition-colors"
                      >
                        {subCopied ? "Copied! ✓" : "Copy to clipboard"}
                      </button>
                    </div>
                  )}
                </div>

                {!logLoading && !logError && letterSummary.length > 0 && (
                  <div className="rounded-2xl bg-pink-50 px-4 py-4 mb-5">
                    <p className="font-medium text-pink-800 text-sm mb-2">
                      Letters Chlo's seen recently
                    </p>
                    <ul className="space-y-1.5">
                      {letterSummary.map((item) => (
                        <li
                          key={item.key}
                          className="flex items-center justify-between gap-3 text-sm"
                        >
                          <span
                            className={
                              item.missing ? "text-pink-400" : "text-pink-800"
                            }
                          >
                            {item.label}
                          </span>
                          <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-xs font-medium text-pink-500">
                            ×{item.count}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-pink-400 mt-2">
                      High numbers = she's seeing that one a lot, might be
                      worth adding another. "No letter written yet" means
                      exactly that for that mood.
                    </p>
                  </div>
                )}

                <p className="text-xs text-pink-500 mb-4">
                  Recent activity below is a short-term history log (not
                  the notifications themselves) — it won't go back very
                  far. Your phone's actual notifications are the lasting
                  record.
                </p>

                {logLoading && (
                  <p className="text-pink-400 text-sm text-center py-6">
                    Loading...
                  </p>
                )}

                {!logLoading && logError && (
                  <p className="text-red-500 text-sm text-center py-6">
                    Couldn't load activity right now. Try again in a bit.
                  </p>
                )}

                {!logLoading && !logError && log && log.length === 0 && (
                  <p className="text-pink-400 text-sm text-center py-6">
                    Nothing recent.
                  </p>
                )}

                {!logLoading && !logError && log && log.length > 0 && (
                  <ul className="space-y-2 max-h-64 overflow-y-auto">
                    {log.map((entry, i) => (
                      <li
                        key={i}
                        className="rounded-xl bg-pink-50 px-4 py-2 text-sm"
                      >
                        <p className="text-pink-800">{entry.message}</p>
                        <p className="text-pink-400 text-xs mt-0.5">
                          {new Date(entry.time * 1000).toLocaleString(
                            "en-GB"
                          )}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  type="button"
                  onClick={handleLoadActivity}
                  className="mt-4 w-full rounded-full bg-white border-2 border-pink-300 text-pink-600 px-5 py-2 text-sm font-medium hover:bg-pink-50 transition-colors"
                >
                  Refresh
                </button>
              </div>
            ) : (
              <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">
              Mood
            </label>
            <select
              value={moodKey}
              onChange={(e) => setMoodKey(e.target.value)}
              className="w-full rounded-xl border-2 border-pink-200 px-3 py-2 mb-4 focus:outline-none focus:border-pink-400"
            >
              {moods.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.emoji} {m.label}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium text-pink-700 mb-1">
              Letter text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              placeholder="Write it just like you'd write it to her. Press enter for a new paragraph."
              className="w-full rounded-xl border-2 border-pink-200 px-3 py-2 mb-4 focus:outline-none focus:border-pink-400"
            />

            <label className="block text-sm font-medium text-pink-700 mb-1">
              Sign-off (optional — leave blank for "Love, Noah")
            </label>
            <input
              type="text"
              value={signOff}
              onChange={(e) => setSignOff(e.target.value)}
              placeholder="Love, Noah"
              className="w-full rounded-xl border-2 border-pink-200 px-3 py-2 mb-4 focus:outline-none focus:border-pink-400"
            />

            <button
              type="button"
              onClick={handlePublish}
              disabled={!text.trim() || publishLoading}
              className="w-full rounded-full bg-pink-500 text-white px-5 py-2 text-sm font-medium hover:bg-pink-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {publishLoading ? "Publishing..." : "Publish to the site"}
            </button>

            {publishSuccess && (
              <p className="text-green-600 text-sm text-center mt-3">
                Published! Should be live on the site in about a minute. ✓
              </p>
            )}

            {publishError && (
              <p className="text-red-500 text-xs mt-3">{publishError}</p>
            )}

            <button
              type="button"
              onClick={handleGenerate}
              disabled={!text.trim()}
              className="w-full mt-2 rounded-full bg-white border-2 border-pink-300 text-pink-600 px-5 py-2 text-xs font-medium hover:bg-pink-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Or generate code to paste in yourself
            </button>

            {generated && (
              <div className="mt-5">
                <p className="text-xs text-pink-500 mb-1">
                  Copy this and paste it inside the{" "}
                  <code className="bg-pink-50 px-1 rounded">letters</code>{" "}
                  array in <code className="bg-pink-50 px-1 rounded">
                    app/data/letters.ts
                  </code>{" "}
                  on GitHub — right before the closing{" "}
                  <code className="bg-pink-50 px-1 rounded">];</code>, not
                  after it — then commit to main. Vercel redeploys
                  automatically — check the live site in about a minute.
                </p>
                <textarea
                  readOnly
                  value={generated}
                  rows={6}
                  className="w-full rounded-xl border-2 border-pink-200 px-3 py-2 text-xs font-mono bg-pink-50"
                  onFocus={(e) => e.currentTarget.select()}
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="mt-2 rounded-full bg-white border-2 border-pink-300 text-pink-600 px-5 py-2 text-sm font-medium hover:bg-pink-50 transition-colors"
                >
                  {copied ? "Copied! ✓" : "Copy to clipboard"}
                </button>
              </div>
            )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

