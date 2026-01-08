import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineShoppingCart, AiOutlineLogout } from "react-icons/ai";
import me from "../../assets/skj.jpg";
import { useStore } from "../../context/StoreContext";

const Profile = () => {
  const navigate = useNavigate();
  const { state, logout } = useStore();
  const user = state.user || { name: "Guest", email: "" };

  return (
    <section className="min-h-screen bg-pink-light py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header with gradient */}
          <div className="h-32 bg-gradient-to-r from-primary to-primary-dark"></div>

          {/* Profile Content */}
          <div className="relative px-8 pb-8">
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              src={me}
              alt="User"
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl -mt-16 mx-auto"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mt-4"
            >
              <h2 className="text-3xl font-bold text-dark">{user.name}</h2>
              {user.email && (
                <p className="text-dark-light mt-2">{user.email}</p>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 space-y-4"
            >
              <Link
                to="/myorders"
                className="flex items-center justify-center space-x-2 w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <AiOutlineShoppingCart className="text-xl" />
                <span>My Orders</span>
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="flex items-center justify-center space-x-2 w-full bg-gray-200 hover:bg-gray-300 text-dark py-3 rounded-full font-semibold transition-all duration-300"
              >
                <AiOutlineLogout className="text-xl" />
                <span>Logout</span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Profile;
