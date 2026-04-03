import { pool } from "../config/db.js";

export const addFavorite = async (userId, albumId) => {
  const res = await pool.query(
    `INSERT INTO favorites (user_id, album_id) VALUES ($1, $2)
     ON CONFLICT DO NOTHING RETURNING *`,
    [userId, albumId]
  );
  return res.rows[0];
};

export const removeFavorite = async (userId, albumId) => {
  await pool.query(
    "DELETE FROM favorites WHERE user_id = $1 AND album_id = $2",
    [userId, albumId]
  );
};

export const getUserFavorites = async (userId) => {
  const res = await pool.query(
    `SELECT a.*,
       ROUND(AVG(r.rating), 1) AS avg_rating,
       COUNT(r.id) AS review_count
     FROM favorites f
     JOIN albums a ON a.id = f.album_id
     LEFT JOIN reviews r ON r.album_id = a.id
     WHERE f.user_id = $1
     GROUP BY a.id
     ORDER BY a.id DESC`,
    [userId]
  );
  return res.rows;
};

export const isFavorite = async (userId, albumId) => {
  const res = await pool.query(
    "SELECT 1 FROM favorites WHERE user_id = $1 AND album_id = $2",
    [userId, albumId]
  );
  return res.rows.length > 0;
};