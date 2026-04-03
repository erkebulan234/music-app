import axios from "axios";

const API = axios.create({
  baseURL: "https://music-app-production-53c4.up.railway.app/api"
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getFavorites = () => API.get("/favorites");
export const checkFavorite = (albumId) => API.get(`/favorites/${albumId}`);
export const toggleFavorite = (albumId) => API.post(`/favorites/${albumId}`);
export const getUserReviews = () => API.get("/reviews/user/me");
export const getPlaylists = () => API.get("/playlists");
export const createPlaylist = (data) => API.post("/playlists", data);
export const deletePlaylist = (id) => API.delete(`/playlists/${id}`);

export const getAlbums = () => API.get("/albums");
export const getAlbum = (id) => API.get(`/albums/${id}`);
export const getReviews = (id) => API.get(`/reviews/${id}`);
export const addReview = (data) => API.post("/reviews", data);

export const getPlaylistById = (id) => API.get(`/playlists/${id}`);
export const addTrackToPlaylist = (playlistId, trackId) =>
  API.post(`/playlists/${playlistId}/tracks`, { trackId });
export const removeTrackFromPlaylist = (playlistId, trackId) =>
  API.delete(`/playlists/${playlistId}/tracks/${trackId}`);

export const deleteAlbum = (id) => API.delete(`/albums/${id}`);
export const addTrack = (formData) =>
  API.post("/tracks", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
export const deleteTrack = (id) => API.delete(`/tracks/${id}`);

export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);
export const getTracks = (id) => API.get(`/tracks/${id}`);
export const searchAlbums = (q) => API.get(`/albums/search?q=${q}`);

export const createAlbum = (formData) =>
  API.post("/albums", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });