import React from "react";
import { MdWifiOff } from "react-icons/md";
import { IoReload } from "react-icons/io5";
import useOnline from "../utils/useOnline";

const OfflineScreen = () => {
  const isOnline = useOnline();

  if (isOnline) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a0e1a] text-white z-50 text-center p-6">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-rose-600/8 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-indigo-600/6 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-0">
        <MdWifiOff className="text-rose-400 text-8xl mb-5 mx-auto animate-pulse" />
        <h1 className="text-3xl font-bold mb-3">You're Offline</h1>
        <p className="text-[#94a3b8] text-base max-w-md mx-auto mb-6">
          It seems you've lost your internet connection. Please check your network or try reconnecting.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
        >
          <IoReload size={18} /> Retry Connection
        </button>
      </div>
    </div>
  );
};

export default OfflineScreen;
