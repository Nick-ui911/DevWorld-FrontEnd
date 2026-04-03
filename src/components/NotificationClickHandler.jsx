import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotificationClickHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
      // Guard: service workers may not be available in all environments
      if (!("serviceWorker" in navigator) || !navigator.serviceWorker) {
        console.warn("Service Worker not supported — NotificationClickHandler disabled");
        return;
      }

      const handleMessage = (event) => {
        console.log("📨 NotificationClickHandler received message:", event.data);
        if (event.data?.type === "OPEN_CHAT" && event.data?.path) {
          console.log("🚀 Navigating to:", event.data.path);
          navigate(event.data.path);
        }
      };

      navigator.serviceWorker.addEventListener("message", handleMessage);

      // ✅ Cleanup: remove listener on unmount to prevent duplicates
      return () => {
        navigator.serviceWorker.removeEventListener("message", handleMessage);
      };
    }, [navigate]);
  
    return null;
}

export default NotificationClickHandler;

