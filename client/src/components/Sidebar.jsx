import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <Link to="/">🏠 Главная</Link>
      <Link to="/">🔥 Популярное</Link>
      <Link to="/">❤️ Избранное</Link>
      <Link to="/">🎵 Плейлисты</Link>
    </div>
  );
}