const Book = require("../models/Book");
const BorrowRecord = require("../models/BorrowRecord");
const User = require("../models/User");

const getStats = async (req, res) => {
  try {
    const [totalBooks, availableBooks, borrowedBooks, totalUsers, activeBorrows] =
      await Promise.all([
        Book.countDocuments(),
        Book.countDocuments({ availabilityStatus: "available" }),
        Book.countDocuments({ availabilityStatus: "borrowed" }),
        User.countDocuments(),
        BorrowRecord.countDocuments({ status: "borrowed" })
      ]);

    return res.status(200).json({
      totalBooks,
      availableBooks,
      borrowedBooks,
      totalUsers,
      activeBorrows
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching admin stats" });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("email role");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching users" });
  }
};

module.exports = { getStats, getAllUsers };