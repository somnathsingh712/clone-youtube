import { useNavigate } from "react-router-dom";

export default function VideoCard({ video }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/watch/${video.id}`)}
      className="cursor-pointer group"
    >
      {/* Thumbnail with duration badge */}
      <div className="w-full aspect-video bg-gray-800 rounded-lg overflow-hidden relative mb-3">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:brightness-75 transition duration-200"
        />
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
          {video.duration}
        </div>
      </div>

      {/* Video info */}
      <div className="flex gap-3">
        {/* Channel avatar placeholder */}
        <div className="w-9 h-9 bg-gray-700 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-300">
          {video.channel.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="font-semibold text-sm line-clamp-2 text-white group-hover:text-gray-300 transition">
            {video.title}
          </h3>

          {/* Channel and metadata */}
          <p className="text-gray-400 text-xs mt-1 line-clamp-1">
            {video.channel}
          </p>

          {/* Views and upload date */}
          <p className="text-gray-500 text-xs mt-0.5">
            {video.views} views • {video.uploadedAt}
          </p>
        </div>
      </div>
    </div>
  );
}