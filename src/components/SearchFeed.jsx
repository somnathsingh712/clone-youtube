import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Shimmer from "./Shimmer";
import VideoCard from "./VideoCard";

export default function SearchFeed() {
  const { searchTerm } = useParams();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [prevPageToken, setPrevPageToken] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);

  useEffect(() => {
    // reset paging when search term changes
    setNextPageToken(null);
    setPrevPageToken(null);
    setPageIndex(1);

    async function fetchSearchResults(token = null) {
      if (!searchTerm) return;

      setLoading(true);
      try {
        const q = encodeURIComponent(searchTerm);
        const tokenParam = token ? `&pageToken=${token}` : "";

        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=24&type=video&q=${q}${tokenParam}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
        );

        const data = await response.json();

        if (!data.items) {
          setVideos([]);
          setNextPageToken(null);
          setPrevPageToken(null);
          return;
        }

        const formattedVideos = data.items.map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.high.url,
        }));

        setVideos(formattedVideos);
        setNextPageToken(data.nextPageToken || null);
        setPrevPageToken(data.prevPageToken || null);
      } catch (error) {
        console.error("Search API Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResults();
  }, [searchTerm]);

  async function goToPage(token, delta) {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const q = encodeURIComponent(searchTerm);
      const tokenParam = token ? `&pageToken=${token}` : "";
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=24&type=video&q=${q}${tokenParam}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
      );
      const data = await response.json();
      if (!data.items) {
        setVideos([]);
        setNextPageToken(null);
        setPrevPageToken(null);
        return;
      }

      const formattedVideos = data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high.url,
      }));

      setVideos(formattedVideos);
      setNextPageToken(data.nextPageToken || null);
      setPrevPageToken(data.prevPageToken || null);
      setPageIndex((p) => Math.max(1, p + delta));
    } catch (err) {
      console.error("Search pagination error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container mt-4">
      <h2 className="text-xl font-semibold mb-4">
        Search Results for: <span className="text-red-500">{searchTerm}</span>
      </h2>

      <div className="p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading
          ? Array(8)
              .fill(0)
              .map((_, i) => <Shimmer key={i} />)
          : videos.map((v) => <VideoCard key={v.id} video={v} />)}
      </div>

      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={() => goToPage(prevPageToken, -1)}
          disabled={!prevPageToken || loading}
          className={`px-4 py-2 rounded border ${!prevPageToken || loading ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-800'}`}
        >
          Previous
        </button>

        <div className="text-sm text-gray-300">Page {pageIndex}</div>

        <button
          onClick={() => goToPage(nextPageToken, 1)}
          disabled={!nextPageToken || loading}
          className={`px-4 py-2 rounded border ${!nextPageToken || loading ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-800'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}