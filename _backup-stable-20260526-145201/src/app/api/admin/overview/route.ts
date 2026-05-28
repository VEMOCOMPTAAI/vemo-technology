// @ts-nocheck

import { NextResponse } from "next/server";
import { safeCount, verifyAdminToken } from "@/lib/vemoAdminServer";

export async function GET(request: Request) {
  const auth = verifyAdminToken(request);

  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status });
  }

  const [
    totalClients,
    totalOrders,
    pendingPayments,
    pendingDocuments,
    openMessages,
  ] = await Promise.all([
    safeCount("client_accounts"),
    safeCount("client_orders"),
    safeCount("client_payments"),
    safeCount("client_documents"),
    safeCount("client_messages"),
  ]);

  return NextResponse.json({
    ok: true,
    totalClients,
    totalOrders,
    pendingPayments,
    pendingDocuments,
    openMessages,
  });
}
