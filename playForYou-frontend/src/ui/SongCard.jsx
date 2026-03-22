import { useNavigate } from "react-router-dom";
import { resolveMediaUrl } from "../lib/api";
import { usePlayer } from "../providers/PlayerProvider";

function formatDuration(value) {
  if (!value) {
    return "0:00";
  }
  const minutes = Math.floor(value / 60);
  const seconds = `${value % 60}`.padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function SongCard({ song, queue, onLike, compact = false }) {
  const navigate = useNavigate();
  const { playSong } = usePlayer();

  return (
    <article className={`song-card ${compact ? "compact" : ""}`}>
      <button type="button" className="song-cover" onClick={() => navigate(`/song/${song.id}`)}>
        {song.imageUrl ? (
          <img
            src={resolveMediaUrl(song.imageUrl)}
            alt={song.title}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = "/fallback-cover.png";
            }}
          />
        ) : (
          <div className="art-placeholder">{song.title.slice(0, 1)}</div>
        )}
      </button>

      <div className="song-body">
        <div>
          <p className="song-kicker">
            {song.genre} · {formatDuration(song.duration)}
          </p>
          <h3>{song.title}</h3>
          <p className="song-subtitle">
            {song.artist} · {song.album}
          </p>
        </div>

        <div className="song-card-actions">
          <button type="button" className="ghost-button" onClick={() => playSong(song, queue)}>
            Play
          </button>
          {onLike ? (
            <button type="button" className="ghost-button" onClick={() => onLike(song.id)}>
              {song.liked ? "Liked" : "Like"}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
