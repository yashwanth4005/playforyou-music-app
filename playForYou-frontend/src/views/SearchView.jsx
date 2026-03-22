import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SongCard } from "../ui/SongCard";
import { SectionPanel } from "../ui/SectionPanel";
import { SkeletonCards } from "../ui/Skeletons";
import { applyLikeUpdateToSongs } from "../lib/helpers";
import { extractErrorMessage, getSongs, searchSongs, toggleSongLike } from "../lib/api";
import { useToast } from "../providers/ToastProvider";

export default function SearchView() {
  const location = useLocation();
  const { showToast } = useToast();
  const urlQuery = new URLSearchParams(location.search).get("q") || "";
  const [query, setQuery] = useState(urlQuery);
  const deferredQuery = useDeferredValue(query);
  const [songs, setSongs] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [urlQuery, query]);

  useEffect(() => {
    let isMounted = true;

    async function runSearch() {
      setLoading(true);
      try {
        const response = deferredQuery.trim() ? await searchSongs(deferredQuery.trim()) : await getSongs();
        if (isMounted) {
          startTransition(() => {
            setSongs(response);
          });
        }
      } catch (error) {
        if (isMounted) {
          showToast(extractErrorMessage(error), "error");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    runSearch();
    return () => {
      isMounted = false;
    };
  }, [deferredQuery, showToast]);

  async function handleLike(songId) {
    try {
      const likePayload = await toggleSongLike(songId);
      setSongs((currentSongs) => applyLikeUpdateToSongs(currentSongs, songId, likePayload));
    } catch (error) {
      showToast(extractErrorMessage(error), "error");
    }
  }

  const genres = ["All", ...new Set(songs.map((song) => song.genre))];
  const filteredSongs = selectedGenre === "All" ? songs : songs.filter((song) => song.genre === selectedGenre);

  return (
    <div className="view-stack">
      <section className="search-panel">
        <label className="search-input">
          <span>Search songs, artists, albums, or genres</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try 'ambient', 'jazz', or an artist name" />
        </label>
        <div className="genre-pills">
          {genres.map((genre) => (
            <button
              key={genre}
              type="button"
              className={selectedGenre === genre ? "active" : ""}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      <SectionPanel
        title={deferredQuery ? "Search results" : "Browse the catalog"}
        subtitle={deferredQuery ? `Instant results for "${deferredQuery}"` : "Start broad and narrow fast"}
      >
        {loading ? (
          <SkeletonCards count={6} />
        ) : filteredSongs.length ? (
          <div className="card-grid">
            {filteredSongs.map((song) => (
              <SongCard key={song.id} song={song} queue={filteredSongs} onLike={handleLike} />
            ))}
          </div>
        ) : (
          <div className="empty-state">No songs matched that combination yet.</div>
        )}
      </SectionPanel>
    </div>
  );
}
