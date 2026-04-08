import { NextRequest, NextResponse } from "next/server";
import { evaluateDaily } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { problemTitle, code } = await req.json();
    const result = await evaluateDaily(problemTitle as string, code as string);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[evaluate-daily]", err);
    return NextResponse.json({ error: "AI evaluation failed" }, { status: 500 });
  }
}
