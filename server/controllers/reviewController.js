import { createReview, getReviewsByAlbum } from "../models/reviewModel.js";

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