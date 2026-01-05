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

  // useCallback prevents recreation on every render
  const handleRemoveFeed = useCallback((feedId) => {
    dispatch(addFeed(feeds.filter((feed) => feed._id !== feedId)));
  }, [feeds, dispatch]);

  // useMemo prevents recalculation on every render
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

  // Early return for unauthenticated users
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 py-12 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Improved Heading */}
      <div className="text-center mt-14 mb-8 px-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-400 drop-shadow-lg">
          Connect with Professionals & Discover Opportunities
        </h1>
        <p className="text-gray-300 text-base sm:text-lg mt-2">
          Explore skills and find the right talent or opportunities.
        </p>
      </div>

      {/* Styled Search Input */}
      <div className="mb-8 flex justify-center px-4">
        <input
          type="text"
          placeholder="🔍 Search by skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-lg px-5 py-3 text-white bg-gray-800 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-all"
          aria-label="Search by skills"
        />
      </div>

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
        <div className="text-center mt-10 px-4">
          <p className="text-gray-400 text-lg sm:text-xl font-semibold">
            {searchQuery
              ? `No results found for "${searchQuery}"`
              : "🎉 No more feeds available! 🎉"}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default FeedData;