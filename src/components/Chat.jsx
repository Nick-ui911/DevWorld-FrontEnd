import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Send, ArrowLeft, Smile, Check, CheckCheck } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import NotPremium from "./NotPremium";
import { addUser } from "../utils/UserSlice";
import Loader from "./Loader";
import { FaPaperclip } from "react-icons/fa6";

let socket;

// ✅ Helper: always format time as 12-hour AM/PM (e.g. "07:30 PM")
const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const date = new Date(`1970-01-01T${convertTo24Hr(timeStr)}`);
  if (!isNaN(date.getTime())) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
  return timeStr;
};

const convertTo24Hr = (timeStr) => {
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(timeStr.trim())) {
    return timeStr.trim();
  }
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
    const rawExtensions = ["pdf", "doc", "docx", "txt", "zip", "rar", "csv", "xls", "xlsx", "ppt", "pptx"];
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
    if (userId) fetchChat();
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
    if (e.key === "Enter") sendMessage();
  };

  const handleEmojiClick = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji.emoji);
  };

  if (loading) return <Loader />;
  if (isPremium === null || isPremium === false) return <NotPremium />;

  const isOnline = onlineUsers?.includes(connectionUserId);

  return (
    <div className="flex flex-col h-screen h-[100dvh] chat-container bg-[#070b14] text-white overflow-hidden">

      {/* ===== WHATSAPP-STYLE HEADER ===== */}
      <header className="chat-header-fixed chat-header flex-shrink-0 z-50 px-2 sm:px-4 py-2 flex items-center gap-2">
        {/* Back button */}
        <button
          onClick={() => navigate("/connections")}
          className="p-2 rounded-full hover:bg-white/[0.06] transition-all duration-200 flex-shrink-0 active:scale-90"
          aria-label="Go back"
        >
          <ArrowLeft size={22} className="text-[#94a3b8]" />
        </button>

        {/* User avatar + info */}
        <div
          className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:bg-white/[0.03] rounded-xl px-2 py-1.5 transition-colors"
        >
          {/* Avatar with online ring */}
          <div className="relative flex-shrink-0">
            <div className={`absolute -inset-[2px] rounded-full transition-all duration-500 ${
              isOnline
                ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-80'
                : 'bg-gradient-to-r from-gray-600 to-gray-700 opacity-30'
            }`}></div>
            <img
              src={connectionUser?.PhotoUrl || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
              alt={connectionUser?.name}
              className="relative w-10 h-10 rounded-full object-cover border-[2px] border-[#0f1729]"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-[15px] truncate text-white leading-tight">
              {connectionUser ? connectionUser.name : "Loading..."}
            </h2>
            <p className={`text-[11px] font-medium leading-tight mt-0.5 ${
              isOnline ? 'text-emerald-400' : 'text-[#64748b]'
            }`}>
              {isOnline ? '● online' : '○ offline'}
            </p>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header on mobile */}
      <div className="chat-header-spacer md:hidden"></div>

      {/* ===== MESSAGES AREA ===== */}
      <main className="flex-1 overflow-y-auto chat-wallpaper pb-[72px] md:pb-0 relative">
        <div className="relative z-[1] max-w-3xl mx-auto px-3 sm:px-4 py-4 space-y-[3px]">

          {/* Full Screen Image Modal */}
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[60] p-4"
              onClick={() => setSelectedImage(null)}
            >
              <button
                className="absolute top-4 right-4 text-white/70 hover:text-white text-xl bg-white/10 backdrop-blur rounded-full w-10 h-10 flex items-center justify-center transition-all hover:bg-white/20 hover:scale-105"
                onClick={() => setSelectedImage(null)}
                aria-label="Close image"
              >
                ✕
              </button>
              <img
                src={selectedImage}
                alt="Full view"
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, index) => {
            const isSender = msg.senderId === userId;
            const showDateSeparator = index === 0 || messages[index - 1]?.date !== msg.date;
            const isLastInGroup = index === messages.length - 1 || messages[index + 1]?.senderId !== msg.senderId;

            return (
              <React.Fragment key={index}>
                {/* Date separator - WhatsApp style */}
                {showDateSeparator && msg.date && (
                  <div className="flex justify-center my-4">
                    <span className="chat-date-pill">
                      {msg.date}
                    </span>
                  </div>
                )}

                <div className={`flex ${isSender ? "justify-end" : "justify-start"} ${isLastInGroup ? 'mb-2' : 'mb-[2px]'}`}>
                  <div
                    className={`relative max-w-[82%] sm:max-w-[65%] px-3 py-1.5 shadow-sm ${
                      isSender
                        ? `chat-bubble-sent ${!isLastInGroup ? 'rounded-xl' : ''}`
                        : `chat-bubble-received ${!isLastInGroup ? 'rounded-xl' : ''}`
                    }`}
                  >
                    {msg.text && (
                      <p className="text-[14px] sm:text-[15px] leading-[1.35] break-words text-white/95">
                        {msg.text}
                      </p>
                    )}

                    {msg.media && (
                      <div className="mt-1.5 mb-0.5">
                        {msg.mediaType === "image" && (
                          <img
                            src={msg.media}
                            alt="Media"
                            className="w-full max-w-[240px] sm:max-w-[280px] h-auto object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setSelectedImage(msg.media)}
                          />
                        )}
                        {msg.mediaType === "video" && (
                          <video
                            src={msg.media}
                            controls
                            className="w-full max-w-[240px] sm:max-w-[280px] rounded-lg"
                          />
                        )}
                        {msg.mediaType === "raw" && (
                          <a
                            href={msg.media}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-blue-300 hover:text-blue-200 underline text-sm transition-colors"
                          >
                            📄 View File
                          </a>
                        )}
                        {msg.mediaType === "unknown" && (
                          <p className="text-rose-400 text-xs">Unsupported file type</p>
                        )}
                      </div>
                    )}

                    {/* Time + tick marks like WhatsApp */}
                    <div className={`flex items-center gap-1 justify-end mt-0.5 -mb-0.5 ${
                      isSender ? '' : ''
                    }`}>
                      <span className={`text-[10px] ${isSender ? 'msg-time-sent' : 'msg-time'}`}>
                        {msg.time}
                      </span>
                      {isSender && (
                        <CheckCheck size={14} className="text-blue-400/50" />
                      )}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* ===== WHATSAPP-STYLE INPUT AREA ===== */}
      <footer className="chat-footer-fixed chat-input-container flex-shrink-0 z-50">
        {/* Image Preview */}
        {(media || mediaLoading) && (
          <div className="px-3 sm:px-4 pt-3 flex items-center">
            <div className="relative">
              {mediaLoading ? (
                <div className="h-16 w-16 flex items-center justify-center bg-white/[0.03] rounded-xl border border-white/[0.06]">
                  <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <img
                    src={media}
                    alt="preview"
                    className="h-16 w-16 object-cover rounded-xl border border-white/[0.06] shadow-lg"
                  />
                  <button
                    onClick={() => {
                      setMedia(null);
                      setSelectedImage(null);
                    }}
                    className="absolute -top-1.5 -right-1.5 bg-rose-500 hover:bg-rose-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold transition-all shadow-lg hover:scale-110"
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
        <div className="px-2 sm:px-3 py-2 sm:py-2.5 flex items-center gap-1 sm:gap-1.5">
          {/* Emoji Picker */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2.5 rounded-full hover:bg-white/[0.06] transition-all text-[#64748b] hover:text-[#94a3b8] active:scale-90"
              aria-label="Open emoji picker"
            >
              <Smile size={22} />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2 z-[60]">
                <div className="scale-[0.82] origin-bottom-left sm:scale-90 md:scale-100">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    theme="dark"
                    searchPlaceholder="Search emoji..."
                    lazyLoadEmojis={true}
                  />
                </div>
              </div>
            )}
          </div>

          {/* File Upload */}
          <div className="flex-shrink-0">
            <input
              type="file"
              id="fileInput"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer p-2.5 rounded-full hover:bg-white/[0.06] transition-all flex items-center justify-center text-[#64748b] hover:text-[#94a3b8] active:scale-90"
            >
              <FaPaperclip size={19} className="rotate-45" />
            </label>
          </div>

          {/* Message Input - WhatsApp style rounded */}
          <div className="flex-1 min-w-0">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={() => setShowEmojiPicker(false)}
              type="text"
              className="w-full px-4 py-2.5 text-[14px] sm:text-[15px] bg-white/[0.04] border border-white/[0.06] rounded-full text-white placeholder-[#64748b] focus:outline-none focus:border-indigo-500/30 transition-all"
              placeholder="Type a message"
            />
          </div>

          {/* Send Button - WhatsApp style circle */}
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() && !media}
            className="flex-shrink-0 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-2.5 rounded-full hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:shadow-none active:scale-90"
            aria-label="Send message"
          >
            <Send size={19} className="translate-x-[1px]" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Chat;
