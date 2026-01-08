import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlineEye } from "react-icons/ai";
import { useStore } from "../../context/StoreContext";

const MyOrders = () => {
  const { state } = useStore();
  const orders = state.orders;

  return (
    <section className="min-h-screen bg-pink-light py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-dark mb-8 text-center">
          My <span className="text-primary">Orders</span>
        </h1>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto"
          >
            <p className="text-2xl text-dark-light mb-6">
              You have not placed any orders yet.
            </p>
            <Link
              to="/"
              className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Browse Menu
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Item Qty
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Payment Method
                    </th>
                    <th className="px-6 py-4 text-center font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order, idx) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-dark">
                        {order.id}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-dark-light">
                        {order.items.reduce(
                          (sum, i) => sum + Number(i.qty || 0),
                          0
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-primary">
                        ₹{order.amount?.total ?? 0}
                      </td>
                      <td className="px-6 py-4 text-dark-light">
                        {order.paymentMethod}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          to={`/order/${order.id}`}
                          aria-label={`View ${order.id}`}
                          className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 hover:bg-primary hover:text-white text-primary rounded-full transition-all duration-300"
                        >
                          <AiOutlineEye className="text-xl" />
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default MyOrders;
