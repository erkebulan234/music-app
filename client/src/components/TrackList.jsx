import { useEffect, useState } from "react";
import { getTracks } from "../services/api";

export default function TrackList({ albumId }) {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    getTracks(albumId).then(res => setTracks(res.data));
  }, [albumId]);

  return (
    <div className="tracklist">
      <h2>Треки</h2>

      {tracks.map((track, index) => (
        <div key={track.id} className="track">
          <span>{index + 1}.</span>
          <span>{track.title}</span>
          <span>{track.duration}</span>
        </div>
      ))}
    </div>
  );
}