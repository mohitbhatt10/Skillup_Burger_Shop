const express = require("express");
const { body } = require("express-validator");
const {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validator");

const router = express.Router();

router.get("/", protect, getCart);

router.post(
  "/items",
  protect,
  validate([
    body("productId").notEmpty().withMessage("productId is required"),
    body("quantity")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
  ]),
  addItem
);

router.put(
  "/items/:itemId",
  protect,
  validate([
    body("quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
  ]),
  updateItem
);

router.delete("/items/:itemId", protect, removeItem);
router.delete("/", protect, clearCart);

module.exports = router;
