import { useState } from "react";
import { searchAlbums } from "../services/api";

export default function Topbar({ setResults }) {
  const [query, setQuery] = useState("");

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 1 && setResults) {
      const res = await searchAlbums(value);
      setResults(res.data);
    }

    if (value.length <= 1 && setResults) {
      setResults([]);
    }
  };

  return (
    <div className="topbar">
      <div className="logo">Soundify</div>

      <input
        className="search"
        placeholder="Поиск..."
        value={query}
        onChange={handleSearch}
      />
    </div>
  );
}