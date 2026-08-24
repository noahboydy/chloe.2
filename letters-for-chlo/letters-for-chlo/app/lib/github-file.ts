// Shared helper for reading/writing app/data/letters.ts directly in the
// GitHub repo via the GitHub Contents API. Used by both /api/consume-letter
// (deletes a letter after Chlo reads it) and /api/add-letter (publishes a
// new one from the hidden panel) so the actual GitHub-talking code lives
// in one place.
//
// Needs three env vars, set in Vercel — see the README's "Publish letters
// straight from the site" section for how to create these:
//
//   GITHUB_TOKEN         — a fine-grained personal access token, scoped to
//                          ONLY this one repo, with "Contents" read+write.
//   GITHUB_REPO          — "your-username/your-repo-name"
//   GITHUB_LETTERS_PATH  — the path to letters.ts INSIDE that repo
//
// GITHUB_BRANCH is optional and defaults to "main". If any of the first
// three are missing, getLettersFile() returns null and callers should
// degrade gracefully rather than erroring.

export type GitHubConfig = {
  token: string;
  repo: string;
  path: string;
  branch: string;
};

export function getGitHubConfig(): GitHubConfig | null {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const path = process.env.GITHUB_LETTERS_PATH;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token || !repo || !path) return null;
  return { token, repo, path, branch };
}

function apiUrl(config: GitHubConfig) {
  return `https://api.github.com/repos/${config.repo}/contents/${config.path}`;
}

function headers(config: GitHubConfig) {
  return {
    Authorization: `Bearer ${config.token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "letters-for-chlo",
  };
}

export type GetFileResult =
  | { ok: true; content: string; sha: string }
  | { ok: false; reason: string };

export async function getLettersFile(config: GitHubConfig): Promise<GetFileResult> {
  try {
    const res = await fetch(`${apiUrl(config)}?ref=${config.branch}`, {
      headers: headers(config),
    });
    if (!res.ok) return { ok: false, reason: `github-get-failed-${res.status}` };
    const file = await res.json();
    const content = Buffer.from(file.content, "base64").toString("utf-8");
    return { ok: true, content, sha: file.sha };
  } catch (err) {
    return { ok: false, reason: `github-get-error: ${String(err)}` };
  }
}

export type PutFileResult = { ok: true } | { ok: false; reason: string };

export async function putLettersFile(
  config: GitHubConfig,
  newContent: string,
  sha: string,
  commitMessage: string
): Promise<PutFileResult> {
  try {
    const res = await fetch(apiUrl(config), {
      method: "PUT",
      headers: { ...headers(config), "Content-Type": "application/json" },
      body: JSON.stringify({
        message: commitMessage,
        content: Buffer.from(newContent, "utf-8").toString("base64"),
        sha,
        branch: config.branch,
      }),
    });
    if (!res.ok) {
      // Common cause: someone else's commit landed between the GET and the
      // PUT (stale sha) — harmless, just means this particular write
      // didn't go through this time; the caller can retry.
      return { ok: false, reason: `github-put-failed-${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: `github-put-error: ${String(err)}` };
  }
}
