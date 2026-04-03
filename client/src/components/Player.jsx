import { useEffect, useRef, useState } from "react";
import { getPlaylists, addTrackToPlaylist } from "../services/api";

const btnStyle = {
  background: "none", border: "none", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  padding: 4, borderRadius: 6, transition: "opacity 0.15s"
};

const sliderCSS = `
.player-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  background: transparent;
}
.player-slider::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: 2px;
}
.player-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px; height: 12px;
  border-radius: 50%;
  background: var(--text-1);
  margin-top: -4px;
  cursor: pointer;
  transition: transform 0.15s;
}
.player-slider:hover::-webkit-slider-thumb { transform: scale(1.3); }
.player-slider::-moz-range-track { height: 4px; border-radius: 2px; }
.player-slider::-moz-range-thumb {
  width: 12px; height: 12px;
  border-radius: 50%;
  background: var(--text-1);
  border: none; cursor: pointer;
}
.player-modal-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(24,22,15,0.55);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
}
.player-modal {
  width: 400px; max-width: 95vw;
  background: var(--surface);
  border-radius: 24px;
  padding: 36px 32px 32px;
  display: flex; flex-direction: column; align-items: center; gap: 24px;
  box-shadow: 0 32px 80px rgba(24,22,15,0.2);
  position: relative;
}
.pl-dropdown {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  z-index: 300;
  min-width: 200px;
  overflow: hidden;
}
.pl-dropdown-header {
  padding: 8px 14px 6px;
  font-size: 10px; font-weight: 700; letter-spacing: 1.2px;
  text-transform: uppercase; color: var(--text-3);
  border-bottom: 1px solid var(--border);
}
.pl-dropdown-item {
  display: flex; align-items: center; gap: 10px;
  width: 100%; padding: 10px 14px;
  background: none; border: none; cursor: pointer;
  color: var(--text-1); font-size: 13px;
  text-align: left; transition: background .15s;
}
.pl-dropdown-item:hover { background: var(--bg); }
.pl-dropdown-item.added { color: var(--gold); }
`;

function Controls({ playing, onToggle, onPrev, onNext, shuffle, onShuffle }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <button style={{ ...btnStyle, color: shuffle ? "var(--gold)" : "var(--text-3)" }} onClick={onShuffle}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="16 3 21 3 21 8"/>
          <line x1="4" y1="20" x2="21" y2="3"/>
          <polyline points="21 16 21 21 16 21"/>
          <line x1="15" y1="15" x2="21" y2="21"/>
        </svg>
      </button>

      <button style={{ ...btnStyle, color: "var(--text-2)" }} onClick={onPrev}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="19 20 9 12 19 4 19 20"/>
          <line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </button>

      <button onClick={onToggle} style={{
        width: 44, height: 44, borderRadius: "50%",
        background: "var(--text-1)", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--bg)", flexShrink: 0,
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)"
      }}>
        {playing
          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6 3 20 12 6 21 6 3"/>
            </svg>
        }
      </button>

      <button style={{ ...btnStyle, color: "var(--text-2)" }} onClick={onNext}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 4 15 12 5 20 5 4"/>
          <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

