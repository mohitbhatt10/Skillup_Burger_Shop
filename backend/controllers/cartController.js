const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );
    res
      .status(200)
      .json({ success: true, cart: cart || { items: [], totalAmount: 0 } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch cart" });
  }
};

const addItem = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalAmount: 0,
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (existingItem) {
      existingItem.quantity += Number(quantity);
      existingItem.price = product.price;
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        price: product.price,
      });
    }

    await cart.save();
    await cart.populate("items.product");

    res
      .status(200)
      .json({ success: true, message: "Item added to cart", cart });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to add item to cart" });
  }
};

const updateItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    const item = cart.items.id(req.params.itemId);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found" });

    item.quantity = Number(quantity);
    await cart.save();
    await cart.populate("items.product");

    res.status(200).json({ success: true, message: "Cart updated", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update cart" });
  }
};

const removeItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    const item = cart.items.id(req.params.itemId);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found" });

    item.deleteOne();
    await cart.save();
    await cart.populate("items.product");

    res
      .status(200)
      .json({ success: true, message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to remove item" });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(200).json({ success: true, message: "Cart cleared", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to clear cart" });
  }
};

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
