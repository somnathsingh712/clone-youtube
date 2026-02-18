import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Home" },
  { to: "/shorts", label: "Shorts" },
  { to: "/explore", label: "Explore" },
  { to: "/subscriptions", label: "Subscriptions" },
  { to: "/library", label: "Library" },
  { to: "/history", label: "History" },
];

export default function Sidebar({ onClose }) {
  return (
    <nav className="w-full h-full p-4 overflow-y-auto">
      <div className="space-y-1 text-sm">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            onClick={onClose}
            className={({ isActive }) =>
              `block py-2 px-2 rounded hover:bg-gray-800 ${
                isActive ? "bg-gray-800 font-medium" : ""
              }`
            }
          >
            {it.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}