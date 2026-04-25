require("dotenv").config();

console.log("[BOOT] server.js loaded");

process.on("uncaughtException", (err) => {
  console.error("[FATAL] uncaughtException:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("[FATAL] unhandledRejection:", reason);
  process.exit(1);
});

const connectDB = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("[BOOT] Environment loaded");
    console.log("[BOOT] PORT:", PORT);
    console.log(
      "[BOOT] MONGO URI present:",
      Boolean(process.env.MONGO_URI || process.env.MONGODB_URI)
    );

    await connectDB();

    console.log("[BOOT] Starting Express server...");
    const server = app.listen(PORT, () => {
      console.log(`[OK] Server running on http://localhost:${PORT}`);
    });

    server.on("error", (err) => {
      console.error("[SERVER] Listen error:", err);
      process.exit(1);
    });
  } catch (error) {
    console.error("[BOOT] Failed to start server:", error);
    process.exit(1);
  }
};

startServer();