import { io } from "socket.io-client";
import { BASE_URL } from "./constants";
export const createSocketConnection = () => {
  if (location.hostname === "localhost") {
    // 🖥️ If running locally, connect using BASE_URL (e.g., http://localhost:5000)
    return io(BASE_URL);
  } else {
    //      In production, io("/") means
    // 👉 connect to the same domain where the frontend is loaded from
    // Example:
    // Frontend: https://book-your-event.vercel.app
    // Socket connects to: https://book-your-event.vercel.app
    return io("/", { path: "/api/socket.io" });
  }
};
