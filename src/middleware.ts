import { NextRequest, NextResponse } from "next/server";

const SITE_PASSWORD = "2372859525680375jJCARbanak";
const COOKIE_NAME = "cg_site_access";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/site-lock"
  ) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(COOKIE_NAME);
  if (cookie?.value === SITE_PASSWORD) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/site-lock";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
