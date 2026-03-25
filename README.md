# ShiftZen — Dynamic Portfolio App

## Quick Start

### 1. Install backend dependencies
cd backend
npm install

### 2. Configure environment
cp .env.example .env
Edit .env with your MongoDB Atlas URI and a JWT secret

### 3. Run locally
npm run dev  →  opens on http://localhost:3000

---

## Deploy for Free

### Step 1 — MongoDB Atlas (database)
Sign up at https://mongodb.com/atlas → free M0 cluster → copy connection string

### Step 2 — Render (backend)
- New Web Service → connect GitHub repo
- Root directory: backend
- Start command: node server.js
- Add env vars: MONGODB_URI, PORT=3000, JWT_SECRET, NODE_ENV=production

### Step 3 — Netlify (frontend)
- Update frontend/app.js line 1: const API = 'https://YOUR-APP.onrender.com/api'
- New site from Git → publish directory: frontend

---

## File Structure
shiftzen/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── middleware/auth.js
│   ├── models/User.js
│   ├── models/Portfolio.js
│   ├── models/Project.js
│   ├── models/Interest.js
│   ├── routes/auth.js
│   ├── routes/portfolio.js
│   ├── routes/projects.js
│   ├── routes/interests.js
│   └── utils/suggestions.js
├── frontend/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── portfolio.html
└── README.md
