import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const CreatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!password || !confirmPassword) throw new Error("Please fill in both fields.");
      if (password !== confirmPassword) throw new Error("Passwords do not match!");

      const res = await axios.patch(
        BASE_URL + "/createPassword",
        { password },
        { withCredentials: true }
      );

      setSuccess(res?.data?.message || "Password created successfully!");
      setError("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Something went wrong!";
      setError(errorMsg);
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 pr-11 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-[#475569] text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all duration-300";

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm text-[#94a3b8]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Account Setup
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight mb-3">
            Create{" "}
            <span className="gradient-text-warm">Password</span>
          </h1>
          <p className="text-[#94a3b8] text-sm leading-relaxed">
            Set a strong password to secure your account.
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
          className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-7 sm:p-8 backdrop-blur-sm"
        >
          {/* Error / Success messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.3 }}
                className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20"
              >
                <XCircle size={16} />
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.3 }}
                className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              >
                <CheckCircle size={16} />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-[#475569] hover:text-[#94a3b8] transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-[#475569] hover:text-[#94a3b8] transition-colors duration-200"
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Password"
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center text-[#475569] text-sm mt-6"
        >
          Already have a password?{" "}
          <Link
            to="/ForgotPasswordPage"
            className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
          >
            Update Password
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default CreatePassword;