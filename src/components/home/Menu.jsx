import React from "react";
import { motion } from "framer-motion";
import MenuCard from "./MenuCard";
import { products, useStore } from "../../context/StoreContext";

function Menu() {
  const { addToCart } = useStore();

  const handleBuy = (id) => {
    const product = products.find((p) => Number(p.id) === Number(id));
    if (product) addToCart(product);
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <MenuCard
              key={product.id}
              itemNum={product.id}
              burgerSrc={product.img}
              price={product.price}
              title={product.title}
              handler={handleBuy}
              delay={idx * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Menu;
