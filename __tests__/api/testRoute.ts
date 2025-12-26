/**
 * @jest-environment node
 */
import { GET } from "@/app/api/test/route";
import { NextResponse } from "next/server";

it("should return OK message with timestamp", async () => {
  const response = await GET();
  expect(response).toBeInstanceOf(NextResponse);

  const json = await response.json();
  expect(json).toHaveProperty("message", "OK");
  expect(json).toHaveProperty("timestamp");

  const timestamp = new Date(json.timestamp);
  expect(timestamp.toString()).not.toBe("Invalid Date");
});
