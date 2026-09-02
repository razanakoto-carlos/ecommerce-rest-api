# 🛒 VOLT — e-commerce

A full-stack e-commerce application: a Node.js/Express/MongoDB REST API
paired with a React storefront. Buyers can browse and search a catalog,
filter by category, and manage a cart; sellers can list products;
admins can manage categories. Authentication supports both email/password
and Google OAuth.

The project is **feature-complete and working end to end** — backend and
frontend are wired together, verified against a live database, and
covered by a real commit history (see `git log`).

---

## ✨ Features

- 🔐 Email/password auth and Google OAuth (JWT-based sessions)
- 🛍️ Product catalog with search, category filtering, and pagination
- 🖼️ Multi-image product listings and category icons (uploaded via Multer)
- 🛒 Cart: add, increment, and remove line items
- 🧑‍💼 Role-based access — `user`, `seller` (list/delete own products),
  `admin` (manage categories, delete any product)
- 💻 A polished, responsive React storefront with a light, custom design
  system, and a subtle scroll parallax on the homepage hero
- ♿ Accessible by default — visible focus states, `prefers-reduced-motion`
  respected throughout

---

## 🛠️ Tech Stack

| Layer     | Technology                                                  |
| --------- | ------------------------------------------------------------ |
| Backend   | Node.js, Express 5, MongoDB + Mongoose, JWT, Passport (Google OAuth), Multer, Joi, bcryptjs |
| Frontend  | React 19, Vite, Tailwind CSS v4, React Router, Axios, React Context |
| Dev tools | nodemon, ESLint                                               |

---

## 📁 Project Structure

```
e-commerce/
├── backend/          # REST API — see backend/README.md
│   ├── src/
│   │   ├── config/       # Passport (Google OAuth) config
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Auth + role guards
│   │   ├── models/       # Mongoose schemas
│   │   └── routes/       # Express routers
│   └── upload/        # User-uploaded images (gitignored)
└── frontend/         # React storefront — see frontend/README.md
    └── src/
        ├── api/          # Axios calls per resource
        ├── components/   # Shared UI
        ├── context/      # Auth + cart state
        ├── hooks/        # Reusable hooks (e.g. scroll parallax)
        └── pages/        # One file per route
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A running MongoDB instance (local or a connection string)

### 1. Clone the repository

```bash
git clone https://github.com/razanakoto-carlos/ecommerce-rest-api
cd e-commerce
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/e-commerce
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

```bash
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # defaults to VITE_API_URL=http://localhost:3000
npm run dev
```

Open **http://localhost:5173**.

### 4. Try it out

Register an account from the UI to get a regular `user`. To try the
seller and admin flows, promote a user's role directly in MongoDB —
there's no role-management endpoint yet:

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "seller" } })
// role can be "user", "seller", or "admin"
```

---

## 📡 API Overview

| Resource | Endpoints |
| --- | --- |
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `GET /auth/google`, `GET /auth/google/callback` |
| Categories | `GET /category` (public), `POST /category` (admin) |
| Products | `GET /product`, `GET /product/:id` (public, supports `page`/`perPage`/`category`/`search`), `POST /product` (seller), `DELETE /product/:id` (owner or admin) |
| Cart | `GET /cart`, `POST /cart/:productId`, `PATCH /cart/remove/:productId` (all require auth) |

Protected routes expect `Authorization: Bearer <token>`. See
[`backend/README.md`](backend/README.md) for full endpoint details and
[`frontend/README.md`](frontend/README.md) for the app's routes and structure.
