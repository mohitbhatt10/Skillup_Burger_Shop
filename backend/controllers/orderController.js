const Order = require("../models/Order");
const Product = require("../models/Product");
const generateOrderId = require("../utils/generateOrderId");

const computeAmounts = async (items) => {
  let subtotal = 0;
  const normalizedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) throw new Error("Invalid product in order items");

    const qty = Number(item.quantity) || 1;
    const price = product.price;
    subtotal += price * qty;

    normalizedItems.push({
      product: product._id,
      title: product.title,
      price,
      quantity: qty,
      image: product.image,
    });
  }

  const taxRate = 0.18;
  const tax = Number((subtotal * taxRate).toFixed(2));
  const shipping = 50;
  const total = Number((subtotal + tax + shipping).toFixed(2));

  return {
    items: normalizedItems,
    amounts: { subtotal, tax, shipping, total },
  };
};

const createOrder = async (req, res) => {
  try {
    const { items = [], shippingAddress, paymentMethod = "COD" } = req.body;

    if (!items.length)
      return res
        .status(400)
        .json({ success: false, message: "No order items" });
    if (!shippingAddress)
      return res
        .status(400)
        .json({ success: false, message: "Shipping address required" });

    const { items: normalizedItems, amounts } = await computeAmounts(items);

    const order = await Order.create({
      orderId: generateOrderId(),
      user: req.user._id,
      items: normalizedItems,
      shippingAddress,
      amount: amounts,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Pending",
      orderStatus: "Processing",
    });

    res
      .status(201)
      .json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Order creation failed",
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.user.role === "admin") {
      delete filter.user;
      if (req.query.status) filter.orderStatus = req.query.status;
      if (req.query.userId) filter.user = req.query.userId;
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "name email role");
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    const isOwner =
      order.user && order.user._id.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to view this order" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch order" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    order.orderStatus = orderStatus || order.orderStatus;
    if (orderStatus === "Delivered") {
      order.deliveredAt = new Date();
    }
    if (orderStatus === "Cancelled") {
      order.cancelledAt = new Date();
    }

    await order.save();
    res
      .status(200)
      .json({ success: true, message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update order" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    const isOwner = order.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this order",
      });
    }

    if (order.orderStatus !== "Processing" && req.user.role !== "admin") {
      return res
        .status(400)
        .json({ success: false, message: "Cannot cancel this order" });
    }

    order.orderStatus = "Cancelled";
    order.cancelledAt = new Date();
    await order.save();

    res
      .status(200)
      .json({ success: true, message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to cancel order" });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};
