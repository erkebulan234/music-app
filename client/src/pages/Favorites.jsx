import { useState } from "react";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

// Моковые данные — заменишь на API
const MOCK_FAVORITES = [
  { id: 1, title: "Demon Days", artist: "Gorillaz", avg_rating: 4.8, review_count: 12 },
  { id: 2, title: "OK Computer", artist: "Radiohead", avg_rating: 4.9, review_count: 20 },
  { id: 3, title: "Currents", artist: "Tame Impala", avg_rating: 4.6, review_count: 8 },
];

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
  const [favorites, setFavorites] = useState(MOCK_FAVORITES);

  const remove = (id) => setFavorites(f => f.filter(a => a.id !== id));

  return (
    <div className="layout">
      <Topbar />
      <Sidebar />

      <main className="main-content">
        <div>
          <h1 className="page-title">Избранное</h1>
          <p className="page-subtitle">{favorites.length} сохранённых альбомов</p>
        </div>

        {favorites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">♡</div>
            <div className="empty-title">Пока ничего нет</div>
            <div className="empty-sub">Добавляйте альбомы в избранное, нажимая ♡ на странице альбома</div>
            <Link to="/" className="btn-play" style={{ display: "inline-flex", marginTop: 8 }}>
              Перейти к альбомам
            </Link>
          </div>
        ) : (
          <div className="fav-grid">
            {favorites.map(album => (
              <div key={album.id} className="fav-card">
                <div className="fav-card-cover">
                  <span>🎵</span>
                  <button
                    className="fav-remove-btn"
                    onClick={() => remove(album.id)}
                    title="Удалить из избранного"
                  >
                    ✕
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
                  <Link to={`/album/${album.id}`} className="fav-open-btn">
                    Открыть →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
