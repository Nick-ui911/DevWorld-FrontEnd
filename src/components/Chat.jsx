import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Send, ArrowLeft } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import NotPremium from "./NotPremium";
import { addUser } from "../utils/UserSlice";
import Loader from "./Loader";
import { FaPaperclip } from "react-icons/fa6";

let socket;

// ✅ Helper: always format time as 12-hour AM/PM (e.g. "07:30 PM")
const formatTime = (timeStr) => {
  if (!timeStr) return "";
  // Try to parse the time string into a Date to normalize it
  const date = new Date(`1970-01-01T${convertTo24Hr(timeStr)}`);
  if (!isNaN(date.getTime())) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
  // Fallback: return as-is if parsing fails
  return timeStr;
};

// Convert various time formats to 24-hr for Date parsing
const convertTo24Hr = (timeStr) => {
  // Already 24-hr format like "19:30:45" or "19:30"
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(timeStr.trim())) {
    return timeStr.trim();
  }
  // 12-hr format like "7:30:45 PM" or "07:30 AM"
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const seconds = match[3] || "00";
    const period = match[4].toUpperCase();
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return `${String(hours).padStart(2, "0")}:${minutes}:${seconds}`;
  }
  return timeStr;
};

const getNowTime = () => {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connectionUser, setConnectionUser] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isPremium, setIsPremium] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [media, setMedia] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);

  const { connectionUserId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const messagesEndRef = useRef(null);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/profile/view`, {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
      setIsPremium(res.data.isPremium);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        console.error("Error fetching profile", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchChat = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/chat/${connectionUserId}`, {
        withCredentials: true,
      });
      const chat = res.data?.messages.map((msg) => {
        const isCurrentUser = msg?.senderId?._id === userId;
        return {
          text: msg?.text,
          media: msg?.media,
          mediaType: getMediaType(msg?.media),
          name: isCurrentUser ? "You" : msg?.senderId?.name || "Unknown User",
          date: msg?.date,
          time: formatTime(msg?.time),
          senderId: msg?.senderId?._id,
        };
      });

      setMessages(chat || []);
      if (res.data?.participants) {
        const otherUser = res.data.participants.find((p) => p._id !== userId);
        if (otherUser) {
          setConnectionUser(otherUser);
        }
      }
    } catch (error) {
      console.error("Failed to fetch chat:", error);
    }
  };

  const getMediaType = (url) => {
    if (!url) return null;
    const extension = url.split(".").pop().toLowerCase();

    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
    const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm"];
    const rawExtensions = [
      "pdf",
      "doc",
      "docx",
      "txt",
      "zip",
      "rar",
      "csv",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
    ];

    if (imageExtensions.includes(extension)) return "image";
    if (videoExtensions.includes(extension)) return "video";
    if (rawExtensions.includes(extension)) return "raw";

    return "unknown";
  };

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    const extension = uploadedFile.name.split(".").pop().toLowerCase();
    if (extension === "pdf") {
      alert("PDF files are not supported");
      e.target.value = null;
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("upload_preset", "devworldimage-cloud");

    setMediaLoading(true);
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dj7i4ts8b/auto/upload",
        formData,
      );
      const fileUrl = response.data.secure_url;
      setMedia(fileUrl);
      setSelectedImage(fileUrl);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Failed to upload image");
    } finally {
      setMediaLoading(false);
      e.target.value = null;
    }
  };

  useEffect(() => {
    if (userId) {
      fetchChat();
    }
  }, [userId]);

  useEffect(() => {
    if (!userId || !connectionUser) return;

    socket = createSocketConnection();
    socket.emit("userOnline", userId);
    socket.on("updateOnlineUsers", (onlineUsers) => {
      setOnlineUsers(onlineUsers);
    });

    socket.emit("joinChat", {
      name: user.name,
      userId,
      connectionUserId,
      time: getNowTime(),
      date: new Date().toLocaleDateString(),
    });

    socket.on(
      "messageReceived",
      ({ name, text, time, date, media, mediaType, senderId }) => {
        setMessages((messages) => [
          ...messages,
          { name, text, time, date, media, mediaType, senderId },
        ]);
      },
    );

    return () => {
      socket.emit("userOffline", userId);
      socket.disconnect();
    };
  }, [userId, connectionUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() && !media) return;

    socket.emit("sendMessage", {
      name: user.name,
      userId,
      connectionUserId,
      text: newMessage,
      time: getNowTime(),
      date: new Date().toLocaleDateString(),
      media,
      mediaType: getMediaType(media),
    });
    setNewMessage("");
    setMedia(null);
    setSelectedImage(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleEmojiClick = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji.emoji);
  };

  if (loading) return <Loader />;

  if (isPremium === null || isPremium === false) {
    return <NotPremium />;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 text-white overflow-hidden">
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-black to-gray-900 p-3 sm:p-4 flex items-center gap-2 sm:gap-3 shadow-xl border-b border-gray-700/50 backdrop-blur-sm">
        <button
          onClick={() => navigate("/connections")}
          className="p-1.5 sm:p-2 rounded-full hover:bg-gray-700 transition-colors flex-shrink-0"
          aria-label="Go back"
        >
          <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-base sm:text-lg truncate">
            {connectionUser ? connectionUser.name : "Loading..."}
          </h2>
          <div className="flex items-center gap-1 text-xs sm:text-sm">
            {onlineUsers?.includes(connectionUserId) ? (
              <>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-green-400">Online</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="text-red-400">Offline</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* MESSAGES AREA WITH PROPER PADDING */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Full Screen Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white text-2xl sm:text-3xl font-bold bg-gray-800/50 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-gray-700/50 transition-colors"
              onClick={() => setSelectedImage(null)}
              aria-label="Close image"
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Full view"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.senderId === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] sm:max-w-xs p-2.5 sm:p-3 rounded-2xl shadow-lg ${
                msg.senderId === userId
                  ? "bg-gradient-to-br from-blue-600 to-purple-600 rounded-br-sm"
                  : "bg-gray-700 rounded-bl-sm"
              }`}
            >
              {msg.text && (
                <p className="text-sm sm:text-base break-words mb-1">
                  {msg.text}
                </p>
              )}

              {msg.media && (
                <>
                  {msg.mediaType === "image" && (
                    <img
                      src={msg.media}
                      alt="Media"
                      className="w-full max-w-[200px] sm:max-w-[240px] h-auto object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(msg.media)}
                    />
                  )}

                  {msg.mediaType === "video" && (
                    <video
                      src={msg.media}
                      controls
                      className="w-full max-w-[200px] sm:max-w-[240px] rounded-lg"
                    />
                  )}

                  {msg.mediaType === "raw" && (
                    <a
                      href={msg.media}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 underline break-all text-sm hover:text-blue-200 transition-colors"
                    >
                      📄 View File
                    </a>
                  )}

                  {msg.mediaType === "unknown" && (
                    <p className="text-red-400 text-sm">
                      Unsupported file type
                    </p>
                  )}
                </>
              )}

              <p className="text-[10px] sm:text-xs text-gray-300 mt-1 opacity-70">
                {msg.time}
              </p>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </main>

      {/* STICKY FOOTER INPUT BAR */}
      <footer className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900 to-gray-800/95 border-t border-gray-700/50 shadow-2xl backdrop-blur-md z-50">
        {/* Image Preview */}
        {(media || mediaLoading) && (
          <div className="px-3 sm:px-4 pt-2 sm:pt-3 flex items-center">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20">
              {mediaLoading ? (
                <div className="h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center bg-gray-700 rounded-lg">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <img
                    src={media}
                    alt="preview"
                    className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg shadow-lg"
                  />
                  <button
                    onClick={() => {
                      setMedia(null);
                      setSelectedImage(null);
                    }}
                    className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm font-bold transition-colors shadow-lg"
                    aria-label="Remove image"
                  >
                    ✕
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Input Controls */}
        <div className="px-2 sm:px-4 py-2 sm:py-3 flex items-center gap-1.5 sm:gap-3">
          {/* File Upload */}
          <div className="relative flex-shrink-0">
            <input
              type="file"
              id="fileInput"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer p-2 rounded-full hover:bg-gray-700 transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center"
            >
              <FaPaperclip size={18} className="sm:w-5 sm:h-5 text-gray-300" />
            </label>
          </div>

          {/* Emoji Picker */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 rounded-full hover:bg-gray-700 transition-all duration-300 transform hover:scale-110 active:scale-95"
              aria-label="Open emoji picker"
            >
              <span className="text-xl sm:text-2xl">😊</span>
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2 z-[60]">
                <div className="scale-75 origin-bottom-left sm:scale-90 md:scale-100">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="flex-1 min-w-0">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={() => setShowEmojiPicker(false)}
              type="text"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-gray-700/50 border border-gray-600/30 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="Type a message..."
            />
          </div>

          {/* Send Button */}
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() && !media}
            className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 sm:p-2.5 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
            aria-label="Send message"
          >
            <Send size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Chat;
