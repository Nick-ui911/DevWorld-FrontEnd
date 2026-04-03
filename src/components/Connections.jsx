import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addConnections } from "../utils/ConnectionSlice";
import { Link } from "react-router-dom";
import { FiMessageSquare } from "react-icons/fi";
import { AiOutlineUserDelete } from "react-icons/ai";
import Loader from "./Loader";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((state) => state.connection.connections);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConnections = connections.filter((connection) =>
    connection?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });
      dispatch(addConnections(response.data.data));
    } catch (error) {
      setError("Failed to load connections");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      setLoading(true);
      await axios.delete(`${BASE_URL}/user/unfollow/${userId}`, {
        withCredentials: true,
      });
      dispatch(
        addConnections(connections.filter((user) => user?._id !== userId))
      );
    } catch (error) {
      console.error("Error unfollowing user", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#0a0e1a] px-4 py-12 text-white w-full overflow-hidden pt-24">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-600/6 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-violet-600/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-0 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs font-semibold text-indigo-400 tracking-widest uppercase mb-2">Network</p>
          <h2 className="text-3xl font-bold">My <span className="gradient-text">Connections</span></h2>
        </div>

        {/* Search */}
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-lg px-5 py-3 text-white bg-white/[0.04] border border-white/[0.08] rounded-xl focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 placeholder-[#64748b] transition-all"
          />
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-center text-rose-400">{error}</p>
        ) : filteredConnections.length === 0 ? (
          <div className="text-center mt-16">
            <div className="text-6xl mb-4" style={{ animation: 'float 3s ease-in-out infinite' }}>👥</div>
            <p className="text-[#64748b] text-lg">No connections found.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
            {filteredConnections
              .filter((user) => user && user._id)
              .map((user, index) => (
                <div
                  key={user?._id || index}
                  className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col items-center transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Profile Picture */}
                  <div className="relative mb-4">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full blur-sm opacity-50"></div>
                    <img
                      src={
                        user?.PhotoUrl ||
                        "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2220431045.jpg"
                      }
                      alt={user?.name || "User"}
                      className="relative w-20 h-20 rounded-full border-2 border-[#0a0e1a] object-cover"
                    />
                  </div>

                  {/* User Info */}
                  <h3 className="text-lg font-semibold text-white">{user?.name || "Unknown User"}</h3>
                  <p className="text-[#94a3b8] text-sm mt-1">{user?.gender || "N/A"}</p>
                  <p className="text-[#64748b] text-xs mt-0.5">
                    Skill: {user?.skill || "N/A"}
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-5 w-full">
                    <button
                      onClick={() => handleUnfollow(user?._id)}
                      className="flex items-center justify-center gap-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium flex-1 border border-rose-500/20"
                    >
                      <AiOutlineUserDelete size={16} /> Unfollow
                    </button>
                    <Link to={`/chat/${user?._id}`} className="flex-1">
                      <button className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-3 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium w-full shadow-lg shadow-indigo-500/15 hover:shadow-indigo-500/25">
                        <FiMessageSquare size={16} /> Chat
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
