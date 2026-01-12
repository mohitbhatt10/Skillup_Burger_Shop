const express = require("express");
const { body } = require("express-validator");
const {
  submitContact,
  getMessages,
} = require("../controllers/contactController");
const { protect } = require("../middleware/auth");
const { admin } = require("../middleware/admin");
const validate = require("../middleware/validator");

const router = express.Router();

router.post(
  "/",
  validate([
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("message").notEmpty().withMessage("Message is required"),
  ]),
  submitContact
);

router.get("/", protect, admin, getMessages);

module.exports = router;
