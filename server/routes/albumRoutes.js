import express from "express";
import { fetchAlbums, fetchAlbum, search, createAlbum, removeAlbum } from "../controllers/albumController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", fetchAlbums);
router.get("/search", search);
router.get("/:id", fetchAlbum);
router.post("/", adminMiddleware, upload.single("cover"), createAlbum);
router.delete("/:id", adminMiddleware, removeAlbum);

export default router;