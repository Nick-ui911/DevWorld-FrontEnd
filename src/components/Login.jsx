import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/UserSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { requestNotificationPermission } from "../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { email, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/feeddata");
      handleFcmToken(res.data._id);
    } catch (error) {
      setError(error?.response?.data || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const { email, displayName: name, photoURL: photo } = result.user;

      const res = await axios.post(
        BASE_URL + "/google-login",
        { idToken, email },
        { withCredentials: true }
      );

      dispatch(addUser(res.data));
      navigate("/feeddata");
      handleFcmToken(res.data._id);
    } catch (error) {
      console.error("Google Login Error:", error);
      setError(error.response?.data || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleFcmToken = async (userId) => {
    if (!userId) return;
    await requestNotificationPermission(userId);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0e1a] px-4">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-violet-600/8 rounded-full blur-[80px]"></div>
      </div>

      {!loading && (
        <div className="relative glass-card p-8 sm:p-10 rounded-2xl w-full max-w-md animate-fade-in-up">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-sm text-[#64748b]">Sign in to your DevWorld account</p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-[#64748b] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-300"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-[#94a3b8] mb-2">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-[#64748b] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-300 pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-4 top-[42px] text-[#64748b] hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 flex justify-center items-center"
            >
              {loading ? (
                <span className="animate-spin border-2 border-white/30 border-t-white rounded-full h-5 w-5"></span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-white/[0.06]"></div>
            <span className="mx-4 text-xs text-[#64748b] uppercase tracking-wider">or</span>
            <div className="flex-grow h-px bg-white/[0.06]"></div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-medium hover:bg-white/[0.08] transition-all duration-300"
          >
            <FcGoogle size={20} />
            <span>Continue with Google</span>
          </button>

          <div className="text-center mt-6">
            <p className="text-sm text-[#64748b]">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
