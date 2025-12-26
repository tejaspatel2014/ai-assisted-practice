/**
 * @jest-environment node
 */
import { GET } from "@/app/api/github/user/route";
import { NextRequest, NextResponse } from "next/server";

describe("GET /api/github/user - GitHub 404", () => {
  const originalFetch = global.fetch;
  const originalToken = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

  beforeEach(() => {
    process.env.GITHUB_PERSONAL_ACCESS_TOKEN = "test-token";
    global.fetch = jest.fn(async () => ({
      ok: false,
      status: 404,
      text: async () => "", // cause JSON parse to fail and trigger fallback message
    })) as unknown as typeof global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.GITHUB_PERSONAL_ACCESS_TOKEN = originalToken;
  });

  it("returns 404 with fallback 'User not found' message", async () => {
    const req = new NextRequest(
      "http://localhost/api/github/user?username=nonexistentuser"
    );
    const res = await GET(req);

    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(404);

    const json = await res.json();
    expect(json).toMatchObject({ error: "User not found" });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.github.com/users/nonexistentuser",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.stringContaining("Bearer test-token"),
        }),
      })
    );
  });
});
