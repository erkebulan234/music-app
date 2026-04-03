import { pool } from "../config/db.js";

export const createReview = async (userId, albumId, rating, comment) => {
  const res = await pool.query(
    `INSERT INTO reviews (user_id, album_id, rating, comment)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, albumId, rating, comment]
  );
  return res.rows[0];
};

export const getReviewsByAlbum = async (albumId) => {
  const res = await pool.query(
    `SELECT 
       r.id,
       r.rating,
       r.comment,
       r.created_at,
       u.name AS user
     FROM reviews r
     LEFT JOIN users u ON u.id = r.user_id
     WHERE r.album_id = $1
     ORDER BY r.created_at DESC`,
    [albumId]
  );
  return res.rows;
};
export const getReviewsByUser = async (userId) => {
  const res = await pool.query(
    `SELECT 
       r.id, r.rating, r.comment, r.created_at,
       a.title AS album_title, a.artist, a.id AS album_id, a.cover_url
     FROM reviews r
     JOIN albums a ON a.id = r.album_id
     WHERE r.user_id = $1
     ORDER BY r.created_at DESC`,
    [userId]
  );
  return res.rows;
};
export const getAllReviews = async () => {
  const result = await pool.query(
    `SELECT r.*, u.name AS username, a.title AS album_title
     FROM reviews r
     LEFT JOIN users u ON u.id = r.user_id
     LEFT JOIN albums a ON a.id = r.album_id
     ORDER BY r.created_at DESC`
  );
  return result.rows;
};
 
// Обновить отзыв (для админа)
export const updateReview = async (id, rating, comment) => {
  const result = await pool.query(
    `UPDATE reviews SET rating = $1, comment = $2 WHERE id = $3 RETURNING *`,
    [rating, comment, id]
  );
  return result.rows[0] || null;
};
 
// Удалить отзыв (для админа)
export const deleteReview = async (id) => {
  await pool.query("DELETE FROM reviews WHERE id = $1", [id]);
};