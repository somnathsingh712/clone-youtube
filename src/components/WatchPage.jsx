import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SuggestedVideo from "./SuggestedVideo";

// Utility functions for localStorage history management
const addToHistory = (videoData) => {
  try {
    const history = JSON.parse(localStorage.getItem('watchHistory')) || [];
    // Remove if video already exists to avoid duplicates
    const filtered = history.filter(v => v.id !== videoData.id);
    // Add the new video at the beginning
    const updated = [videoData, ...filtered];
    // Keep only the last 50 videos
    localStorage.setItem('watchHistory', JSON.stringify(updated.slice(0, 50)));
  } catch (err) {
    console.error('Error saving to history:', err);
  }
};

export default function WatchPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [suggested, setSuggested] = useState([]);
  const [suggestedLoading, setSuggestedLoading] = useState(false);

  useEffect(() => {
    async function fetchVideo() {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
        );
        const data = await res.json();
        if (data.items && data.items.length) {
          const videoData = data.items[0].snippet;
          setVideo(videoData);
          // Save to localStorage history
          addToHistory({
            id: id,
            title: videoData.title,
            channel: videoData.channelTitle,
            thumbnail: videoData.thumbnails?.high?.url || videoData.thumbnails?.default?.url,
            watchedAt: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchVideo();
  }, [id]);

  useEffect(() => {
    async function fetchSuggested() {
      if (!id) return;
      setSuggestedLoading(true);
      try {
        // Fetch related videos using search.list with relatedToVideoId
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${id}&type=video&maxResults=8&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
        );
        const data = await res.json();
        if (data.items && data.items.length) {
          const formatted = data.items
            .filter((it) => it.id && (it.id.videoId || it.id.channelId || it.id.playlistId))
            .map((it) => ({
              id: it.id.videoId,
              title: it.snippet.title,
              channel: it.snippet.channelTitle,
              thumbnail: it.snippet.thumbnails?.medium?.url || it.snippet.thumbnails?.default?.url,
            }))
            .filter(Boolean);

          // If no valid video ids found, fall back to popular videos below
          if (formatted.length) {
            setSuggested(formatted);
          } else {
            console.warn('No valid related videos returned, falling back to popular');
            // fallback to popular
            const pop = await fetch(
              `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=US&maxResults=8&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
            );
            const popData = await pop.json();
            const popFormatted = (popData.items || [])
              .map((v) => ({
                id: v.id,
                title: v.snippet.title,
                channel: v.snippet.channelTitle,
                thumbnail: v.snippet.thumbnails?.medium?.url || v.snippet.thumbnails?.default?.url,
              }))
              .filter((s) => s.id !== id);
            setSuggested(popFormatted);
          }
        } else {
          console.warn('Related search returned no items, using popular fallback');
          const pop = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=US&maxResults=8&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
          );
          const popData = await pop.json();
          const popFormatted = (popData.items || [])
            .map((v) => ({
              id: v.id,
              title: v.snippet.title,
              channel: v.snippet.channelTitle,
              thumbnail: v.snippet.thumbnails?.medium?.url || v.snippet.thumbnails?.default?.url,
            }))
            .filter((s) => s.id !== id);
          setSuggested(popFormatted);
        }
      } catch (err) {
        console.error("Suggested fetch error:", err);
        // on error, try a simple popular fallback
        try {
          const pop = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=US&maxResults=8&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
          );
          const popData = await pop.json();
          const popFormatted = (popData.items || [])
            .map((v) => ({
              id: v.id,
              title: v.snippet.title,
              channel: v.snippet.channelTitle,
              thumbnail: v.snippet.thumbnails?.medium?.url || v.snippet.thumbnails?.default?.url,
            }))
            .filter((s) => s.id !== id);
          setSuggested(popFormatted);
        } catch (e) {
          console.error('Fallback popular fetch failed', e);
          setSuggested([]);
        }
      } finally {
        setSuggestedLoading(false);
      }
    }

    fetchSuggested();
  }, [id]);

  return (
    <div className="app-container mt-4">
      <div className="flex gap-6">
        <main className="flex-1">
          <div className="w-full bg-black rounded-lg overflow-hidden shadow-lg">
            <div className="w-full aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${id}?autoplay=1`}
                title="Youtube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          <div className="mt-4">
            <h1 className="video-title">{loading ? "Loading..." : video?.title}</h1>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full" />
                <div>
                  <div className="text-sm font-medium">{video?.channelTitle}</div>
                  <div className="text-xs text-gray-400">Subscribed • 1.2M</div>
                </div>
              </div>

              <div>
                <button className="bg-red-600 px-4 py-2 rounded text-sm">Subscribe</button>
              </div>
            </div>

            <p className="text-sm text-gray-300 mt-3 line-clamp-3">
              {video?.description}
            </p>
          </div>
        </main>

        <aside className="w-80 hidden lg:block">
          <div className="text-sm text-gray-400 mb-2">Up next</div>
          <div className="space-y-3">
            {suggestedLoading
              ? Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-24 bg-gray-800 rounded" />
                ))
              : suggested.map((s) => <SuggestedVideo key={s.id} video={s} />)}
          </div>
        </aside>
      </div>
    </div>
  );
}