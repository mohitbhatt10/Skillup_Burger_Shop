import React, { useState } from "react";
import { motion } from "framer-motion";
import { AiOutlineShoppingCart } from "react-icons/ai";

const MenuCard = ({ itemNum, burgerSrc, price, title, handler, delay = 0 }) => {
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    handler(itemNum);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 group"
    >
      {/* Image Container */}
      <div className="relative h-64 bg-gradient-to-br from-primary/10 to-pink-light overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
          src={burgerSrc}
          alt={title}
          className="w-full h-full object-contain p-4"
        />
        <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
          ₹{price}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-dark mb-4 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          className={`w-full py-3 rounded-full font-semibold flex items-center justify-center space-x-2 transition-all duration-300 ${
            added
              ? "bg-green-500 text-white"
              : "bg-primary hover:bg-primary-dark text-white"
          }`}
        >
          <AiOutlineShoppingCart className="text-xl" />
          <span>{added ? "Added to Cart!" : "Add to Cart"}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MenuCard;
