import { useEffect, useState } from "react";
import { SectionPanel } from "../ui/SectionPanel";
import { SongCard } from "../ui/SongCard";
import { SkeletonCards } from "../ui/Skeletons";
import { applyLikeUpdateToSongs } from "../lib/helpers";
import { extractErrorMessage, getHomeFeed, toggleSongLike } from "../lib/api";
import { useToast } from "../providers/ToastProvider";

export default function HomeView() {
  const { showToast } = useToast();
  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadFeed() {
      try {
        const response = await getHomeFeed();
        if (isMounted) {
          setFeed(response);
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

    loadFeed();
    return () => {
      isMounted = false;
    };
  }, [showToast]);

  async function handleLike(songId) {
    try {
      const likePayload = await toggleSongLike(songId);
      setFeed((currentFeed) => ({
        ...currentFeed,
        featuredSong:
          currentFeed.featuredSong?.id === songId
            ? { ...currentFeed.featuredSong, liked: likePayload.liked, likeCount: likePayload.likeCount }
            : currentFeed.featuredSong,
        trendingSongs: applyLikeUpdateToSongs(currentFeed.trendingSongs, songId, likePayload),
        newReleases: applyLikeUpdateToSongs(currentFeed.newReleases, songId, likePayload),
        recommendedSongs: applyLikeUpdateToSongs(currentFeed.recommendedSongs, songId, likePayload),
      }));
    } catch (error) {
      showToast(extractErrorMessage(error), "error");
    }
  }

  if (loading) {
    return <SkeletonCards count={6} />;
  }

  return (
    <div className="view-stack">
      {feed?.featuredSong ? (
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Featured track</p>
            <h2>{feed.featuredSong.title}</h2>
            <p>
              {feed.featuredSong.artist} · {feed.featuredSong.album} · {feed.featuredSong.genre}
            </p>
          </div>
          <div className="genre-pills">
            {feed.genres?.map((genre) => (
              <span key={genre.genre}>
                {genre.genre} · {genre.total}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <SectionPanel title="Trending now" subtitle="Most loved today">
        <div className="card-grid">
          {feed?.trendingSongs?.map((song) => (
            <SongCard key={song.id} song={song} queue={feed.trendingSongs} onLike={handleLike} />
          ))}
        </div>
      </SectionPanel>

      <SectionPanel title="New releases" subtitle="Recently added to the platform">
        <div className="card-grid">
          {feed?.newReleases?.map((song) => (
            <SongCard key={song.id} song={song} queue={feed.newReleases} onLike={handleLike} />
          ))}
        </div>
      </SectionPanel>

      <SectionPanel title="Recommended for you" subtitle="Based on your listening signals">
        <div className="card-grid">
          {feed?.recommendedSongs?.map((song) => (
            <SongCard key={song.id} song={song} queue={feed.recommendedSongs} onLike={handleLike} />
          ))}
        </div>
      </SectionPanel>
    </div>
  );
}
