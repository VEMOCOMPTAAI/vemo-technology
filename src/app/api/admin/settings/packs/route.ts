import { NextResponse } from "next/server";
import {
  REGISTERED_AGENT_RENEWAL_BY_STATE,
  VEMO_LLC_PACKS,
} from "@/lib/vemoLlcPacks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    packs: VEMO_LLC_PACKS,
    registeredAgentRenewal: REGISTERED_AGENT_RENEWAL_BY_STATE,
    states: ["Wyoming", "New Mexico"],
  });
}
