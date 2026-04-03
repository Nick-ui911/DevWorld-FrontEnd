import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { removeUser } from "../utils/UserSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { FiLogOut, FiUser, FiHome, FiDatabase, FiStar, FiUsers, FiInbox, FiKey } from "react-icons/fi";
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

  const navLinkClass = (path) =>
    `p-2.5 rounded-xl transition-all duration-200 ${
      location.pathname === path
        ? 'text-white bg-white/[0.06]'
        : 'text-[#64748b] hover:text-white hover:bg-white/[0.04]'
    }`;

  return (
    <div className="fixed top-0 w-full h-16 sm:h-[68px] flex items-center justify-between px-4 md:px-8 navbar-glass z-50">
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-2 group"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
          D
        </div>
        <span className="text-xl sm:text-2xl font-black tracking-tight gradient-text group-hover:opacity-90 transition-opacity">
          DevWorld
        </span>
      </Link>

      {/* Navigation Icons */}
      <div className="hidden md:flex items-center gap-1">
        <Link
          to={location.pathname === "/feeddata" ? "/" : "/feeddata"}
          className={navLinkClass(location.pathname === "/feeddata" ? "/feeddata" : "/feeddata")}
          title={location.pathname === "/feeddata" ? "Home" : "Feed"}
        >
          {location.pathname === "/feeddata" ? <FiHome size={20} /> : <FiDatabase size={20} />}
        </Link>
        <Link to="/contact" className={navLinkClass("/contact")} title="Contact">
          <IoMdContacts size={20} />
        </Link>
        {user && (
          <Link to="/profile" className={navLinkClass("/profile")} title="Profile">
            <FiUser size={20} />
          </Link>
        )}
      </div>

      {/* User Profile & Dropdown */}
      <div className="relative" ref={dropdownRef}>
        {user ? (
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="focus:outline-none group">
            <div className="relative">
              <div className="absolute -inset-[2px] bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-300 blur-[3px]"></div>
              <img
                alt="User Avatar"
                className="relative w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-white/[0.08] object-cover transition-transform duration-200 group-hover:scale-105"
                src={
                  user?.PhotoUrl ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
              />
              {/* Online indicator dot */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#070b14]"></span>
            </div>
          </button>
        ) : (
          <Link to="/login" className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:shadow-indigo-500/25 hover:scale-105 transition-all duration-300 group">
            <span className="relative z-10">Login</span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
        )}

        {dropdownOpen && (
          <div className="absolute right-0 mt-3 w-60 glass-card rounded-2xl overflow-hidden animate-slide-down shadow-2xl shadow-black/50">
            {/* User header in dropdown */}
            {user && (
              <div className="px-4 py-3 border-b border-white/[0.05] flex items-center gap-3">
                <img
                  src={user?.PhotoUrl || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover border border-white/[0.08]"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-[11px] text-[#64748b] truncate">{user?.email}</p>
                </div>
              </div>
            )}

            <ul className="py-1.5">
              <li>
                <Link
                  to={location.pathname === "/feeddata" ? "/" : "/feeddata"}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#94a3b8] hover:text-white hover:bg-white/[0.04] transition-all rounded-lg mx-1.5"
                  onClick={() => setDropdownOpen(false)}
                >
                  {location.pathname === "/feeddata" ? <FiHome size={16} /> : <FiDatabase size={16} />} 
                  {location.pathname === "/feeddata" ? "Home" : "Feed"}
                </Link>
              </li>
              <li>
                <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#94a3b8] hover:text-white hover:bg-white/[0.04] transition-all rounded-lg mx-1.5" onClick={() => setDropdownOpen(false)}>
                  <FiUser size={16} /> Profile
                </Link>
              </li>
              <li>
                <Link to="/connections" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#94a3b8] hover:text-white hover:bg-white/[0.04] transition-all rounded-lg mx-1.5" onClick={() => setDropdownOpen(false)}>
                  <FiUsers size={16} /> Connections
                </Link>
              </li>
              <li>
                <Link to="/premium" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#94a3b8] hover:text-white hover:bg-white/[0.04] transition-all rounded-lg mx-1.5" onClick={() => setDropdownOpen(false)}>
                  <FiStar size={16} className="text-amber-400" /> Get Premium
                </Link>
              </li>
              <li>
                <Link to="/request" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#94a3b8] hover:text-white hover:bg-white/[0.04] transition-all rounded-lg mx-1.5" onClick={() => setDropdownOpen(false)}>
                  <FiInbox size={16} /> Requests
                </Link>
              </li>
              <li>
                <Link to="/ForgotPasswordPage" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#94a3b8] hover:text-white hover:bg-white/[0.04] transition-all rounded-lg mx-1.5" onClick={() => setDropdownOpen(false)}>
                  <FiKey size={16} /> Update Password
                </Link>
              </li>
              <li className="border-t border-white/[0.05] mt-1.5 pt-1.5 mx-1.5">
                <button
                  onClick={() => {
                    handleLogout();
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/8 transition-all rounded-lg"
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