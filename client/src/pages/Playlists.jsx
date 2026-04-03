import { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { getPlaylists, createPlaylist, deletePlaylist } from "../services/api";
import { Link } from "react-router-dom";

// Коллаж из обложек треков плейлиста
function PlaylistCoverCollage({ tracks = [] }) {
  const covers = [...new Map(
    (tracks || []).filter(t => t.cover_url).map(t => [t.cover_url, t])
  ).values()].slice(0, 4);

  if (covers.length === 0) {
    return (
      <div className="pl-card-cover">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
          stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
          <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
          <line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/>
          <line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
      </div>
    );
  }

  if (covers.length === 1) {
    return (
      <div className="pl-card-cover" style={{ padding: 0, overflow: "hidden" }}>
        <img src={covers[0].cover_url}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
    );
  }

  return (
    <div className="pl-card-cover pl-card-cover--collage" style={{ padding: 0 }}>
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="pl-collage-cell">
          {covers[i]
            ? <img src={covers[i].cover_url} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            : <div style={{ width: "100%", height: "100%", background: "var(--bg2)" }} />
          }
        </div>
      ))}
    </div>
  );
}

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => getPlaylists().then(res => setPlaylists(res.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await createPlaylist({ name: newName.trim() });
      setNewName("");
      setCreating(false);
      load();
    } finally { setSaving(false); }
  };

  const remove = async (id) => {
    await deletePlaylist(id);
    setPlaylists(p => p.filter(x => x.id !== id));
  };

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
              <button className="btn-submit" onClick={create} disabled={!newName.trim() || saving}>
                {saving ? "Создаём..." : "Создать"}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading"><div className="spinner" /> Загрузка...</div>
        ) : playlists.length === 0 && !creating ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                stroke="var(--text-3)" strokeWidth="1.2" strokeLinecap="round">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </div>
            <div className="empty-title">Плейлистов пока нет</div>
            <div className="empty-sub">Создайте первый плейлист и добавьте любимые треки</div>
          </div>
        ) : (
          <div className="pl-grid">
            {playlists.map(pl => (
              <div key={pl.id} className="pl-card">
                <PlaylistCoverCollage tracks={pl.tracks || []} />
                <div className="pl-card-body">
                  <div className="pl-card-name">{pl.name}</div>
                  <div className="pl-card-count">{pl.tracks_count || 0} треков</div>
                </div>
                <div className="pl-card-actions">
                  <Link to={`/playlists/${pl.id}`} className="pl-open-btn">Открыть →</Link>
                  <button className="pl-del-btn" onClick={() => remove(pl.id)} title="Удалить">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14H6L5 6"/>
                      <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <style>{`
        .pl-card-cover--collage {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
        }
        .pl-collage-cell {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
