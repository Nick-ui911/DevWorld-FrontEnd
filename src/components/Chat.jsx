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

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connectionUser, setConnectionUser] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isPremium, setIsPremium] = useState(null); // New state to track premium status
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

  // To check MemberShip Type
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/profile/view`, {
        withCredentials: true,
      });
      // console.log(res.data.isPremium)

      dispatch(addUser(res.data));
      setIsPremium(res.data.isPremium); // Store isPremium status
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        console.error("Error fetching profile", error);
      }
    } finally {
      setLoading(false); // Stop loading after fetching
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
          media: msg?.media, // ✅ Add this line to map media properly
          mediaType: getMediaType(msg?.media), // Determine media type
          name: isCurrentUser ? "You" : msg?.senderId?.name || "Unknown User",
          date: msg?.date,
          time: msg?.time,
          senderId: msg?.senderId?._id,
        };
      });

      setMessages(chat || []);
      // ✅ Fix: Ensure connectionUser is set correctly
      if (res.data?.participants) {
        const otherUser = res.data.participants.find((p) => p._id !== userId);
        if (otherUser) {
          setConnectionUser(otherUser); // ✅ Set correct connection user
        }
      }
    } catch (error) {
      console.error("Failed to fetch chat:", error);
    }
  };
  // Function to determine media type
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

    return "unknown"; // fallback if extension not matched
  };
  // Handle File Upload to Cloudinary
  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

      // Check if file is a PDF
  const extension = uploadedFile.name.split('.').pop().toLowerCase();
  // because we are using cloudinary currently i am not trusted by cloudinary because i am using free tier
  if (extension === "pdf") {
    alert("PDF file are not supported");
    e.target.value = null;
    return; // Stop here if it's a PDF
  }

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("upload_preset", "devworldimage-cloud");

    setMediaLoading(true);
    // to upload pdf file to cloudinary use "raw" in place of "auto" in the below line but you have to be trusted by cloudinary
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dj7i4ts8b/auto/upload",
        formData
      );
      const fileUrl = response.data.secure_url;
      setMedia(fileUrl);
      setSelectedImage(fileUrl);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError(error + "Failed to upload image");
    } finally {
      setMediaLoading(false);
      e.target.value = null; // 🔥 RESET the file input after upload , solve reselecting same image problem (means it select first image again and again even if i selected different image in second time) 
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
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
    });

    socket.on(
      "messageReceived",
      ({ name, text, time, date, media, mediaType, senderId }) => {
        setMessages((messages) => [
          ...messages,
          { name, text, time, date, media, mediaType, senderId },
        ]);
      }
    );

    return () => {
      socket.emit("userOffline", userId);
      socket.disconnect();
    };
  }, [userId, connectionUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, media, newMessage]);

  const sendMessage = () => {
    if (!newMessage.trim() && !media) return; // Allow if any one exists

    socket.emit("sendMessage", {
      name: user.name,
      userId,
      connectionUserId,
      text: newMessage,
      time: new Date().toLocaleTimeString(),
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

// Dummy Payment is live For Now
  if (isPremium === null || isPremium === false) {
    return <NotPremium />;
  }

  
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950  text-white overflow-hidden">
      <header className="bg-gradient-to-r from-gray-900 via-black to-gray-900 p-4 flex items-center gap-3 shadow-lg sticky top-0 z-10">
        <button
          onClick={() => navigate("/connections")}
          className="p-2 rounded-full hover:bg-gray-700"
        >
          <ArrowLeft size={24} color="white" />
        </button>
        <h2 className="font-semibold text-lg flex-1 text-center">
          {connectionUser ? connectionUser.name : "Loading..."}
          {onlineUsers?.includes(connectionUserId) ? (
            <span className="text-green-500 ml-2">● Online</span>
          ) : (
            <span className="text-red-500 ml-2">● Offline</span>
          )}
        </h2>
      </header>

      <main
        className={`flex-1 overflow-y-auto p-4 space-y-4 ${
          media ? "pb-38" : "pb-14"
        }`}
      >
        {selectedImage && (
          <div
            className="fixed inset-0 bg-gray-700 bg-opacity-80 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold"
              onClick={() => setSelectedImage(null)} // Close on cross click
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Full view"
              className="max-w-full max-h-full p-4 rounded-lg"
            />
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.senderId === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div className="max-w-xs p-2 rounded-lg bg-gray-700">
              {msg.text && <p className="mb-1">{msg.text}</p>}

              {msg.media && (
                <>
                  {msg.mediaType === "image" && (
                    <img
                      src={msg.media}
                      alt="Media"
                      className="w-40 h-40 object-cover rounded cursor-pointer"
                      onClick={() => setSelectedImage(msg.media)}
                    />
                  )}

                  {msg.mediaType === "video" && (
                    <video
                      src={msg.media}
                      controls
                      className="w-40 h-40 rounded"
                    />
                  )}

                  {msg.mediaType === "raw" && (
                    <a
                      href={msg.media}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline break-words"
                    >
                      📄 View File
                    </a>
                  )}

                  {msg.mediaType === "unknown" && (
                    <p className="text-red-400">Unsupported file type</p>
                  )}
                </>
              )}

              <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black border-t border-gray-700 shadow-2xl z-50">
        {/* IMAGE PREVIEW BEFORE INPUT */}
        {(media || mediaLoading) && (
          <div className="max-w-4xl mx-auto px-3 pt-2 flex items-center">
            <div className="relative h-20 w-20">
              {mediaLoading ? (
                <div className="h-20 w-20 flex items-center justify-center bg-gray-700 rounded-lg">
                  {/* 👇 Small inline loader */}
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <img
                    src={media}
                    alt="preview"
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setMedia(null)}
                    className="absolute top-0 right-0 bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-opacity-80"
                  >
                    ✕
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-3 py-2 flex items-center space-x-4">
          {" "}
          {/* Increased space-x */}
          {/* File Upload */}
          <div className="relative">
            <input
              type="file"
              id="fileInput"
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer p-2 rounded-full hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 flex items-center justify-center"
            >
              <FaPaperclip size={20} className="text-white" />
            </label>
          </div>
          {/* Emoji Picker Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="group relative p-2 rounded-full bg-transparent hover:bg-gray-200 
             transition-transform duration-300 ease-out 
             hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <span className="text-2xl sm:text-3xl transition-transform duration-300 group-hover:rotate-12">
                😊
              </span>
            </button>

            {/* Emoji Picker Dropdown */}
            {showEmojiPicker && (
              <div
                className="absolute bottom-full mb-2 right-0 sm:right-10 w-full max-w-xs
          transform -translate-x-2 sm:translate-x-0
          scale-90 sm:scale-100 origin-bottom-right"
              >
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
          {/* Message Input */}
          <div className="flex-1 relative">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={() => setShowEmojiPicker(false)}
              type="text"
              className="w-full pl-4 pr-10 py-2 text-sm sm:text-base 
          bg-gray-700/50 backdrop-blur-sm 
          border border-gray-600/30 
          rounded-full 
          text-white 
          placeholder-gray-400 
          focus:outline-none 
          focus:ring-2 focus:ring-blue-500/50 
          transition-all duration-300 
          ease-in-out"
              placeholder="Type a message..."
            />
          </div>
          {/* Send Button */}
          <button
            onClick={sendMessage}
            disabled={!newMessage && !media}
            className="
        bg-gradient-to-r from-blue-600 to-purple-600 
        text-white 
        p-2 
        rounded-full 
        hover:from-blue-700 hover:to-purple-700 
        transition-all duration-300 
        ease-in-out 
        transform 
        hover:scale-110 
        active:scale-95
        disabled:opacity-30 
        disabled:cursor-not-allowed
        flex items-center justify-center
        shadow-lg
        hover:shadow-xl
      "
          >
            <Send size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Chat;
