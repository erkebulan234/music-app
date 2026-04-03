import { pool } from "../config/db.js";

export const createPlaylist = async (userId, name) => {
  const result = await pool.query(
    "INSERT INTO playlists (user_id, name) VALUES ($1, $2) RETURNING *",
    [userId, name],
  );

  return result.rows[0];
};

export const getUserPlaylists = async (userId) => {
  const result = await pool.query(
    `SELECT p.*, COUNT(pt.track_id)::int AS tracks_count
     FROM playlists p
     LEFT JOIN playlist_tracks pt ON pt.playlist_id = p.id
     WHERE p.user_id = $1
     GROUP BY p.id
     ORDER BY p.created_at DESC NULLS LAST, p.id DESC`,
    [userId],
  );

  const playlists = result.rows;

  // Для каждого плейлиста подгружаем до 4 уникальных обложек из albums
  const withCovers = await Promise.all(
    playlists.map(async (pl) => {
      const coversRes = await pool.query(
        `SELECT DISTINCT a.cover_url
         FROM albums a
         JOIN tracks t ON t.album_id = a.id
         JOIN playlist_tracks pt ON pt.track_id = t.id
         WHERE pt.playlist_id = $1 AND a.cover_url IS NOT NULL
         LIMIT 4`,
        [pl.id],
      );
      return {
        ...pl,
        tracks: coversRes.rows, // [{cover_url}, ...]
      };
    })
  );

  return withCovers;
};

export const addTrackToPlaylist = async (playlistId, trackId) => {
  await pool.query(
    `INSERT INTO playlist_tracks (playlist_id, track_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [playlistId, trackId],
  );

  const result = await pool.query(
    `SELECT t.*
     FROM tracks t
     JOIN playlist_tracks pt ON pt.track_id = t.id
     WHERE pt.playlist_id = $1
     ORDER BY t.id`,
    [playlistId],
  );

  return result.rows;
};

export const removeTrackFromPlaylist = async (playlistId, trackId) => {
  await pool.query(
    "DELETE FROM playlist_tracks WHERE playlist_id = $1 AND track_id = $2",
    [playlistId, trackId],
  );
};

export const getPlaylistById = async (playlistId) => {
  const playlistResult = await pool.query(
    "SELECT * FROM playlists WHERE id = $1",
    [playlistId],
  );

  if (!playlistResult.rows[0]) {
    return null;
  }

 const tracksResult = await pool.query(
  `SELECT DISTINCT ON (t.id) t.*, a.cover_url, a.title as album_title
   FROM tracks t
   JOIN albums a ON a.id = t.album_id
   JOIN playlist_tracks pt ON pt.track_id = t.id
   WHERE pt.playlist_id = $1
   ORDER BY t.id`,
  [playlistId],
 );

  return {
    ...playlistResult.rows[0],
    tracks: tracksResult.rows,
  };
};