import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { getUserReviews, getFavorites, getPlaylists } from "../services/api";
import { getUser } from "../utils/auth";

function Stars({ value }) {
  return (
    <span className="review-stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`review-star${i <= value ? "" : " empty"}`}>★</span>
      ))}
    </span>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="profile-stat-card">
      <div className="profile-stat-emoji">{icon}</div>
      <div className="profile-stat-value">{value}</div>
      <div className="profile-stat-label">{label}</div>
    </div>
  );
}

export default function Profile() {
  const user = getUser();
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getUserReviews(),
      getFavorites(),
      getPlaylists()
    ]).then(([r, f, p]) => {
      setReviews(r.data);
      setFavorites(f.data);
      setPlaylists(p.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="layout">
      <Topbar />
      <Sidebar />

      <main className="main-content">

        {/* Profile card */}
        <div className="profile-card">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="profile-avatar-badge">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          </div>

          <div className="profile-info">
            <h1 className="profile-name">{user?.name || "Пользователь"}</h1>
            <p className="profile-bio">{user?.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="profile-stats">
          <StatCard
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
            value={loading ? "—" : reviews.length}
            label="Отзывов"
          />
          <StatCard
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>}
            value={loading ? "—" : favorites.length}
            label="Избранных"
          />
          <StatCard
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>}
            value={loading ? "—" : playlists.length}
            label="Плейлистов"
          />
          <StatCard
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>}
            value={loading ? "—" : reviews.reduce((acc, r) => acc + 1, 0)}
            label="Прослушано"
          />
        </div>

        {/* Reviews */}
        <div className="reviews-card">
          <div className="reviews-head">
            <span className="reviews-label">Мои отзывы</span>
            <span className="tag">{reviews.length}</span>
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" /> Загрузка...</div>
          ) : reviews.length === 0 ? (
            <div className="reviews-empty">Вы ещё не оставляли отзывов</div>
          ) : reviews.map((r, i) => (
            <div className="review-item" key={r.id} style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="review-header">
                <div style={{
                  width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                  overflow: "hidden", background: "var(--bg2)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {r.cover_url
                    ? <img src={r.cover_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="1.5">
                        <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                      </svg>
                  }
                </div>
                <div className="review-meta">
                  <Link to={`/album/${r.album_id}`} className="review-user" style={{ transition: "color .15s" }}>
                    {r.album_title}
                    <span style={{ fontWeight: 400, color: "var(--text-2)", marginLeft: 6 }}>
                      — {r.artist}
                    </span>
                  </Link>
                  <Stars value={r.rating} />
                </div>
              </div>
              {r.comment && <p className="review-text">{r.comment}</p>}
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
