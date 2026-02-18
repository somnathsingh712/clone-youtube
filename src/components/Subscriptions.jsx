import { useEffect, useState } from "react";
import Shimmer from "./Shimmer";
import VideoCard from "./VideoCard";

export default function Subscriptions() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true);
      try {
        // Subscriptions requires user auth; fallback to popular for demo
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=US&maxResults=24&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
        );
        const data = await res.json();
        if (data.items) {
          const formatted = data.items.map((v) => ({
            id: v.id,
            title: v.snippet.title,
            channel: v.snippet.channelTitle,
            thumbnail: v.snippet.thumbnails.high.url,
          }));
          setVideos(formatted);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  return (
    <div className="app-container mt-4">
      <h2 className="text-xl font-semibold mb-4">Subscriptions</h2>
      <div className="p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading
          ? Array(8)
              .fill(0)
              .map((_, i) => <Shimmer key={i} />)
          : videos.map((v) => <VideoCard key={v.id} video={v} />)}
      </div>
    </div>
  );
}