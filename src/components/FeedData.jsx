import React, { useEffect, useState } from "react";
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
    // Using [dispatch] in the dependency array is functionally the same as using [] because dispatch always remains same because it’s a stable reference
  }, [dispatch]);
  // use useCallback here because this function is using as a prop for better performance 

  const handleRemoveFeed = (feedId) => {
    dispatch(addFeed(feeds.filter((feed) => feed._id !== feedId)));
  };

  // Filter feeds based on search query
  // this is searching in every input type because it change searchQuery state which rerender component 
  const filteredFeeds = feeds.filter(
    (feed) =>
      !searchQuery ||
      (Array.isArray(feed.skills) &&
        feed.skills.some((skill) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        ))
  );

  return (
    <div className="min-h-screen px-6 py-12 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {!user ? (
        <p className="text-white text-center text-lg">
          Please log in to view user feeds
        </p>
      ) : (
        <>
          {/* 🏆 Improved Heading */}
          <div className="text-center mt-14 mb-8">
            <h1 className="text-4xl font-extrabold text-blue-400 drop-shadow-lg">
              Connect with Professionals & Discover Opportunities
            </h1>
            <p className="text-gray-300 text-lg mt-2">
              Explore skills and find the right talent or opportunities.
            </p>
          </div>

          {/* 🔍 Styled Search Input */}
          <div className="mb-8 flex justify-center">
            <input
              type="text"
              placeholder="🔍 Search by skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-lg px-5 py-3 text-white bg-gray-800 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center mt-20">
              <Loader />
            </div>
          ) : filteredFeeds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredFeeds.map((feed) => (
                <FeedCard
                  key={feed._id}
                  {...feed}
                  // this below is for removing feed card from feed once you send connect or ignore
                  handleRemoveFeed={handleRemoveFeed}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-xl font-bold text-center mt-10">
              {searchQuery
                ? "No results found for your search!"
                : "🎉 No more feeds available! 🎉"}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default FeedData;
