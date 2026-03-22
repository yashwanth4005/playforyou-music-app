import { motion } from "framer-motion";
import { resolveMediaUrl } from "../lib/api";
import { usePlayer } from "../providers/PlayerProvider";
import { Button } from "./Button";

function formatTime(value) {
  if (!value || Number.isNaN(value)) {
    return "0:00";
  }
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    isExpanded,
    togglePlayback,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
    setExpanded,
  } = usePlayer();

  if (!currentSong) {
    return (
      <div className="player-panel idle compact">
        <p>Pick a track to begin</p>
      </div>
    );
  }

  return (
    <motion.div layout className="player-panel compact" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
      <div className="player-left">
        <div className={`player-art ${isPlaying ? "playing" : ""}`}>
          {currentSong.imageUrl ? (
            <img src={resolveMediaUrl(currentSong.imageUrl)} alt={currentSong.title} />
          ) : (
            <div className="art-placeholder">{currentSong.title.slice(0, 1)}</div>
          )}
        </div>
        <div className="player-meta">
          <strong>{currentSong.title}</strong>
          <span>{currentSong.artist || "Unknown artist"}</span>
        </div>
      </div>

      <div className="player-actions">
        <Button variant="ghost" size="sm" onClick={playPrevious}>
          ◀
        </Button>
        <Button variant="primary" size="sm" onClick={togglePlayback}>
          {isPlaying ? "❚❚" : "▶"}
        </Button>
        <Button variant="ghost" size="sm" onClick={playNext}>
          ▶
        </Button>
      </div>

      <div className="player-progress">
        <span>{formatTime(progress)}</span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={Math.min(progress, duration || 0)}
          onChange={(event) => seekTo(Number(event.target.value))}
          aria-label="Track progress"
        />
        <span>{formatTime(duration)}</span>
      </div>

      <div className="player-volume">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
          aria-label="Volume"
        />
      </div>
    </motion.div>
  );
}
