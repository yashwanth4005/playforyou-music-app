export function applyLikeUpdateToSongs(songs, songId, likePayload) {
  return songs.map((song) =>
    song.id === songId
      ? {
          ...song,
          liked: likePayload.liked,
          likeCount: likePayload.likeCount,
        }
      : song,
  );
}
