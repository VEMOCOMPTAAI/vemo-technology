// @ts-nocheck

import { NextResponse } from "next/server";
import { getAdminSupabase, verifyAdminToken } from "@/lib/vemoAdminServer";

const defaultSettings = {
  company: {
    brandName: "Vemo Technology",
    legalName: "Vemo Technology LLC",
    email: "contact@vemo-technology.com",
    whatsapp: "+212600000000",
    supportTextFr: "Support client Vemo",
    supportTextEn: "Vemo client support",
  },
  pricing: {
    currency: "USD",
    newMexicoStarter: 119,
    newMexicoStandard: 179,
    newMexicoAdvanced: 199,
    wyomingStarter: 189,
    wyomingStandard: 239,
    wyomingAdvanced: 299,
  },
  bank: {
    bankName: "Bank details pending",
    accountName: "Vemo Technology LLC",
    iban: "",
    swift: "",
    instructionsFr: "Les coordonnées bancaires seront communiquées après validation.",
    instructionsEn: "Bank details will be provided after validation.",
  },
  portal: {
    requireEmailVerification: true,
    allowClientMessages: true,
    allowDocumentDownload: true,
    adminNotificationEmail: "contact@vemo-technology.com",
  },
};

export async function GET(request: Request) {
  const auth = verifyAdminToken(request);

  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status });
  }

  const supabase = getAdminSupabase();

  if (!supabase) {
    return NextResponse.json({ ok: false, message: "Supabase not configured." }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("vemo_settings")
    .select("setting_key, setting_value")
    .order("setting_key", { ascending: true });

  if (error) {
    return NextResponse.json({
      ok: true,
      settings: defaultSettings,
      warning: error.message,
    });
  }

  const settings: Record<string, unknown> = { ...defaultSettings };

  for (const row of data || []) {
    settings[row.setting_key] = {
      ...(settings[row.setting_key] as object || {}),
      ...(row.setting_value || {}),
    };
  }

  return NextResponse.json({
    ok: true,
    settings,
    warning: "",
  });
}

export async function POST(request: Request) {
  const auth = verifyAdminToken(request);

  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status });
  }

  const supabase = getAdminSupabase();

  if (!supabase) {
    return NextResponse.json({ ok: false, message: "Supabase not configured." }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const settings = body?.settings || {};

  const allowedKeys = ["company", "pricing", "bank", "portal"];

  for (const key of allowedKeys) {
    const value = settings[key];

    if (!value || typeof value !== "object") continue;

    const { error } = await supabase
      .from("vemo_settings")
      .upsert(
        {
          setting_key: key,
          setting_value: value,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "setting_key",
        }
      );

    if (error) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
    }
  }

  return NextResponse.json({
    ok: true,
  });
}
