import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import Player from "../components/Player";
import { getPlaylistById, deletePlaylist, getAlbums } from "../services/api";
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });
API.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// ─── Коллаж обложек ───────────────────────────────────────────────────────────
function CoverCollage({ tracks }) {
  const covers = [...new Map(
    tracks.filter(t => t.cover_url).map(t => [t.cover_url, t])
  ).values()].slice(0, 4);

  const base = {
    width: 140, height: 140, borderRadius: 16, flexShrink: 0,
  };

  if (covers.length === 0) {
    return (
      <div style={{
        ...base, background: "var(--bg2)", display: "flex",
        alignItems: "center", justifyContent: "center",
        border: "1px solid var(--border)"
      }}>
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none"
          stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round">
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
      <div style={{ ...base, overflow: "hidden" }}>
        <img src={covers[0].cover_url}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }

  return (
    <div style={{
      ...base, overflow: "hidden", display: "grid",
      gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr"
    }}>
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{ overflow: "hidden", background: "var(--bg2)" }}>
          {covers[i] && (
            <img src={covers[i].cover_url}
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Модалка добавления треков через альбомы ──────────────────────────────────
function AddTracksModal({ playlistId, existingTrackIds, onClose, onAdded }) {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumTracks, setAlbumTracks] = useState([]);
  const [loadingAlbums, setLoadingAlbums] = useState(true);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [adding, setAdding] = useState(new Set());
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAlbums()
      .then(res => setAlbums(res.data || []))
      .finally(() => setLoadingAlbums(false));
  }, []);

  const openAlbum = async (album) => {
    setSelectedAlbum(album);
    setLoadingTracks(true);
    try {
      const res = await API.get(`/albums/${album.id}`);
      setAlbumTracks(res.data.tracks || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTracks(false);
    }
  };

  const addTrack = async (track) => {
    setAdding(prev => new Set(prev).add(track.id));
    try {
      await API.post(`/playlists/${playlistId}/tracks`, { track_id: track.id });
      onAdded();
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(prev => { const s = new Set(prev); s.delete(track.id); return s; });
    }
  };

  const filteredAlbums = albums.filter(a =>
    a.title?.toLowerCase().includes(search.toLowerCase()) ||
    a.artist?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,.6)",
          zIndex: 999, backdropFilter: "blur(4px)"
        }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000, width: "min(680px, 95vw)",
        maxHeight: "80vh", display: "flex", flexDirection: "column",
        background: "var(--bg)", border: "1px solid var(--border)",
        borderRadius: 20, overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,.6)"
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px 16px", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {selectedAlbum && (
              <button
                onClick={() => { setSelectedAlbum(null); setAlbumTracks([]); }}
                style={{
                  background: "var(--bg2)", border: "none", borderRadius: 8,
                  color: "var(--text-2)", cursor: "pointer", padding: "4px 8px",
                  display: "flex", alignItems: "center", gap: 4, fontSize: 13
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Назад
              </button>
            )}
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)" }}>
                {selectedAlbum ? selectedAlbum.title : "Добавить треки"}
              </div>
              {selectedAlbum && (
                <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>
                  {selectedAlbum.artist}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-3)", padding: 4, borderRadius: 6,
              transition: "color .15s"
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--text-1)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-3)"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Search (only on albums list) */}
        {!selectedAlbum && (
          <div style={{ padding: "12px 24px 0", flexShrink: 0 }}>
            <input
              placeholder="Поиск альбомов..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "var(--bg2)", border: "1px solid var(--border)",
                borderRadius: 10, padding: "9px 14px",
                color: "var(--text-1)", fontSize: 14, outline: "none"
              }}
            />
          </div>
        )}

        {/* Content */}
        <div style={{ overflowY: "auto", flex: 1, padding: "12px 24px 20px" }}>
          {/* Albums list */}
          {!selectedAlbum && (
            loadingAlbums ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8,
                color: "var(--text-3)", padding: "20px 0", justifyContent: "center" }}>
                <div className="spinner" /> Загрузка...
              </div>
            ) : filteredAlbums.length === 0 ? (
              <div style={{ color: "var(--text-3)", textAlign: "center", padding: "24px 0" }}>
                Альбомы не найдены
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {filteredAlbums.map(album => (
                  <button
                    key={album.id}
                    onClick={() => openAlbum(album)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      background: "none", border: "none", cursor: "pointer",
                      padding: "8px 10px", borderRadius: 10, textAlign: "left",
                      transition: "background .15s", width: "100%"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg2)"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                  >
                    {album.cover_url ? (
                      <img src={album.cover_url}
                        style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                    ) : (
                      <div style={{
                        width: 44, height: 44, borderRadius: 8, background: "var(--bg2)",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                      }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                          stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round">
                          <circle cx="12" cy="12" r="10"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: "var(--text-1)", fontWeight: 600, fontSize: 14,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {album.title}
                      </div>
                      <div style={{ color: "var(--text-3)", fontSize: 12, marginTop: 2 }}>
                        {album.artist} · {album.tracks_count || 0} треков
                      </div>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                ))}
              </div>
            )
          )}

          {/* Album tracks */}
          {selectedAlbum && (
            loadingTracks ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8,
                color: "var(--text-3)", padding: "20px 0", justifyContent: "center" }}>
                <div className="spinner" /> Загрузка...
              </div>
            ) : albumTracks.length === 0 ? (
              <div style={{ color: "var(--text-3)", textAlign: "center", padding: "24px 0" }}>
                В альбоме нет треков
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {albumTracks.map((track, i) => {
                  const already = existingTrackIds.has(track.id);
                  const isAdding = adding.has(track.id);
                  return (
                    <div key={track.id} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "8px 10px", borderRadius: 10,
                      background: already ? "rgba(255,255,255,.03)" : "none",
                      transition: "background .15s"
                    }}
                      onMouseEnter={e => !already && (e.currentTarget.style.background = "var(--bg2)")}
                      onMouseLeave={e => !already && (e.currentTarget.style.background = "none")}
                    >
                      <span style={{ color: "var(--text-3)", fontSize: 12,
                        width: 22, textAlign: "right", flexShrink: 0 }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {track.cover_url ? (
                        <img src={track.cover_url}
                          style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: 36, height: 36, borderRadius: 6, background: "var(--bg2)",
                          flexShrink: 0 }} />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: already ? "var(--text-3)" : "var(--text-1)",
                          fontSize: 14, fontWeight: 500,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {track.title}
                        </div>
                        {track.duration && (
                          <div style={{ color: "var(--text-3)", fontSize: 11, marginTop: 1 }}>
                            {track.duration}
                          </div>
                        )}
                      </div>
                      {already ? (
                        <span style={{ fontSize: 11, color: "var(--text-3)",
                          background: "var(--bg2)", borderRadius: 6, padding: "3px 8px", flexShrink: 0 }}>
                          В плейлисте
                        </span>
                      ) : (
                        <button
                          onClick={() => addTrack(track)}
                          disabled={isAdding}
                          style={{
                            background: isAdding ? "var(--bg2)" : "var(--gold)",
                            border: "none", borderRadius: 8, cursor: isAdding ? "default" : "pointer",
                            color: isAdding ? "var(--text-3)" : "#1a1408",
                            padding: "5px 12px", fontSize: 12, fontWeight: 700,
                            flexShrink: 0, transition: "all .15s",
                            opacity: isAdding ? .7 : 1
                          }}
                        >
                          {isAdding ? "..." : "+ Добавить"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

// ─── Главная страница плейлиста ────────────────────────────────────────────────
export default function PlaylistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [allTracks, setAllTracks] = useState([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const load = () => {
    getPlaylistById(id)
      .then(res => {
        setPlaylist(res.data);
        setAllTracks(res.data.tracks || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const handleDelete = async () => {
    if (!confirm("Удалить плейлист?")) return;
    await deletePlaylist(id);
    navigate("/playlists");
  };

  const handleRemoveTrack = async (trackId) => {
    if (!confirm("Убрать трек из плейлиста?")) return;
    try {
      await API.delete(`/playlists/${id}/tracks/${trackId}`);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  // Shuffle: перемешивает список треков для плеера
  const handleShuffle = () => {
    if (!playlist) return;
    const tracks = playlist.tracks || [];
    if (!isShuffled) {
      const shuffled = [...tracks].sort(() => Math.random() - 0.5);
      setAllTracks(shuffled);
      setCurrentTrack(shuffled[0]);
      setIsShuffled(true);
    } else {
      setAllTracks(tracks);
      setCurrentTrack(null);
      setIsShuffled(false);
    }
  };

  // Слушать по порядку
  const handlePlay = () => {
    const tracks = playlist?.tracks || [];
    if (tracks.length === 0) return;
    setAllTracks(tracks);
    setCurrentTrack(tracks[0]);
    setIsShuffled(false);
  };

  if (loading) return (
    <div className="layout">
      <div className="loading" style={{ gridColumn: "1/-1" }}>
        <div className="spinner" /> Загрузка...
      </div>
    </div>
  );

  const tracks = playlist.tracks || [];
  const existingTrackIds = new Set(tracks.map(t => t.id));

  return (
    <div className="layout">
      <Topbar />
      <Sidebar />

      <main className="main-content" style={{ paddingBottom: 80 }}>
        {/* Шапка */}
        <div className="album-hero">
          <CoverCollage tracks={tracks} />
          <div className="hero-info">
            <div className="hero-eyebrow">Плейлист</div>
            <h1 className="hero-title">{playlist.name}</h1>
            <div className="hero-artist">{tracks.length} треков</div>
            <div className="hero-actions" style={{ flexWrap: "wrap", gap: 8 }}>
              {/* Слушать */}
              {tracks.length > 0 && (
                <button className="btn-play" onClick={handlePlay}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  Слушать
                </button>
              )}

              {/* Shuffle */}
              {tracks.length > 0 && (
                <button
                  onClick={handleShuffle}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "9px 18px", borderRadius: 100, fontSize: 13, fontWeight: 600,
                    cursor: "pointer", transition: "all .18s",
                    background: isShuffled ? "var(--gold)" : "transparent",
                    border: `1.5px solid ${isShuffled ? "var(--gold)" : "var(--border)"}`,
                    color: isShuffled ? "#1a1408" : "var(--text-2)",
                  }}
                  onMouseEnter={e => { if (!isShuffled) e.currentTarget.style.borderColor = "var(--gold)"; }}
                  onMouseLeave={e => { if (!isShuffled) e.currentTarget.style.borderColor = "var(--border)"; }}
                >
                  {/* Shuffle icon */}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 3 21 3 21 8"/>
                    <line x1="4" y1="20" x2="21" y2="3"/>
                    <polyline points="21 16 21 21 16 21"/>
                    <line x1="15" y1="15" x2="21" y2="21"/>
                    <line x1="4" y1="4" x2="9" y2="9"/>
                  </svg>
                  {isShuffled ? "Перемешано" : "Перемешать"}
                </button>
              )}

              {/* Добавить треки */}
              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "9px 18px", borderRadius: 100, fontSize: 13, fontWeight: 600,
                  cursor: "pointer", transition: "all .18s",
                  background: "transparent",
                  border: "1.5px solid var(--border)",
                  color: "var(--text-2)",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-2)"; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Добавить треки
              </button>

              {/* Удалить плейлист */}
              <button className="btn-sec" onClick={handleDelete}
                style={{ color: "var(--red)", borderColor: "var(--red)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14H6L5 6"/>
                  <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
                </svg>
                Удалить плейлист
              </button>
            </div>
          </div>
        </div>

        {/* Треки */}
        <div className="tracklist-card" style={{ overflow: "visible" }}>
          <div className="tracklist-head">
            <span className="tracklist-label">Треки</span>
            <span className="tracklist-count">{tracks.length} треков</span>
          </div>
          {tracks.length === 0 ? (
            <div className="reviews-empty" style={{ display: "flex", flexDirection: "column",
              alignItems: "center", gap: 12, padding: "32px 0" }}>
              <div style={{ color: "var(--text-3)", textAlign: "center" }}>
                В плейлисте пока нет треков
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-play"
                style={{ fontSize: 13 }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Добавить треки
              </button>
            </div>
          ) : tracks.map((track, i) => (
            <div
              key={track.id}
              className={`track-row${currentTrack?.id === track.id ? " active" : ""}`}
              onClick={() => { setCurrentTrack(track); setAllTracks(tracks); }}
            >
              <div className="track-index">
                <span className="track-num-text">{String(i + 1).padStart(2, "0")}</span>
                <div className="playing-bars"><span/><span/><span/></div>
              </div>
              {/* Обложка трека */}
              {track.cover_url ? (
                <img src={track.cover_url}
                  style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
              ) : (
                <div style={{ width: 36, height: 36, borderRadius: 6, background: "var(--bg2)", flexShrink: 0 }} />
              )}
              <div className="track-info">
                <div className="track-title">{track.title}</div>
                {track.album_title && (
                  <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>
                    {track.album_title}
                  </div>
                )}
              </div>
              <span className="track-dur">{track.duration}</span>
              <button
                onClick={(e) => { e.stopPropagation(); handleRemoveTrack(track.id); }}
                style={{ background: "none", border: "none", cursor: "pointer",
                  color: "var(--text-3)", padding: 4, transition: "color .15s" }}
                title="Убрать из плейлиста"
                onMouseEnter={e => e.currentTarget.style.color = "var(--red)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--text-3)"}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </main>

      <Player
        track={currentTrack}
        tracks={allTracks}
        album={currentTrack ? { cover_url: currentTrack.cover_url, title: currentTrack.album_title, artist: currentTrack.artist } : null}
        onTrackChange={setCurrentTrack}
      />

      {/* Модалка добавления треков */}
      {showAddModal && (
        <AddTracksModal
          playlistId={id}
          existingTrackIds={existingTrackIds}
          onClose={() => setShowAddModal(false)}
          onAdded={() => { load(); }}
        />
      )}
    </div>
  );
}
