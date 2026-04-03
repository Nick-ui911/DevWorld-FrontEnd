importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js",
);

const firebaseConfig = {
  apiKey: "AIzaSyBIyNHFwdD5jH5sCar2CwRStaTJGU2lyCI",
  authDomain: "devworld-44971.firebaseapp.com",
  projectId: "devworld-44971",
  storageBucket: "devworld-44971.appspot.com",
  messagingSenderId: "830071626560",
  appId: "1:830071626560:web:1f32045efc6f67870638a5",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// ✅ Force the new service worker to activate immediately (don't wait for tabs to close)
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// ✅ Claim all clients so postMessage works immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

// ✅ Handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log("📩 Background notification received:", payload);

  const title = payload?.data?.title || payload?.notification?.title || "New Message";
  const body = payload?.data?.body || payload?.notification?.body || "";
  const iconUrl = "https://devworld.in/logodevworld.png";
  const clickUrl = payload?.data?.click_action || "https://devworld.in/";

  // Show notification manually with click URL stored in data
  self.registration.showNotification(title, {
    body: body,
    icon: iconUrl,
    badge: iconUrl,
    tag: `msg-${Date.now()}`,
    data: { url: clickUrl },
  });
});

// ✅ Handle notification click — navigate to chat page
self.addEventListener("notificationclick", (event) => {
  console.log("🔔 Notification clicked:", event.notification.data);
  event.notification.close();

  const targetUrl = event.notification.data?.url || "https://devworld.in/";

  // Parse the pathname (e.g., "/chat/abc123")
  let chatPath = "/";
  try {
    chatPath = new URL(targetUrl).pathname;
  } catch (e) {
    chatPath = targetUrl;
  }

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(async (clientList) => {
        // ✅ Find any open tab from the SAME ORIGIN (works on localhost + production)
        const matchingClient = clientList.find((client) => {
          try {
            return new URL(client.url).origin === self.location.origin;
          } catch {
            return false;
          }
        });

        if (matchingClient) {
          // Focus the existing tab
          await matchingClient.focus();

          // ✅ Send message to React app for client-side navigation
          // (Do NOT call navigate() — it causes a full page reload that breaks SPA routing)
          matchingClient.postMessage({
            type: "OPEN_CHAT",
            path: chatPath,
          });

          return;
        }

        // No existing tab — open a new window with the target URL
        return clients.openWindow(targetUrl);
      }),
  );
});
