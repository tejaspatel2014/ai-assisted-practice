/**
 * @jest-environment node
 */
import { GET } from "@/app/api/github/user/route";
import { NextRequest, NextResponse } from "next/server";

describe("GET /api/github/user - missing token", () => {
  const originalFetch = global.fetch;
  const originalToken = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

  beforeEach(() => {
    delete process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
    global.fetch = jest.fn() as unknown as typeof global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.GITHUB_PERSONAL_ACCESS_TOKEN = originalToken;
  });

  it("returns 500 when GITHUB_PERSONAL_ACCESS_TOKEN is not set", async () => {
    const req = new NextRequest(
      "http://localhost/api/github/user?username=octocat"
    );
    const res = await GET(req);

    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json).toMatchObject({
      error: "Server is missing env variable details.",
    });

    // Should not attempt a network call
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
