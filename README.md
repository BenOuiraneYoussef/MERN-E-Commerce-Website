# 🛒 ShopMERN - Full Stack E-Commerce App

A full-featured e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript.

## 🌐 Live Demo
Coming soon...

## 📸 Features

### Customer
- 🏠 Home page with featured products and categories
- 🔍 Browse and search products with filters
- 🛍️ Product detail page with reviews and ratings
- 🛒 Persistent shopping cart (saved to database)
- 💳 Multi-step checkout (shipping → payment → confirm)
- 📦 Order history with real-time status
- 🔐 JWT Authentication (register & login)

### Admin
- 👑 Admin dashboard with stats
- 📦 Manage products (add, edit, delete)
- 🛒 Manage orders (update status)
- 🔒 Admin-only protected routes

## 🧰 Tech Stack

### Frontend
- React 18 + TypeScript
- React Router v6
- Axios
- Vite

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed and running

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/mern-ecommerce.git
cd mern-ecommerce
```

### 2. Setup the server
```bash
cd server
npm install
```

Create a `.env` file in the server folder:
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern-ecommerce
JWT_SECRET=supersecretkey123changeThis
JWT_EXPIRE=30d
```

Seed the database:
```bash
node utils/seeder.js
```

Start the server:
```bash
npm run dev
```

### 3. Setup the client
```bash
cd client
npm install
npm run dev
```

### 4. Open the app
```
http://localhost:5173
```

## 🔑 Test Accounts

| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@example.com | admin123 |
| User  | john@example.com | password123 |

## 📁 Project Structure
```
mern-ecommerce/
├── client/                 # React + TypeScript frontend
│   └── src/
│       ├── components/     # Navbar, ProtectedRoute
│       ├── context/        # Auth & Cart context
│       ├── pages/          # All pages
│       │   └── admin/      # Admin dashboard pages
│       ├── services/       # Axios API calls
│       └── types/          # TypeScript interfaces
│
└── server/                 # Node + Express backend
    ├── config/             # Database connection
    ├── controllers/        # Route controllers
    ├── middleware/         # Auth middleware
    ├── models/             # Mongoose models
    ├── routes/             # API routes
    └── utils/              # Seeder script
```

## 📝 API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user

### Products
- `GET /api/products` — Get all products
- `GET /api/products/:id` — Get single product
- `POST /api/products` — Create product (admin)
- `PUT /api/products/:id` — Update product (admin)
- `DELETE /api/products/:id` — Delete product (admin)

### Cart
- `GET /api/cart` — Get cart
- `POST /api/cart` — Add to cart
- `PUT /api/cart/:productId` — Update quantity
- `DELETE /api/cart/:productId` — Remove item
- `DELETE /api/cart/clear` — Clear cart

### Orders
- `POST /api/orders` — Place order
- `GET /api/orders/my` — Get my orders
- `GET /api/orders` — Get all orders (admin)
- `PUT /api/orders/:id/status` — Update status (admin)

## 👨‍💻 Author
Built with ❤️ by Joe
