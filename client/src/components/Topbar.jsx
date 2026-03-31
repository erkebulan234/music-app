import { useState } from "react";
import { searchAlbums } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function getUserFromToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    // JWT payload — второй сегмент base64
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}

export default function Topbar({ setResults }) {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = getUserFromToken();

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 1 && setResults) {
      const res = await searchAlbums(value);
      setResults(res.data);
    }
    if (value.length <= 1 && setResults) setResults([]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Первая буква имени для аватара
  const initial = user?.name?.[0]?.toUpperCase() || "U";

  return (
    <header className="topbar">
      <Link to="/" className="logo">Sound<span>ify</span></Link>

      <div className="topbar-search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          placeholder="Поиск альбомов и артистов..."
          value={query}
          onChange={handleSearch}
        />
      </div>

      <div className="topbar-right">
        <div className="avatar-wrap">
          <div className="avatar" onClick={() => setMenuOpen(o => !o)}
            title={user?.name || "Профиль"}>
            {initial}
          </div>

          {menuOpen && (
            <>
              {/* Клик вне меню — закрыть */}
              <div className="avatar-overlay" onClick={() => setMenuOpen(false)} />
              <div className="avatar-menu">
                {user?.name && (
                  <div className="avatar-menu-header">
                    <div className="avatar-menu-name">{user.name}</div>
                    <div className="avatar-menu-email">{user.email || ""}</div>
                  </div>
                )}
                <Link to="/profile" className="avatar-menu-item"
                  onClick={() => setMenuOpen(false)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Профиль
                </Link>
                <button className="avatar-menu-item avatar-menu-logout"
                  onClick={handleLogout}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Выйти
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
