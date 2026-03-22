import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { useTheme } from "../providers/ThemeProvider";
import { Button } from "./Button";

const TITLES = {
  "/home": ["Home", "Fresh recommendations, mood-led sections, and your current pulse."],
  "/search": ["Search", "Find songs instantly and narrow by genre in one motion."],
  "/library": ["Library", "Your playlists, liked tracks, and saved listening rituals."],
  "/profile": ["Profile", "Account details, listening signals, and personal stats."],
  "/admin": ["Admin Studio", "A concise control room for catalog growth and curation."],
  "/admin/upload": ["Upload Song", "Publish a new track with artwork and metadata."],
  "/admin/songs": ["Manage Songs", "Edit, review, and retire tracks from the catalog."],
};

export function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const [title, subtitle] = useMemo(() => {
    if (location.pathname.startsWith("/song/")) {
      return ["Now Playing", "Expanded detail view with playback context and related picks."];
    }
    return TITLES[location.pathname] || ["PlayForYou", "A clean music platform built for focused listening."];
  }, [location.pathname]);

  function handleLogout() {
    signOut();
    navigate("/auth", { replace: true });
  }

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="topbar-panel">
      <div className="topbar-brand">
        <p className="eyebrow">Music platform</p>
        <h1>{title}</h1>
        <p className="topbar-subtitle">{subtitle}</p>
      </div>

      <div className="topbar-actions">
        <div className="topbar-search">
          <input
            type="search"
            value={searchQuery}
            placeholder="Search artists, tracks, or playlists"
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)}
            disabled={!searchQuery.trim()}
          >
            Go
          </Button>
        </div>

        <Button variant="ghost" size="sm" onClick={toggleTheme}>
          {isDarkMode ? "Light mode" : "Dark mode"}
        </Button>

        <div className="user-pill">
          <strong>{user?.name}</strong>
          <span>{user?.role}</span>
        </div>

        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Sign out
        </Button>
      </div>
    </header>
  );
}
