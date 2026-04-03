import express from "express";
import { toggleFavorite, fetchFavorites, checkFavorite } from "../controllers/favoriteController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, fetchFavorites);
router.get("/:albumId", authMiddleware, checkFavorite);
router.post("/:albumId", authMiddleware, toggleFavorite);

export default router;