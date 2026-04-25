const Book = require("../models/Book");

// 🔹 GET ALL BOOKS (NO LIMIT - FIXED)
const getAllBooks = async (req, res) => {
  try {
    const { search = "", category, available } = req.query;

    const query = {};

    // 🔍 Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ];
    }

    // 📂 Category filter
    if (category) {
      query.category = { $regex: `^${category}$`, $options: "i" };
    }

    // 📌 Available copies filter (NEW)
    if (available === "true") {
      query.availableCopies = { $gt: 0 };
    }

    // ✅ IMPORTANT FIX → NO LIMIT
    const books = await Book.find(query).sort({ createdAt: -1 });

    return res.status(200).json(books);

  } catch (error) {
    return res.status(500).json({ message: "Server error fetching books" });
  }
};

// 🔹 GET BOOK BY ID
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(400).json({ message: "Invalid book id" });
  }
};

// 🔹 CREATE BOOK (ADMIN)
const createBook = async (req, res) => {
  try {
    const { title, author, category, description, totalCopies } = req.body;

    if (!title || !author || !category) {
      return res.status(400).json({ message: "title, author, and category are required" });
    }

    const book = await Book.create({
      title,
      author,
      category,
      description,
      totalCopies: Number(totalCopies) || 1,
      availableCopies: Number(totalCopies) || 1
    });

    return res.status(201).json({
      message: "Book created successfully",
      book
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error creating book" });
  }
};

// 🔹 UPDATE BOOK (ADMIN)
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({
      message: "Book updated successfully",
      book: updatedBook
    });
  } catch (error) {
    return res.status(400).json({ message: "Invalid data or book id" });
  }
};

// 🔹 DELETE BOOK (ADMIN)
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Invalid book id" });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};