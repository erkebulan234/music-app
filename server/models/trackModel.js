import { pool } from "../config/db.js";

export const getTracksByAlbum = async (albumId) => {
  const res = await pool.query(
    "SELECT * FROM tracks WHERE album_id = $1 ORDER BY track_number",
    [albumId]
  );
  return res.rows;
};

export const createTrack = async (albumId, title, duration, audioUrl) => {
  const res = await pool.query(
    "INSERT INTO tracks (album_id, title, duration, audio_url) VALUES ($1, $2, $3, $4) RETURNING *",
    [albumId, title, duration, audioUrl]
  );
  return res.rows[0];
};

export const deleteTrack = async (id) => {
  await pool.query("DELETE FROM tracks WHERE id = $1", [id]);
};