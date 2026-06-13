import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = String(formData.get("password") || "");

  if (password !== "123456") {
    return NextResponse.redirect(new URL("/fr/admin/login", request.url));
  }

  const response = NextResponse.redirect(new URL("/fr/admin/client-portal", request.url));
  response.cookies.set("vemo_admin_access", "true", {
    path: "/",
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
  });

  return response;
}
