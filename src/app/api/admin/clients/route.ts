import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/adminAuth";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

function checkAdmin(request: Request) {
  return verifyAdminRequest(request);
}

export async function GET(request: Request): Promise<Response> {
  try {
    const auth = checkAdmin(request);

    if (!auth.ok) {
      return auth.response;
    }

    const supabase = createSupabaseAdminClient();

    const { data: accounts, error: accountsError } = await supabase
      .from("client_accounts")
      .select("*")
      .order("updated_at", { ascending: false });

    if (accountsError) {
      return NextResponse.json(
        {
          error: "Impossible de charger les comptes clients.",
          details: accountsError.message,
        },
        { status: 500 }
      );
    }

    const emails = Array.from(
      new Set((accounts || []).map((account: any) => account.email).filter(Boolean))
    );

    const orderIds = Array.from(
      new Set((accounts || []).map((account: any) => account.order_id).filter(Boolean))
    );

    let orders: any[] = [];

    if (orderIds.length > 0) {
      const { data: ordersById } = await supabase
        .from("llc_orders")
        .select("*")
        .in("id", orderIds);

      orders = ordersById || [];
    }

    if (emails.length > 0) {
      const { data: ordersByEmail } = await supabase
        .from("llc_orders")
        .select("*")
        .in("customer_email", emails)
        .order("created_at", { ascending: false });

      const existingIds = new Set(orders.map((order: any) => order.id));

      for (const order of ordersByEmail || []) {
        if (!existingIds.has(order.id)) {
          orders.push(order);
        }
      }
    }

    let documents: any[] = [];
    let messages: any[] = [];

    if (emails.length > 0) {
      const { data: docsData } = await supabase
        .from("client_documents")
        .select("*")
        .in("client_email", emails)
        .order("updated_at", { ascending: false });

      documents = docsData || [];

      const { data: messagesData } = await supabase
        .from("client_messages")
        .select("*")
        .in("client_email", emails)
        .order("created_at", { ascending: false });

      messages = messagesData || [];
    }

    const clients = (accounts || []).map((account: any) => {
      const order =
        orders.find((item: any) => item.id === account.order_id) ||
        orders.find((item: any) => item.customer_email === account.email) ||
        null;

      const clientDocuments = documents.filter((doc: any) => {
        return doc.client_email === account.email || doc.order_id === order?.id;
      });

      const clientMessages = messages.filter((message: any) => {
        return message.client_email === account.email || message.order_id === order?.id;
      });

      return {
        account,
        order,
        documents: clientDocuments,
        messages: clientMessages,
      };
    });

    return NextResponse.json({
      ok: true,
      clients,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erreur inconnue.";

    return NextResponse.json(
      {
        error: "Erreur admin.",
        details: message,
      },
      { status: 500 }
    );
  }
}

