// Minimal type declarations for the parts of the `web-push` npm package
// this project actually uses. The real package doesn't ship its own
// TypeScript types under a version we can pin confidently, so this covers
// just enough of the API surface instead.
declare module "web-push" {
  export interface PushSubscription {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  }

  export function setVapidDetails(
    subject: string,
    publicKey: string,
    privateKey: string
  ): void;

  export function sendNotification(
    subscription: PushSubscription,
    payload?: string,
    options?: Record<string, unknown>
  ): Promise<{ statusCode: number; body: string; headers: unknown }>;
}
