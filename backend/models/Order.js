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
  { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderId: 1 });

module.exports = mongoose.model("Order", orderSchema);
