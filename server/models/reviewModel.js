import { pool } from "../config/db.js";

export const createReview = async (userId, albumId, rating, comment) => {
  const res = await pool.query(
    "INSERT INTO reviews (user_id, album_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *",
    [userId, albumId, rating, comment]
  );
  return res.rows[0];
};

export const getReviewsByAlbum = async (albumId) => {
  const res = await pool.query(
    "SELECT * FROM reviews WHERE album_id = $1",
    [albumId]
  );
  return res.rows;
};