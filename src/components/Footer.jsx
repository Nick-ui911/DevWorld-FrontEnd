import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative bg-[#070b14] text-white py-12 z-10 overflow-hidden">
      {/* Subtle top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>

      {/* Background ambient glow */}
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-violet-600/3 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative">
        
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-10">
          
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/20">
                D
              </div>
              <span className="text-2xl font-black gradient-text">DevWorld</span>
            </div>
            <p className="text-sm text-[#64748b] max-w-xs leading-relaxed">Connect, collaborate, and grow with developers worldwide.</p>
          </div>

          {/* Navigation Links */}
          <nav className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-3 text-sm">
            <Link to="/" className="text-[#64748b] hover:text-white transition-colors duration-200 hover:translate-x-0.5 transform">Home</Link>
            <Link to="/about" className="text-[#64748b] hover:text-white transition-colors duration-200 hover:translate-x-0.5 transform">About Us</Link>
            <Link to="/contact" className="text-[#64748b] hover:text-white transition-colors duration-200 hover:translate-x-0.5 transform">Contact</Link>
            <Link to="/register" className="text-[#64748b] hover:text-white transition-colors duration-200 hover:translate-x-0.5 transform">Register</Link>
            <Link to="/privacy" className="text-[#64748b] hover:text-white transition-colors duration-200 hover:translate-x-0.5 transform">Privacy Policy</Link>
            <Link to="/termandconditions" className="text-[#64748b] hover:text-white transition-colors duration-200 hover:translate-x-0.5 transform">Terms & Conditions</Link>
          </nav>

          {/* Social Media Icons */}
          <div className="flex gap-3 justify-center">
            <a href="#" className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/[0.05] text-[#64748b] hover:text-white hover:bg-white/[0.06] hover:border-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045C7.384 8.46 3.756 6.5 1.327 3.521c-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/[0.05] text-[#64748b] hover:text-white hover:bg-white/[0.06] hover:border-rose-500/25 transition-all duration-300 hover:-translate-y-0.5">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/[0.05] text-[#64748b] hover:text-white hover:bg-white/[0.06] hover:border-blue-500/25 transition-all duration-300 hover:-translate-y-0.5">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>
          </div>
          
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent my-10"></div>

        {/* Copyright */}
        <aside className="text-center text-xs text-[#475569]">
          <p>© {new Date().getFullYear()} DevWorld. Crafted with passion for developers.</p>
        </aside>

      </div>
    </footer>
  );
};

export default Footer;
