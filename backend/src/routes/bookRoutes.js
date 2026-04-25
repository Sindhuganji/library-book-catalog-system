const express = require("express");
const router = express.Router();

const { getAllBooks, getBookById } = require("../controllers/bookController");
const { borrowBook } = require("../controllers/borrowController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// startup safety checks
if (typeof getAllBooks !== "function") throw new TypeError("getAllBooks must be a function");
if (typeof getBookById !== "function") throw new TypeError("getBookById must be a function");
if (typeof borrowBook !== "function") throw new TypeError("borrowBook must be a function");
if (typeof authMiddleware !== "function") throw new TypeError("authMiddleware must be a function");

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/:bookId/borrow", authMiddleware, borrowBook);

module.exports = router;