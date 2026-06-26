import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email") || "";
  const redirect = url.searchParams.get("redirect") || "/fr/client";

  const res = NextResponse.redirect(new URL(redirect, url.origin));
  if (email) {
    res.cookies.set("vemo_client_email", email, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return res;
}
