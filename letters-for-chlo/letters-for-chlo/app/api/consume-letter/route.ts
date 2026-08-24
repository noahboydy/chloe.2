import { NextResponse } from "next/server";
import { sendPushToNoah } from "../../lib/push-server";
import { removeLetterFromSource } from "../../lib/letter-source";

// Called once every time Chlo is actually shown a letter (see
// logConsumeLetter() in app/page.tsx — it skips calling this at all while
// Noah's own "testing" flag is set, see the note there). Does two things:
//
//   1. Sends Noah a real push: "go write a replacement for this one".
//   2. Deletes that letter straight out of the live GitHub repo, so it
//      can never be shown again until Noah adds a new one — using the
//      GitHub Contents API with a personal access token.
//
// Needs three more env vars beyond the push ones (VAPID_PRIVATE_KEY /
// PUSH_SUBSCRIPTION), all optional in the sense that this quietly skips
// step 2 (but still does step 1) if they're missing — see the README's
// "Auto-removing letters" section for how to set these up:
//
//   GITHUB_TOKEN         — a fine-grained personal access token, scoped to
//                          ONLY this one repo, with "Contents" read+write.
//   GITHUB_REPO          — "your-username/your-repo-name"
//   GITHUB_LETTERS_PATH  — the path to letters.ts INSIDE that repo (this
//                          depends on your repo's folder structure — see
//                          the README for how to find it exactly)
//
// GITHUB_BRANCH is optional and defaults to "main".
//
// Heads up (also in the README): this means ANY real visit that shows a
// letter consumes it permanently — if the link ever got shared beyond
// Chlo, or she clicks "Read another" a lot, letters really do disappear
// for good until you write more. That's the point of this feature, but
// worth knowing.

export async function POST(req: Request) {
  let body: { letterId?: string; moodLabel?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-request" });
  }

  const letterId = body.letterId;
  const moodLabel = body.moodLabel || "a mood";
  if (!letterId) {
    return NextResponse.json({ ok: false, reason: "bad-request" });
  }

  const pushResult = await sendPushToNoah(
    "Time to replace a letter ✏️",
    `Chlo just read "${moodLabel}" (${letterId}). Go write her a new one when you can!`
  );

  const removeResult = await removeLetterFromGitHub(letterId);

  return NextResponse.json({ push: pushResult, remove: removeResult });
}

type RemoveResult =
  | { ok: true; removed: boolean }
  | { ok: false; reason: string; detail?: string };

async function removeLetterFromGitHub(letterId: string): Promise<RemoveResult> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const path = process.env.GITHUB_LETTERS_PATH;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !repo || !path) {
    return { ok: false, reason: "not-configured" };
  }

  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "letters-for-chlo",
  };

  try {
    const getRes = await fetch(`${apiUrl}?ref=${branch}`, { headers });
    if (!getRes.ok) {
      return { ok: false, reason: `github-get-failed-${getRes.status}` };
    }
    const file = await getRes.json();
    const currentSource = Buffer.from(file.content, "base64").toString("utf-8");

    const { updated, removed } = removeLetterFromSource(currentSource, letterId);
    if (!removed) {
      // Letter wasn't found in the expected shape/location — nothing to
      // do, not an error (Noah still got his notification above).
      return { ok: true, removed: false };
    }

    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Remove read letter: ${letterId}`,
        content: Buffer.from(updated, "utf-8").toString("base64"),
        sha: file.sha,
        branch,
      }),
    });

    if (!putRes.ok) {
      // Common cause: someone else's commit landed between the GET and
      // the PUT (stale sha) — harmless, just means this particular
      // removal didn't go through this time.
      return { ok: false, reason: `github-put-failed-${putRes.status}` };
    }

    return { ok: true, removed: true };
  } catch (err) {
    return { ok: false, reason: "github-request-failed", detail: String(err) };
  }
}
