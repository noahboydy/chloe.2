import { NextResponse } from "next/server";
import { sendPushToNoah } from "../../lib/push-server";
import { removeLetterFromSource } from "../../lib/letter-source";
import { getGitHubConfig, getLettersFile, putLettersFile } from "../../lib/github-file";

// Called once every time Chlo is actually shown a letter (see
// consumeLetter() in app/page.tsx — it skips calling this at all while
// Noah's own "testing" flag is set, see the note there). Does two things:
//
//   1. Sends Noah a real push: "go write a replacement for this one".
//   2. Deletes that letter straight out of the live GitHub repo, so it
//      can never be shown again until Noah adds a new one.
//
// Step 2 needs the GITHUB_TOKEN / GITHUB_REPO / GITHUB_LETTERS_PATH env
// vars (see app/lib/github-file.ts and the README) — if they're missing,
// this quietly skips step 2 but still does step 1.
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

  const removeResult = await removeLetter(letterId);

  return NextResponse.json({ push: pushResult, remove: removeResult });
}

type RemoveResult = { ok: true; removed: boolean } | { ok: false; reason: string };

async function removeLetter(letterId: string): Promise<RemoveResult> {
  const config = getGitHubConfig();
  if (!config) return { ok: false, reason: "not-configured" };

  const file = await getLettersFile(config);
  if (!file.ok) return { ok: false, reason: file.reason };

  const { updated, removed } = removeLetterFromSource(file.content, letterId);
  if (!removed) {
    // Letter wasn't found in the expected shape/location — nothing to
    // do, not an error (Noah still got his notification above).
    return { ok: true, removed: false };
  }

  const put = await putLettersFile(
    config,
    updated,
    file.sha,
    `Remove read letter: ${letterId}`
  );
  if (!put.ok) return { ok: false, reason: put.reason };

  return { ok: true, removed: true };
}
