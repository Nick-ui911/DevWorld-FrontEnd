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
      className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-3xl shadow-2xl overflow-hidden 
          max-w-sm sm:max-w-md w-full flex flex-col min-h-[480px] border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-purple-500/20 hover:shadow-2xl"
    >
      {/* Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-blue-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:via-blue-500/5 group-hover:to-pink-500/5 transition-all duration-500 pointer-events-none z-10"></div>

      {/* Profile Image Section */}
      <div className="relative w-full h-52 sm:h-64 overflow-hidden">
        {/* Gradient Overlay on Image */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent z-10"></div>

        <img
          src={PhotoUrl || (gender === "Male" ? maleProfile : femaleProfile)}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Age Badge */}
        {age !== null && age !== undefined && (
          <div className="absolute top-4 right-4 z-20">
            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-600/50">
              <span className="text-white font-semibold text-sm">
                {age} yrs
              </span>
            </div>
          </div>
        )}

        {/* Location Badge */}
        {location && (
          <div className="absolute bottom-4 left-4 z-20">
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-2 rounded-full border border-gray-600/50">
              <FaMapMarkerAlt className="text-purple-400 text-xs" />
              <span className="text-white text-xs font-medium">{location}</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="relative z-20 p-5 sm:p-6 flex-grow flex flex-col space-y-4">
        {/* Name */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            {name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed line-clamp-2">
          {description || "No description available"}
        </p>

        {/* Skills Section */}
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
            <h4 className="text-xs uppercase text-gray-400 font-bold tracking-widest">
              Skills
            </h4>
            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          </div>

          {skills?.filter((s) => s.trim()).length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills
                .filter((skill) => skill.trim())
                .map((skill, index) => (
                  <motion.span
                    key={`${skill}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-500 hover:to-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold border border-purple-500/30 hover:border-purple-400/50 transition-all duration-200 cursor-default shadow-lg"
                  >
                    {skill.trim()}
                  </motion.span>
                ))}
            </div>
          ) : (
            <span className="text-gray-500 text-sm italic">
              No skills added yet
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons / Loader */}
      <div className="relative z-20 p-4 sm:p-5 border-t border-gray-700/50 bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm">
        {isLoading ? (
          <div className="flex justify-center py-2">
            <motion.div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-lg"
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatDelay: 0.2,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                ></motion.span>
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="flex gap-3 w-full">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRequestSend("ignored")}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 py-3 rounded-xl sm:rounded-2xl flex-1 flex items-center justify-center gap-2 font-semibold text-sm sm:text-base shadow-lg hover:shadow-red-500/50 transition-all duration-300 border border-red-500/30"
            >
              <FaUserAltSlash className="text-base sm:text-lg" />
              <span className="hidden xs:inline">Ignore</span>
              <span className="xs:hidden">✕</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRequestSend("interested")}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-4 py-3 rounded-xl sm:rounded-2xl flex-1 flex items-center justify-center gap-2 font-semibold text-sm sm:text-base shadow-lg hover:shadow-green-500/50 transition-all duration-300 border border-green-500/30"
            >
              <FaUserCheck className="text-base sm:text-lg" />
              <span className="hidden xs:inline">Connect</span>
              <span className="xs:hidden">✓</span>
            </motion.button>
          </div>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-xs sm:text-sm text-center mt-3 bg-red-500/10 py-2 rounded-lg border border-red-500/20"
          >
            {error}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default FeedCard;
