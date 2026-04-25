const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const { returnBook, getMyBorrowedBooks } = require("../controllers/borrowController");

// startup safety checks
if (typeof authMiddleware !== "function") throw new TypeError("authMiddleware must be a function");
if (typeof returnBook !== "function") throw new TypeError("returnBook must be a function");
if (typeof getMyBorrowedBooks !== "function") throw new TypeError("getMyBorrowedBooks must be a function");

router.get("/my-books", authMiddleware, getMyBorrowedBooks);
router.post("/return/:bookId", authMiddleware, returnBook);

module.exports = router;