import { createReview, getReviewsByAlbum, getReviewsByUser, getAllReviews, updateReview, deleteReview } from "../models/reviewModel.js";

export const addReview = async (req, res) => {
  const { albumId, rating, comment } = req.body;
  const userId = req.user.id;
  try {
    const review = await createReview(userId, albumId, rating, comment);
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReviews = async (req, res) => {
  const { albumId } = req.params;
  try {
    const reviews = await getReviewsByAlbum(albumId);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const reviews = await getReviewsByUser(req.user.id);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Получить все отзывы (только для админа)
export const adminGetAllReviews = async (req, res) => {
  try {
    const reviews = await getAllReviews();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Редактировать отзыв (только для админа)
export const adminUpdateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  try {
    const updated = await updateReview(id, rating, comment);
    if (!updated) return res.status(404).json({ message: "Отзыв не найден" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Удалить отзыв (только для админа)
export const adminDeleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteReview(id);
    res.json({ message: "Отзыв удалён" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};