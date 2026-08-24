import { NextResponse } from "next/server";
import { sendPushToNoah } from "../../lib/push-server";

// Sends a real push notification to Noah's phone. See app/lib/push-server.ts
// for the shared sending logic and the env vars it needs.

export async function POST(req: Request) {
  let body: { title?: string; message?: string; urgent?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-request" });
  }

  const result = await sendPushToNoah(
    body.title || "Chlo Chlo",
    body.message || "",
    !!body.urgent
  );

  return NextResponse.json(result);
}
