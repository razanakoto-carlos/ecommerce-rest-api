# 🛒 node-mongo-ecommerce-api

A REST API for an e-commerce application built with **Node.js**, **Express** and **MongoDB**.

---

## ✨ Features

- 🔐 User registration & authentication (JWT)
- 📦 Product listing & single product details
- 🛒 Add & remove items from cart
- 📋 Order history

---

## 🛠️ Tech Stack

| Layer      | Technology                  |
|------------|-----------------------------|
| Runtime    | Node.js                     |
| Framework  | Express.js                  |
| Database   | MongoDB + Mongoose          |
| Auth       | JSON Web Tokens (JWT)       |
| Security   | bcryptjs                    |
| Config     | dotenv                      |

---

📁 Project Structure

```
node-mongo-ecommerce-api/
├── src/
│   ├── config/         # config (google auth)
│   ├── controllers/    # Route logic (user, product, cart, order)
│   ├── middlewares/    # Auth middleware, error handler
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   └── server.js       # App entry point
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/razanakoto-carlos/ecommerce-rest-api
cd node-mongo-ecommerce-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
create .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://exemple/auth/google/callback
```

### 4. Start the server

```bash
# Development
npm run dev

```

---

 ## 📡 API Endpoints

### Auth
| Method | Endpoint              | Description               |
|--------|-----------------------|---------------------------|
| POST   | `/auth/register`      | Register a new user       |
| POST   | `/auth/login`         | Login a user              |
| POST   | `/auth/google`        | Login with google account |

### Category
| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| POST   | `/category`           | Add new category    |
| GET    | `/category`           | get all category    |



 ### Products
| Method | Endpoint              | Description                                    |
|--------|-----------------------|------------------------------------------------|
| GET    | `/product`            | Get all products                               |
| GET    | `/product/productId`  | Get a single product                           |
| POST   | `/product`            | add item (with role = seller)                  |
| DELETE | `/product/productId`  | delete a product (with role = admin or seller) |

### Cart
| Method | Endpoint                 | Description                       |
|--------|--------------------------|-------------------------------|
| get    | `/cart`                  | get user cart                 |
| POST   | `/cart/:productId`       | Add product to cart           |
| PATCH  | `cart/remove/:productId` | remove single product in cart |

---
## 🔒 Authentication

Protected routes require a Bearer token in the request header:

```
Authorization: Bearer <your_jwt_token>
```

---