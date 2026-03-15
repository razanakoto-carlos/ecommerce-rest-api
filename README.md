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
```

### 4. Start the server

```bash
# Development
npm run dev

```

---

 ## 📡 API Endpoints

### Auth
| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| POST   | `/api/users/register` | Register a new user |
| POST   | `/api/users/login`    | Login a user        |

<!-- ### Products
| Method | Endpoint              | Description            |
|--------|-----------------------|------------------------|
| GET    | `/api/products`       | Get all products       |
| GET    | `/api/products/:id`   | Get a single product   |

### Cart
| Method | Endpoint            | Description           |
|--------|---------------------|-----------------------|
| POST   | `/api/cart`         | Add item to cart      |
| DELETE | `/api/cart/:itemId` | Remove item from cart |

### Orders
| Method | Endpoint       | Description           |
|--------|----------------|-----------------------|
| GET    | `/api/orders`  | Get order history     |
| POST   | `/api/orders`  | Place an order        |

### Payment
| Method | Endpoint          | Description        |
|--------|-------------------|--------------------|
| POST   | `/api/payment`    | Process a payment  | -->

---
## 🔒 Authentication

Protected routes require a Bearer token in the request header:

```
Authorization: Bearer <your_jwt_token>
```

---