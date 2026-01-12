import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlinePlus, AiOutlineMinus, AiOutlineDelete } from "react-icons/ai";
import { useStore } from "../../context/StoreContext";

const CartItem = ({ value, title, img, increment, decrement, remove }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-center justify-between"
  >
    <div className="flex items-center space-x-4">
      <img
        src={img}
        alt={title}
        className="w-20 h-20 object-contain rounded-lg"
      />
      <h4 className="text-lg font-semibold text-dark">{title}</h4>
    </div>

    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-2">
        <button
          onClick={decrement}
          className="p-2 hover:bg-primary hover:text-white rounded-full transition-colors"
        >
          <AiOutlineMinus />
        </button>
        <span className="w-12 text-center font-semibold">{value}</span>
        <button
          onClick={increment}
          className="p-2 hover:bg-primary hover:text-white rounded-full transition-colors"
        >
          <AiOutlinePlus />
        </button>
      </div>

      <button
        onClick={remove}
        className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-colors"
      >
        <AiOutlineDelete className="text-xl" />
      </button>
    </div>
  </motion.div>
);

const Cart = () => {
  const { state, updateCartItem, removeCartItem, totals, loading } = useStore();
  const items = state.cartItems;

  return (
    <section className="min-h-screen bg-pink-light py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-dark mb-8 text-center">
          Your <span className="text-primary">Cart</span>
        </h1>

        {loading.cart && items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-12 text-center"
          >
            <p className="text-2xl text-dark-light mb-6">Loading cart...</p>
          </motion.div>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-12 text-center"
          >
            <p className="text-2xl text-dark-light mb-6">Your cart is empty</p>
            <Link
              to="/"
              className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Browse Menu
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {items.map((item) => (
                <CartItem
                  key={item.cartItemId}
                  title={item.title}
                  img={item.img}
                  value={item.qty}
                  increment={() =>
                    updateCartItem(item.cartItemId, Number(item.qty) + 1)
                  }
                  decrement={() =>
                    updateCartItem(
                      item.cartItemId,
                      Math.max(1, Number(item.qty) - 1)
                    )
                  }
                  remove={() => removeCartItem(item.cartItemId)}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
                <h3 className="text-2xl font-bold text-dark mb-6">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-dark-light">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{totals.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-dark-light">
                    <span>Tax (18%)</span>
                    <span className="font-semibold">₹{totals.tax}</span>
                  </div>
                  <div className="flex justify-between text-dark-light">
                    <span>Shipping</span>
                    <span className="font-semibold">₹{totals.shipping}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between text-dark text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{totals.total}</span>
                  </div>
                </div>

                <Link
                  to="/shipping"
                  className="block w-full bg-primary hover:bg-primary-dark text-white text-center py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
