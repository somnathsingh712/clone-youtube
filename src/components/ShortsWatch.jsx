import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ShortsWatch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [short, setShort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const fetchShort = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${id}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
        );
        const data = await response.json();
        if (data.items?.[0]) {
          const video = data.items[0];
          setShort({
            id: video.id,
            title: video.snippet.title,
            channel: video.snippet.channelTitle,
            thumbnail: video.snippet.thumbnails.high.url,
            views: video.statistics?.viewCount || 0,
            likes: video.statistics?.likeCount || 0,
            description: video.snippet.description,
          });
        }
      } catch (error) {
        console.error("Error fetching short:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShort();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!short) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="text-white">Short not found</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Main content */}
      <div className="w-full h-full max-w-sm flex flex-col relative">
        {/* Video area */}
        <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
          <img
            src={short.thumbnail}
            alt={short.title}
            className="w-full h-full object-cover"
          />

          {/* Play/Pause overlay */}
          {!playing && (
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition"
            >
              <div className="text-white text-6xl">▶</div>
            </button>
          )}
        </div>

        {/* Info and controls at bottom */}
        <div className="bg-gradient-to-t from-black to-transparent p-4 absolute bottom-0 left-0 right-0">
          <h2 className="text-white font-semibold mb-2 line-clamp-2 text-sm">
            {short.title}
          </h2>
          <p className="text-gray-300 text-xs mb-3">{short.channel}</p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-300 mb-4">
            <span>👁 {(short.views / 1000).toFixed(1)}K views</span>
            <span>👍 {(short.likes / 1000).toFixed(1)}K</span>
          </div>
        </div>

        {/* Right-side action buttons */}
        <div className="absolute right-4 bottom-24 flex flex-col gap-6">
          <button
            onClick={() => setPlaying(!playing)}
            className="text-white bg-gray-800 hover:bg-gray-700 rounded-full p-3 transition"
            title={playing ? "Pause" : "Play"}
          >
            {playing ? "⏸" : "▶"}
          </button>

          <button
            className="text-white bg-gray-800 hover:bg-gray-700 rounded-full p-3 transition flex flex-col items-center"
            title="Like"
          >
            <span className="text-lg">👍</span>
          </button>

          <button
            className="text-white bg-gray-800 hover:bg-gray-700 rounded-full p-3 transition flex flex-col items-center"
            title="Dislike"
          >
            <span className="text-lg">👎</span>
          </button>

          <button
            className="text-white bg-gray-800 hover:bg-gray-700 rounded-full p-3 transition flex flex-col items-center"
            title="Share"
          >
            <span className="text-lg">📤</span>
          </button>

          <button
            className="text-white bg-gray-800 hover:bg-gray-700 rounded-full p-3 transition flex flex-col items-center"
            title="More options"
          >
            <span className="text-lg">⋮</span>
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={() => navigate("/shorts")}
          className="absolute top-4 left-4 text-white text-2xl z-10 hover:bg-gray-800 p-2 rounded-full transition"
        >
          ✕
        </button>

        {/* Navigation arrows */}
        <button
          onClick={() => navigate("/shorts")}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-2xl hover:bg-gray-800 p-2 rounded-full transition"
        >
          ⬆
        </button>

        <button
          onClick={() => navigate("/shorts")}
          className="absolute left-4 bottom-24 text-white text-2xl hover:bg-gray-800 p-2 rounded-full transition"
        >
          ⬇
        </button>
      </div>
    </div>
  );
}
