import { useEffect, useState } from "react";
import { createPlaylist, extractErrorMessage, getLibrary, getSongs } from "../lib/api";
import { SectionPanel } from "../ui/SectionPanel";
import { SongCard } from "../ui/SongCard";
import { SkeletonCards } from "../ui/Skeletons";
import { useToast } from "../providers/ToastProvider";

export default function LibraryView() {
  const { showToast } = useToast();
  const [library, setLibrary] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "" });
  const [selectedSongIds, setSelectedSongIds] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadLibrary() {
      try {
        const [libraryResponse, songsResponse] = await Promise.all([getLibrary(), getSongs()]);
        if (isMounted) {
          setLibrary(libraryResponse);
          setCatalog(songsResponse);
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

    loadLibrary();
    return () => {
      isMounted = false;
    };
  }, [showToast]);

  function toggleSongSelection(songId) {
    setSelectedSongIds((currentIds) =>
      currentIds.includes(songId) ? currentIds.filter((id) => id !== songId) : [...currentIds, songId],
    );
  }

  async function handleCreatePlaylist(event) {
    event.preventDefault();
    try {
      const playlist = await createPlaylist({
        name: form.name,
        description: form.description,
        songIds: selectedSongIds,
      });
      setLibrary((currentLibrary) => ({
        ...currentLibrary,
        playlists: [playlist, ...(currentLibrary?.playlists || [])],
      }));
      setForm({ name: "", description: "" });
      setSelectedSongIds([]);
      showToast("Playlist created successfully.", "success");
    } catch (error) {
      showToast(extractErrorMessage(error), "error");
    }
  }

  if (loading) {
    return <SkeletonCards count={5} />;
  }

  return (
    <div className="view-stack">
      <SectionPanel title="Create a playlist" subtitle="Build a collection from your catalog">
        <form className="playlist-builder" onSubmit={handleCreatePlaylist}>
          <div className="field-grid">
            <label>
              <span>Name</span>
              <input
                value={form.name}
                onChange={(event) => setForm((currentForm) => ({ ...currentForm, name: event.target.value }))}
                placeholder="Sunday slow burn"
                required
              />
            </label>
            <label>
              <span>Description</span>
              <input
                value={form.description}
                onChange={(event) => setForm((currentForm) => ({ ...currentForm, description: event.target.value }))}
                placeholder="Warm, spacious, and late-evening friendly"
              />
            </label>
          </div>

          <div className="playlist-selector">
            {catalog.slice(0, 12).map((song) => (
              <button
                key={song.id}
                type="button"
                className={selectedSongIds.includes(song.id) ? "active" : ""}
                onClick={() => toggleSongSelection(song.id)}
              >
                {song.title}
              </button>
            ))}
          </div>

          <button type="submit" className="primary-button">
            Save playlist
          </button>
        </form>
      </SectionPanel>

      <SectionPanel title="Liked songs" subtitle="Tracks you want close">
        {library?.likedSongs?.length ? (
          <div className="card-grid">
            {library.likedSongs.map((song) => (
              <SongCard key={song.id} song={song} queue={library.likedSongs} compact />
            ))}
          </div>
        ) : (
          <div className="empty-state">Like a few tracks and they’ll show up here instantly.</div>
        )}
      </SectionPanel>

      <SectionPanel title="Your playlists" subtitle="Saved sets and personal mixes">
        {library?.playlists?.length ? (
          <div className="playlist-grid">
            {library.playlists.map((playlist) => (
              <article key={playlist.id} className="playlist-card">
                <div>
                  <p className="eyebrow">{playlist.songCount} songs</p>
                  <h3>{playlist.name}</h3>
                  <p>{playlist.description || "No description added yet."}</p>
                </div>
                <div className="playlist-song-stack">
                  {playlist.songs.slice(0, 3).map((song) => (
                    <span key={song.id}>{song.title}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">Create your first playlist to start shaping your library.</div>
        )}
      </SectionPanel>
    </div>
  );
}
