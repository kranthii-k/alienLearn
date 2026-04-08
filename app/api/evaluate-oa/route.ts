import { NextRequest, NextResponse } from "next/server";
import { evaluateOA } from "@/lib/ai";
import { OAPayload } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as OAPayload;
    const result = await evaluateOA(payload);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[evaluate-oa]", err);
    return NextResponse.json({ error: "AI evaluation failed" }, { status: 500 });
  }
}
