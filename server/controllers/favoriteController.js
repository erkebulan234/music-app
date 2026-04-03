import { addFavorite, removeFavorite, getUserFavorites, isFavorite } from "../models/favoriteModel.js";

export const toggleFavorite = async (req, res) => {
  const userId = req.user.id;
  const albumId = req.params.albumId;
  try {
    const already = await isFavorite(userId, albumId);
    if (already) {
      await removeFavorite(userId, albumId);
      res.json({ favorited: false });
    } else {
      await addFavorite(userId, albumId);
      res.json({ favorited: true });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchFavorites = async (req, res) => {
  try {
    const favorites = await getUserFavorites(req.user.id);
    res.json(favorites);
  } catch (err) {
    console.error("FAVORITES ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const checkFavorite = async (req, res) => {
  try {
    const result = await isFavorite(req.user.id, req.params.albumId);
    res.json({ favorited: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};