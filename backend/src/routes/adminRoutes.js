const express = require("express");
const router = express.Router();

const { authMiddleware, adminOnly } = require("../middlewares/authMiddleware");
const { getStats, getAllUsers } = require("../controllers/adminController");

// /api/admin/stats
router.get("/stats", authMiddleware, adminOnly, getStats);
router.get("/users", authMiddleware, adminOnly, getAllUsers);

module.exports = router;