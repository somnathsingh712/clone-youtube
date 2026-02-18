import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header({ onToggleSidebar }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  function submitSearch(e) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    navigate(`/search/${encodeURIComponent(term)}`);
    setQ("");
  }

  return (
    <header className="bg-black/95 border-b border-gray-800 sticky top-0 z-30 backdrop-blur">
      <div className="app-container flex items-center justify-between gap-4 h-16 px-4">
        {/* Left section: Menu & Logo */}
        <div className="flex items-center gap-4 min-w-max">
          <button
            onClick={onToggleSidebar}
            className="text-2xl text-white hover:bg-gray-800 p-2 rounded-full transition hover:text-gray-200"
            title="Main menu"
          >
            ☰
          </button>

          <Link to="/" className="flex items-center gap-1 font-bold text-xl select-none hover:opacity-80 transition">
            <div className="bg-red-600 text-white px-2 py-0.5 rounded-sm">
              ▶
            </div>
            <span className="text-white">YouTube</span>
          </Link>
        </div>

        {/* Center section: Search */}
        <form onSubmit={submitSearch} className="flex-1 flex justify-center max-w-xl">
          <div className="w-full flex items-center bg-gray-900 rounded-full border border-gray-700 focus-within:border-blue-500 transition overflow-hidden">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              className="flex-1 bg-transparent px-4 py-2.5 outline-none text-white placeholder-gray-500"
            />
            <button
              type="submit"
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-6 py-2.5 transition border-l border-gray-700"
              title="Search"
            >
              🔍
            </button>
          </div>
        </form>

        {/* Right section: Actions */}
        <div className="flex items-center gap-2 min-w-max">
          {/* Create/Upload button */}
          <button
            className="text-white hover:bg-gray-800 p-2 rounded-full transition hover:text-gray-200"
            title="Create"
          >
            ➕
          </button>

          {/* Notifications */}
          <button
            className="text-white hover:bg-gray-800 p-2 rounded-full transition hover:text-gray-200 relative"
            title="Notifications"
          >
            🔔
            <span className="absolute top-1 right-0.5 w-2 h-2 bg-red-600 rounded-full"></span>
          </button>

          {/* Apps menu */}
          <button
            className="text-white hover:bg-gray-800 p-2 rounded-full transition hover:text-gray-200"
            title="YouTube apps"
          >
            ⋮⋮
          </button>

          {/* User Profile */}
          <button
            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full hover:ring-2 hover:ring-gray-500 transition flex items-center justify-center text-white text-sm font-bold"
            title="User account"
          >
            U
          </button>
        </div>
      </div>
    </header>
  );
}