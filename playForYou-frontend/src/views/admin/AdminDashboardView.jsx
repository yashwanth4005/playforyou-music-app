import { useEffect, useState } from "react";
import { extractErrorMessage, getAdminDashboard } from "../../lib/api";
import { SectionPanel } from "../../ui/SectionPanel";
import { SongCard } from "../../ui/SongCard";
import { SkeletonCards } from "../../ui/Skeletons";
import { useToast } from "../../providers/ToastProvider";

export default function AdminDashboardView() {
  const { showToast } = useToast();
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const response = await getAdminDashboard();
        if (isMounted) {
          setDashboard(response);
        }
      } catch (error) {
        if (isMounted) {
          showToast(extractErrorMessage(error), "error");
        }
      }
    }

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, [showToast]);

  if (!dashboard) {
    return <SkeletonCards count={4} />;
  }

  return (
    <div className="view-stack">
      <div className="stat-grid">
        <article>
          <strong>{dashboard.totalSongs}</strong>
          <span>songs</span>
        </article>
        <article>
          <strong>{dashboard.totalUsers}</strong>
          <span>users</span>
        </article>
        <article>
          <strong>{dashboard.totalPlaylists}</strong>
          <span>playlists</span>
        </article>
        <article>
          <strong>{dashboard.totalLikes}</strong>
          <span>likes</span>
        </article>
      </div>

      <SectionPanel title="Recent uploads" subtitle="Newest additions to the catalog">
        <div className="card-grid">
          {dashboard.recentUploads.map((song) => (
            <SongCard key={song.id} song={song} queue={dashboard.recentUploads} compact />
          ))}
        </div>
      </SectionPanel>

      <SectionPanel title="Top genres" subtitle="Current catalog mix">
        <div className="genre-pills">
          {dashboard.topGenres.map((genre) => (
            <span key={genre.genre}>
              {genre.genre} · {genre.total}
            </span>
          ))}
        </div>
      </SectionPanel>
    </div>
  );
}
