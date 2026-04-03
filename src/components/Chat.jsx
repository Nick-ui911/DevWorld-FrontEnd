import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Send, ArrowLeft, Image, Smile } from "lucide-react";
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
    <div className="flex flex-col h-screen h-[100dvh] chat-container bg-[#0a0e1a] text-white overflow-hidden">
      {/* ===== HEADER ===== */}
      <header className="chat-header-fixed flex-shrink-0 z-50 bg-[#0a0e1a] backdrop-blur-xl px-3 sm:px-5 py-3 flex items-center gap-3 border-b border-white/[0.06]">
        <button
          onClick={() => navigate("/connections")}
          className="p-2 rounded-xl hover:bg-white/[0.06] transition-colors flex-shrink-0"
          aria-label="Go back"
        >
          <ArrowLeft size={20} className="text-[#94a3b8]" />
        </button>

        {/* User info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={connectionUser?.PhotoUrl || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
              alt={connectionUser?.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-white/10"
            />
            {/* Online dot */}
            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0a0e1a] ${
              isOnline ? 'bg-emerald-400' : 'bg-[#64748b]'
            }`}></span>
          </div>

          <div className="min-w-0">
            <h2 className="font-semibold text-base truncate text-white">
              {connectionUser ? connectionUser.name : "Loading..."}
            </h2>
            <p className={`text-xs ${isOnline ? 'text-emerald-400' : 'text-[#64748b]'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </header>
      {/* Spacer for fixed header on mobile */}
      <div className="chat-header-spacer md:hidden"></div>

      {/* ===== MESSAGES AREA ===== */}
      <main className="flex-1 overflow-y-auto chat-wallpaper pb-[70px] md:pb-0">
        <div className="max-w-3xl mx-auto px-3 sm:px-5 py-4 space-y-1">
          {/* Full Screen Image Modal */}
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[60] p-4"
              onClick={() => setSelectedImage(null)}
            >
              <button
                className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl bg-white/10 backdrop-blur rounded-full w-10 h-10 flex items-center justify-center transition-colors"
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

            return (
              <React.Fragment key={index}>
                {/* Date separator */}
                {showDateSeparator && msg.date && (
                  <div className="flex justify-center my-4">
                    <span className="px-3 py-1 rounded-lg bg-white/[0.05] text-[10px] text-[#64748b] font-medium">
                      {msg.date}
                    </span>
                  </div>
                )}

                <div className={`flex ${isSender ? "justify-end" : "justify-start"} mb-0.5`}>
                  <div
                    className={`relative max-w-[80%] sm:max-w-[65%] px-3.5 py-2 ${
                      isSender
                        ? "bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl rounded-br-md"
                        : "bg-[#1e293b] rounded-2xl rounded-bl-md"
                    } shadow-sm`}
                  >
                    {msg.text && (
                      <p className="text-[14px] sm:text-[15px] leading-relaxed break-words text-white/95">
                        {msg.text}
                      </p>
                    )}

                    {msg.media && (
                      <div className="mt-1">
                        {msg.mediaType === "image" && (
                          <img
                            src={msg.media}
                            alt="Media"
                            className="w-full max-w-[220px] sm:max-w-[260px] h-auto object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setSelectedImage(msg.media)}
                          />
                        )}
                        {msg.mediaType === "video" && (
                          <video
                            src={msg.media}
                            controls
                            className="w-full max-w-[220px] sm:max-w-[260px] rounded-xl"
                          />
                        )}
                        {msg.mediaType === "raw" && (
                          <a
                            href={msg.media}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-indigo-300 hover:text-indigo-200 underline text-sm transition-colors"
                          >
                            📄 View File
                          </a>
                        )}
                        {msg.mediaType === "unknown" && (
                          <p className="text-rose-400 text-xs">Unsupported file type</p>
                        )}
                      </div>
                    )}

                    {/* Time */}
                    <p className={`text-[10px] mt-1 text-right ${
                      isSender ? 'text-white/40' : 'text-[#64748b]'
                    }`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* ===== INPUT AREA ===== */}
      <footer className="chat-footer-fixed flex-shrink-0 bg-[#0a0e1a] backdrop-blur-xl border-t border-white/[0.06] z-50">
        {/* Image Preview */}
        {(media || mediaLoading) && (
          <div className="px-3 sm:px-5 pt-3 flex items-center">
            <div className="relative">
              {mediaLoading ? (
                <div className="h-16 w-16 flex items-center justify-center bg-white/[0.04] rounded-xl border border-white/[0.08]">
                  <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <img
                    src={media}
                    alt="preview"
                    className="h-16 w-16 object-cover rounded-xl border border-white/[0.08] shadow-lg"
                  />
                  <button
                    onClick={() => {
                      setMedia(null);
                      setSelectedImage(null);
                    }}
                    className="absolute -top-1.5 -right-1.5 bg-rose-500 hover:bg-rose-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold transition-colors shadow-lg"
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
        <div className="px-2 sm:px-4 py-2.5 sm:py-3 flex items-center gap-1.5 sm:gap-2">
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
              className="cursor-pointer p-2.5 rounded-xl hover:bg-white/[0.06] transition-all flex items-center justify-center text-[#64748b] hover:text-[#94a3b8]"
            >
              <FaPaperclip size={18} />
            </label>
          </div>

          {/* Emoji Picker */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2.5 rounded-xl hover:bg-white/[0.06] transition-all text-[#64748b] hover:text-[#94a3b8]"
              aria-label="Open emoji picker"
            >
              <Smile size={20} />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2 z-[60]">
                <div className="scale-75 origin-bottom-left sm:scale-90 md:scale-100">
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

          {/* Message Input */}
          <div className="flex-1 min-w-0">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={() => setShowEmojiPicker(false)}
              type="text"
              className="w-full px-4 py-2.5 text-sm sm:text-base bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-[#64748b] focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all"
              placeholder="Type a message..."
            />
          </div>

          {/* Send Button */}
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() && !media}
            className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:shadow-none"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Chat;
