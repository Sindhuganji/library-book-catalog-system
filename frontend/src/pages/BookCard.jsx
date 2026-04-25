import React from 'react';

export default function BookCard({ book, onBorrow, isBorrowing = false }) {
  const isUnavailable = book?.availabilityStatus !== "available";
  const isDisabled = isBorrowing || isUnavailable;

  const handleBorrowClick = (e) => {
    e.stopPropagation();
    console.log("[BookCard] Borrow clicked. bookId:", book?._id);
    console.log("[BookCard] isDisabled:", isDisabled);

    if (isDisabled) return;

    if (typeof onBorrow === "function") {
      onBorrow(book._id);
    } else {
      console.error("[BookCard] onBorrow is not a function");
    }
  };

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-semibold">{book?.title}</h3>
      <p className="text-sm text-slate-600 mt-1">Author: {book?.author}</p>
      <p className="text-sm text-slate-600">Category: {book?.category}</p>

      <span
        className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
          isUnavailable ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
        }`}
      >
        {book?.availabilityStatus}
      </span>

      <button
        type="button"
        onClick={handleBorrowClick}
        disabled={isDisabled}
        className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isBorrowing ? "Borrowing..." : isUnavailable ? "Unavailable" : "Borrow"}
      </button>
    </div>
  );
}