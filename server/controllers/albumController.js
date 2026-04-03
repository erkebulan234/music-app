import { pool } from "../config/db.js";
import { getAlbumWithRating } from "../models/albumModel.js";

export const fetchAlbums = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.*,
        ROUND(AVG(r.rating), 1) AS avg_rating,
        COUNT(r.id) AS review_count
      FROM albums a
      LEFT JOIN reviews r ON a.id = r.album_id
      GROUP BY a.id
      ORDER BY a.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const fetchAlbum = async (req, res) => {
  try {
    const album = await getAlbumWithRating(req.params.id);
    if (!album) {
      return res.status(404).json({ message: "Альбом не найден" });
    }
    res.json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
import { searchAlbums } from "../models/albumModel.js";

export const search = async (req, res) => {
  const { q } = req.query;

  try {
    const results = await searchAlbums(q);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
import { upload } from "../middleware/uploadMiddleware.js";

export const createAlbum = async (req, res) => {
  const { title, artist, year } = req.body;
  const coverUrl = req.file ? `/covers/${req.file.filename}` : null;
  try {
    const result = await pool.query(
      "INSERT INTO albums (title, artist, year, cover_url) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, artist, year, coverUrl]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
import { deleteAlbum } from "../models/albumModel.js";

export const removeAlbum = async (req, res) => {
  try {
    await deleteAlbum(req.params.id);
    res.json({ message: "Альбом удалён" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

