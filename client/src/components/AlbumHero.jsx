import { useState } from "react";

function Stars({ value = 0 }) {
  const rounded = Math.round(value);
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`star${i <= rounded ? "" : " empty"}`}>★</span>
      ))}
    </span>
  );
}

export default function AlbumHero({ album }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="album-hero">
      <div className="hero-cover">
        <img
          src={`/covers/${album.id}.jpg`}
          alt={album.title}
          onError={(e) => { e.target.style.display = "none"; }}
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
        />
      </div>


      <div className="hero-info">
        <div className="hero-eyebrow">Альбом</div>

        <h1 className="hero-title">{album.title}</h1>

        <div className="hero-artist">{album.artist}</div>

        <div className="hero-rating">
          <Stars value={album.avg_rating} />
          <span className="hero-rating-num">
            {Number(album.avg_rating || 0).toFixed(1)}
          </span>
          <span className="hero-rating-count">
            ({album.review_count || 0} отзывов)
          </span>
        </div>

        <div className="hero-actions">
          <button className="btn-play">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Слушать
          </button>

          <button
            className="btn-sec"
            onClick={() => setLiked(l => !l)}
            style={liked ? { borderColor: "var(--red)", color: "var(--red)", background: "#FFF0EF" } : {}}
          >
            {liked ? "♥" : "♡"} {liked ? "В избранном" : "В избранное"}
          </button>
        </div>
      </div>
    </div>
  );
}
