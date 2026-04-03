import React from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

const SuccessPage = ({ membershipType }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0e1a] text-white relative">
      <Confetti />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-card p-10 rounded-2xl text-center max-w-lg mx-4"
      >
        <div className="text-5xl mb-4">🎉</div>
        <motion.h1
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold text-emerald-400 mb-3"
        >
          Congratulations!
        </motion.h1>
        
        <p className="text-[#94a3b8] text-lg">
          You have successfully subscribed to the{" "}
          <strong className="text-amber-400">{membershipType}</strong> plan.
        </p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/")}
          className="mt-8 bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 px-8 rounded-xl font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all"
        >
          Go to Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
