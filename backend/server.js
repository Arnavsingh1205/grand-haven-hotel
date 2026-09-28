require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/rooms");
const bookingRoutes = require("./routes/bookings");
const reviewRoutes = require("./routes/reviews");

const app = express();

const PORT = process.env.PORT || 5001;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/grandhaven";

// -----------------------------
// Middleware
// -----------------------------

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// -----------------------------
// Health Check
// -----------------------------

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "The Grand Haven API is running",
  });
});

// -----------------------------
// API Routes
// -----------------------------

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);

// -----------------------------
// 404 Handler
// -----------------------------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// -----------------------------
// Error Handler
// -----------------------------

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// -----------------------------
// MongoDB + Server
// -----------------------------

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`The Grand Haven API is running on port ${PORT}`);
      console.log(`Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();