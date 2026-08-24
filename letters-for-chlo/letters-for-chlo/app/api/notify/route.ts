import { NextResponse } from "next/server";
import webpush from "web-push";

// Sends a real push notification to Noah's phone. Reads three server-side
// secrets from Vercel environment variables — never exposed to the
// browser, unlike the public VAPID key in app/lib/push-client.ts:
//
//   VAPID_PRIVATE_KEY   — pairs with the public key in push-client.ts
//   PUSH_SUBSCRIPTION   — the subscription JSON generated once when Noah
//                         taps "Enable phone notifications" in the hidden
//                         panel, then pasted here as an env var
//
// If either is missing, this quietly does nothing rather than erroring —
// so the rest of the site keeps working fine before notifications are
// set up.

const VAPID_PUBLIC_KEY =
  "BJkuwVsGv014uneH163XoEvr1Q_M_Q50gM9Xq054Q2SLow2YOHiZ34ZJAC0FSYje1O7vcnVD6gB-crEvIDmQv-c";

export async function POST(req: Request) {
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subscriptionJson = process.env.PUSH_SUBSCRIPTION;

  if (!privateKey || !subscriptionJson) {
    return NextResponse.json({ ok: false, reason: "not-configured" });
  }

  let body: { title?: string; message?: string; urgent?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-request" });
  }

  let subscription;
  try {
    subscription = JSON.parse(subscriptionJson);
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-subscription-env" });
  }

  try {
    // This "subject" is just a contact point push services can use if
    // something goes wrong with your notifications — it doesn't need to
    // be a real working address, but change it to your own if you want.
    webpush.setVapidDetails(
      "mailto:noah@example.com",
      VAPID_PUBLIC_KEY,
      privateKey
    );
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: body.title || "Chlo Chlo",
        body: body.message || "",
        urgent: !!body.urgent,
      })
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    // Common cause: the subscription expired (device reset, PWA
    // reinstalled). Noah would need to re-run "Enable phone
    // notifications" and update the PUSH_SUBSCRIPTION env var.
    return NextResponse.json({
      ok: false,
      reason: "send-failed",
      detail: String(err),
    });
  }
}
