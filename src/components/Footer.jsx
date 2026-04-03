import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0a0e1a] text-white py-10 relative z-10 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-10">
          
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-2xl font-black gradient-text">DevWorld</span>
            <p className="text-sm text-[#64748b] max-w-xs">Connect, collaborate, and grow with developers worldwide.</p>
          </div>

          {/* Navigation Links */}
          <nav className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 text-sm">
            <Link to="/" className="text-[#94a3b8] hover:text-white transition-colors duration-200">Home</Link>
            <Link to="/about" className="text-[#94a3b8] hover:text-white transition-colors duration-200">About Us</Link>
            <Link to="/contact" className="text-[#94a3b8] hover:text-white transition-colors duration-200">Contact</Link>
            <Link to="/register" className="text-[#94a3b8] hover:text-white transition-colors duration-200">Register</Link>
            <Link to="/privacy" className="text-[#94a3b8] hover:text-white transition-colors duration-200">Privacy Policy</Link>
            <Link to="/termandconditions" className="text-[#94a3b8] hover:text-white transition-colors duration-200">Terms & Conditions</Link>
          </nav>

          {/* Social Media Icons */}
          <div className="flex gap-4 justify-center">
            <a href="#" className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.04] border border-white/[0.06] text-[#94a3b8] hover:text-white hover:bg-white/[0.08] hover:border-indigo-500/30 transition-all duration-300">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045C7.384 8.46 3.756 6.5 1.327 3.521c-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.04] border border-white/[0.06] text-[#94a3b8] hover:text-white hover:bg-white/[0.08] hover:border-rose-500/30 transition-all duration-300">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.04] border border-white/[0.06] text-[#94a3b8] hover:text-white hover:bg-white/[0.08] hover:border-blue-500/30 transition-all duration-300">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>
          </div>
          
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8"></div>

        {/* Copyright */}
        <aside className="text-center text-xs text-[#64748b]">
          <p>© {new Date().getFullYear()} DevWorld. All rights reserved.</p>
        </aside>

      </div>
    </footer>
  );
};

export default Footer;
