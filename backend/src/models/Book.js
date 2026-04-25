const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  availableCopies: { type: Number, default: 1, min: 0 },
  totalCopies: { type: Number, default: 1, min: 1 },
  availabilityStatus: {
    type: String,
    enum: ["available", "unavailable"],
    default: "available"
  }
});

// No next() needed
bookSchema.pre("validate", function () {
  if (this.availableCopies > this.totalCopies) {
    this.availableCopies = this.totalCopies;
  }
  this.availabilityStatus = this.availableCopies > 0 ? "available" : "unavailable";
});

module.exports = mongoose.model("Book", bookSchema);