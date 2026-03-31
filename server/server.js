import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import albumRoutes from "./routes/albumRoutes.js";
import trackRoutes from "./routes/trackRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/tracks", trackRoutes);

app.get("/", (req, res) => {
  res.send("API работает");
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});