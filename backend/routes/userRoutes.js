const express = require("express");
const { body } = require("express-validator");
const {
  getProfile,
  getAllUsers,
  updateProfile,
  updatePassword,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const { admin } = require("../middleware/admin");
const validate = require("../middleware/validator");

const router = express.Router();

router.get("/profile", protect, getProfile);
router.get("/all", protect, admin, getAllUsers);

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
  "/profile/admin",
  protect,
  admin,
  validate([
    body("targetUserId").notEmpty().withMessage("targetUserId is required"),
    body("role").optional().isIn(["user", "admin"]).withMessage("Invalid role"),
    body("isActive")
      .optional()
      .isBoolean()
      .withMessage("isActive must be boolean"),
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
