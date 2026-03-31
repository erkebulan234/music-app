import express from "express";
import {
  addTrack,
  createUserPlaylist,
  fetchPlaylistById,
  fetchUserPlaylists,
  removeTrack,
} from "../controllers/playlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", fetchUserPlaylists);
router.post("/", createUserPlaylist);
router.get("/:id", fetchPlaylistById);
router.post("/:id/tracks", addTrack);
router.delete("/:id/tracks/:trackId", removeTrack);

export default router;