
import { useNavigate } from "react-router-dom";

export default function SuggestedVideo({ video }) {
  const navigate = useNavigate();

  if (!video) return null;

  return (
    <div
      onClick={() => navigate(`/watch/${video.id}`)}
      className="flex gap-3 items-start cursor-pointer hover:bg-gray-800 p-2 rounded"
    >
      <div className="w-36 h-20 bg-gray-700 flex-shrink-0 overflow-hidden rounded">
        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1">
        <div className="text-sm font-medium line-clamp-2">{video.title}</div>
        <div className="text-xs text-gray-400 mt-1">{video.channel}</div>
      </div>
    </div>
  );
}
