import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import Shimmer from "./components/Shimmer";
import VideoCard from "./components/VideoCard";

export default function App() {
  const { section } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef(null);

  const fetchVideos = useCallback(async (pageToken = null) => {
    if (!pageToken) setLoading(true);
    else setLoadingMore(true);

    try {
      const tokenParam = pageToken ? `&pageToken=${pageToken}` : "";
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=US&maxResults=12${tokenParam}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
      );

      const data = await response.json();

      if (!data.items) {
        if (!pageToken) setVideos([]);
        return;
      }

      const formattedVideos = data.items.map((video) => {
        // Parse ISO 8601 duration to readable format
        const duration = video.contentDetails?.duration || 'PT0S';
        const durationMatch = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        const hours = parseInt(durationMatch?.[1] || 0);
        const minutes = parseInt(durationMatch?.[2] || 0);
        const seconds = parseInt(durationMatch?.[3] || 0);
        const formattedDuration = `${hours ? hours + ':' : ''}${minutes ? (hours && minutes < 10 ? '0' : '') + minutes : '0'}:${seconds < 10 ? '0' : ''}${seconds}`;

        // Format upload date
        const uploadDate = new Date(video.snippet.publishedAt);
        const now = new Date();
        const diffTime = Math.abs(now - uploadDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        let timeAgo = '';
        if (diffDays === 0) timeAgo = 'Today';
        else if (diffDays === 1) timeAgo = '1 day ago';
        else if (diffDays < 7) timeAgo = `${diffDays} days ago`;
        else if (diffDays < 30) timeAgo = `${Math.floor(diffDays / 7)} weeks ago`;
        else if (diffDays < 365) timeAgo = `${Math.floor(diffDays / 30)} months ago`;
        else timeAgo = `${Math.floor(diffDays / 365)} years ago`;

        // Format view count
        const viewCount = video.statistics?.viewCount || 0;
        let viewsFormatted = '';
        if (viewCount >= 1000000) viewsFormatted = (viewCount / 1000000).toFixed(1) + 'M';
        else if (viewCount >= 1000) viewsFormatted = (viewCount / 1000).toFixed(1) + 'K';
        else viewsFormatted = viewCount.toString();

        return {
          id: video.id,
          title: video.snippet.title,
          channel: video.snippet.channelTitle,
          thumbnail: video.snippet.thumbnails.high.url,
          duration: formattedDuration,
          views: viewsFormatted,
          uploadedAt: timeAgo,
          publishedAt: video.snippet.publishedAt,
        };
      });

      if (pageToken) setVideos((prev) => [...prev, ...formattedVideos]);
      else setVideos(formattedVideos);

      setNextPageToken(data.nextPageToken || null);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && nextPageToken && !loadingMore) {
          fetchVideos(nextPageToken);
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [nextPageToken, loadingMore, fetchVideos]);

  return (
    <div className="app-container mt-4">
      <main className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{section ? section.charAt(0).toUpperCase() + section.slice(1) : 'Home'}</h2>
          </div>

          <div className="p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading
              ? Array(8)
                  .fill(0)
                  .map((_, i) => <Shimmer key={i} />)
              : videos.map((v) => <VideoCard key={v.id} video={v} />)}
          </div>

          <div ref={sentinelRef} className="h-6" />

          {loadingMore && (
            <div className="mt-4 flex justify-center">
              <div className="text-sm text-gray-300">Loading more...</div>
            </div>
          )}
        </main>
    </div>
  );
}