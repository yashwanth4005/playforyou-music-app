import { useEffect, useState } from "react";
import { deleteSong, extractErrorMessage, getAdminSongs, updateSong } from "../../lib/api";
import { SectionPanel } from "../../ui/SectionPanel";
import { useToast } from "../../providers/ToastProvider";

export default function AdminSongsView() {
  const { showToast } = useToast();
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [form, setForm] = useState({ title: "", artist: "", album: "", genre: "", duration: "", description: "" });

  useEffect(() => {
    let isMounted = true;

    async function loadSongs() {
      try {
        const response = await getAdminSongs();
        if (isMounted) {
          setSongs(response);
          if (response.length) {
            selectSong(response[0]);
          }
        }
      } catch (error) {
        if (isMounted) {
          showToast(extractErrorMessage(error), "error");
        }
      }
    }

    loadSongs();
    return () => {
      isMounted = false;
    };
  }, [showToast]);

  function selectSong(song) {
    setSelectedSong(song);
    setForm({
      title: song.title,
      artist: song.artist,
      album: song.album,
      genre: song.genre,
      duration: song.duration,
      description: song.description || "",
    });
  }

  async function handleUpdate(event) {
    event.preventDefault();
    if (!selectedSong) {
      return;
    }
    try {
      const updatedSong = await updateSong(selectedSong.id, {
        ...form,
        duration: Number(form.duration),
      });
      setSongs((currentSongs) => currentSongs.map((song) => (song.id === updatedSong.id ? updatedSong : song)));
      setSelectedSong(updatedSong);
      showToast("Song updated successfully.", "success");
    } catch (error) {
      showToast(extractErrorMessage(error), "error");
    }
  }

  async function handleDelete() {
    if (!selectedSong) {
      return;
    }
    const shouldDelete = window.confirm(`Delete "${selectedSong.title}" from the catalog?`);
    if (!shouldDelete) {
      return;
    }
    try {
      await deleteSong(selectedSong.id);
      const nextSongs = songs.filter((song) => song.id !== selectedSong.id);
      setSongs(nextSongs);
      if (nextSongs.length) {
        selectSong(nextSongs[0]);
      } else {
        setSelectedSong(null);
      }
      showToast("Song deleted successfully.", "success");
    } catch (error) {
      showToast(extractErrorMessage(error), "error");
    }
  }

  return (
    <div className="manage-layout">
      <SectionPanel title="Catalog" subtitle="Select a song to edit">
        <div className="song-list">
          {songs.map((song) => (
            <button
              key={song.id}
              type="button"
              className={`song-list-item ${selectedSong?.id === song.id ? "active" : ""}`}
              onClick={() => selectSong(song)}
            >
              <strong>{song.title}</strong>
              <span>
                {song.artist} · {song.genre}
              </span>
            </button>
          ))}
        </div>
      </SectionPanel>

      <SectionPanel title="Edit metadata" subtitle="Keep admin changes synced with the player UI">
        {selectedSong ? (
          <form className="field-grid" onSubmit={handleUpdate}>
            <label>
              <span>Title</span>
              <input value={form.title} onChange={(event) => setForm((currentForm) => ({ ...currentForm, title: event.target.value }))} />
            </label>
            <label>
              <span>Artist</span>
              <input value={form.artist} onChange={(event) => setForm((currentForm) => ({ ...currentForm, artist: event.target.value }))} />
            </label>
            <label>
              <span>Album</span>
              <input value={form.album} onChange={(event) => setForm((currentForm) => ({ ...currentForm, album: event.target.value }))} />
            </label>
            <label>
              <span>Genre</span>
              <input value={form.genre} onChange={(event) => setForm((currentForm) => ({ ...currentForm, genre: event.target.value }))} />
            </label>
            <label>
              <span>Duration</span>
              <input
                type="number"
                min="1"
                value={form.duration}
                onChange={(event) => setForm((currentForm) => ({ ...currentForm, duration: event.target.value }))}
              />
            </label>
            <label className="full-width">
              <span>Description</span>
              <textarea
                rows="5"
                value={form.description}
                onChange={(event) => setForm((currentForm) => ({ ...currentForm, description: event.target.value }))}
              />
            </label>
            <div className="button-row">
              <button type="submit" className="primary-button">
                Save changes
              </button>
              <button type="button" className="ghost-button danger" onClick={handleDelete}>
                Delete song
              </button>
            </div>
          </form>
        ) : (
          <div className="empty-state">No songs in the catalog yet.</div>
        )}
      </SectionPanel>
    </div>
  );
}
