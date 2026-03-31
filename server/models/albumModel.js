import { pool } from "../config/db.js";

export const getAllAlbums = async () => {
  const res = await pool.query("SELECT * FROM albums");
  return res.rows;
};

export const getAlbumById = async (id) => {
  const res = await pool.query(
    "SELECT * FROM albums WHERE id = $1",
    [id]
  );
  return res.rows[0];
};
export const getAlbumWithRating = async (id) => {
  const res = await pool.query(`
    SELECT 
      a.*,
      ROUND(AVG(r.rating), 1) as avg_rating,
      COUNT(r.id) as review_count
    FROM albums a
    LEFT JOIN reviews r ON a.id = r.album_id
    WHERE a.id = $1
    GROUP BY a.id
  `, [id]);

  return res.rows[0];
};
export const searchAlbums = async (query) => {
  const res = await pool.query(
    `SELECT * FROM albums 
     WHERE title ILIKE $1 OR artist ILIKE $1`,
    [`%${query}%`]
  );
  return res.rows;
};