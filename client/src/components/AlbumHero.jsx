export default function AlbumHero({ album }) {
  return (
    <div className="album-hero">
      <div className="hero-cover">
        🎵
      </div>

      <div className="hero-info">
        <div className="hero-title">{album.title}</div>
        <div className="hero-artist">{album.artist}</div>

        <div className="hero-rating">
            ⭐{album.avg_rating || 0} ({album.review_count || 0} отзывов)
        </div>

        <div className="hero-actions">
          <button className="btn-play">▶ Слушать</button>
          <button className="btn-sec">♡ В избранное</button>
        </div>

      </div>
    </div>
  );
}