import { useEffect, useState } from "react";
import { getAlbums } from "../services/api";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

function StarRating({ value = 0 }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`star${i <= Math.round(value) ? "" : " empty"}`}>★</span>
      ))}
    </span>
  );
}

function AlbumCard({ album }) {
  return (
    <Link to={`/album/${album.id}`} className="album-card">
      <div className="album-cover">
        <img
          src={album.cover_url}
          alt={album.title}
          onError={(e) => { e.target.style.display = "none"; }}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div className="album-cover-play">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
      </div>
      <div className="album-card-body">
        <div className="album-card-title">{album.title}</div>
        <div className="album-card-artist">{album.artist}</div>
        <div className="album-card-meta">
          <div className="album-card-rating">
            <StarRating value={album.avg_rating} />
            <span>{Number(album.avg_rating || 0).toFixed(1)}</span>
          </div>
          <span className="album-card-reviews">
            {album.review_count || 0} отз.
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [albums, setAlbums] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAlbums()
      .then(res => setAlbums(res.data))
      .finally(() => setLoading(false));
  }, []);

  const dataToShow = results.length ? results : albums;

  return (
    <div className="layout">
      <Topbar setResults={setResults} />
      <Sidebar />

      <main className="main-content">
        <div>
          <h1 className="page-title">
            {results.length ? "Результаты поиска" : "Все альбомы"}
          </h1>
          <p className="page-subtitle">
            {results.length
              ? `Найдено ${results.length} альбомов`
              : `${albums.length} альбомов в библиотеке`}
          </p>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner" />
            Загрузка...
          </div>
        ) : (
          <div>
            <div className="section-header">
              <span className="section-title">
                {results.length ? "Найденные" : "Библиотека"}
              </span>
            </div>
            <div className="albums-grid">
              {dataToShow.map(album => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
