import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type AdminOk = {
  ok: true;
  email: string;
  user: any;
};

type AdminFail = {
  ok: false;
  response: NextResponse;
};

const ADMIN_COOKIE_NAME = "vemo_admin_session";

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization") || "";

  if (authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.slice(7).trim();
  }

  return "";
}

function getAllowedAdminEmails() {
  return String(process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function verifyAdminRequest(
  request: Request
): Promise<AdminOk | AdminFail> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error:
            "Configuration Supabase admin manquante : NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY.",
        },
        { status: 500 }
      ),
    };
  }

  const token = getBearerToken(request);

  if (!token) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Session admin manquante." },
        { status: 401 }
      ),
    };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user?.email) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Session admin invalide ou expirée." },
        { status: 401 }
      ),
    };
  }

  const email = user.email.trim().toLowerCase();
  const allowedEmails = getAllowedAdminEmails();

  if (!allowedEmails.includes(email)) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: "Accès admin refusé.",
          email,
        },
        { status: 403 }
      ),
    };
  }

  return {
    ok: true,
    email,
    user,
  };
}

/**
 * Compatibilité avec les anciennes routes /api/admin/auth/login et logout.
 * La sécurité principale admin utilise maintenant Supabase Bearer token.
 */
export function createAdminSessionToken(email: string) {
  const payload = {
    email: email.trim().toLowerCase(),
    createdAt: new Date().toISOString(),
  };

  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function setAdminCookie(response: NextResponse, token: string) {
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export function clearAdminCookie(response: NextResponse) {
  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}