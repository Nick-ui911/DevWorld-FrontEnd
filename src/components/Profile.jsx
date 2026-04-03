import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { addUser } from "../utils/UserSlice";
import { BASE_URL } from "../utils/constants";
import { motion } from "framer-motion";
import { FaUserEdit, FaMapMarkerAlt } from "react-icons/fa";
import { FiMail, FiStar } from "react-icons/fi";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((store) => store.user);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/profile/view`, {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        console.error("Error fetching profile", error);
      }
    }
  };

  useEffect(() => {
    if (location.pathname === "/profile") {
      fetchProfile();
    }
  }, [location.pathname]);

  const skillsArray = Array.isArray(user?.skills)
    ? user.skills.flatMap((skill) => skill.split(","))
    : ["Not specified"];

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#070b14] px-4 pt-20 pb-10 text-white">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-indigo-600/8 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-violet-600/6 rounded-full blur-[100px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative glass-card w-full max-w-md p-8 rounded-2xl text-center"
      >
        {/* Premium Badge */}
        {user?.isPremium && (
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5 uppercase"
          >
            <FiStar size={12} />
            <span className="truncate">{user?.membershipType}</span>
          </motion.span>
        )}

        {/* Profile Picture */}
        <div className="flex justify-center mb-5">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full blur-sm opacity-60"></div>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-28 h-28 rounded-full border-3 border-[#070b14] shadow-xl object-cover"
              src={
                user?.PhotoUrl ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              alt="Profile"
            />
          </div>
        </div>

        {!user?.gender && (
          <div className="flex items-center gap-2 mb-4 bg-amber-500/10 text-amber-400 px-4 py-2.5 rounded-xl border border-amber-500/20 text-sm">
            <FaUserEdit size={16} />
            <span>Please complete your profile (Add Picture & Gender)</span>
          </div>
        )}

        {/* User Info */}
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2 text-white mb-1">
          {user?.name || "User Name"}
          {user?.isPremium && <FiStar className="text-amber-400" size={18} />}
        </h2>

        {/* Location */}
        {user?.location && (
          <p className="flex items-center justify-center gap-2 text-sm text-[#94a3b8] mb-1">
            <FaMapMarkerAlt className="text-indigo-400" size={12} /> {user.location}
          </p>
        )}

        {/* Email */}
        <p className="text-[#64748b] flex items-center justify-center gap-2 text-sm mb-5">
          <FiMail size={14} /> {user?.email || "user@example.com"}
        </p>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-5"></div>

        {/* Details */}
        <div className="space-y-3 text-sm text-[#94a3b8] text-left">
          <div className="flex items-start gap-2">
            <span className="text-base mt-0.5">🚻</span>
            <div>
              <span className="text-[#64748b]">Gender: </span>
              <span className="text-white font-medium">{user?.gender ? user.gender : "Not provided"}</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-base mt-0.5">📝</span>
            <div>
              <span className="text-[#64748b]">About: </span>
              <span className="text-white font-medium">{user?.description || "No description available"}</span>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-6">
          <h3 className="text-xs uppercase text-[#64748b] font-bold tracking-[0.2em] mb-3">Skills</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {skillsArray.map((skill, index) => (
              <span
                key={index}
                className="bg-indigo-500/15 text-indigo-300 px-3 py-1.5 rounded-lg text-xs font-medium border border-indigo-500/20"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="flex justify-center mt-7">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
            onClick={() => navigate("/profileEdit")}
          >
            <FaUserEdit size={16} /> Edit Profile
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
