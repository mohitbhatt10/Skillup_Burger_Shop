const express = require("express");
const { body } = require("express-validator");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");
const { protect } = require("../middleware/auth");
const { admin } = require("../middleware/admin");
const validate = require("../middleware/validator");

const router = express.Router();

router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);

router.post(
  "/",
  protect,
  validate([
    body("items")
      .isArray({ min: 1 })
      .withMessage("At least one order item is required"),
    body("shippingAddress.house").notEmpty().withMessage("House is required"),
    body("shippingAddress.city").notEmpty().withMessage("City is required"),
    body("shippingAddress.state").notEmpty().withMessage("State is required"),
    body("shippingAddress.country")
      .notEmpty()
      .withMessage("Country is required"),
    body("shippingAddress.pinCode")
      .notEmpty()
      .withMessage("Pin code is required"),
    body("shippingAddress.contact")
      .notEmpty()
      .withMessage("Contact is required"),
  ]),
  createOrder
);

router.put(
  "/:id/status",
  protect,
  admin,
  validate([
    body("orderStatus").notEmpty().withMessage("orderStatus is required"),
  ]),
  updateOrderStatus
);

router.delete("/:id", protect, cancelOrder);

module.exports = router;
