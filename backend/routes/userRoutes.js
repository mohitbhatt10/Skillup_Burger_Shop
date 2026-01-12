const express = require("express");
const { body } = require("express-validator");
const {
  getProfile,
  updateProfile,
  updatePassword,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validator");

const router = express.Router();

router.get("/profile", protect, getProfile);

router.put(
  "/profile",
  protect,
  validate([
    body("name")
      .optional()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("email").optional().isEmail().withMessage("Provide a valid email"),
  ]),
  updateProfile
);

router.put(
  "/password",
  protect,
  validate([
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
  ]),
  updatePassword
);

module.exports = router;
