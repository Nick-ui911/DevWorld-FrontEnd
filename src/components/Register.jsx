import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/UserSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { requestNotificationPermission } from "../utils/firebase";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (!name || !email || !password || !gender) {
      setErrorMessage("All fields are required.");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage(
        "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        BASE_URL + "/signup",
        { name, email, password, gender },
        { withCredentials: true }
      );
      dispatch(addUser(response.data.data));
      navigate("/profile");
      handleFcmToken(response.data.data._id);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFcmToken = async (userId) => {
    if (!userId) return;
    await requestNotificationPermission(userId);
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const user = result.user;
      const { displayName, email, photoURL } = user;

      const response = await axios.post(
        BASE_URL + "/google-signup",
        { name: displayName, email, PhotoUrl: photoURL, idToken },
        { withCredentials: true }
      );

      dispatch(addUser(response.data.data));
      navigate("/profile");
      handleFcmToken(response.data.data._id);
    } catch (error) {
      console.log(error);
      setErrorMessage("Google Sign Up failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0e1a] pt-20 pb-10 px-4">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-72 h-72 bg-violet-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-600/8 rounded-full blur-[80px]"></div>
      </div>

      <div className="relative glass-card p-8 sm:p-10 rounded-2xl w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-sm text-[#64748b]">Join the DevWorld community today</p>
        </div>

        {errorMessage && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-[#64748b] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-[#64748b] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-[#64748b] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all pr-12"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-4 top-[38px] text-[#64748b] hover:text-white transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">Age</label>
            <input
              type="number"
              name="age"
              placeholder="25"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-[#64748b] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">Gender</label>
            <select
              name="gender"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all appearance-none cursor-pointer"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 12px center", backgroundRepeat: "no-repeat", backgroundSize: "16px" }}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="" className="bg-[#111827]">Select Gender</option>
              <option value="Male" className="bg-[#111827]">Male</option>
              <option value="Female" className="bg-[#111827]">Female</option>
              <option value="Other" className="bg-[#111827]">Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 flex justify-center items-center mt-2"
          >
            {loading ? (
              <span className="animate-spin border-2 border-white/30 border-t-white rounded-full h-5 w-5"></span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-grow h-px bg-white/[0.06]"></div>
          <span className="mx-4 text-xs text-[#64748b] uppercase tracking-wider">or</span>
          <div className="flex-grow h-px bg-white/[0.06]"></div>
        </div>

        <button
          onClick={handleGoogleSignUp}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-medium hover:bg-white/[0.08] transition-all duration-300"
        >
          <FcGoogle size={20} />
          Sign up with Google
        </button>

        <div className="text-center mt-6">
          <p className="text-sm text-[#64748b]">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
