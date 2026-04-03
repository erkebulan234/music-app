import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AlbumPage from "./pages/AlbumPage";
import Popular from "./pages/Popular";
import Favorites from "./pages/Favorites";
import Playlists from "./pages/Playlists";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import { isAdmin } from "./utils/auth";
import PlaylistPage from "./pages/PlaylistPage";

function AdminRoute({ children }) {
  if (!isAdmin()) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/album/:id" element={<ProtectedRoute><AlbumPage /></ProtectedRoute>} />
        <Route path="/popular" element={<ProtectedRoute><Popular /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/playlists" element={<ProtectedRoute><Playlists /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="/playlists/:id" element={<ProtectedRoute><PlaylistPage /></ProtectedRoute>} />

        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminRoute>
              <Admin />
            </AdminRoute>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
