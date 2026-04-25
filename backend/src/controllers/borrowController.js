const mongoose = require("mongoose");
const BorrowRecord = require("../models/BorrowRecord");
const Book = require("../models/Book");

const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid bookId" });
    }

    // atomic decrement to avoid race conditions
    const updatedBook = await Book.findOneAndUpdate(
      { _id: bookId, availableCopies: { $gt: 0 } },
      { $inc: { availableCopies: -1 } },
      { new: true }
    );

    if (!updatedBook) {
      const exists = await Book.exists({ _id: bookId });
      if (!exists) return res.status(404).json({ message: "Book not found" });
      return res.status(400).json({ message: "Book is not available for borrowing" });
    }

    updatedBook.availabilityStatus =
      updatedBook.availableCopies > 0 ? "available" : "unavailable";
    await updatedBook.save();

    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + 7);

    const record = await BorrowRecord.create({
      userId: req.user._id,
      bookId: updatedBook._id,
      borrowDate,
      dueDate,
      status: "borrowed"
    });

    return res.status(201).json({
      message: "Book borrowed successfully",
      record,
      book: {
        _id: updatedBook._id,
        availableCopies: updatedBook.availableCopies,
        totalCopies: updatedBook.totalCopies,
        availabilityStatus: updatedBook.availabilityStatus
      }
    });
  } catch (error) {
    console.error("[borrowBook] error:", error);
    return res.status(500).json({ message: "Server error while borrowing book" });
  }
};

const returnBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid bookId" });
    }

    const activeRecord = await BorrowRecord.findOne({
      userId: req.user._id,
      bookId,
      status: "borrowed"
    });

    if (!activeRecord) {
      return res.status(404).json({ message: "No active borrow record found" });
    }

    activeRecord.status = "returned";
    activeRecord.returnDate = new Date();
    await activeRecord.save();

    const book = await Book.findById(bookId);
    if (book) {
      if (book.availableCopies < book.totalCopies) {
        book.availableCopies += 1;
      }
      book.availabilityStatus = book.availableCopies > 0 ? "available" : "unavailable";
      await book.save();
    }

    return res.status(200).json({ message: "Book returned successfully" });
  } catch (error) {
    console.error("[returnBook] error:", error);
    return res.status(500).json({ message: "Server error while returning book" });
  }
};

const getMyBorrowedBooks = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const records = await BorrowRecord.find({ userId: req.user._id })
      .populate("bookId", "title author category availableCopies totalCopies availabilityStatus")
      .sort({ createdAt: -1 });

    return res.status(200).json({ records });
  } catch (error) {
    console.error("[getMyBorrowedBooks] error:", error);
    return res.status(500).json({ message: "Server error fetching borrowed books" });
  }
};

module.exports = { borrowBook, returnBook, getMyBorrowedBooks };