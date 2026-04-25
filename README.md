# 📚 Library Book Catalog System

A full-stack MERN application for managing and borrowing books.

## 🚀 Features
- View all books
- Borrow books with availability tracking
- Prevent duplicate borrowing
- Real-time updates using MongoDB

## 🛠 Tech Stack
- Frontend: React (Vite)
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)

## 🔧 Key Concepts Implemented
- Atomic updates using MongoDB
- Mongoose middleware (pre hooks)
- REST API design
- Authentication middleware

## 🐞 Bugs Fixed
- Fixed "next is not a function" (Mongoose hook misuse)
- Fixed "handler must be a function" (undefined route handlers)
- Fixed borrow logic & availability sync

## 📌 Future Improvements
- Return book feature
- Admin dashboard
- UI enhancements

## ▶️ Run Locally
```bash
cd backend
npm install
npm run dev
