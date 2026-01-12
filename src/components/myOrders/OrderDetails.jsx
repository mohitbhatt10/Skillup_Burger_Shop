import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Country, State } from "country-state-city";
import { AiOutlineCheckCircle, AiOutlineShoppingCart } from "react-icons/ai";
import { useStore } from "../../context/StoreContext";

function OrderDetails() {
  const { id } = useParams();
  const { state, getOrderById } = useStore();
  const [order, setOrder] = useState(() =>
    state.orders.find((o) => String(o._id) === String(id))
  );
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    let active = true;
    if (!order) {
      getOrderById(id).then((res) => {
        if (active) {
          setOrder(res);
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
    return () => {
      active = false;
    };
  }, [id, order, getOrderById]);

  const shipping = order?.shippingAddress;
  const countryName = shipping?.country
    ? Country.getCountryByCode(shipping.country)?.name || shipping.country
    : "";
  const stateName = shipping?.state
    ? State.getStateByCodeAndCountry(shipping.state, shipping.country)?.name ||
      shipping.state
    : "";

  if (loading) {
    return (
      <section className="min-h-screen bg-pink-light py-12">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <p className="text-dark-light">Loading order...</p>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="min-h-screen bg-pink-light py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-12 text-center"
          >
            <h2 className="text-2xl font-bold text-dark mb-6">
              Order not found
            </h2>
            <Link
              to="/myorders"
              className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Back to Orders
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-pink-light py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Order Details</h2>
                <p className="text-white/80">
                  Order ID: {order.orderId || order._id}
                </p>
              </div>
              <AiOutlineCheckCircle className="text-5xl" />
            </div>
          </div>

          {/* Order Meta */}
          <div className="p-8 border-b border-gray-200">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-dark-light text-sm mb-1">Status</p>
                <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                  {order.orderStatus}
                </span>
              </div>
              <div>
                <p className="text-dark-light text-sm mb-1">Payment Method</p>
                <p className="font-semibold text-dark">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-dark-light text-sm mb-1">Order Date</p>
                <p className="font-semibold text-dark">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="p-8 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-dark mb-4">
              Shipping Address
            </h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-dark mb-2">
                <strong>Address:</strong> {shipping.house}, {shipping.city}
              </p>
              <p className="text-dark mb-2">
                <strong>Location:</strong> {stateName}, {countryName} -{" "}
                {shipping.pinCode}
              </p>
              <p className="text-dark">
                <strong>Contact:</strong> {shipping.contact}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="p-8 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-dark mb-6 flex items-center space-x-2">
              <AiOutlineShoppingCart className="text-primary" />
              <span>Order Items</span>
            </h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <motion.div
                  key={item._id || item.product}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-contain rounded-lg"
                    />
                    <div>
                      <h4 className="font-semibold text-dark">{item.title}</h4>
                      <p className="text-dark-light text-sm">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-primary text-lg">
                    ₹{Number(item.price) * Number(item.quantity)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-8 bg-gray-50">
            <h3 className="text-2xl font-bold text-dark mb-6">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-dark-light">
                <span>Subtotal</span>
                <span className="font-semibold">₹{order.amount.subtotal}</span>
              </div>
              <div className="flex justify-between text-dark-light">
                <span>Tax (18%)</span>
                <span className="font-semibold">₹{order.amount.tax}</span>
              </div>
              <div className="flex justify-between text-dark-light">
                <span>Shipping</span>
                <span className="font-semibold">₹{order.amount.shipping}</span>
              </div>
              <div className="border-t-2 border-gray-300 pt-3 flex justify-between text-dark text-xl font-bold">
                <span>Total</span>
                <span className="text-primary">₹{order.amount.total}</span>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="p-8">
            <Link
              to="/myorders"
              className="block w-full text-center bg-primary hover:bg-primary-dark text-white py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Back to Orders
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default OrderDetails;
