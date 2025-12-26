/**
 * @jest-environment node
 */
import { GET } from "@/app/api/github/user/route";
import { NextRequest, NextResponse } from "next/server";

describe("GET /api/github/user - invalid username", () => {
  const originalFetch = global.fetch;
  const originalToken = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

  beforeEach(() => {
    process.env.GITHUB_PERSONAL_ACCESS_TOKEN = "test-token";
    global.fetch = jest.fn() as unknown as typeof global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.GITHUB_PERSONAL_ACCESS_TOKEN = originalToken;
  });

  it("returns 400 for invalid username format", async () => {
    const req = new NextRequest(
      "http://localhost/api/github/user?username=-bad"
    );
    const res = await GET(req);

    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json).toMatchObject({ error: "Invalid username format" });

    // Should not attempt a network call when validation fails
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
