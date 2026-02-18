import { useNavigate } from "react-router-dom";

export default function ShortCard({ short }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/shorts/${short.id}`)}
      className="group cursor-pointer"
    >
      {/* Vertical Video Container */}
      <div className="w-full aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden relative mb-2 flex flex-col justify-end">
        <img
          src={short.thumbnail}
          alt={short.title}
          className="w-full h-full object-cover group-hover:brightness-75 transition duration-200 absolute inset-0"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Duration badge */}
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-semibold">
          {short.duration}
        </div>

        {/* Info section at bottom */}
        <div className="relative p-3 z-10">
          {/* Title */}
          <h3 className="font-semibold text-xs line-clamp-2 text-white mb-2">
            {short.title}
          </h3>

          {/* Channel info */}
          <p className="text-gray-200 text-xs line-clamp-1 mb-1">
            {short.channel}
          </p>

          {/* Stats */}
          <p className="text-gray-300 text-xs">
            {short.views} views
          </p>
        </div>

        {/* Action icons overlay on hover */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition visible z-20">
          <button className="text-white hover:scale-110 transition" title="Like">
            👍
          </button>
          <button className="text-white hover:scale-110 transition" title="Dislike">
            👎
          </button>
          <button className="text-white hover:scale-110 transition" title="Share">
            📤
          </button>
          <button className="text-white hover:scale-110 transition" title="More options">
            ⋮
          </button>
        </div>
      </div>
    </div>
  );
}
