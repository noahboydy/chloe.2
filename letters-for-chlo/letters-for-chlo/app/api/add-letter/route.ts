import { NextResponse } from "next/server";
import { addLetterToSource } from "../../lib/letter-source";
import { getGitHubConfig, getLettersFile, putLettersFile } from "../../lib/github-file";

// Publishes a new letter straight from the hidden 🌸 panel's "Add a
// letter" tab — no copy/pasting code into GitHub needed. Called from
// LetterBuilder.tsx's "Publish to the site" button.
//
// Needs the GITHUB_TOKEN / GITHUB_REPO / GITHUB_LETTERS_PATH env vars
// (same ones /api/consume-letter uses — see app/lib/github-file.ts and the
// README's "Publish letters straight from the site" section). If they're
// missing, this returns not-configured and LetterBuilder.tsx falls back to
// the old "generate code to paste in yourself" flow instead.
//
// PASSPHRASE here must match the one in LetterBuilder.tsx — it's checked
// again server-side because this endpoint has a real effect (commits to
// your repo), unlike the passphrase's original purely-client-side "keep
// Chlo out of my writing tool" job. Still not real security (same caveat
// as always — anyone reading the source could find it), just raises the
// bar above "guess the URL."
const PASSPHRASE = "flowers4chlo";

export async function POST(req: Request) {
  let body: {
    passphrase?: string;
    moodKey?: string;
    text?: string;
    signOff?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-request" });
  }

  if (body.passphrase !== PASSPHRASE) {
    return NextResponse.json({ ok: false, reason: "wrong-passphrase" });
  }

  const moodKey = body.moodKey;
  const text = body.text?.trim();
  const signOff = body.signOff?.trim() || undefined;
  if (!moodKey || !text) {
    return NextResponse.json({ ok: false, reason: "bad-request" });
  }

  const config = getGitHubConfig();
  if (!config) {
    return NextResponse.json({ ok: false, reason: "not-configured" });
  }

  const file = await getLettersFile(config);
  if (!file.ok) {
    return NextResponse.json({ ok: false, reason: file.reason });
  }

  const id = `${moodKey}-${Date.now()}`;
  const { updated, added } = addLetterToSource(file.content, {
    id,
    moodKey,
    text,
    signOff,
  });
  if (!added) {
    return NextResponse.json({ ok: false, reason: "could-not-place-letter" });
  }

  const put = await putLettersFile(
    config,
    updated,
    file.sha,
    `Add letter: ${id}`
  );
  if (!put.ok) {
    return NextResponse.json({ ok: false, reason: put.reason });
  }

  return NextResponse.json({ ok: true, id });
}
