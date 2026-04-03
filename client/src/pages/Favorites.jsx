import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { getFavorites, toggleFavorite } from "../services/api";

function StarRating({ value = 0 }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`star${i <= Math.round(value) ? "" : " empty"}`}>★</span>
      ))}
    </span>
  );
}

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFavorites()
      .then(res => setFavorites(res.data))
      .finally(() => setLoading(false));
  }, []);

  const remove = async (albumId) => {
    await toggleFavorite(albumId);
    setFavorites(f => f.filter(a => a.id !== albumId));
  };

  return (
    <div className="layout">
      <Topbar />
      <Sidebar />

      <main className="main-content">
        <div>
          <h1 className="page-title">Избранное</h1>
          <p className="page-subtitle">{favorites.length} сохранённых альбомов</p>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /> Загрузка...</div>
        ) : favorites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                stroke="var(--text-3)" strokeWidth="1.2" strokeLinecap="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <div className="empty-title">Пока ничего нет</div>
            <div className="empty-sub">Добавляйте альбомы в избранное на странице альбома</div>
            <Link to="/" className="btn-play" style={{ display: "inline-flex", marginTop: 8 }}>
              Перейти к альбомам
            </Link>
          </div>
        ) : (
          <div className="fav-grid">
            {favorites.map(album => (
              <div key={album.id} className="fav-card">
                <div className="fav-card-cover">
                  {album.cover_url
                    ? <img src={album.cover_url} alt={album.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                        stroke="var(--text-3)" strokeWidth="1.2">
                        <path d="M9 18V5l12-2v13"/>
                        <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                      </svg>
                  }
                  <button className="fav-remove-btn" onClick={() => remove(album.id)} title="Удалить из избранного">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
                <div className="fav-card-body">
                  <div className="album-card-title">{album.title}</div>
                  <div className="album-card-artist">{album.artist}</div>
                  <div className="album-card-meta">
                    <div className="album-card-rating">
                      <StarRating value={album.avg_rating} />
                      <span>{Number(album.avg_rating || 0).toFixed(1)}</span>
                    </div>
                    <span className="album-card-reviews">{album.review_count} отз.</span>
                  </div>
                  <Link to={`/album/${album.id}`} className="fav-open-btn">Открыть →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
