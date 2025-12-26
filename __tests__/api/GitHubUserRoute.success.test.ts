/**
 * @jest-environment node
 */
import { GET } from "@/app/api/github/user/route";
import { NextRequest, NextResponse } from "next/server";

const makeRequest = (username: string): NextRequest => {
  const url = `http://localhost/api/github/user?username=${encodeURIComponent(
    username
  )}`;
  return new NextRequest(url);
};

describe("GET /api/github/user - success", () => {
  const originalFetch = global.fetch;
  const originalToken = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

  beforeEach(() => {
    process.env.GITHUB_PERSONAL_ACCESS_TOKEN = "test-token";
    global.fetch = jest.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        login: "octocat",
        id: 583231,
        avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
        html_url: "https://github.com/octocat",
        name: "The Octocat",
      }),
    })) as unknown as typeof global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.GITHUB_PERSONAL_ACCESS_TOKEN = originalToken;
  });

  it("returns 200 with user JSON when GitHub responds OK", async () => {
    const req = makeRequest("octocat");
    const res = await GET(req);

    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toMatchObject({
      login: "octocat",
      id: 583231,
      avatar_url: expect.stringContaining("avatars.githubusercontent.com"),
      html_url: expect.stringContaining("github.com/octocat"),
    });

    // Ensure our fetch mock was called with the expected URL and header
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.github.com/users/octocat",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.stringContaining("Bearer test-token"),
        }),
      })
    );
  });
});
