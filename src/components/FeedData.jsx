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
    <div className="min-h-screen px-4 sm:px-6 py-12 bg-[#070b14] text-white relative overflow-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/8 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-600/6 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/4 rounded-full blur-[100px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-0">
        {/* Hero Heading Section */}
        <div className="text-center pt-20 sm:pt-24 mb-12 px-4 space-y-5">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/[0.04] rounded-full border border-white/[0.08]">
              <span className="text-lg">✨</span>
              <span className="text-xs font-semibold text-indigo-400 tracking-widest uppercase">Discover Talent</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
            <span className="block gradient-text">Connect with</span>
            <span className="block mt-1 gradient-text-warm">Professionals</span>
          </h1>

          <p className="text-[#94a3b8] text-lg sm:text-xl mt-4 max-w-2xl mx-auto leading-relaxed">
            Explore skills, discover opportunities, and build meaningful connections
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">👥</span>
              <span className="text-[#64748b]">
                <span className="font-bold text-white text-lg">{feeds?.length || 0}</span> Profiles
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🚀</span>
              <span className="text-[#64748b]">
                <span className="font-bold text-white text-lg">Active</span> Community
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-12 flex justify-center px-4">
          <div className="relative w-full max-w-2xl group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600/30 via-violet-600/30 to-indigo-600/30 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#64748b]">
                🔍
              </div>
              <input
                type="text"
                placeholder="Search by skills (e.g., React, Python, Design)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-12 py-4 text-base text-white bg-white/[0.04] border border-white/[0.08] rounded-2xl focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 placeholder-[#64748b] transition-all"
                aria-label="Search by skills"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-white/[0.06] hover:bg-white/[0.12] rounded-lg transition-colors"
                  aria-label="Clear search"
                >
                  <span className="text-[#94a3b8] text-xs">✕</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        {!isLoading && filteredFeeds.length > 0 && (
          <div className="text-center mb-8 px-4">
            <p className="text-[#64748b] text-sm">
              {searchQuery 
                ? (
                  <span>
                    Found <span className="text-white font-semibold">{filteredFeeds.length}</span> {filteredFeeds.length === 1 ? 'result' : 'results'} for 
                    <span className="text-indigo-400 font-semibold"> "{searchQuery}"</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto">
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
            <div className="max-w-md mx-auto space-y-6">
              <div className="text-7xl sm:text-8xl mb-6" style={{ animation: 'float 3s ease-in-out infinite' }}>
                {searchQuery ? "🔍" : "🎉"}
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                {searchQuery ? "No Results Found" : "You're All Caught Up!"}
              </h3>
              <p className="text-[#94a3b8] text-lg mb-6">
                {searchQuery
                  ? `We couldn't find any profiles matching "${searchQuery}"`
                  : "You've explored all available profiles. Check back later for new connections!"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
                >
                  Clear Search & Explore All
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedData;