import { useEffect, useState } from "react";
import { getTracks, deleteTrack, getPlaylists, addTrackToPlaylist } from "../services/api";

export default function TrackList({ albumId, isAdmin = false, onPlay, currentTrack }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [menuTrackId, setMenuTrackId] = useState(null);
  const [added, setAdded] = useState({});

  const loadTracks = () => {
    getTracks(albumId)
      .then(res => setTracks(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTracks();
    getPlaylists().then(res => setPlaylists(res.data));
  }, [albumId]);

 const handleAddToPlaylist = async (e, playlistId, trackId) => {
    e.stopPropagation();
    try {
    await addTrackToPlaylist(playlistId, trackId);
    setAdded(a => ({ ...a, [`${playlistId}-${trackId}`]: true }));
    setMenuTrackId(null); // закрываем меню сразу
    setTimeout(() => {
      setAdded(a => ({ ...a, [`${playlistId}-${trackId}`]: false }));
    }, 2000);
  } catch (err) {
    console.error("Ошибка добавления в плейлист:", err);
    setMenuTrackId(null);
   } 
 };

  if (loading) return (
    <div className="loading"><div className="spinner" /> Загрузка треков...</div>
  );

  return (
    <div className="tracklist-card">
      <div className="tracklist-head">
        <span className="tracklist-label">Треки</span>
        <span className="tracklist-count">{tracks.length} треков</span>
      </div>

      {tracks.map((track, i) => (
        <div
          key={track.id}
          className={`track-row${currentTrack?.id === track.id ? " active" : ""}`}
          onClick={() => onPlay && onPlay(track, tracks)}
          style={{ position: "relative" }}
        >
          <div className="track-index">
            <span className="track-num-text">{String(i + 1).padStart(2, "0")}</span>
            <div className="playing-bars">
              <span /><span /><span />
            </div>
          </div>

          <div className="track-info">
            <div className="track-title">{track.title}</div>
          </div>

          <span className="track-dur">{track.duration}</span>

          {/* Кнопка добавить в плейлист */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuTrackId(id => id === track.id ? null : track.id);
            }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: menuTrackId === track.id ? "var(--gold)" : "var(--text-3)",
              marginLeft: 4, padding: "4px",
              transition: "color .15s"
            }}
            title="Добавить в плейлист"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>

          {console.log("menuTrackId:", menuTrackId, "track.id:", track.id, "equal:", menuTrackId === track.id)}
          {/* Dropdown меню плейлистов */}
          {menuTrackId === track.id && (
            <>
              {/* Оверлей для закрытия по клику вне меню */}
              <div
                style={{ position: "fixed", inset: 0, zIndex: 49 }}
                onClick={(e) => { e.stopPropagation(); setMenuTrackId(null); e.preventDefault(); }}
                onMouseDown={(e) => e.stopPropagation()}
              />
              <div style={{
                position: "absolute", right: 8, top: "calc(100% + 4px)",
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.25)", zIndex: 50,
                minWidth: 200, overflow: "visible"
              }}>
                <div style={{
                  padding: "8px 14px 6px",
                  fontSize: 10, fontWeight: 700, letterSpacing: 1.2,
                  textTransform: "uppercase", color: "var(--text-3)",
                  borderBottom: "1px solid var(--border)"
                }}>
                  Добавить в плейлист
                </div>
                {playlists.length === 0 ? (
                  <div style={{ padding: "12px 14px", fontSize: 13, color: "var(--text-3)" }}>
                    Нет плейлистов
                  </div>
                ) : playlists.map(pl => {
                  const key = `${pl.id}-${track.id}`;
                  return (
                    <button
                      key={pl.id}
                      onClick={(e) => handleAddToPlaylist(e, pl.id, track.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        width: "100%", padding: "10px 14px",
                        background: added[key] ? "rgba(var(--gold-rgb, 180,140,60),0.12)" : "none",
                        border: "none", cursor: "pointer",
                        color: added[key] ? "var(--gold)" : "var(--text-1)",
                        fontSize: 13, textAlign: "left", transition: "background .15s"
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        {added[key]
                          ? <polyline points="20 6 9 17 4 12"/>
                          : <>
                              <line x1="8" y1="6" x2="21" y2="6"/>
                              <line x1="8" y1="12" x2="21" y2="12"/>
                              <line x1="8" y1="18" x2="21" y2="18"/>
                              <line x1="3" y1="6" x2="3.01" y2="6"/>
                              <line x1="3" y1="12" x2="3.01" y2="12"/>
                              <line x1="3" y1="18" x2="3.01" y2="18"/>
                            </>
                        }
                      </svg>
                      {pl.name}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Кнопка удаления — только в AdminPanel, здесь скрыта намеренно */}
        </div>
      ))}
    </div>
  );
}
