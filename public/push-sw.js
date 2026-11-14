self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("push", (event) => {
  const rawText = event.data?.text() || "(no data)";
  const firstCodes = rawText.length > 0 ? rawText.charCodeAt(0) + "," + rawText.charCodeAt(1) : "empty";
  let data = {};
  let parseOk = true;
  try {
    data = JSON.parse(rawText);
  } catch (e) {
    parseOk = false;
    data = { title: "Notification", body: rawText };
  }

  const title = data.title || "Notification";
  const options = {
    body: data.body || rawText,
    icon: data.icon || "/finalink-1.svg",
    badge: "/vite.svg",
    data: data.data || {},
    tag: "push-notification",
    requireInteraction: false,
  };
  if (!parseOk) {
    options.body = "[codes:" + firstCodes + "]\n" + rawText.substring(0, 200);
  }

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "/";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});
