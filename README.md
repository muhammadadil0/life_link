# 🩸 LifeLink — Next-Generation Blood Donation & Emergency SOS Platform

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas_Cloud-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **LifeLink** is a modern, mobile-first full-stack emergency blood donation network connecting critical patients with verified voluntary donors and hospital blood banks across Pakistan in real time.

---

## 🌟 Key Highlights

- 🚨 **10-Second Rapid SOS Broadcast**: One-tap emergency broadcast for critical patients requiring immediate blood transfusions.
- 🩸 **Dedicated Personal Donor Portal**:
  - **Live Availability Toggle**: Instant status switch (🟢 *Available to Donate* / ⚪ *Temporarily Resting*) synced directly to MongoDB Atlas.
  - **Donation Readiness Checklist**: Pre-donation health criteria (weight $\ge$ 50kg, 90-day safe interval, vitals check, hydration).
  - **Blood Compatibility Matrix**: Instant transfusion rules and compatibility information tailored to the donor's blood type.
  - **Donation Tracker & Milestone Counter**: Keep record of verified donations with a built-in "+ Log Donation" modal.
- 🏥 **Patients In Need Board**: Nationwide emergency SOS feed with real-time blood group and city filtering, 1-click Google Maps hospital navigation, and direct chat.
- 📱 **Mobile Native-App Experience**:
  - Touch-optimized bottom navigation bar with a centered floating SOS trigger.
  - Smooth swipe gestures for emergency patient carousels on mobile screens.
  - Glassmorphic, responsive UI built with Tailwind CSS and Lucide React.
- 📍 **Smart Geolocation**: Automatic IP-based and GPS reverse-geocoding for instantaneous city and hospital matching.
- 🍃 **MongoDB Atlas Cloud Database**: Production-ready schemas for users, emergency requests, and donation activity with automatic fallback.

---

## 🏗️ Architecture & Technology Stack

```
lifelink/
├── frontend/                # React 18 SPA (Vite + Tailwind CSS)
│   ├── public/              # Optimized static assets & logos
│   └── src/
│       ├── components/      # UI components (Navbar, MobileBottomNav, Carousels, SOS Modal)
│       ├── pages/           # Views (Home, DonorDashboard, EmergencyPage, Donors, Auth, Contact)
│       └── services/        # Centralized REST API client (Fetch)
│
└── backend/                 # Node.js + Express REST API
    ├── config/              # MongoDB Atlas connection (Mongoose)
    ├── models/              # User, EmergencyRequest, Donor schemas
    ├── routes/              # Auth, Emergencies, Donors, Geolocation APIs
    ├── data/                # Seed and static references
    └── server.js            # Express server entry point
```

### Core Technologies
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React icons.
- **Backend**: Node.js, Express.js, Mongoose, CORS, Dotenv, JWT.
- **Database**: MongoDB Atlas (Cloud Cluster).
- **Location Services**: IP-API & OpenStreetMap Nominatim reverse geocoding.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18.0.0 or later)
- **npm** (v9.0.0 or later)
- **MongoDB Atlas** account (or local MongoDB URI)

---

### 1. Clone the Repository
```bash
git clone https://github.com/muhammadadil0/life_link.git
cd life_link
```

---

### 2. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` configuration file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Update `.env` with your settings:
   ```env
   PORT=5050
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/lifelink?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key
   ```
5. Start the backend server:
   ```bash
   # Development / Production
   node server.js
   ```
   *The server runs by default on `http://localhost:5050`.*

---

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev -- --host
   ```
   *The frontend application will be live at `http://localhost:3002` (or your local Vite port).*

4. To generate a production build:
   ```bash
   npm run build
   ```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new donor or patient account |
| `POST` | `/api/auth/login` | Authenticate user & return session |
| `PATCH` | `/api/auth/profile/:id` | Update availability status, total donations, phone, or city |
| `GET` | `/api/emergencies` | List active emergency SOS blood requests (filter by blood type / city) |
| `POST` | `/api/emergencies` | Broadcast a new emergency blood transfusion request |
| `GET` | `/api/donors` | Browse verified blood donors with availability filter |
| `GET` | `/api/location/detect` | Auto-detect visitor city and coordinates via IP |
| `GET` | `/api/location/reverse` | Reverse-geocode coordinates to street address / city |

---

## 🔒 Security Best Practices
- Passwords are encrypted before storage.
- Environment variables (`.env`) are excluded from version control via `.gitignore`.
- Sanitized payloads are enforced on all public and profile endpoints.

---

## 📞 Support & Central Operations

- **HQ Location**: Shergarh, Mardan, Khyber Pakhtunkhwa, Pakistan
- **24/7 Helpline**: `+92 349 4996898` (`03494996898`)
- **Official Email**: [adilraxiq64@gmail.com](mailto:adilraxiq64@gmail.com)
- **GitHub**: [@muhammadadil0](https://github.com/muhammadadil0)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
