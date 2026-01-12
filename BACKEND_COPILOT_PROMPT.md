# Backend Development Prompt: Skillup Burger Shop

## Project Context

This is a comprehensive prompt to generate a complete backend API for the **Skillup Burger Shop** - a React-based burger ordering application. The frontend is fully functional but currently uses localStorage for all data persistence. We need to build a production-ready Node.js/Express backend with MongoDB that will replace all localStorage operations with proper API endpoints.

### Frontend Technology Stack

- React.js with React Router
- Context API for state management
- Axios installed (ready for API integration)
- Tailwind CSS + SCSS for styling

### Required Backend Technology Stack

- **Runtime**: Node.js (v18+ LTS)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) + bcrypt for password hashing
- **File Upload**: Multer + Cloudinary (or local storage as fallback)
- **Email**: Nodemailer with Gmail/SMTP
- **Payment**: Razorpay (India) or Stripe (global) - initially COD only
- **Validation**: express-validator or Joi
- **Security**: helmet, cors, express-rate-limit, express-mongo-sanitize
- **Environment**: dotenv
- **Development**: nodemon

---

## Complete Backend Requirements

### 1. Project Structure

Create the following folder structure:

```
backend/
├── server.js                 # Entry point
├── config/
│   ├── db.js                # MongoDB connection
│   ├── cloudinary.js        # Cloudinary config (optional)
│   └── razorpay.js          # Payment gateway config (optional)
├── models/
│   ├── User.js              # User schema
│   ├── Product.js           # Product schema
│   ├── Cart.js              # Cart schema (optional)
│   ├── Order.js             # Order schema
│   └── ContactMessage.js    # Contact form schema
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User profile operations
│   ├── productController.js # Product CRUD
│   ├── cartController.js    # Cart operations
│   ├── orderController.js   # Order management
│   └── contactController.js # Contact form handling
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── userRoutes.js        # User endpoints
│   ├── productRoutes.js     # Product endpoints
│   ├── cartRoutes.js        # Cart endpoints
│   ├── orderRoutes.js       # Order endpoints
│   └── contactRoutes.js     # Contact endpoints
├── middleware/
│   ├── auth.js              # JWT verification middleware
│   ├── admin.js             # Admin authorization
│   ├── errorHandler.js      # Global error handler
│   ├── validator.js         # Input validation
│   └── upload.js            # File upload handling
├── utils/
│   ├── generateToken.js     # JWT token generation
│   ├── sendEmail.js         # Email sending utility
│   └── generateOrderId.js   # Order ID generator
├── seeders/
│   └── productSeeder.js     # Initial product data
├── .env                     # Environment variables
├── .env.example            # Template for env vars
├── .gitignore
├── package.json
└── README.md
```

---

## 2. MongoDB Schema Definitions

### 2.1 User Model (models/User.js)

```javascript
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePicture: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
```

### 2.2 Product Model (models/Product.js)

```javascript
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
    },
    category: {
      type: String,
      enum: ["burger", "sides", "drinks", "desserts"],
      default: "burger",
    },
    available: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
```

### 2.3 Cart Model (models/Cart.js) - Optional

```javascript
const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total amount before saving
cartSchema.pre("save", function (next) {
  this.totalAmount = this.items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
```

### 2.4 Order Model (models/Order.js)

```javascript
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      house: {
        type: String,
        required: [true, "House/Building is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      state: {
        type: String,
        required: [true, "State is required"],
      },
      country: {
        type: String,
        required: [true, "Country is required"],
      },
      pinCode: {
        type: String,
        required: [true, "Pin code is required"],
      },
      contact: {
        type: String,
        required: [true, "Contact number is required"],
      },
    },
    amount: {
      subtotal: {
        type: Number,
        required: true,
      },
      tax: {
        type: Number,
        required: true,
      },
      shipping: {
        type: Number,
        required: true,
        default: 50,
      },
      total: {
        type: Number,
        required: true,
      },
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Card", "UPI", "Wallet"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "Processing",
        "Confirmed",
        "Preparing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Processing",
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    deliveredAt: Date,
    cancelledAt: Date,
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderId: 1 });

module.exports = mongoose.model("Order", orderSchema);
```

### 2.5 ContactMessage Model (models/ContactMessage.js)

```javascript
const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: ["New", "Read", "Responded"],
      default: "New",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
```

---

## 3. Complete API Endpoint Specifications

### 3.1 Authentication Routes (POST /api/auth/\*)

#### POST /api/auth/register

**Description**: Register a new user account  
**Access**: Public  
**Request Body**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201)**:

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### POST /api/auth/login

