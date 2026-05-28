// @ts-nocheck
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    const adminEmail = String(process.env.VEMO_ADMIN_EMAIL || "").trim().toLowerCase();
    const adminPassword = String(process.env.VEMO_ADMIN_PASSWORD || "");
    const adminToken = String(process.env.VEMO_ADMIN_TOKEN || "vemo-admin-token");

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        {
          ok: false,
          message: "Admin credentials are not configured.",
        },
        { status: 500 }
      );
    }

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid admin credentials.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      ok: true,
      token: adminToken,
      email: adminEmail,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Admin login failed.",
      },
      { status: 500 }
    );
  }
}
