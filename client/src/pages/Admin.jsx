import { useState, useEffect } from "react";
import { createAlbum, getAlbums, deleteAlbum, addTrack, getTracks, deleteTrack } from "../services/api";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });
API.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default function Admin() {
  const [form, setForm] = useState({ title: "", artist: "", year: "" });
  const [cover, setCover] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [trackForm, setTrackForm] = useState({ title: "", duration: "" });
  const [audioFile, setAudioFile] = useState(null);

  // Отзывы
  const [allReviews, setAllReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null); // { id, rating, comment }
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const loadAlbums = () => getAlbums().then(res => setAlbums(res.data));

  const loadAllReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await API.get("/reviews/admin/all");
      setAllReviews(res.data);
    } catch (e) {
      console.error("Ошибка загрузки отзывов:", e);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    loadAlbums();
    loadAllReviews();
  }, []);

  useEffect(() => {
    if (selectedAlbum) {
      getTracks(selectedAlbum.id).then(res => setTracks(res.data));
    }
  }, [selectedAlbum]);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleFile = (e) => {
    const file = e.target.files[0];
    setCover(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.artist || !form.year) { setError("Заполните все поля"); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("artist", form.artist);
      fd.append("year", form.year);
      if (cover) fd.append("cover", cover);
      await createAlbum(fd);
      setSuccess("Альбом добавлен!");
      setForm({ title: "", artist: "", year: "" });
      setCover(null); setPreview(null);
      loadAlbums();
    } catch (e) {
      setError(e?.response?.data?.error || "Ошибка");
    } finally { setLoading(false); }
  };

  const handleDeleteAlbum = async (id) => {
    if (!confirm("Удалить альбом?")) return;
    await deleteAlbum(id);
    if (selectedAlbum?.id === id) setSelectedAlbum(null);
    loadAlbums();
  };

  const handleAddTrack = async () => {
    if (!trackForm.title || !selectedAlbum) return;
    const fd = new FormData();
    fd.append("albumId", selectedAlbum.id);
    fd.append("title", trackForm.title);
    fd.append("duration", trackForm.duration);
    if (audioFile) fd.append("audio", audioFile);
    await addTrack(fd);
    setTrackForm({ title: "", duration: "" });
    setAudioFile(null);
    getTracks(selectedAlbum.id).then(res => setTracks(res.data));
  };

  const handleDeleteTrack = async (id) => {
    if (!confirm("Удалить трек?")) return;
    await deleteTrack(id);
    getTracks(selectedAlbum.id).then(res => setTracks(res.data));
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Удалить отзыв?")) return;
    try {
      await API.delete(`/reviews/${reviewId}`);
      loadAllReviews();
    } catch (e) {
      console.error("Ошибка удаления отзыва:", e);
    }
  };

  const handleSaveReview = async () => {
    if (!editingReview) return;
    try {
      await API.put(`/reviews/${editingReview.id}`, {
        rating: editingReview.rating,
        comment: editingReview.comment,
      });
      setEditingReview(null);
      loadAllReviews();
    } catch (e) {
      console.error("Ошибка сохранения отзыва:", e);
    }
  };

  const starStyle = (filled) => ({
    cursor: "pointer", fontSize: 18,
    color: filled ? "var(--gold)" : "var(--text-3)",
    transition: "color .1s"
  });

  return (
    <div className="layout">
      <Topbar />
      <Sidebar />
      <main className="main-content">
        <h1 className="page-title">Админ-панель</h1>

        {/* Добавить альбом */}
        <div className="auth-card" style={{ maxWidth: 480, marginBottom: 32 }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 16 }}>Добавить альбом</div>

          <label style={{ cursor: "pointer", display: "block", marginBottom: 16 }}>
            <div style={{
              width: "100%", height: 160, borderRadius: 12,
              background: "var(--card-bg)", border: "2px dashed var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
            }}>
              {preview
                ? <img src={preview} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ color: "var(--text-muted)" }}>Нажмите чтобы загрузить обложку</span>}
            </div>
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
          </label>

          <div className="auth-field">
            <label className="auth-label">Название</label>
            <input className="auth-input" name="title" placeholder="Midnight Drift" value={form.title} onChange={handleChange} />
          </div>
          <div className="auth-field">
            <label className="auth-label">Артист</label>
            <input className="auth-input" name="artist" placeholder="Luna Park" value={form.artist} onChange={handleChange} />
          </div>
          <div className="auth-field">
            <label className="auth-label">Год</label>
            <input className="auth-input" name="year" type="number" placeholder="2024" value={form.year} onChange={handleChange} />
          </div>

          {error && <div className="auth-error">{error}</div>}
          {success && <div style={{ color: "green", marginBottom: 12 }}>{success}</div>}
          <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Добавляем..." : "Добавить альбом"}
          </button>
        </div>

        {/* Список альбомов */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>Альбомы</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {albums.map(album => (
              <div key={album.id} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 16px", borderRadius: 10, background: "var(--card-bg)",
                border: selectedAlbum?.id === album.id ? "1.5px solid var(--accent)" : "1.5px solid var(--border)"
              }}>
                <img src={album.cover_url || "/covers/default.jpg"}
                  onError={e => e.target.style.display = "none"}
                  style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{album.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{album.artist} · {album.year}</div>
                </div>
                <button className="btn-sec" style={{ fontSize: 12, padding: "4px 10px" }}
                  onClick={() => setSelectedAlbum(album)}>
                  Треки
                </button>
                <button onClick={() => handleDeleteAlbum(album.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--red)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Треки выбранного альбома */}
        {selectedAlbum && (
          <div className="auth-card" style={{ maxWidth: 480, marginBottom: 32 }}>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 16 }}>
              Треки — {selectedAlbum.title}
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <input className="auth-input" style={{ flex: 2, minWidth: 120 }}
                placeholder="Название трека" value={trackForm.title}
                onChange={e => setTrackForm(f => ({ ...f, title: e.target.value }))} />
              <input className="auth-input" style={{ flex: 1, minWidth: 70 }}
                placeholder="3:45" value={trackForm.duration}
                onChange={e => setTrackForm(f => ({ ...f, duration: e.target.value }))} />
              <label style={{
                display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
                padding: "8px 12px", borderRadius: 8, border: "1.5px dashed var(--border)",
                fontSize: 13, color: audioFile ? "var(--accent)" : "var(--text-muted)"
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <path d="M9 18V5l12-2v13"/>
                  <circle cx="6" cy="18" r="3"/>
                  <circle cx="18" cy="16" r="3"/>
                </svg>
                {audioFile ? audioFile.name : "mp3"}
                <input type="file" accept="audio/*" style={{ display: "none" }}
                  onChange={e => setAudioFile(e.target.files[0])} />
              </label>
              <button className="btn-play" onClick={handleAddTrack}>+ Добавить</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {tracks.length === 0
                ? <div style={{ color: "var(--text-muted)", fontSize: 14 }}>Треков нет</div>
                : tracks.map(track => (
                  <div key={track.id} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 12px", borderRadius: 8, background: "var(--card-bg)"
                  }}>
                    <span style={{ color: "var(--text-muted)", fontSize: 13, minWidth: 20 }}>
                      {track.track_number}
                    </span>
                    <span style={{ flex: 1 }}>{track.title}</span>
                    <span style={{ color: "var(--text-muted)", fontSize: 13 }}>{track.duration}</span>
                    <button onClick={() => handleDeleteTrack(track.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--red)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                        <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ======= Управление отзывами ======= */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>
            Отзывы
            <span style={{ marginLeft: 8, fontSize: 13, color: "var(--text-muted)", fontWeight: 400 }}>
              ({allReviews.length})
            </span>
          </div>

          {reviewsLoading ? (
            <div className="loading"><div className="spinner" /> Загрузка отзывов...</div>
          ) : allReviews.length === 0 ? (
            <div style={{ color: "var(--text-muted)", fontSize: 14 }}>Отзывов пока нет</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {allReviews.map(review => (
                <div key={review.id} style={{
                  padding: "14px 16px", borderRadius: 12, background: "var(--card-bg)",
                  border: "1.5px solid var(--border)"
                }}>
                  {editingReview?.id === review.id ? (
                    // Режим редактирования
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 13, color: "var(--text-muted)", marginRight: 6 }}>Оценка:</span>
                        {[1, 2, 3, 4, 5].map(star => (
                          <span
                            key={star}
                            style={starStyle(star <= editingReview.rating)}
                            onClick={() => setEditingReview(r => ({ ...r, rating: star }))}
                          >★</span>
                        ))}
                      </div>
                      <textarea
                        value={editingReview.comment}
                        onChange={e => setEditingReview(r => ({ ...r, comment: e.target.value }))}
                        rows={3}
                        style={{
                          width: "100%", padding: "10px 12px", borderRadius: 8,
                          border: "1.5px solid var(--border)", background: "var(--bg2)",
                          color: "var(--text-1)", fontSize: 13, resize: "vertical",
                          fontFamily: "inherit", boxSizing: "border-box"
                        }}
                      />
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button className="btn-sec" style={{ fontSize: 12, padding: "5px 12px" }}
                          onClick={() => setEditingReview(null)}>
                          Отмена
                        </button>
                        <button className="btn-play" style={{ fontSize: 12, padding: "5px 14px" }}
                          onClick={handleSaveReview}>
                          Сохранить
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Режим просмотра
                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>
                            {review.username || review.user_name || "Пользователь"}
                          </span>
                          <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
                            · {review.album_title || `Альбом #${review.album_id}`}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ color: "var(--gold)", fontSize: 13 }}>
                            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                          </span>
                          {/* Кнопка редактировать */}
                          <button
                            onClick={() => setEditingReview({ id: review.id, rating: review.rating, comment: review.comment })}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: 4 }}
                            title="Редактировать"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          {/* Кнопка удалить */}
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--red)", padding: 4 }}
                            title="Удалить"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                              <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div style={{ fontSize: 13, color: "var(--text-2)" }}>{review.comment}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
