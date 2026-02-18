import { useEffect, useState } from "react";

export default function App() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=US&maxResults=12&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
        );

        const data = await response.json();
        console.log(data);

        if (!data.items) {
          console.error("Invalid API response:", data);
          return;
        }

        const formattedVideos = data.items.map((video) => ({
          id: video.id,
          title: video.snippet.title,
          channel: video.snippet.channelTitle,
          thumbnail: video.snippet.thumbnails.high.url,
        }));

        setVideos(formattedVideos);
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);
  
}