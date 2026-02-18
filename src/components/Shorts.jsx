import { useEffect, useState, useRef, useCallback } from "react";
import Shimmer from "./Shimmer";
import ShortCard from "./ShortCard";

export default function Shorts() {
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef(null);

  const fetchShorts = useCallback(async (pageToken = null) => {
    if (!pageToken) setLoading(true);
    else setLoadingMore(true);

    try {
      const tokenParam = pageToken ? `&pageToken=${pageToken}` : "";
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=US&maxResults=20${tokenParam}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
      );

      const data = await response.json();

      if (!data.items) {
        if (!pageToken) setShorts([]);
        return;
      }

      // Filter for short videos (under 60 seconds)
      const formattedShorts = data.items
        .map((video) => {
          const duration = video.contentDetails?.duration || "PT0S";
          const durationMatch = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
          const hours = parseInt(durationMatch?.[1] || 0);
          const minutes = parseInt(durationMatch?.[2] || 0);
          const seconds = parseInt(durationMatch?.[3] || 0);
          const totalSeconds = hours * 3600 + minutes * 60 + seconds;

          // Only return videos under 60 seconds
          if (totalSeconds <= 60) {
            const formattedDuration = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

            const uploadDate = new Date(video.snippet.publishedAt);
            const now = new Date();
            const diffTime = Math.abs(now - uploadDate);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            let timeAgo = "";
            if (diffDays === 0) timeAgo = "Today";
            else if (diffDays === 1) timeAgo = "1 day ago";
            else if (diffDays < 7) timeAgo = `${diffDays} days ago`;
            else if (diffDays < 30) timeAgo = `${Math.floor(diffDays / 7)} weeks ago`;
            else if (diffDays < 365) timeAgo = `${Math.floor(diffDays / 30)} months ago`;
            else timeAgo = `${Math.floor(diffDays / 365)} years ago`;

            const viewCount = video.statistics?.viewCount || 0;
            let viewsFormatted = "";
            if (viewCount >= 1000000)
              viewsFormatted = (viewCount / 1000000).toFixed(1) + "M";
            else if (viewCount >= 1000)
              viewsFormatted = (viewCount / 1000).toFixed(1) + "K";
            else viewsFormatted = viewCount.toString();

            return {
              id: video.id,
              title: video.snippet.title,
              channel: video.snippet.channelTitle,
              thumbnail: video.snippet.thumbnails.high.url,
              duration: formattedDuration,
              views: viewsFormatted,
              uploadedAt: timeAgo,
            };
          }
          return null;
        })
        .filter((item) => item !== null);

      if (pageToken) setShorts((prev) => [...prev, ...formattedShorts]);
      else setShorts(formattedShorts);

      setNextPageToken(data.nextPageToken || null);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchShorts();
  }, [fetchShorts]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && nextPageToken && !loadingMore) {
          fetchShorts(nextPageToken);
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [nextPageToken, loadingMore, fetchShorts]);

  return (
    <div className="w-full h-full flex flex-col bg-black">
      {/* Header */}
      <div className="border-b border-gray-800 px-4 py-3">
        <h1 className="text-2xl font-bold text-white">Shorts</h1>
      </div>

      {/* Shorts Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {loading
            ? Array(10)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="aspect-[9/16] bg-gray-800 rounded">
                    <Shimmer />
                  </div>
                ))
            : shorts.map((short) => (
                <ShortCard key={short.id} short={short} />
              ))}
        </div>

        <div ref={sentinelRef} className="h-6" />

        {loadingMore && (
          <div className="mt-4 flex justify-center">
            <div className="text-sm text-gray-300">Loading more...</div>
          </div>
        )}
      </div>
    </div>
  );
}
