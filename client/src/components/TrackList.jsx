import { useEffect, useState } from "react";
import { getTracks } from "../services/api";

export default function TrackList({ albumId }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    getTracks(albumId)
      .then(res => setTracks(res.data))
      .finally(() => setLoading(false));
  }, [albumId]);

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
          className={`track-row${activeId === track.id ? " active" : ""}`}
          onClick={() => setActiveId(id => id === track.id ? null : track.id)}
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
        </div>
      ))}
    </div>
  );
}
