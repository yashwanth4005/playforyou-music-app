import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { extractErrorMessage, getSongDetails, toggleSongLike } from "../lib/api";
import { applyLikeUpdateToSongs } from "../lib/helpers";
import { SectionPanel } from "../ui/SectionPanel";
import { SongCard } from "../ui/SongCard";
import { SkeletonCards } from "../ui/Skeletons";
import { usePlayer } from "../providers/PlayerProvider";
import { useToast } from "../providers/ToastProvider";

export default function SongDetailsView() {
  const { songId } = useParams();
  const { playSong } = usePlayer();
  const { showToast } = useToast();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadSong() {
      try {
        const response = await getSongDetails(songId);
        if (isMounted) {
          setDetails(response);
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

    loadSong();
    return () => {
      isMounted = false;
    };
  }, [showToast, songId]);

  async function handleLike(songToLikeId) {
    try {
      const likePayload = await toggleSongLike(songToLikeId);
      setDetails((currentDetails) => ({
        song:
          currentDetails.song.id === songToLikeId
            ? { ...currentDetails.song, liked: likePayload.liked, likeCount: likePayload.likeCount }
            : currentDetails.song,
        relatedSongs: applyLikeUpdateToSongs(currentDetails.relatedSongs, songToLikeId, likePayload),
      }));
    } catch (error) {
      showToast(extractErrorMessage(error), "error");
    }
  }

  if (loading) {
    return <SkeletonCards count={4} />;
  }

  return (
    <div className="view-stack">
      <section className="detail-hero">
        <div>
          <p className="eyebrow">{details.song.genre}</p>
          <h2>{details.song.title}</h2>
          <p>
            {details.song.artist} · {details.song.album}
          </p>
          <p>{details.song.description || "No description was added for this track yet."}</p>
          <div className="detail-actions">
            <button type="button" className="primary-button" onClick={() => playSong(details.song, [details.song, ...details.relatedSongs])}>
              Play now
            </button>
            <button type="button" className="ghost-button" onClick={() => handleLike(details.song.id)}>
              {details.song.liked ? "Liked" : "Like"} · {details.song.likeCount}
            </button>
          </div>
        </div>

        <div className="metric-grid">
          <article>
            <strong>{details.song.playCount}</strong>
            <span>plays</span>
          </article>
          <article>
            <strong>{details.song.likeCount}</strong>
            <span>likes</span>
          </article>
          <article>
            <strong>{details.relatedSongs.length}</strong>
            <span>related tracks</span>
          </article>
        </div>
      </section>

      <SectionPanel title="Related tracks" subtitle="Keep the same mood moving">
        <div className="card-grid">
          {details.relatedSongs.map((song) => (
            <SongCard key={song.id} song={song} queue={[details.song, ...details.relatedSongs]} onLike={handleLike} />
          ))}
        </div>
      </SectionPanel>
    </div>
  );
}
