import { useEffect, useState } from "react";
import { getAlbums } from "../services/api";
import Topbar from "../components/Topbar";
import { Link } from "react-router-dom";


export default function Home() {
  const [albums, setAlbums] = useState([]);
  const [results, setResults] = useState([]);
  

  useEffect(() => {
    getAlbums().then(res => setAlbums(res.data));
  }, []);

  const dataToShow = results.length ? results : albums;

  return (
    <div>
      <Topbar setResults={setResults} />

      <h1>Альбомы</h1>

      {dataToShow.map(album => (
        <div key={album.id}>
          <Link to={`/album/${album.id}`}>
            <h3>{album.title}</h3>
            <p>{album.artist}</p>
          </Link>
        </div>
      ))}
    </div>
  );
}