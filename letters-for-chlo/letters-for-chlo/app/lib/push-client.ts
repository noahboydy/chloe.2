// Client-side helpers for turning on real browser push notifications
// (no app install needed) — this is the public half of the VAPID key
// pair; it's fine for this to be visible in the code, only the private
// key (kept server-side as an env var) needs to stay secret.
export const VAPID_PUBLIC_KEY =
  "BJkuwVsGv014uneH163XoEvr1Q_M_Q50gM9Xq054Q2SLow2YOHiZ34ZJAC0FSYje1O7vcnVD6gB-crEvIDmQv-c";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export type PushSetupStatus =
  | "unsupported"
  | "needs-home-screen"
  | "denied"
  | "ready";

// iOS only allows push notifications from a site that's been added to the
// home screen AND is currently being viewed as that standalone app — not
// from a normal Safari tab. This checks for that.
export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const mql = window.matchMedia?.("(display-mode: standalone)").matches;
  const iosStandalone = (window.navigator as any).standalone === true;
  return Boolean(mql || iosStandalone);
}

export function getPushSupportStatus(): PushSetupStatus {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    !("Notification" in window)
  ) {
    return "unsupported";
  }
  if (!isStandalone()) return "needs-home-screen";
  if (Notification.permission === "denied") return "denied";
  return "ready";
}

// Registers the service worker, asks for permission, subscribes, and
// returns the subscription as a JSON string ready to paste into a Vercel
// environment variable. Throws with a readable message on failure.
export async function subscribeToPush(): Promise<string> {
  const registration = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  const existing = await registration.pushManager.getSubscription();
  const subscription =
    existing ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as any,
    }));

  return JSON.stringify(subscription);
}
