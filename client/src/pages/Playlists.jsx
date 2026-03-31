import { useState } from "react";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";

const MOCK_PLAYLISTS = [
  { id: 1, name: "Утренний кофе", count: 8, emoji: "☕" },
  { id: 2, name: "В дорогу",      count: 14, emoji: "🚗" },
  { id: 3, name: "Для работы",    count: 6, emoji: "💻" },
];

export default function Playlists() {
  const [playlists, setPlaylists] = useState(MOCK_PLAYLISTS);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const create = () => {
    if (!newName.trim()) return;
    setPlaylists(p => [...p, {
      id: Date.now(),
      name: newName.trim(),
      count: 0,
      emoji: "🎵",
    }]);
    setNewName("");
    setCreating(false);
  };

  const remove = (id) => setPlaylists(p => p.filter(x => x.id !== id));

  return (
    <div className="layout">
      <Topbar />
      <Sidebar />

      <main className="main-content">
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <h1 className="page-title">Плейлисты</h1>
            <p className="page-subtitle">{playlists.length} плейлистов</p>
          </div>
          <button className="btn-play" onClick={() => setCreating(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Новый плейлист
          </button>
        </div>

        {/* Create form */}
        {creating && (
          <div className="pl-create-card">
            <div className="review-form-title">Создать плейлист</div>
            <input
              className="review-textarea"
              style={{ minHeight: "unset", padding: "10px 14px" }}
              placeholder="Название плейлиста..."
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && create()}
              autoFocus
            />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="btn-sec" onClick={() => { setCreating(false); setNewName(""); }}>
                Отмена
              </button>
              <button className="btn-submit" onClick={create} disabled={!newName.trim()}>
                Создать
              </button>
            </div>
          </div>
        )}

        {playlists.length === 0 && !creating ? (
          <div className="empty-state">
            <div className="empty-icon">🎵</div>
            <div className="empty-title">Плейлистов пока нет</div>
            <div className="empty-sub">Создайте первый плейлист и добавьте любимые треки</div>
          </div>
        ) : (
          <div className="pl-grid">
            {playlists.map(pl => (
              <div key={pl.id} className="pl-card">
                <div className="pl-card-cover">{pl.emoji}</div>
                <div className="pl-card-body">
                  <div className="pl-card-name">{pl.name}</div>
                  <div className="pl-card-count">{pl.count} треков</div>
                </div>
                <div className="pl-card-actions">
                  <button className="pl-open-btn">Открыть →</button>
                  <button className="pl-del-btn" onClick={() => remove(pl.id)} title="Удалить">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14H6L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
