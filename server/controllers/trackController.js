import { getTracksByAlbum } from "../models/trackModel.js";

export const fetchTracks = async (req, res) => {
  try {
    const tracks = await getTracksByAlbum(req.params.albumId);
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};