**Description**: Login with email and password  
**Access**: Public  
**Request Body**:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200)**:

```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### POST /api/auth/logout

**Description**: Logout user (client-side token removal primarily)  
**Access**: Private  
**Response (200)**:

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET /api/auth/me

**Description**: Get current logged-in user profile  
**Access**: Private  
**Headers**: `Authorization: Bearer <token>`  
**Response (200)**:

```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2026-01-12T00:00:00.000Z"
  }
}
```

---

### 3.2 User Routes (GET/PUT /api/users/\*)

#### GET /api/users/profile

**Description**: Get user profile (same as /api/auth/me)  
**Access**: Private  
**Response**: Same as GET /api/auth/me

#### PUT /api/users/profile

**Description**: Update user profile (name, email)  
**Access**: Private  
**Request Body**:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response (200)**:

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "user_id",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user"
  }
}
```

#### PUT /api/users/password

**Description**: Change user password  
**Access**: Private  
**Request Body**:

```json
{
  "currentPassword": "oldpass123",
  "newPassword": "newpass456"
}
```

**Response (200)**:

```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

### 3.3 Product Routes (GET/POST/PUT/DELETE /api/products/\*)

#### GET /api/products

**Description**: Get all products (with optional filtering)  
**Access**: Public  
**Query Params**: `?category=burger&available=true`  
**Response (200)**:

```json
{
  "success": true,
  "count": 3,
  "products": [
    {
      "_id": "prod_id_1",
      "title": "Classic Burger",
      "description": "Delicious classic burger",
      "price": 199,
      "image": "image_url",
      "category": "burger",
      "available": true,
      "rating": 4.5,
      "numReviews": 10
    }
  ]
}
```

#### GET /api/products/:id

**Description**: Get single product by ID  
**Access**: Public  
**Response (200)**:

```json
{
  "success": true,
  "product": {
    "_id": "prod_id",
    "title": "Classic Burger",
    "price": 199,
    ...
  }
}
```

#### POST /api/products

**Description**: Create new product (admin only)  
**Access**: Private (Admin)  
**Request Body** (multipart/form-data):

```
title: "New Burger"
description: "Amazing new burger"
price: 299
image: [file upload]
category: "burger"
```

**Response (201)**:

```json
{
  "success": true,
  "message": "Product created successfully",
  "product": { ... }
}
```

#### PUT /api/products/:id

**Description**: Update product (admin only)  
**Access**: Private (Admin)  
**Request Body**: Same as POST (all fields optional)  
**Response (200)**:

```json
{
  "success": true,
  "message": "Product updated successfully",
  "product": { ... }
}
```

#### DELETE /api/products/:id

**Description**: Delete product (admin only)  
**Access**: Private (Admin)  
**Response (200)**:

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### 3.4 Cart Routes (GET/POST/PUT/DELETE /api/cart/\*)

#### GET /api/cart

**Description**: Get user's cart  
**Access**: Private  
**Response (200)**:

```json
{
  "success": true,
  "cart": {
    "items": [
      {
        "product": { "_id": "prod_id", "title": "Classic Burger", ... },
        "quantity": 2,
        "price": 199
      }
    ],
    "totalAmount": 398
  }
}
```

#### POST /api/cart/items

**Description**: Add item to cart  
**Access**: Private  
**Request Body**:

```json
{
  "productId": "prod_id",
  "quantity": 1
}
```

**Response (200)**:

```json
{
  "success": true,
  "message": "Item added to cart",
  "cart": { ... }
}
```

#### PUT /api/cart/items/:itemId

**Description**: Update item quantity in cart  
**Access**: Private  
**Request Body**:

```json
{
  "quantity": 3
}
```

**Response (200)**:

```json
{
  "success": true,
  "message": "Cart updated",
  "cart": { ... }
}
```

#### DELETE /api/cart/items/:itemId

**Description**: Remove specific item from cart  
**Access**: Private  
**Response (200)**:

```json
{
  "success": true,
  "message": "Item removed from cart",
  "cart": { ... }
}
```

#### DELETE /api/cart

**Description**: Clear entire cart  
**Access**: Private  
**Response (200)**:

```json
{
  "success": true,
  "message": "Cart cleared"
}
```

---

### 3.5 Order Routes (GET/POST/PUT /api/orders/\*)

#### GET /api/orders

**Description**: Get all orders for logged-in user  
**Access**: Private  
**Query Params**: `?status=Processing&limit=10`  
**Response (200)**:

```json
{
  "success": true,
  "count": 5,
  "orders": [
    {
      "_id": "order_db_id",
      "orderId": "ORD-1736640000000",
      "items": [...],
      "amount": {
        "subtotal": 398,
        "tax": 71.64,
        "shipping": 50,
        "total": 519.64
      },
      "orderStatus": "Processing",
      "paymentStatus": "Pending",
      "paymentMethod": "COD",
      "createdAt": "2026-01-12T10:00:00.000Z"
    }
  ]
}
```

#### GET /api/orders/:id

**Description**: Get specific order details  
**Access**: Private (owner or admin)  
**Response (200)**:

```json
{
  "success": true,
  "order": {
    "_id": "order_db_id",
    "orderId": "ORD-1736640000000",
    "user": { "name": "John Doe", "email": "john@example.com" },
    "items": [
      {
        "product": "prod_id",
        "title": "Classic Burger",
        "price": 199,
        "quantity": 2,
        "image": "image_url"
      }
    ],
    "shippingAddress": {
      "house": "123 Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India",
      "pinCode": "400001",
      "contact": "9876543210"
    },
    "amount": { ... },
    "orderStatus": "Processing",
    "paymentStatus": "Pending",
    "createdAt": "2026-01-12T10:00:00.000Z"
  }
}
```

#### POST /api/orders

**Description**: Create new order  
**Access**: Private  
**Request Body**:

```json
{
  "items": [
    {
      "product": "prod_id",
      "title": "Classic Burger",
      "price": 199,
      "quantity": 2,
      "image": "image_url"
    }
  ],
  "shippingAddress": {
    "house": "123 Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "pinCode": "400001",
    "contact": "9876543210"
  },
  "paymentMethod": "COD"
}
```

**Response (201)**:

```json
{
  "success": true,
  "message": "Order placed successfully",
  "order": { ... }
}
```

#### PUT /api/orders/:id/status

**Description**: Update order status (admin only)  
**Access**: Private (Admin)  
**Request Body**:

```json
{
  "orderStatus": "Confirmed"
}
```

**Response (200)**:

```json
{
  "success": true,
  "message": "Order status updated",
  "order": { ... }
}
```

#### DELETE /api/orders/:id

**Description**: Cancel order (user: only if Processing, admin: anytime)  
**Access**: Private  
**Response (200)**:

```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "order": { ... }
}
```

---

### 3.6 Contact Routes (POST /api/contact)

#### POST /api/contact

**Description**: Submit contact form  
**Access**: Public  
**Request Body**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I have a question about delivery times."
}
```

