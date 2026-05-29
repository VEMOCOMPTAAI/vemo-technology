import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function safeName(name: string) {
  return String(name || "justificatif")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();

    const email = String(form.get("email") || "").trim().toLowerCase();
    const dossierNumber = String(form.get("dossier_number") || "").trim();
    const file = form.get("file");

    if (!email || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "Email client invalide." }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Justificatif manquant." }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads", "bank-transfers");
    await fs.mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${safeName(file.name)}`;
    const fullPath = path.join(uploadDir, fileName);
    await fs.writeFile(fullPath, bytes);

    const fileUrl = `/uploads/bank-transfers/${fileName}`;
    const supabase = supabaseAdmin();

    if (supabase) {
      try {
        await supabase.from("client_documents").insert({
          client_email: email,
          title: "Justificatif de virement",
          document_type: "Justificatif de virement",
          file_name: file.name,
          file_url: fileUrl,
          status: "pending_verification",
          dossier_number: dossierNumber,
          uploaded_by: "client",
        });
      } catch {}

      try {
        await supabase.from("client_messages").insert({
          client_email: email,
          sender: "vemo",
          message: "Justificatif de virement reçu. Paiement en attente de vérification.",
        });
      } catch {}

      for (const table of ["orders", "clients", "client_payments"]) {
        try {
          await supabase
            .from(table)
            .update({
              payment_status: "pending_verification",
              dossier_status: "payment_pending_verification",
              status: "pending_verification",
              updated_at: new Date().toISOString(),
            })
            .eq("client_email", email);
        } catch {}
      }
    }

    return NextResponse.json({
      ok: true,
      file_url: fileUrl,
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: error?.message || "Erreur upload justificatif.",
    }, { status: 500 });
  }
}
