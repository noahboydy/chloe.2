import webpush from "web-push";

// Shared server-only helper for sending a real push notification to Noah's
// phone. Used by both /api/notify (site-open / hurting-mood alerts) and
// /api/consume-letter (the "Chlo just read this, go replace it" alert).
//
// Reads two secrets from Vercel environment variables — never exposed to
// the browser, unlike the public VAPID key in app/lib/push-client.ts:
//
//   VAPID_PRIVATE_KEY   — pairs with the public key below
//   PUSH_SUBSCRIPTION   — the subscription JSON generated once when Noah
//                         taps "Enable phone notifications" in the hidden
//                         panel, then pasted here as an env var
//
// If either is missing, this quietly does nothing rather than erroring —
// so the rest of the site keeps working fine before notifications are
// set up.

const VAPID_PUBLIC_KEY =
  "BJkuwVsGv014uneH163XoEvr1Q_M_Q50gM9Xq054Q2SLow2YOHiZ34ZJAC0FSYje1O7vcnVD6gB-crEvIDmQv-c";

export type SendPushResult =
  | { ok: true }
  | { ok: false; reason: "not-configured" | "bad-subscription-env" | "send-failed"; detail?: string };

export async function sendPushToNoah(
  title: string,
  message: string,
  urgent = false
): Promise<SendPushResult> {
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subscriptionJson = process.env.PUSH_SUBSCRIPTION;

  if (!privateKey || !subscriptionJson) {
    return { ok: false, reason: "not-configured" };
  }

  let subscription;
  try {
    subscription = JSON.parse(subscriptionJson);
  } catch {
    return { ok: false, reason: "bad-subscription-env" };
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
      JSON.stringify({ title, body: message, urgent })
    );
    return { ok: true };
  } catch (err) {
    // Common cause: the subscription expired (device reset, PWA
    // reinstalled). Noah would need to re-run "Enable phone
    // notifications" and update the PUSH_SUBSCRIPTION env var.
    return { ok: false, reason: "send-failed", detail: String(err) };
  }
}
