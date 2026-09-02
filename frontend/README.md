# VOLT — frontend

React 19 + Vite + Tailwind v4 storefront for the `ecommerce-rest-api` backend.

## Stack

- React Router for routing, Axios for the API client, React Context for auth/cart state
- `react-hot-toast` for notifications, `lucide-react` for icons
- Tailwind v4 (CSS-first `@theme`) — design tokens live in `src/index.css`

## Getting started

```bash
npm install
cp .env.example .env   # if present — otherwise set VITE_API_URL yourself
npm run dev
```

`VITE_API_URL` should point at the backend (defaults to `http://localhost:3000`).

## Structure

```
src/
├── api/          # axios calls per resource (auth, products, categories, cart)
├── components/   # shared UI (Navbar, ProductCard, PriceTag, ...)
├── context/      # AuthContext, CartContext
├── lib/          # formatting + constants
└── pages/        # one file per route
```

## Pages

| Route | Access | Notes |
|---|---|---|
| `/` | public | hero + featured products |
| `/products` | public | search, category filter, pagination |
| `/products/:id` | public | detail, add to cart, delete (owner/admin) |
| `/cart` | logged in | view/add/remove line items |
| `/login`, `/register` | public | email+password and Google OAuth |
| `/auth/callback` | public | receives the token after Google OAuth |
| `/sell` | role: seller | create a product listing |
| `/admin/categories` | role: admin | create categories |

Promoting a user to `seller` or `admin` currently has to be done directly in
MongoDB — the API has no role-management endpoint yet.
