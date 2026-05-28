// @ts-nocheck
import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/adminAuth";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

function checkAdmin(request: Request) {
  return verifyAdminRequest(request);
}

function cleanFileName(name: string) {
  return String(name || "document")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function documentKeyFromTitle(title: string) {
  const value = String(title || "").trim().toLowerCase();

  if (
    value === "company document" ||
    value === "documents société" ||
    value === "documents societe" ||
    value === "formation document"
  ) {
    return "company_document";
  }

  if (value === "operating agreement") {
    return "operating_agreement";
  }

  if (value === "ein letter" || value === "ein" || value === "ein / irs") {
    return "ein_letter";
  }

  if (value.includes("address") || value.includes("adresse")) {
    return "proof_of_address";
  }

  if (
    value.includes("identity") ||
    value.includes("identité") ||
    value.includes("passport") ||
    value.includes("passeport")
  ) {
    return "identity_document";
  }

  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function cleanTitle(title: string) {
  const key = documentKeyFromTitle(title);

  if (key === "company_document") return "Company Document";
  if (key === "operating_agreement") return "Operating Agreement";
  if (key === "ein_letter") return "EIN Letter";
  if (key === "proof_of_address") return "Justificatif d'adresse";
  if (key === "identity_document") return "Pièce d'identité";

  return title;
}

export async function POST(request: Request) {
  try {
    const auth = checkAdmin(request);

    if (!auth.ok) {
      return auth.response;
    }

    const supabase = createSupabaseAdminClient();

    const form = await request.formData();

    const file = form.get("file") as File | null;
    const orderId = String(form.get("orderId") || "").trim();
    const clientEmail = String(form.get("clientEmail") || "").trim().toLowerCase();
    const rawTitle = String(form.get("title") || "").trim();
    const adminComment = String(form.get("adminComment") || "").trim();
    const existingDocumentId = String(form.get("documentId") || "").trim();

    if (!clientEmail) {
      return NextResponse.json(
        { error: "Email client manquant." },
        { status: 400 }
      );
    }

    if (!rawTitle) {
      return NextResponse.json(
        { error: "Titre du document manquant." },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: "Fichier manquant." },
        { status: 400 }
      );
    }

    const title = cleanTitle(rawTitle);
    const documentKey = documentKeyFromTitle(rawTitle);

    await supabase.storage.createBucket("client-documents", {
      public: true,
    }).catch(() => null);

    const fileName = cleanFileName(file.name);
    const safeEmail = clientEmail.replace(/[^a-zA-Z0-9@._-]/g, "-");
    const safeOrder = orderId || "no-order";
    const filePath = `${safeEmail}/${safeOrder}/${documentKey}/${Date.now()}-${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("client-documents")
      .upload(filePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        {
          error: "Upload impossible.",
          details: uploadError.message,
        },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("client-documents")
      .getPublicUrl(filePath);

    const fileUrl = publicUrlData.publicUrl;

    let targetDocumentId = existingDocumentId;

    if (!targetDocumentId) {
      let query = supabase
        .from("client_documents")
        .select("id")
        .eq("client_email", clientEmail)
        .eq("document_key", documentKey)
        .limit(1);

      if (orderId) {
        query = query.eq("order_id", orderId);
      }

      const { data: existingDocument } = await query.maybeSingle();

      if (existingDocument?.id) {
        targetDocumentId = existingDocument.id;
      }
    }

    let documentResult = null;

    if (targetDocumentId) {
      const { data: updatedDocument, error: updateError } = await supabase
        .from("client_documents")
        .update({
          title,
          document_key: documentKey,
          status: "completed",
          required: false,
          file_url: fileUrl,
          file_path: filePath,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          uploaded_by: "admin",
          admin_comment: adminComment || "Document ajouté par l’équipe Vemo.",
          updated_at: new Date().toISOString(),
        })
        .eq("id", targetDocumentId)
        .select("*")
        .single();

      if (updateError) {
        return NextResponse.json(
          {
            error: "Impossible de mettre à jour le document.",
            details: updateError.message,
          },
          { status: 500 }
        );
      }

      documentResult = updatedDocument;
    } else {
      const { data: insertedDocument, error: insertError } = await supabase
        .from("client_documents")
        .insert({
          order_id: orderId || null,
          client_email: clientEmail,
          title,
          document_key: documentKey,
          status: "completed",
          required: false,
          file_url: fileUrl,
          file_path: filePath,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          uploaded_by: "admin",
          admin_comment: adminComment || "Document ajouté par l’équipe Vemo.",
          updated_at: new Date().toISOString(),
        })
        .select("*")
        .single();

      if (insertError) {
        return NextResponse.json(
          {
            error: "Impossible d'ajouter le document.",
            details: insertError.message,
          },
          { status: 500 }
        );
      }

      documentResult = insertedDocument;
    }

    await supabase.from("client_messages").insert({
      order_id: orderId || null,
      client_email: clientEmail,
      sender: "Admin Vemo",
      message: `Un document est disponible : ${title}.`,
      message_type: "document",
      is_read: false,
    });

    return NextResponse.json({
      ok: true,
      document: documentResult,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erreur inconnue.";

    return NextResponse.json(
      {
        error: "Impossible d'uploader le document.",
        details: message,
      },
      { status: 500 }
    );
  }
}



