import { NextResponse } from "next/server";
import { getGitHubConfig, getLettersFile } from "../../lib/github-file";

// TEMPORARY diagnostic endpoint — visit it in a browser to see exactly what
// Vercel currently has stored for the GitHub env vars, without exposing the
// actual secret token. Built because a 401 kept happening and guessing at
// the cause twice in a row didn't fix it — this shows the real values
// instead of guessing a third time.
//
// Visit: https://your-site.vercel.app/api/debug-github?passphrase=flowers4chlo
// (swap in your real passphrase if you changed it from the default)
//
// Safe to leave up short-term — it never returns the actual token, only its
// length and first few characters (enough to spot a truncated/wrong paste
// without leaking the real value) — but delete this whole file once
// publishing works, no need to keep a diagnostic endpoint around forever.

const PASSPHRASE = "flowers4chlo";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("passphrase") !== PASSPHRASE) {
    return NextResponse.json({ ok: false, reason: "wrong-passphrase" });
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const path = process.env.GITHUB_LETTERS_PATH;
  const branch = process.env.GITHUB_BRANCH || "main (default, no override set)";

  const env = {
    hasToken: !!token,
    tokenPrefix: token ? token.slice(0, 12) : null,
    tokenLength: token ? token.length : 0,
    hasRepo: !!repo,
    repo: repo || null,
    hasPath: !!path,
    path: path || null,
    branch,
  };

  let githubCheck: unknown = "skipped — one of the env vars above is missing";
  const config = getGitHubConfig();
  if (config) {
    const file = await getLettersFile(config);
    githubCheck = file.ok
      ? { ok: true, message: "GitHub accepted the token and found the file.", fileLength: file.content.length }
      : { ok: false, reason: file.reason };
  }

  return NextResponse.json({ env, githubCheck });
}
