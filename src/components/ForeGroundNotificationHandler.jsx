import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { onMessage } from "firebase/messaging";
import { messaging } from "../utils/firebase";

const ForeGroundNotificationHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      const title = payload?.notification?.title || payload?.data?.title;
      const body = payload?.notification?.body || payload?.data?.body;
      const clickAction = payload?.data?.click_action; // ✅ Grab click_action URL

      if (!title || !body || !clickAction) {
        console.warn(
          "⚠️ Missing title, body, or click_action in payload:",
          payload
        );
        return;
      }

      if (!location.pathname.startsWith("/chat/")) {
        const toastId = toast.info(
          <div
            onClick={() => {
              const path = new URL(clickAction).pathname; // ✅ Get only /chat/userId part
              navigate(path);
              toast.dismiss(toastId); // 👈 dismiss the toast on click
            }}
            className="cursor-pointer bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 py-3 rounded-lg shadow-lg w-full sm:w-80 md:w-96"
          >
            <p className="font-semibold text-base sm:text-lg">📩 {title}</p>
            <p className="text-xs sm:text-sm">{body}</p>
            <p className="text-blue-400 underline text-xs mt-2">Click here</p>
          </div>,
          {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: false, // We handle click manually
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          }
        );
      } else {
        console.log("🔕 Notification blocked on chat page.");
      }
    });

    // Cleanup: remove the FCM message listener when the component unmounts
    // or when dependencies change. Prevents multiple listeners & duplicate notifications.
  //  because cleanup function work in two situation first in unmounting and second when useEffect re-runs

    return () => unsubscribe();
  }, [location, navigate]);

  return null;
};

export default ForeGroundNotificationHandler;
