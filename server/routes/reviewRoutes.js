import express from "express";
import { addReview, getReviews, getUserReviews, adminGetAllReviews, adminUpdateReview, adminDeleteReview } from "../controllers/reviewController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
const router = express.Router();

router.get("/:albumId", getReviews);
router.get("/user/me", authMiddleware, getUserReviews);
router.post("/", authMiddleware, addReview);
router.get("/admin/all", adminMiddleware, adminGetAllReviews);
router.put("/:id", adminMiddleware, adminUpdateReview);
router.delete("/:id", adminMiddleware, adminDeleteReview);

export default router;