import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addRequest, removeRequest } from "../utils/RequestSlice";
import { addConnections } from "../utils/ConnectionSlice";
import Loader from "./Loader";
import { Loader2 } from "lucide-react";

const Request = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.request.requests);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [processing, setProcessing] = useState({});

  const fetchRequest = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/requests`, {
        withCredentials: true,
      });
      dispatch(addRequest(response.data.data));
      setError("");
    } catch (error) {
      setError("Failed to load requests");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const reviewRequest = async (status, _id) => {
    setProcessing((prev) => ({ ...prev, [_id]: true }));
    try {
      await axios.post(
        `${BASE_URL}/request/review/${status}/${_id}`,
        {},
        { withCredentials: true }
      );

      dispatch(removeRequest(_id));

      if (status === "accepted") {
        const response = await axios.get(`${BASE_URL}/user/connections`, {
          withCredentials: true,
        });
        dispatch(addConnections(response.data.data));
      }

      setSuccessMessage(
        `Request ${status === "accepted" ? "accepted" : "rejected"} successfully`
      );
      setError("");
    } catch (error) {
      setError("Failed to review request");
    } finally {
      setProcessing((prev) => ({ ...prev, [_id]: false }));
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e1a] text-white pt-24">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-indigo-600/6 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-violet-600/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="flex-grow container mx-auto px-4 sm:px-6 py-8 relative z-0">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-indigo-400 tracking-widest uppercase mb-2">Incoming</p>
          <h2 className="text-3xl font-bold">My <span className="gradient-text">Requests</span></h2>
        </div>

        {successMessage && (
          <div className="flex items-center justify-center mb-6 text-emerald-400 text-sm font-medium glass-card border-emerald-500/20 p-3 rounded-xl max-w-md mx-auto animate-fade-in">
            ✓ {successMessage}
          </div>
        )}

        {error && (
          <div className="text-center mb-6 text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl max-w-md mx-auto">
            {error}
          </div>
        )}

        {loading ? (
          <Loader />
        ) : requests.length === 0 ? (
          <div className="text-center mt-16">
            <div className="text-6xl mb-4" style={{ animation: 'float 3s ease-in-out infinite' }}>📩</div>
            <p className="text-[#64748b] text-lg">No requests found.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 max-w-6xl mx-auto">
            {requests.map((user) => (
              <div
                key={user._id}
                className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col items-center transition-all duration-300 hover:-translate-y-1"
              >
                {/* Profile Picture */}
                <div className="relative mb-4">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full blur-sm opacity-40"></div>
                  <img
                    src={
                      user.fromUserId?.PhotoUrl ||
                      "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2220431045.jpg"
                    }
                    alt={user.fromUserId?.name || "Unknown User"}
                    className="relative w-18 h-18 rounded-full border-2 border-[#0a0e1a] object-cover"
                  />
                </div>

                {/* User Info */}
                <h3 className="text-lg font-semibold">{user.fromUserId?.name || "Unknown"}</h3>
                <p className="text-sm text-[#94a3b8] mt-1">{user.fromUserId?.gender || "Unknown"}</p>
                <p className="text-xs text-[#64748b]">
                  Skills: {user.fromUserId?.skills?.join(", ") || "N/A"}
                </p>

                {/* Loading or Buttons */}
                {processing[user._id] ? (
                  <Loader2 className="animate-spin text-indigo-500 mt-4" size={22} />
                ) : (
                  <div className="mt-5 flex gap-3 w-full">
                    <button
                      onClick={() => reviewRequest("accepted", user._id)}
                      className="flex-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all border border-emerald-500/20"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => reviewRequest("rejected", user._id)}
                      className="flex-1 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all border border-rose-500/20"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Request;
