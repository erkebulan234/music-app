import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import albumRoutes from "./routes/albumRoutes.js";
import trackRoutes from "./routes/trackRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

import path from "path";
import { fileURLToPath } from "url";



const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Music API работает");
});

app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/tracks", trackRoutes);
app.use("/api/playlists", playlistRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;