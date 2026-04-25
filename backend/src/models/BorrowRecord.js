const mongoose = require("mongoose");

const borrowRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"]
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "bookId is required"]
    },
    borrowDate: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date,
      required: [true, "dueDate is required"],
      validate: {
        validator: function (value) {
          const baseDate = this.borrowDate || new Date();
          return value > baseDate;
        },
        message: "dueDate must be later than borrowDate"
      }
    },
    returnDate: {
      type: Date,
      default: null,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return value >= (this.borrowDate || new Date(0));
        },
        message: "returnDate cannot be earlier than borrowDate"
      }
    },
    status: {
      type: String,
      enum: {
        values: ["borrowed", "returned"],
        message: "Status must be either 'borrowed' or 'returned'"
      },
      default: "borrowed"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Prevent duplicate active borrow entries for same user + book
borrowRecordSchema.index(
  { userId: 1, bookId: 1, status: 1 },
  { partialFilterExpression: { status: "borrowed" } }
);

// Common query patterns
borrowRecordSchema.index({ userId: 1, status: 1, dueDate: 1 });
borrowRecordSchema.index({ bookId: 1, status: 1 });

module.exports = mongoose.model("BorrowRecord", borrowRecordSchema);