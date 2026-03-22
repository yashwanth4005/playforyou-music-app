export function SkeletonCards({ count = 4 }) {
  return (
    <div className="card-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="song-card skeleton-card">
          <div className="song-cover skeleton-block" />
          <div className="song-body">
            <div className="skeleton-line short" />
            <div className="skeleton-line" />
            <div className="skeleton-line medium" />
          </div>
        </div>
      ))}
    </div>
  );
}
