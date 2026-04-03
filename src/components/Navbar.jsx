import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { removeUser } from "../utils/UserSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { FiLogOut, FiUser, FiHome, FiDatabase } from "react-icons/fi";
import { IoMdContacts } from "react-icons/io";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed top-0 w-full h-16 sm:h-18 flex items-center justify-between px-4 md:px-8 bg-[#0a0e1a]/80 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)] z-50 border-b border-white/[0.06]">
      {/* Logo */}
      <Link
        to="/"
        className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight hover:scale-105 transition-transform duration-300 gradient-text"
      >
        DevWorld
      </Link>

      {/* Navigation Icons */}
      <div className="hidden md:flex items-center gap-1">
        <Link
          to={location.pathname === "/feeddata" ? "/" : "/feeddata"}
          className="p-2.5 rounded-xl text-[#94a3b8] hover:text-white hover:bg-white/[0.06] transition-all duration-200"
        >
          {location.pathname === "/feeddata" ? <FiHome size={20} /> : <FiDatabase size={20} />}
        </Link>
        <Link to="/contact" className="p-2.5 rounded-xl text-[#94a3b8] hover:text-white hover:bg-white/[0.06] transition-all duration-200">
          <IoMdContacts size={20} />
        </Link>
        {user && (
          <Link to="/profile" className="p-2.5 rounded-xl text-[#94a3b8] hover:text-white hover:bg-white/[0.06] transition-all duration-200">
            <FiUser size={20} />
          </Link>
        )}
      </div>

      {/* User Profile & Dropdown */}
      <div className="relative" ref={dropdownRef}>
        {user ? (
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="focus:outline-none group">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              <img
                alt="User Avatar"
                className="relative w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white/10 object-cover"
                src={
                  user?.PhotoUrl ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
              />
            </div>
          </button>
        ) : (
          <Link to="/login" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg hover:shadow-indigo-500/25 hover:scale-105 transition-all duration-300">
            Login
          </Link>
        )}

        {dropdownOpen && (
          <div className="absolute right-0 mt-3 w-56 glass-card rounded-2xl overflow-hidden animate-slide-down">
            <ul className="py-2">
              <li>
                <Link
                  to={location.pathname === "/feeddata" ? "/" : "/feeddata"}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#94a3b8] hover:text-white hover:bg-white/[0.06] transition-all"
                  onClick={() => setDropdownOpen(false)}
                >
                  {location.pathname === "/feeddata" ? <FiHome size={16} /> : <FiDatabase size={16} />} 
                  {location.pathname === "/feeddata" ? "Home" : "Feed"}
                </Link>
              </li>
              <li>
                <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#94a3b8] hover:text-white hover:bg-white/[0.06] transition-all" onClick={() => setDropdownOpen(false)}>
                  <FiUser size={16} /> Profile
                </Link>
              </li>
              <li>
                <Link to="/connections" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#94a3b8] hover:text-white hover:bg-white/[0.06] transition-all" onClick={() => setDropdownOpen(false)}>
                  <IoMdContacts size={16} /> Connections
                </Link>
              </li>
              <li>
                <Link to="/premium" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#94a3b8] hover:text-white hover:bg-white/[0.06] transition-all" onClick={() => setDropdownOpen(false)}>
                  <span className="text-amber-400">⭐</span> Get Premium
                </Link>
              </li>
              <li>
                <Link to="/request" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#94a3b8] hover:text-white hover:bg-white/[0.06] transition-all" onClick={() => setDropdownOpen(false)}>
                  <span>📩</span> Requests
                </Link>
              </li>
              <li>
                <Link to="/ForgotPasswordPage" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#94a3b8] hover:text-white hover:bg-white/[0.06] transition-all" onClick={() => setDropdownOpen(false)}>
                  <span>🔑</span> Update Password
                </Link>
              </li>
              <li className="border-t border-white/[0.06] mt-1 pt-1">
                <button
                  onClick={() => {
                    handleLogout();
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
                >
                  <FiLogOut size={16} /> Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;