import { pool } from "../config/db.js";

export const getTracksByAlbum = async (albumId) => {
  const res = await pool.query(
    "SELECT * FROM tracks WHERE album_id = $1",
    [albumId]
  );
  return res.rows;
};