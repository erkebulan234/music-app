import express from "express";
import { fetchTracks, addTrack, removeTrack } from "../controllers/trackController.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { uploadAudio } from "../middleware/audioMiddleware.js";

const router = express.Router();

router.get("/:albumId", fetchTracks);
router.post("/", adminMiddleware, uploadAudio.single("audio"), addTrack);
router.delete("/:id", adminMiddleware, removeTrack);

export default router;