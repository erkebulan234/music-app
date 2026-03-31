import express from "express";
import { fetchAlbums, fetchAlbum, search} from "../controllers/albumController.js";
    

const router = express.Router();


router.get("/", fetchAlbums);
router.get("/search", search);
router.get("/:id", fetchAlbum);

export default router;