import {
  addTrackToPlaylist,
  createPlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeTrackFromPlaylist,
} from "../models/Playlist.js";

export const createUserPlaylist = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Укажите название плейлиста" });
  }

  try {
    const playlist = await createPlaylist(req.user.id, name);
    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchUserPlaylists = async (req, res) => {
  try {
    const playlists = await getUserPlaylists(req.user.id);
    res.json(playlists);
  } catch (err) {
    console.error("fetchUserPlaylists error:", err); // добавь эту строку
    res.status(500).json({ error: err.message });
  }
}

export const fetchPlaylistById = async (req, res) => {
  try {
    const playlist = await getPlaylistById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: "Плейлист не найден" });
    }

    if (playlist.user_id !== req.user.id) {
      return res.status(403).json({ message: "Нет доступа к этому плейлисту" });
    }

    res.json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addTrack = async (req, res) => {
  const { trackId } = req.body;

  if (!trackId) {
    return res.status(400).json({ message: "Укажите trackId" });
  }

  try {
    const playlist = await getPlaylistById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: "Плейлист не найден" });
    }

    if (playlist.user_id !== req.user.id) {
      return res.status(403).json({ message: "Нет доступа к этому плейлисту" });
    }

    const tracks = await addTrackToPlaylist(req.params.id, trackId);
    res.json({ playlistId: Number(req.params.id), tracks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeTrack = async (req, res) => {
  try {
    const playlist = await getPlaylistById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: "Плейлист не найден" });
    }

    if (playlist.user_id !== req.user.id) {
      return res.status(403).json({ message: "Нет доступа к этому плейлисту" });
    }

    await removeTrackFromPlaylist(req.params.id, req.params.trackId);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
import { pool } from "../config/db.js";
export const deleteUserPlaylist = async (req, res) => {
  try {
    await pool.query("DELETE FROM playlist_tracks WHERE playlist_id = $1", [req.params.id]);
    await pool.query("DELETE FROM playlists WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
    res.json({ message: "Плейлист удалён" });
  } catch (err) {
    console.error("PLAYLISTS ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};