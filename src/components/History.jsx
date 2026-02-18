import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function History() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem('watchHistory')) || [];
      setVideos(history);
    } catch (err) {
      console.error('Error loading history:', err);
      setVideos([]);
    }
  }, []);

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem('watchHistory');
      setVideos([]);
    }
  };

  return (
    <div className="app-container mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">History</h2>
        {videos.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition"
          >
            Clear History
          </button>
        )}
      </div>
      
      {videos.length === 0 ? (
        <div className="text-gray-400 text-center py-8">No videos in history yet. Start watching!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video) => (
            <Link key={video.id} to={`/watch/${video.id}`} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg bg-gray-900 aspect-video">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="mt-2">
                <h3 className="text-sm font-medium line-clamp-2 group-hover:text-blue-400 transition">
                  {video.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{video.channel}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(video.watchedAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}