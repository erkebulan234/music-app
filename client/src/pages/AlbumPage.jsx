import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAlbum, getReviews } from "../services/api";

import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import AlbumHero from "../components/AlbumHero";
import TrackList from "../components/TrackList";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import Player from "../components/Player";
import { isAdmin } from "../utils/auth";
import { getTracks } from "../services/api";

export default function AlbumPage() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [allTracks, setAllTracks] = useState([]);
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [reviews, setReviews] = useState([]);

  const loadAlbum = () => {
    getAlbum(id).then(res => setAlbum(res.data));
  };


  const loadReviews = () => {
    getReviews(id).then(res => setReviews(res.data));
  };

  const handleReviewAdded = () => {
    loadReviews();
    loadAlbum();
  };

  useEffect(() => {
    loadAlbum();
    loadReviews();
    getTracks(id).then(res => setAllTracks(res.data));
  }, [id]);

  if (!album) return (
    <div className="layout">
      <div className="loading" style={{ gridColumn: "1/-1" }}>
        <div className="spinner" /> Загрузка...
      </div>
    </div>
  );

  return (
    <div className="layout">
      <Topbar />
      <Sidebar />
      <main className="main-content" style={{ paddingBottom: 80 }}>
        <AlbumHero
        album={album}
        onPlay={() => {
          if (allTracks.length > 0) {
            setCurrentTrack(allTracks[0]);
            setAllTracks(allTracks);
          }
         }}
        />
        <TrackList
          albumId={id}
          isAdmin={isAdmin()}
          currentTrack={currentTrack}
          onPlay={(track, tracks) => { setCurrentTrack(track); setAllTracks(tracks); }}
        />
        <ReviewForm albumId={id} onReviewAdded={handleReviewAdded} />
        <ReviewList reviews={reviews} />
      </main>
      <Player
        track={currentTrack}
        tracks={allTracks}
        album={album}
        onTrackChange={setCurrentTrack}
      />
    </div>
  );
}

