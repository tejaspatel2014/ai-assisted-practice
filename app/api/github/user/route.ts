import { NextResponse } from "next/server";

type GitHubErrorResponse = {
  message?: string;
  documentation_url?: string;
  error?: string;
  errors?: Array<{
    resource?: string;
    field?: string;
    code?: string;
    message?: string;
  }>;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const username = url.searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Missing 'username' query parameter" },
      { status: 400 }
    );
  }

  // Basic server-side validation mirroring client rules
  const trimmed = username.trim();
  const isValidLength = trimmed.length >= 1 && trimmed.length <= 39;
  const validChars = /^[a-zA-Z0-9-]+$/.test(trimmed);
  const startsOrEndsHyphen = trimmed.startsWith("-") || trimmed.endsWith("-");
  const hasConsecutiveHyphens = trimmed.includes("--");
  if (
    !isValidLength ||
    !validChars ||
    startsOrEndsHyphen ||
    hasConsecutiveHyphens
  ) {
    return NextResponse.json(
      { error: "Invalid username format" },
      { status: 400 }
    );
  }

  const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Server is missing GITHUB_PERSONAL_ACCESS_TOKEN" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(trimmed)}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
          // Some GitHub endpoints expect a User-Agent
          "User-Agent": "ai-practice-nextjs-app",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const bodyText = await res.text().catch(() => "");
      let body: GitHubErrorResponse | undefined;
      try {
        body = JSON.parse(bodyText) as GitHubErrorResponse;
      } catch (parseErr) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            "[api/github/user] Failed to parse GitHub error response",
            {
              status: res.status,
              bodyText,
              error:
                parseErr instanceof Error ? parseErr.message : String(parseErr),
            }
          );
        }
        body = undefined;
      }
      const message =
        (body && (body.error || body.message)) ||
        (res.status === 404
          ? "User not found"
          : res.status === 403
          ? "Access forbidden or rate limited"
          : `GitHub API error: ${res.status}`);
      return NextResponse.json({ error: message }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[api/github/user] Request failed", err);
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
