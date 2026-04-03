import { useEffect, useState } from "react";
import { getAlbums } from "../services/api";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

function StarRating({ value = 0 }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`star${i <= Math.round(value) ? "" : " empty"}`}>★</span>
      ))}
    </span>
  );
}

export default function Popular() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("rating");

  useEffect(() => {
    getAlbums()
      .then(res => setAlbums(res.data))
      .finally(() => setLoading(false));
  }, []);

 const sorted = [...albums].sort((a, b) => {
  if (filter === "rating") {
    const ratingDiff = (Number(b.avg_rating) || 0) - (Number(a.avg_rating) || 0);
    if (ratingDiff !== 0) return ratingDiff;
    return (Number(b.review_count) || 0) - (Number(a.review_count) || 0);
  }
  if (filter === "reviews") return (Number(b.review_count) || 0) - (Number(a.review_count) || 0);
  return 0;
 });

  return (
    <div className="layout">
      <Topbar />
      <Sidebar />

      <main className="main-content">
        {/* Hero banner */}
        <div className="popular-hero">
          <div className="popular-hero-inner">
            <div className="popular-hero-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C12 2 7 8 7 13a5 5 0 0 0 10 0c0-2-1-4-2-5 0 0 0 3-2 4-1-2-1-5-1-5s-2 3-2 5a3 3 0 0 0 6 0c0-1.5-.5-2.5-1-3.5C15 10 12 2 12 2z" fill="var(--gold)" opacity="0.9"/>
              </svg>
            </div>
            <div>
              <div className="popular-hero-label">Чарты</div>
              <h1 className="popular-hero-title">Популярное</h1>
              <p className="popular-hero-sub">Лучшие альбомы по оценкам слушателей</p>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="filter-row">
          <span className="filter-label">Сортировать:</span>
          <div className="filter-tabs">
            {[
              { id: "rating", label: "По рейтингу" },
              { id: "reviews", label: "По отзывам" },
            ].map(f => (
              <button
                key={f.id}
                className={`filter-tab${filter === f.id ? " active" : ""}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ranked list */}
        {loading ? (
          <div className="loading"><div className="spinner" /> Загрузка...</div>
        ) : (
          <div className="ranked-list">
            {sorted.map((album, i) => (
              <Link to={`/album/${album.id}`} key={album.id} className="ranked-row">
                <div className={`ranked-num${i < 3 ? " top" : ""}`}>
                  {i === 0 && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#FFD700" opacity="0.15"/>
                      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="#FFD700"/>
                    </svg>
                  )}
                  {i === 1 && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#C0C0C0" opacity="0.15"/>
                      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="#C0C0C0"/>
                    </svg>
                  )}
                  {i === 2 && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#CD7F32" opacity="0.15"/>
                      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="#CD7F32"/>
                    </svg>
                  )}
                  {i >= 3 && String(i + 1).padStart(2, "0")}
                </div>

                <div className="ranked-cover">
                  <img
                    src={album.cover_url}
                    alt={album.title}
                    onError={(e) => { e.target.style.display = "none"; }}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                <div className="ranked-info">
                  <div className="ranked-title">{album.title}</div>
                  <div className="ranked-artist">{album.artist}</div>
                </div>

                <div className="ranked-meta">
                  <StarRating value={album.avg_rating} />
                  <span className="ranked-rating-num">
                    {Number(album.avg_rating || 0).toFixed(1)}
                  </span>
                </div>

                <div className="ranked-reviews">
                  {album.review_count || 0} отзывов
                </div>

                <div className="ranked-arrow">→</div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
