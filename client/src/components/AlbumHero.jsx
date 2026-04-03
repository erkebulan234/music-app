import { useState, useEffect } from "react";
import { checkFavorite, toggleFavorite } from "../services/api";

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

export default function AlbumHero({ album, onPlay }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    checkFavorite(album.id).then(res => setLiked(res.data.favorited));
  }, [album.id]);

  const handleLike = async () => {
    const res = await toggleFavorite(album.id);
    setLiked(res.data.favorited);
  };

  return (
    <div className="album-hero">
      <div className="hero-cover">
        <img
          src={album.cover_url}
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
          <button className="btn-play" onClick={onPlay}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Слушать
          </button>

          <button
            className="btn-sec"
            onClick={handleLike}
            style={liked ? { borderColor: "var(--red)", color: "var(--red)", background: "rgba(224,107,98,0.1)" } : {}}
          >
            {liked
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            }
            {liked ? "В избранном" : "В избранное"}
          </button>
        </div>
      </div>
    </div>
  );
}