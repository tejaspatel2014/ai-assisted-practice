import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "OK", timestamp: new Date().toISOString() },
    { status: 200 }
  );
}