**Response (201)**:

```json
{
  "success": true,
  "message": "Your message has been sent successfully! We'll get back to you soon."
}
```

#### GET /api/contact (Optional - Admin only)

**Description**: Get all contact messages  
**Access**: Private (Admin)  
**Response (200)**:

```json
{
  "success": true,
  "count": 10,
  "messages": [ ... ]
}
```

---

## 4. Authentication & Authorization Implementation

### 4.1 JWT Token Generation (utils/generateToken.js)

```javascript
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

module.exports = generateToken;
```

### 4.2 Auth Middleware (middleware/auth.js)

```javascript
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
};

// Admin middleware
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Not authorized as admin",
    });
  }
};
```

---

## 5. Utility Functions

### 5.1 Order ID Generator (utils/generateOrderId.js)

```javascript
const generateOrderId = () => {
  return `ORD-${Date.now()}`;
};

module.exports = generateOrderId;
```

### 5.2 Email Sender (utils/sendEmail.js)

```javascript
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email options
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
```

---

## 6. Error Handling Middleware (middleware/errorHandler.js)

```javascript
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for dev
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
```

---

## 7. Server Entry Point (server.js)

```javascript
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const contactRoutes = require("./routes/contactRoutes");

// Initialize app
const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // 100 requests per window
});
app.use("/api/", limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
```

---

## 8. Database Connection (config/db.js)

