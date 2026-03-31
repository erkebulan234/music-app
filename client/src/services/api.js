import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const getAlbums = () => API.get("/albums");
export const getAlbum = (id) => API.get(`/albums/${id}`);
export const getReviews = (id) => API.get(`/reviews/${id}`);
export const addReview = (data) => API.post("/reviews", data);

export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);
export const getTracks = (id) => API.get(`/tracks/${id}`);
export const searchAlbums = (q) => API.get(`/albums/search?q=${q}`);


API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});