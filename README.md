# 🩺 DocBook — Doctor Appointment Booking System

A full-stack MERN application for booking doctor appointments, with role-based access for patients and admins. Built as the mega intermediate project for the Dev Weekends '26 fellowship.

## 🌐 Live Demo
**[Click here to view the live project]((https://doctor-booking-system-sw4g.vercel.app/))**

## 📖 Overview
DocBook lets patients search for doctors by specialty, book appointments, and leave reviews. It also includes a dedicated admin dashboard to manage the doctor directory and confirm or cancel patient bookings securely.

## ✨ Features
* **Role-Based Access:** Secure JWT authentication for Patients and Admins.
* **Smart Search:** Filter doctors by specialty with built-in pagination.
* **Booking System:** Seamless appointment scheduling with double-booking prevention.
* **Admin Dashboard:** Full control to add doctors, and confirm or delete appointments.
* **Security & Recovery:** Forgot/Reset password via email (Nodemailer) and secure password changes.
* **Robust API:** Centralized error handling, rate limiting, and Helmet security headers.

## 🛠 Tech Stack
* **Frontend:** React.js (Vite), React Router DOM, Axios, Custom CSS
* **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs
* **Tools & Utilities:** Helmet, express-rate-limit, morgan, nodemailer

## 📂 Project Structure
```text
doctor-booking-system/
├── backend/     → Node/Express/MongoDB API      (see backend/README.md)
└── frontend/    → React (Vite) client           (see frontend/README.md)
🚀 Getting Started
1. Clone the repository

Bash
git clone [https://github.com/Haroonkhan4063/doctor-booking-system.git](https://github.com/Haroonkhan4063/doctor-booking-system.git)
cd doctor-booking-system
2. Backend Setup

Bash
cd backend
npm install
cp .env.example .env     # fill in MONGO_URI and JWT_SECRET
npm run seed:admin       # creates the initial admin account
npm run dev              # runs on http://localhost:5000
3. Frontend Setup

Bash
cd ../frontend
npm install
cp .env.example .env     # points to the backend API (http://localhost:5000/api)
npm run dev              # runs on http://localhost:5173
👤 Author
Muhammad Haroon Khan

GitHub: @Haroonkhan4063

Developed as part of the Dev Weekends '26 fellowship program.