```javascript
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

## 9. Environment Variables (.env.example)

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Database
MONGO_URI=mongodb://localhost:27017/burger_shop
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/burger_shop?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Email Configuration (using Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@skillupburgershop.com
EMAIL_FROM_NAME=Skillup Burger Shop

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (Optional - for payment integration)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Stripe (Optional - alternative payment)
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

---

## 10. Package.json Dependencies

```json
{
  "name": "skillup-burger-shop-backend",
  "version": "1.0.0",
  "description": "Backend API for Skillup Burger Shop",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node seeders/productSeeder.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "express-mongo-sanitize": "^2.2.0",
    "express-rate-limit": "^6.7.0",
    "express-validator": "^7.0.1",
    "helmet": "^7.0.0",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.0.3",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.1",
    "cloudinary": "^1.36.2",
    "razorpay": "^2.8.6"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

---

## 11. Product Seeder (seeders/productSeeder.js)

```javascript
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const connectDB = require("../config/db");

const products = [
  {
    title: "Classic Burger",
    description:
      "Juicy beef patty with fresh lettuce, tomato, onion, and our special sauce",
    price: 199,
    image: "https://res.cloudinary.com/demo/image/upload/burger1.png",
    category: "burger",
    available: true,
    rating: 4.5,
    numReviews: 25,
  },
  {
    title: "Cheese Burger",
    description: "Classic burger topped with melted cheddar cheese",
    price: 249,
    image: "https://res.cloudinary.com/demo/image/upload/burger2.png",
    category: "burger",
    available: true,
    rating: 4.7,
    numReviews: 38,
  },
  {
    title: "Double Deluxe",
    description:
      "Double beef patties with extra cheese, bacon, and premium toppings",
    price: 299,
    image: "https://res.cloudinary.com/demo/image/upload/burger3.png",
    category: "burger",
    available: true,
    rating: 4.8,
    numReviews: 42,
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany();

    // Insert new products
    await Product.insertMany(products);

    console.log("✅ Products seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();
```

---

## 12. Implementation Priority & Phases

### Phase 1: Core Setup (Day 1)

- [ ] Initialize Node.js project with package.json
- [ ] Install all dependencies
- [ ] Set up folder structure
- [ ] Create .env file with configurations
- [ ] Implement database connection (config/db.js)
- [ ] Create server.js with basic Express setup

### Phase 2: Authentication & Users (Day 2)

- [ ] Create User model with password hashing
- [ ] Implement JWT token generation utility
- [ ] Create auth middleware (protect, admin)
- [ ] Build authController (register, login, logout, getMe)
- [ ] Build userController (getProfile, updateProfile, changePassword)
- [ ] Set up auth routes and user routes
- [ ] Test all auth endpoints

### Phase 3: Products (Day 3)

- [ ] Create Product model
- [ ] Build productController (CRUD operations)
- [ ] Set up product routes
- [ ] Implement product seeder
- [ ] Test product endpoints
- [ ] Add image upload functionality (optional)

### Phase 4: Cart Management (Day 4)

- [ ] Create Cart model (optional - can use session-based)
- [ ] Build cartController (get, add, update, remove, clear)
- [ ] Set up cart routes
- [ ] Test cart endpoints

### Phase 5: Orders (Day 5)

- [ ] Create Order model
- [ ] Implement order ID generator
- [ ] Build orderController (create, getAll, getById, updateStatus, cancel)
- [ ] Set up order routes
- [ ] Test order endpoints
- [ ] Add email notification on order creation

### Phase 6: Contact & Misc (Day 6)

- [ ] Create ContactMessage model
- [ ] Build contactController
- [ ] Set up contact routes
- [ ] Implement email sender utility
- [ ] Test contact form submission

### Phase 7: Security & Optimization (Day 7)

- [ ] Add input validation (express-validator)
- [ ] Implement global error handler
- [ ] Add security middleware (helmet, cors, rate limiting)
- [ ] Test all endpoints thoroughly
- [ ] Write API documentation

### Phase 8: Advanced Features (Optional)

- [ ] Integrate Razorpay/Stripe payment
- [ ] Add file upload to Cloudinary
- [ ] Implement admin dashboard endpoints
- [ ] Add search & filtering
- [ ] Set up WebSocket for real-time updates

---

## 13. Testing Checklist

Use Postman or Thunder Client to test:

### Authentication Tests

- [ ] POST /api/auth/register - with valid data
- [ ] POST /api/auth/register - with duplicate email (should fail)
- [ ] POST /api/auth/login - with correct credentials
- [ ] POST /api/auth/login - with wrong password (should fail)
- [ ] GET /api/auth/me - with valid token
- [ ] GET /api/auth/me - without token (should fail)

### Product Tests

- [ ] GET /api/products - list all products
- [ ] GET /api/products/:id - get single product
- [ ] POST /api/products - create product as admin
- [ ] POST /api/products - create product as user (should fail)
- [ ] PUT /api/products/:id - update product
- [ ] DELETE /api/products/:id - delete product

### Cart Tests

- [ ] POST /api/cart/items - add item to cart
- [ ] GET /api/cart - get user's cart
- [ ] PUT /api/cart/items/:itemId - update quantity
- [ ] DELETE /api/cart/items/:itemId - remove item
- [ ] DELETE /api/cart - clear entire cart

### Order Tests

- [ ] POST /api/orders - create new order with valid shipping
- [ ] GET /api/orders - get all user orders
- [ ] GET /api/orders/:id - get specific order
- [ ] PUT /api/orders/:id/status - update status as admin
- [ ] DELETE /api/orders/:id - cancel order

### Contact Tests

- [ ] POST /api/contact - submit contact form
- [ ] GET /api/contact - get messages as admin

---

## 14. Security Considerations

### Implemented Security Features

✅ Password hashing with bcrypt (12 rounds)  
✅ JWT token authentication with expiration  
✅ Input sanitization (express-mongo-sanitize)  
✅ Security headers (helmet)  
✅ Rate limiting (100 requests per 10 minutes)  
✅ CORS configuration  
✅ Mongoose schema validation

### Additional Recommendations

- Use HTTPS in production
- Store JWT in httpOnly cookies (more secure than localStorage)
- Implement refresh tokens for long sessions
- Add CSRF protection for state-changing operations
- Validate and sanitize all user inputs
- Use environment variables for all secrets
- Implement logging and monitoring
- Regular dependency updates (npm audit)

---

## 15. Frontend Integration Guide

### Update Frontend Environment (.env in React project)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY=rzp_test_xxxxx
```

### Axios Configuration (create src/api/axiosConfig.js)

```javascript
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
```

### Update StoreContext.js to Use API

Replace localStorage operations with API calls:

```javascript
// Example: Login function
const login = async (name, email) => {
  try {
    const { data } = await API.post("/auth/register", {
      name,
      email,
      password: "temp123",
    });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    toast.success("Login successful!");
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
  }
};

// Example: Fetch products
const fetchProducts = async () => {
  try {
    const { data } = await API.get("/products");
    setProducts(data.products);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// Example: Create order
const createOrder = async (orderData) => {
  try {
    const { data } = await API.post("/orders", orderData);
    toast.success("Order placed successfully!");
    return data.order;
  } catch (error) {
    toast.error(error.response?.data?.message || "Order failed");
  }
};
```

---

## 16. Deployment Guide

### MongoDB Atlas Setup

1. Create free cluster at mongodb.com/atlas
2. Create database user
3. Whitelist IP (0.0.0.0/0 for dev)
4. Get connection string
5. Update MONGO_URI in .env

### Backend Deployment (Render/Railway/Heroku)

1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Frontend Updates

1. Update REACT_APP_API_URL to production backend URL
2. Rebuild and redeploy frontend

---

## 17. README.md Template

```markdown
# Skillup Burger Shop - Backend API

RESTful API for the Skillup Burger Shop application built with Node.js, Express, and MongoDB.

## Features

- User authentication (JWT)
- Product management
- Shopping cart
- Order management
- Contact form
- Admin functionality

## Installation

1. Clone repository
2. Install dependencies: `npm install`
3. Create .env file (see .env.example)
4. Start MongoDB
5. Run seeder: `npm run seed`
6. Start server: `npm run dev`

## API Documentation

Server runs on http://localhost:5000
API Base URL: http://localhost:5000/api

See full endpoint documentation in BACKEND_COPILOT_PROMPT.md

## Tech Stack

- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- Bcrypt
- Nodemailer
- Cloudinary (image uploads)
- Razorpay (payments)
```

---

## FINAL INSTRUCTIONS FOR COPILOT

When implementing this backend:

1. **Start with Phase 1** - Set up the basic project structure first
2. **Follow the exact folder structure** provided above
3. **Implement all models** exactly as specified with validation
4. **Create all controllers** with proper error handling
5. **Set up all routes** with correct HTTP methods and middleware
6. **Implement authentication middleware** before protected routes
7. **Test each phase** before moving to the next
8. **Use async/await** consistently for all database operations
9. **Add proper error messages** for validation failures
10. **Include comments** in complex logic sections

### Critical Requirements:

- All passwords must be hashed before storing
- All protected routes must verify JWT token
- All user inputs must be validated
- All database operations must have try-catch blocks
- Order amounts must be calculated server-side (never trust client)
- Admin operations must check role authorization
- Email notifications should not block request responses

### Code Quality Standards:

- Use ES6+ syntax (const, arrow functions, destructuring)
- Follow RESTful conventions
- DRY principle - no code duplication
- Meaningful variable names
- Consistent error handling pattern
- Proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)

---

## Ready to Build!

This prompt contains everything needed to build a production-ready backend API. Follow the phases sequentially, test thoroughly, and ensure all security measures are implemented. Good luck! 🚀
