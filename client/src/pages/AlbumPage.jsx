import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";
import AlbumHero from "../components/AlbumHero";
import TrackList from "../components/TrackList";


import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAlbum, getReviews } from "../services/api";

export default function AlbumPage({ setResults }) {
  const { id } = useParams();

  const [album, setAlbum] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getAlbum(id).then(res => setAlbum(res.data));
    getReviews(id).then(res => setReviews(res.data));
  }, [id]);

  if (!album) return <p>Загрузка...</p>;

  return (
    <div>
      <Topbar setResults={setResults} />

      <div className="body">
        <Sidebar />

        <div className="main">
          <AlbumHero album={album} />

          <TrackList albumId={id} />

          <ReviewForm albumId={id} />

          <h2>Отзывы</h2>
          <ReviewList reviews={reviews} />
        </div>
      </div>
    </div>
  );
}