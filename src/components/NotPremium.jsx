import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NotPremium = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center h-screen bg-[#070b14] text-white text-center p-6"
    >
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-amber-500/6 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-indigo-600/6 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-0 flex flex-col items-center">
        <div className="text-6xl mb-6" style={{ animation: 'float 3s ease-in-out infinite' }}>✨</div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Premium Access Required</h1>
        <p className="text-[#94a3b8] text-lg max-w-sm mb-8">
          Upgrade to unlock exclusive chat features and connect with more developers.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/")}
            className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white font-medium hover:bg-white/[0.1] transition-all"
          >
            🏠 Home
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/premium")}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all"
          >
            🚀 Upgrade
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotPremium;
