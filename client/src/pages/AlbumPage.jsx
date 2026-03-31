import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAlbum, getReviews } from "../services/api";

import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import AlbumHero from "../components/AlbumHero";
import TrackList from "../components/TrackList";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";

export default function AlbumPage() {
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
      <main className="main-content">
        <AlbumHero album={album} />
        <TrackList albumId={id} />
        <ReviewForm albumId={id} onReviewAdded={handleReviewAdded} />
        <ReviewList reviews={reviews} />
      </main>
    </div>
  );
}
