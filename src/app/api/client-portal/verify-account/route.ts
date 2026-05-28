// @ts-nocheck

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

function getBaseUrl(request: Request) {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "";

  if (envUrl) return envUrl.replace(/\/$/, "");

  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

function getSupabaseAnon() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function GET(request: Request) {
  return NextResponse.redirect(new URL("/fr/verification-compte", request.url), 303);
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();

    const client_email = clean(form.get("client_email")).toLowerCase();
    const password = clean(form.get("password"));
    const password_confirm = clean(form.get("password_confirm"));
    const payment = clean(form.get("payment"));
    const status = clean(form.get("status")) || "pending_verification";

    if (!client_email || !client_email.includes("@")) {
      return NextResponse.redirect(
        new URL(`/fr/verification-compte?error=email`, request.url),
        303
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.redirect(
        new URL(
          `/fr/verification-compte?error=password&email=${encodeURIComponent(client_email)}&payment=${encodeURIComponent(payment)}`,
          request.url
        ),
        303
      );
    }

    if (password !== password_confirm) {
      return NextResponse.redirect(
        new URL(
          `/fr/verification-compte?error=password_confirm&email=${encodeURIComponent(client_email)}&payment=${encodeURIComponent(payment)}`,
          request.url
        ),
        303
      );
    }

    const supabaseAnon = getSupabaseAnon();
    const supabaseAdmin = getSupabaseAdmin();

    if (!supabaseAnon) {
      return NextResponse.redirect(
        new URL(
          `/fr/confirmation-email?email=${encodeURIComponent(client_email)}&payment=${encodeURIComponent(payment)}&mail=supabase_anon_missing&reason=${encodeURIComponent("NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY manquant dans .env.local")}`,
          request.url
        ),
        303
      );
    }

    const baseUrl = getBaseUrl(request);
    const emailRedirectTo =
      `${baseUrl}/fr/auth/callback?next=${encodeURIComponent("/fr/espace-client")}`;

    let mailStatus = "sent";
    let reason = "";

    const signUp = await supabaseAnon.auth.signUp({
      email: client_email,
      password,
      options: {
        emailRedirectTo,
        data: {
          role: "client",
          source: "vemo_portal",
          payment_status: status,
        },
      },
    });

    if (signUp.error) {
      reason = signUp.error.message || "Erreur Supabase Auth";

      const msg = reason.toLowerCase();

      if (
        msg.includes("already") ||
        msg.includes("registered") ||
        msg.includes("exists") ||
        msg.includes("user already")
      ) {
        const resend = await supabaseAnon.auth.resend({
          type: "signup",
          email: client_email,
          options: {
            emailRedirectTo,
          },
        });

        if (resend.error) {
          mailStatus = "resend_failed";
          reason = resend.error.message || reason;
        } else {
          mailStatus = "resent";
          reason = "";
        }
      } else {
        mailStatus = "signup_failed";
      }
    }

    if (supabaseAdmin) {
      await supabaseAdmin
        .from("client_accounts")
        .upsert(
          {
            email: client_email,
            portal_enabled: false,
            payment_status: status,
            account_status: "pending_email_confirmation",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "email" }
        )
        .then(() => null);

      await supabaseAdmin
        .from("client_messages")
        .insert({
          client_email,
          sender: "system",
          message:
            status === "pending_verification"
              ? "Compte créé. Email de confirmation envoyé. Paiement en attente de vérification."
              : "Compte créé. Email de confirmation envoyé.",
          created_at: new Date().toISOString(),
        })
        .then(() => null);
    }

    return NextResponse.redirect(
      new URL(
        `/fr/confirmation-email?email=${encodeURIComponent(client_email)}&payment=${encodeURIComponent(payment)}&mail=${encodeURIComponent(mailStatus)}&reason=${encodeURIComponent(reason)}`,
        request.url
      ),
      303
    );
  } catch (error: any) {
    console.error("VEMO verify-account fatal:", error?.message || error);

    return NextResponse.redirect(
      new URL(
        `/fr/verification-compte?error=server&reason=${encodeURIComponent(error?.message || "Erreur serveur verify-account")}`,
        request.url
      ),
      303
    );
  }
}
