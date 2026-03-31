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
    if (filter === "rating") return (b.avg_rating || 0) - (a.avg_rating || 0);
    if (filter === "reviews") return (b.review_count || 0) - (a.review_count || 0);
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
            <div className="popular-hero-icon">🔥</div>
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
                  {i < 3 ? ["🥇","🥈","🥉"][i] : String(i + 1).padStart(2, "0")}
                </div>

                <div className="ranked-cover">
                  <img
                    src={`/covers/${album.id}.jpg`}
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
