import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import bgimage from "../assets/bg1.png";
import FeaturesSection from "./FeaturesSection";
import UsersCarousel from "./UsersCarousel";

const LandingPage = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  return (
    <>
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-4">
        {/* Background */}
        <div className="fixed inset-0 w-full h-full">
          <div className="absolute inset-0 bg-[#070b14] z-0"></div>
          <img
            src={bgimage}
            alt="Background"
            className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
          />
          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]"></div>
        </div>

        {/* Foreground Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative text-white flex flex-col items-center px-4 sm:px-6 max-w-3xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm text-[#94a3b8]"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Open for collaboration
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] tracking-tight">
            Unleash Your{" "}
            <span className="gradient-text-warm">Development</span>{" "}
            Potential
          </h1>

          <p className="text-lg sm:text-xl mb-10 max-w-xl mx-auto text-[#94a3b8] leading-relaxed">
            Connect, collaborate, and create with developers from around the
            globe
          </p>

          {/* CTA Buttons */}
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/register")}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3.5 rounded-full text-base font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow duration-300"
              >
                Get Started
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/login")}
                className="border border-white/15 px-8 py-3.5 rounded-full text-base font-semibold hover:bg-white/[0.06] transition-all duration-300"
              >
                Login
              </motion.button>
            </div>
          )}

          {/* Social Proof */}
          <div className="flex items-center gap-6 text-sm text-[#64748b]">
            <span className="flex items-center gap-1.5">
              <span className="text-base">🚀</span> 1000+ Developers
            </span>
            <span className="w-1 h-1 rounded-full bg-[#64748b]"></span>
            <span className="flex items-center gap-1.5">
              <span className="text-base">🌍</span> Global Community
            </span>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ y: 0, opacity: 1 }}
          animate={{
            y: [0, 12, 0],
            opacity: [1, 0.4, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-10 flex flex-col items-center"
        >
          <div className="w-8 h-12 border border-white/15 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-indigo-400"
            />
          </div>
        </motion.div>
      </div>

      {/* Stats */}
      <div>
        <UsersCarousel />
      </div>

      {/* Features */}
      <FeaturesSection />
    </>
  );
};

export default LandingPage;
