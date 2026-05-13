import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const protectedAdmin =
    pathname === "/admin" ||
    pathname.startsWith("/admin/dossiers");

  if (!protectedAdmin) {
    return NextResponse.next();
  }

  const session = request.cookies.get("vemo_admin_session")?.value;

  if (session === "ok") {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/admin/connexion";

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
