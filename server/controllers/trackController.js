import { getTracksByAlbum, createTrack, deleteTrack } from "../models/trackModel.js";

export const fetchTracks = async (req, res) => {
  try {
    const tracks = await getTracksByAlbum(req.params.albumId);
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addTrack = async (req, res) => {
  const { albumId, title, duration } = req.body;
  const audioUrl = req.file ? `/audio/${req.file.filename}` : null;
  try {
    const track = await createTrack(albumId, title, duration, audioUrl);
    res.status(201).json(track);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeTrack = async (req, res) => {
  try {
    await deleteTrack(req.params.id);
    res.json({ message: "Трек удалён" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};