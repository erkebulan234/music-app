import { useState } from "react";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";

const MOCK_REVIEWS = [
  { id: 1, albumTitle: "Demon Days", albumArtist: "Gorillaz", rating: 5, comment: "Абсолютный шедевр." },
  { id: 2, albumTitle: "OK Computer", albumArtist: "Radiohead", rating: 5, comment: "Меняет восприятие музыки." },
  { id: 3, albumTitle: "Currents", albumArtist: "Tame Impala", rating: 4, comment: "Очень атмосферный альбом." },
];

function Stars({ value }) {
  return (
    <span className="review-stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`review-star${i <= value ? "" : " empty"}`}>★</span>
      ))}
    </span>
  );
}

function StatCard({ emoji, value, label }) {
  return (
    <div className="profile-stat-card">
      <div className="profile-stat-emoji">{emoji}</div>
      <div className="profile-stat-value">{value}</div>
      <div className="profile-stat-label">{label}</div>
    </div>
  );
}

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Пользователь");
  const [bio, setBio] = useState("Меломан и ценитель хорошей музыки");
  const [tempName, setTempName] = useState(name);
  const [tempBio, setTempBio] = useState(bio);

  const save = () => {
    setName(tempName);
    setBio(tempBio);
    setEditing(false);
  };

  return (
    <div className="layout">
      <Topbar />
      <Sidebar />

      <main className="main-content">

        {/* Profile card */}
        <div className="profile-card">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              {name[0]?.toUpperCase()}
            </div>
            <div className="profile-avatar-badge">✓</div>
          </div>

          <div className="profile-info">
            {editing ? (
              <div className="profile-edit-form">
                <input
                  className="profile-edit-input"
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  placeholder="Имя"
                />
                <input
                  className="profile-edit-input"
                  value={tempBio}
                  onChange={e => setTempBio(e.target.value)}
                  placeholder="О себе"
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn-sec" onClick={() => setEditing(false)}>Отмена</button>
                  <button className="btn-play" onClick={save}>Сохранить</button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="profile-name">{name}</h1>
                <p className="profile-bio">{bio}</p>
                <button className="btn-sec profile-edit-btn" onClick={() => {
                  setTempName(name); setTempBio(bio); setEditing(true);
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Редактировать
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="profile-stats">
          <StatCard emoji="⭐" value={MOCK_REVIEWS.length} label="Отзывов" />
          <StatCard emoji="♡" value="3" label="Избранных" />
          <StatCard emoji="🎵" value="3" label="Плейлистов" />
          <StatCard emoji="🎧" value="47" label="Прослушано" />
        </div>

        {/* Recent reviews */}
        <div className="reviews-card">
          <div className="reviews-head">
            <span className="reviews-label">Мои отзывы</span>
            <span className="tag">{MOCK_REVIEWS.length}</span>
          </div>

          {MOCK_REVIEWS.map((r, i) => (
            <div className="review-item" key={r.id} style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="review-header">
                <div className="review-avatar" style={{ background: "var(--gold-light)", color: "var(--gold-dark)" }}>
                  {r.albumTitle[0]}
                </div>
                <div className="review-meta">
                  <div className="review-user">{r.albumTitle}
                    <span style={{ fontWeight: 400, color: "var(--text-2)", marginLeft: 6 }}>
                      — {r.albumArtist}
                    </span>
                  </div>
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
