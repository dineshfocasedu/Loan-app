require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const memberRoutes = require("./routes/memberRoutes");

const app = express();

/* =========================
   CORS CONFIGURATION
========================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://vattiapp.netlify.app",
  "https://loan-app-client.vercel.app",
  "https://loan-app-client-4uyfuf8yo-focas.vercel.app",
  "https://loan-app-client-git-main-focas.vercel.app",
  "https://september-subsphenoid-celia.ngrok-free.dev",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

/* =========================
   ROUTES
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

/* =========================
   DATABASE CONNECTION
========================= */

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

/* =========================
   SERVER START (LOCAL ONLY)
========================= */

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  };

  startServer();
}

/* =========================
   EXPORT FOR VERCEL
========================= */

module.exports = async (req, res) => {
  // Force CORS headers for Vercel
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://loan-app-client.vercel.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }

  return app(req, res);
};