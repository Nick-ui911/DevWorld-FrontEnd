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
  storageBucket: "devworld-44971.appspot.com", // Fixed typo in storageBucket
  messagingSenderId: "830071626560",
  appId: "1:830071626560:web:1f32045efc6f67870638a5",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// ✅ Handle background notifications
messaging.onBackgroundMessage((payload) => {
  // console.log("📩 Received Background Notification:", payload);

  const { title, body } = payload.notification || payload.data;
  const iconUrl = "https://devworld.in/logodevworld.png";
  const clickUrl = payload.data?.click_action || "https://devworld.in/";

  // Ensure notifications don’t stack unnecessarily
  // In your service worker code, self refers to the service worker global scope. It's similar to window in a browser but for service workers.
  self.registration.getNotifications().then((existingNotifications) => {
    const isDuplicate = existingNotifications.some((n) => n.title === title);
    if (!isDuplicate) {
      self.registration.showNotification(title, {
        body: body,
        icon: iconUrl,
        badge: iconUrl,
        tag: payload.messageId, // Helps avoid duplicate notifications
        data: { url: clickUrl }, // Store click action URL here
      });
    }
  });
});
// ✅ Claim clients so the SW controls all open tabs (required for navigate())
self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl =
    event.notification.data?.url || "https://devworld.in/";
  const chatPath = new URL(targetUrl).pathname;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(async (clientList) => {
        // ✅ Find any open tab of the app
        const matchingClient = clientList.find((client) =>
          client.url.includes("devworld.in"),
        );

        if (matchingClient) {
          // Focus the existing tab first
          await matchingClient.focus();

          // ✅ Use postMessage to let React Router handle navigation
          // This is more reliable than WindowClient.navigate() which
          // can fail on uncontrolled clients
          matchingClient.postMessage({
            type: "OPEN_CHAT",
            path: chatPath,
          });

          return;
        }

        // No existing tab — open a new window
        return clients.openWindow(targetUrl);
      }),
  );
});
