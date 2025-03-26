# 🔥 Pokémon Card Tracker App

A fully responsive, full-stack web app built with **React**, **Node.js**, **MongoDB**, and **Tailwind CSS**.  
Users can register/login, add Pokémon trading cards to their personal collection, favorite them, and fetch live card prices (mock or API).

---

## ✨ Features

- 🧑‍💼 **User Authentication** – Secure login & registration using JWT
- 🃏 **Card Collection** – Add, view, and favorite Pokémon cards
- 🔥 **Charizard Highlight** – Special glowing effect when adding Charizard
- 💸 **Live Pricing** – Fetches mock or real-time pricing from TCGplayer API
- ⭐ **Favorites** – Mark your top cards and view them first
- 🌗 **Dark Mode** – Toggle between light and dark themes
- 📱 **Responsive UI** – Fully mobile-friendly layout
- 🧭 **Multi-Page Navigation** – React Router integration for a real app feel

---

## 🧪 Tech Stack

| Frontend | Backend | Styling | Database |
|----------|---------|---------|----------|
| React + Vite | Node.js + Express | Tailwind CSS | MongoDB (Mongoose) |
| Axios | JWT + Bcrypt | Dark Mode | MongoDB Atlas |

---

## 🛠️ Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/pokemon-card-tracker.git
cd pokemon-card-tracker
2. Install Dependencies
bash
Copy
Edit
# Client
cd client
npm install

# Server
cd ../server
npm install
3. Environment Setup
Create a .env file inside /server using the provided .env.example:

env
Copy
Edit
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
🚀 Running the App
Start the Backend
bash
Copy
Edit
cd server
npm start
Start the Frontend
bash
Copy
Edit
cd ../client
npm run dev
🖼️ Screenshots (Optional)
Add screenshots here to show off dark mode, Charizard glow, and the dashboard layout.

📦 Deployment Ready
Frontend → Vercel

Backend → Render or Railway

MongoDB → MongoDB Atlas

🧑‍🎨 Created by
🎓 Jared Mindock
Full Stack Web Developer