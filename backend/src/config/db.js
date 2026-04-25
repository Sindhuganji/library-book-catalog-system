const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("Missing MONGO_URI (or MONGODB_URI) in environment variables");
    }

    console.log("[DB] Connecting to MongoDB...");
    const conn = await mongoose.connect(mongoUri);

    console.log(`[DB] MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("[DB] MongoDB connection failed:", error.message);
    // Re-throw so server.js can decide to exit with explicit log
    throw error;
  }
};

module.exports = connectDB;