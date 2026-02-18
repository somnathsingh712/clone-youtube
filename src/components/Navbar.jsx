import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/search/${searchTerm}`);
      setSearchTerm("");
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 sticky top-0 z-50">
      <Link to="/" className="flex items-center">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png"
          alt="logo"
          height={45}
          width={45}
        />
        <span className="text-white font-bold text-xl ml-2 hidden sm:block">YouTube</span>
      </Link>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-full flex items-center px-4 py-1 w-full max-w-md ml-4"
      >
        <input
          className="bg-transparent border-none outline-none w-full text-black"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="p-2 text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </form>
    </nav>
  );
}


Navbar.jsx