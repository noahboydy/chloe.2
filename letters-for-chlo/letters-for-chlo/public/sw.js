// Service worker — required for web push notifications to work at all.
// This runs in the background even when the site itself isn't open, which
// is what lets a notification arrive without the site being on screen.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "Chlo Chlo", body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "Chlo Chlo";
  const options = {
    body: data.body || "",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    // requireInteraction keeps it on screen until dismissed instead of
    // auto-disappearing after a few seconds — used for the urgent one.
    requireInteraction: !!data.urgent,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) return client.focus();
        }
        if (self.clients.openWindow) return self.clients.openWindow("/");
      })
  );
});
