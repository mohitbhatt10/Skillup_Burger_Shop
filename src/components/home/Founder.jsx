import React from "react";
import { motion } from "framer-motion";
import me from "../../assets/skj.jpg";

const Founder = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.img
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            src={me}
            alt="Founder"
            className="w-48 h-48 rounded-full mx-auto mb-8 shadow-2xl border-4 border-primary"
          />
          <h3 className="text-4xl font-bold text-dark mb-6">
            Meet Our <span className="text-primary">Founder</span>
          </h3>
          <h4 className="text-2xl font-semibold text-primary mb-4">Nelson</h4>
          <p className="text-lg text-dark-light leading-relaxed max-w-2xl mx-auto">
            Hey, Everyone! I am Nelson, the founder of Skillup Burger Shop.
            <br />
            <br />
            Our aim is to create the most tasty and delightful burgers on the
            planet, using only the finest ingredients and served with love and
            passion.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Founder;
