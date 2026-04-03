import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUserAltSlash, FaUserCheck, FaMapMarkerAlt } from "react-icons/fa";
import maleProfile from "../assets/maleDefaultProfile.png";
import femaleProfile from "../assets/femaleDefaultProfile.png";
import { BASE_URL } from "../utils/constants";

const FeedCard = ({
  _id,
  name,
  gender,
  age,
  PhotoUrl,
  skills,
  description,
  location,
  handleRemoveFeed,
}) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestSend = async (status) => {
    try {
      setIsLoading(true);
      await axios.post(
        `${BASE_URL}/request/send/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
      setError("");
      if (handleRemoveFeed) handleRemoveFeed(_id);
    } catch (error) {
      setError("Failed to review request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative glass-card text-white rounded-2xl overflow-hidden 
          max-w-sm sm:max-w-md w-full flex flex-col min-h-[480px] hover:border-indigo-500/30 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(99,102,241,0.1)]"
    >
      {/* Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-violet-500/0 to-emerald-500/0 group-hover:from-indigo-500/[0.03] group-hover:via-violet-500/[0.03] group-hover:to-emerald-500/[0.03] transition-all duration-500 pointer-events-none z-10"></div>

      {/* Profile Image Section */}
      <div className="relative w-full h-52 sm:h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/60 to-transparent z-10"></div>
        <img
          src={PhotoUrl || (gender === "Male" ? maleProfile : femaleProfile)}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Age Badge */}
        {age !== null && age !== undefined && (
          <div className="absolute top-4 right-4 z-20">
            <div className="glass-card px-3 py-1.5 rounded-full">
              <span className="text-white font-semibold text-sm">{age} yrs</span>
            </div>
          </div>
        )}

        {/* Location Badge */}
        {location && (
          <div className="absolute bottom-4 left-4 z-20">
            <div className="glass-card flex items-center gap-2 px-3 py-1.5 rounded-full">
              <FaMapMarkerAlt className="text-indigo-400 text-xs" />
              <span className="text-white text-xs font-medium">{location}</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="relative z-20 p-5 sm:p-6 flex-grow flex flex-col space-y-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">{name}</h3>
        </div>

        <p className="text-[#94a3b8] text-sm leading-relaxed line-clamp-2">
          {description || "No description available"}
        </p>

        {/* Skills Section */}
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"></div>
            <h4 className="text-[10px] uppercase text-[#64748b] font-bold tracking-[0.2em]">Skills</h4>
            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"></div>
          </div>

          {skills?.filter((s) => s.trim()).length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {skills
                .filter((skill) => skill.trim())
                .map((skill, index) => (
                  <motion.span
                    key={`${skill}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 px-3 py-1 rounded-lg text-xs font-medium border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-200 cursor-default"
                  >
                    {skill.trim()}
                  </motion.span>
                ))}
            </div>
          ) : (
            <span className="text-[#64748b] text-sm italic">No skills added yet</span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-20 p-4 sm:p-5 border-t border-white/[0.06]">
        {isLoading ? (
          <div className="flex justify-center py-2">
            <motion.div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                  animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                ></motion.span>
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="flex gap-3 w-full">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleRequestSend("ignored")}
              className="bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 px-4 py-2.5 rounded-xl flex-1 flex items-center justify-center gap-2 font-semibold text-sm border border-rose-500/20 hover:border-rose-500/30 transition-all duration-300"
            >
              <FaUserAltSlash size={14} />
              <span>Ignore</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleRequestSend("interested")}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-4 py-2.5 rounded-xl flex-1 flex items-center justify-center gap-2 font-semibold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-300"
            >
              <FaUserCheck size={14} />
              <span>Connect</span>
            </motion.button>
          </div>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-rose-400 text-xs text-center mt-3 bg-rose-500/10 py-2 rounded-lg border border-rose-500/20"
          >
            {error}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default FeedCard;
