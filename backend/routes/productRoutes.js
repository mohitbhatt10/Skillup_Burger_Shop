const express = require("express");
const { body } = require("express-validator");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect } = require("../middleware/auth");
const { admin } = require("../middleware/admin");
const validate = require("../middleware/validator");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);

router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  validate([
    body("title").notEmpty().withMessage("Title is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
  ]),
  createProduct
);

router.put(
  "/:id",
  protect,
  admin,
  upload.single("image"),
  validate([
    body("price").optional().isNumeric().withMessage("Price must be a number"),
  ]),
  updateProduct
);

router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
