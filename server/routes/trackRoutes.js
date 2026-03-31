import express from "express";
import { fetchTracks } from "../controllers/trackController.js";

const router = express.Router();

router.get("/:albumId", fetchTracks);

export default router;