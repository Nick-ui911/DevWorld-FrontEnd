import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotificationClickHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
      if (!("serviceWorker" in navigator) || !navigator.serviceWorker) {
        console.warn("Service Worker not supported — NotificationClickHandler disabled");
        return;
      }

      const handleMessage = (event) => {
        console.log("📨 NotificationClickHandler received message:", event.data);
        if (event.data?.type === "OPEN_CHAT" && event.data?.path) {
          console.log("🚀 Navigating to:", event.data.path);
          // Small delay to ensure the app is focused and ready
          setTimeout(() => {
            navigate(event.data.path);
          }, 100);
        }
      };

      // Listen on the serviceWorker container for messages from the SW
      navigator.serviceWorker.addEventListener("message", handleMessage);

      // ✅ Also ensure the SW is ready and controlled
      navigator.serviceWorker.ready.then((registration) => {
        console.log("✅ Service Worker ready:", registration.scope);
      });

      return () => {
        navigator.serviceWorker.removeEventListener("message", handleMessage);
      };
    }, [navigate]);
  
    return null;
}

export default NotificationClickHandler;
