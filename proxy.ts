import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const proxy = auth(function proxy(req) {
  if (!req.auth) {
    const portalLogin =
      process.env.PORTAL_LOGIN_URL ?? "https://portal.imagina.au/login";
    const destination = new URL(portalLogin);
    destination.searchParams.set("callbackUrl", req.nextUrl.href);
    return NextResponse.redirect(destination);
  }
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)"],
};
