require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const memberRoutes = require("./routes/memberRoutes");

const app = express();

// =========================
// MIDDLEWARE
// =========================
app.use(express.json());

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://vattiapp.netlify.app",
  "https://loan-app-client.vercel.app",
  "https://loan-app-client-4uyfuf8yo-focas.vercel.app",
  "https://loan-app-client-git-main-focas.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow Postman or server requests
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));

// =========================
// ROUTES
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// =========================
// DATABASE CONNECTION
// =========================
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return; // already connected
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }
};

// =========================
// VERCEL SERVERLESS EXPORT
// =========================
module.exports = async (req, res) => {
  // Handle CORS preflight manually for serverless
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      req.headers["access-control-request-headers"] || "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    return res.status(200).end();
  }

  // Connect to MongoDB
  try {
    await connectDB();
  } catch (err) {
    return res.status(500).json({ message: "Database connection error" });
  }

  // Pass request to Express app
  return app(req, res);
};

// =========================
// LOCAL SERVER (for dev only)
// =========================
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  });
}