export default function Player({ track, tracks, album, onTrackChange }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [shuffle, setShuffle] = useState(false);
  const [modal, setModal] = useState(false);
  const [plDropdown, setPlDropdown] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [addedPl, setAddedPl] = useState({});
  const plBtnRef = useRef(null);

  useEffect(() => {
    if (!track?.audio_url) return;
    const audio = audioRef.current;
    audio.src = track.audio_url;
    audio.volume = volume;
    audio.play().then(() => setPlaying(true)).catch(() => {});
  }, [track]);

  useEffect(() => {
    if (plDropdown) {
     getPlaylists()
      .then(res => {
        const unique = [...new Map(res.data.map(p => [p.id, p])).values()];
        setPlaylists(unique);
      })
      .catch(() => {});
   }
  }, [plDropdown]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play(); setPlaying(true); }
  };

  const handleTimeUpdate = () => {
    const a = audioRef.current;
    setCurrentTime(a.currentTime);
    setDuration(a.duration || 0);
  };

  const handleSeek = (e) => {
    const a = audioRef.current;
    a.currentTime = (e.target.value / 100) * duration;
    setCurrentTime(a.currentTime);
  };

  const handleVolume = (e) => {
    const v = e.target.value / 100;
    setVolume(v);
    audioRef.current.volume = v;
  };

  const handleNext = () => {
    if (!tracks?.length) return;
    const idx = tracks.findIndex(t => t.id === track.id);
    const next = shuffle
      ? Math.floor(Math.random() * tracks.length)
      : (idx + 1) % tracks.length;
    onTrackChange(tracks[next]);
  };

  const handlePrev = () => {
    if (!tracks?.length) return;
    const idx = tracks.findIndex(t => t.id === track.id);
    onTrackChange(tracks[(idx - 1 + tracks.length) % tracks.length]);
  };

  const handleAddToPlaylist = async (e, playlistId) => {
    e.stopPropagation();
    if (!track) return;
    try {
      await addTrackToPlaylist(playlistId, track.id);
      setAddedPl(a => ({ ...a, [playlistId]: true }));
      setTimeout(() => setAddedPl(a => ({ ...a, [playlistId]: false })), 2000);
    } catch (err) {
      console.error("Ошибка:", err);
    }
    setPlDropdown(false);
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  };

  const progressVal = duration ? (currentTime / duration) * 100 : 0;
  const progressStyle = (val) => `linear-gradient(to right, var(--text-1) ${val}%, var(--border) ${val}%)`;
  const coverUrl = track?.cover_url || album?.cover_url || null;

  const Cover = ({ size, radius }) => (
    <div style={{
      width: size, height: size, borderRadius: radius, flexShrink: 0,
      background: "var(--bg2)", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
      border: "1px solid var(--border)",
    }}>
      {coverUrl
        ? <img src={coverUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <svg width={size * 0.35} height={size * 0.35} viewBox="0 0 24 24" fill="none"
            stroke="var(--text-3)" strokeWidth="1.5">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
          </svg>
      }
    </div>
  );

  if (!track) return null;

  return (
    <>
      <style>{sliderCSS}</style>
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={handleNext} />

      {/* ── ПЛЕЕР ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 220, right: 0, zIndex: 100,
        background: "rgba(15,15,15,0.92)",
        backdropFilter: "blur(24px)",
        borderTop: "1px solid var(--border)",
        height: 72,
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        padding: "0 24px",
        gap: 16,
        boxShadow: "0 -8px 32px rgba(0,0,0,0.3)"
      }}>

        {/* Левая колонка — обложка + название + кнопка плейлиста */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <div onClick={() => setModal(true)} style={{ cursor: "pointer", flexShrink: 0 }}>
            <Cover size={44} radius={8} />
          </div>
          <div onClick={() => setModal(true)} style={{ cursor: "pointer", minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {track.title}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 1 }}>
              {album?.artist || ""}
            </div>
          </div>

          {/* Кнопка + плейлист */}
          <div style={{ position: "relative", flexShrink: 0 }} ref={plBtnRef}>
            <button
              onClick={(e) => { e.stopPropagation(); setPlDropdown(v => !v); }}
              style={{
                ...btnStyle,
                color: plDropdown ? "var(--gold)" : "var(--text-3)",
                border: "1px solid var(--border)",
                borderRadius: 8, padding: "5px 8px"
              }}
              title="Добавить в плейлист"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>

            {plDropdown && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 299 }} onClick={() => setPlDropdown(false)} />
                <div className="pl-dropdown">
                  <div className="pl-dropdown-header">Добавить в плейлист</div>
                  {playlists.length === 0
                    ? <div style={{ padding: "12px 14px", fontSize: 13, color: "var(--text-3)" }}>Нет плейлистов</div>
                    : playlists.map(pl => (
                      <button key={pl.id}
                        className={`pl-dropdown-item${addedPl[pl.id] ? " added" : ""}`}
                        onClick={(e) => handleAddToPlaylist(e, pl.id)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          {addedPl[pl.id]
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
                    ))
                  }
                </div>
              </>
            )}
          </div>
        </div>

        {/* Центр — кнопки + прогресс */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 400 }}>
          <Controls playing={playing} onToggle={togglePlay}
            onPrev={handlePrev} onNext={handleNext}
            shuffle={shuffle} onShuffle={() => setShuffle(s => !s)} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
            <span style={{ fontSize: 11, color: "var(--text-3)", flexShrink: 0, minWidth: 32, textAlign: "right" }}>
              {fmt(currentTime)}
            </span>
            <input type="range" min="0" max="100" value={progressVal}
              onChange={handleSeek} className="player-slider"
              style={{ flex: 1, background: progressStyle(progressVal) }} />
            <span style={{ fontSize: 11, color: "var(--text-3)", flexShrink: 0, minWidth: 32 }}>
              {fmt(duration)}
            </span>
          </div>
        </div>

        {/* Правая колонка — громкость */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            {volume > 0 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>}
            {volume > 0.5 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>}
          </svg>
          <input type="range" min="0" max="100" value={Math.round(volume * 100)}
            onChange={handleVolume} className="player-slider"
            style={{ width: 80, background: progressStyle(volume * 100) }} />
        </div>
      </div>

      {/* ── МОДАЛЬНОЕ ОКНО ── */}
      {modal && (
        <div className="player-modal-overlay" onClick={() => setModal(false)}>
          <div className="player-modal" onClick={e => e.stopPropagation()}>
            <button onClick={() => setModal(false)} style={{
              position: "absolute", top: 16, right: 16,
              ...btnStyle, color: "var(--text-3)"
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <Cover size={220} radius={16} />

            <div style={{ textAlign: "center", width: "100%" }}>
              <div style={{ fontWeight: 700, fontSize: 20 }}>{track.title}</div>
              <div style={{ color: "var(--text-3)", fontSize: 13, marginTop: 4 }}>
                {album?.title} · {album?.artist}
              </div>
            </div>

            <div style={{ width: "100%" }}>
              <input type="range" min="0" max="100" value={progressVal}
                onChange={handleSeek} className="player-slider"
                style={{ width: "100%", background: progressStyle(progressVal) }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-3)", marginTop: 6 }}>
                <span>{fmt(currentTime)}</span>
                <span>{fmt(duration)}</span>
              </div>
            </div>

            <Controls playing={playing} onToggle={togglePlay}
              onPrev={handlePrev} onNext={handleNext}
              shuffle={shuffle} onShuffle={() => setShuffle(s => !s)} />

            <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              </svg>
              <input type="range" min="0" max="100" value={Math.round(volume * 100)}
                onChange={handleVolume} className="player-slider"
                style={{ flex: 1, background: progressStyle(volume * 100) }} />
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
            </div>
          </div>
        </div>
      )}
    </>
  );
}