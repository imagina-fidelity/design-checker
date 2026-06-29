import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth disabled for testing — restore shared session proxy before production
export function proxy(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
