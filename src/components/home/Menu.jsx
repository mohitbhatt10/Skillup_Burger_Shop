import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MenuCard from "./MenuCard";
import { useStore } from "../../context/StoreContext";

function Menu() {
  const navigate = useNavigate();
  const { products, loading, fetchProducts, addToCart, isAuthenticated } =
    useStore();

  useEffect(() => {
    if (!products.length) fetchProducts();
  }, [products.length, fetchProducts]);

  const handleBuy = async (productId) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    await addToCart(productId, 1);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-dark mb-4">
            Our <span className="text-primary">Menu</span>
          </h2>
          <p className="text-dark-light text-lg max-w-2xl mx-auto">
            Handcrafted burgers made with love and the finest ingredients
          </p>
        </motion.div>

        {loading.products ? (
          <p className="text-center text-dark-light">Loading menu...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, idx) => (
              <MenuCard
                key={product._id}
                itemNum={product._id}
                burgerSrc={product.image}
                price={product.price}
                title={product.title}
                handler={handleBuy}
                delay={idx * 0.1}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Menu;
