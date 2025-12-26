import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import morgan from "morgan";

import db_con from "./config/db.js";

import authRoutes from "./routes/authRoute.js";
import productRoute from "./routes/productRoute.js";
import purchaseProductsRoute from "./routes/purchaseProductsRoute.js";
import feedbackRoute from "./routes/feedbackRoute.js";
import commentRoute from "./routes/commentRoute.js";
import soilTestingRoute from "./routes/soilTestingRoute.js";

dotenv.config();
db_con();

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(express.json());
app.use(morgan("dev"));

app.use(cors({
  origin: [
    "http://localhost:8080",
    "http://localhost:3000",
    "https://green-nursery.netlify.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// 🔥 VERY IMPORTANT FOR PREFLIGHT
app.options("*", cors());

/* ================= STATIC ================= */

app.use("/upload", express.static("upload"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/uploadVideos", express.static(path.join(process.cwd(), "uploadVideos")));

/* ================= ROUTES ================= */

app.get("/", (req, res) => {
  res.send("Welcome to omiii");
});

app.use("/auth", authRoutes);
app.use("/product", productRoute);
app.use("/purchase", purchaseProductsRoute);
app.use("/feedback", feedbackRoute);
app.use("/comment", commentRoute);
app.use("/soil-testing", soilTestingRoute);

/* ================= EXPORT FOR VERCEL ================= */

export default app;

/* ================= LOCAL ONLY ================= */
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}
