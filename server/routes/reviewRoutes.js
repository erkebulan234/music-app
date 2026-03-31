import express from "express";
import { addReview, getReviews } from "../controllers/reviewController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:albumId", getReviews);
router.post("/", authMiddleware, addReview);

export default router;