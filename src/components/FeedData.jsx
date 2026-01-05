import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import FeedCard from "./FeedCard";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/FeedSlice";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

function FeedData() {
  const dispatch = useDispatch();
  const feeds = useSelector((store) => store.feed.feeds);
  const user = useSelector((store) => store.user);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(BASE_URL + "/feed", {
          withCredentials: true,
        });
        dispatch(addFeed(response.data.data));
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login");
        } else {
          console.error("Error fetching feed", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedData();
  }, [dispatch, navigate, user]);

  const handleRemoveFeed = useCallback((feedId) => {
    dispatch(addFeed(feeds.filter((feed) => feed._id !== feedId)));
  }, [feeds, dispatch]);

  const filteredFeeds = useMemo(() => {
    if (!searchQuery.trim()) return feeds;
    
    const query = searchQuery.toLowerCase();
    return feeds.filter((feed) =>
      Array.isArray(feed.skills) &&
      feed.skills.some((skill) =>
        skill.toLowerCase().includes(query)
      )
    );
  }, [feeds, searchQuery]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 py-12 bg-gradient-to-r from-black via-slate-900 to-gray-950 text-white relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-0">
        {/* Hero Heading Section */}
        <div className="text-center pt-20 sm:pt-24 mb-12 px-4 space-y-6">
          {/* Badge */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/30 backdrop-blur-sm">
              <span className="text-2xl">✨</span>
              <span className="text-sm font-semibold text-purple-300 tracking-wide">DISCOVER TALENT</span>
            </div>
          </div>

          {/* Main Title with Gradient */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
              Connect with
            </span>
            <span className="block mt-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
              Professionals
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-300 text-lg sm:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
            Explore skills, discover opportunities, and build meaningful connections
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👥</span>
              <span className="text-gray-400">
                <span className="font-bold text-white text-lg">{feeds?.length || 0}</span> Profiles
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              <span className="text-gray-400">
                <span className="font-bold text-white text-lg">Active</span> Community
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="mb-12 flex justify-center px-4">
          <div className="relative w-full max-w-2xl group">
            {/* Glow effect on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 rounded-full blur-lg opacity-25 group-hover:opacity-50 transition duration-500"></div>
            
            <div className="relative">
              {/* Search Icon */}
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl">
                🔍
              </div>
              
              <input
                type="text"
                placeholder="Search by skills (e.g., React, Python, Design)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-4 text-lg text-white bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 transition-all shadow-2xl"
                aria-label="Search by skills"
              />

              {/* Clear button */}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                  aria-label="Clear search"
                >
                  <span className="text-gray-400">✕</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        {!isLoading && filteredFeeds.length > 0 && (
          <div className="text-center mb-8 px-4">
            <p className="text-gray-400 text-sm">
              {searchQuery 
                ? (
                  <span>
                    Found <span className="text-white font-semibold">{filteredFeeds.length}</span> {filteredFeeds.length === 1 ? 'result' : 'results'} for 
                    <span className="text-purple-400 font-semibold"> "{searchQuery}"</span>
                  </span>
                )
                : (
                  <span>
                    Showing <span className="text-white font-semibold">{filteredFeeds.length}</span> {filteredFeeds.length === 1 ? 'profile' : 'profiles'}
                  </span>
                )
              }
            </p>
          </div>
        )}

        {/* Content Area */}
        {isLoading ? (
          <div className="flex justify-center mt-20">
            <Loader />
          </div>
        ) : filteredFeeds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
            {filteredFeeds.map((feed) => (
              <FeedCard
                key={feed._id}
                {...feed}
                handleRemoveFeed={handleRemoveFeed}
              />
            ))}
          </div>
        ) : (
          <div className="text-center mt-20 px-4">
            {/* Empty State */}
            <div className="max-w-md mx-auto space-y-6">
              {/* Large Icon */}
              <div className="text-7xl sm:text-8xl mb-6 animate-bounce">
                {searchQuery ? "🔍" : "🎉"}
              </div>
              
              {/* Main Message */}
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                {searchQuery
                  ? "No Results Found"
                  : "You're All Caught Up!"}
              </h3>
              
              <p className="text-gray-400 text-lg mb-6">
                {searchQuery
                  ? `We couldn't find any profiles matching "${searchQuery}"`
                  : "You've explored all available profiles. Check back later for new connections!"}
              </p>
              
              {/* Action Button */}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 hover:from-purple-700 hover:via-blue-700 hover:to-pink-700 text-white text-lg font-semibold rounded-full transition-all transform hover:scale-105 shadow-2xl hover:shadow-purple-500/50"
                >
                  ✨ Clear Search & Explore All
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}

export default FeedData;