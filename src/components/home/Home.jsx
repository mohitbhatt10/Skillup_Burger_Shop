import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Founder from "./Founder";
import Menu from "./Menu";
import bgImage from "../../assets/bg.jpg";

function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-br from-primary/10 to-pink-light overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${bgImage})` }}
        ></div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-dark uppercase mb-6 leading-tight"
            >
              Welcome to <span className="text-primary">Skillup Burger</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-dark-light mb-8"
            >
              Experience the best burgers crafted with passion and premium
              ingredients
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Link
                to="#menu"
                className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Explore Menu
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Menu Section */}
      <div id="menu">
        <Menu />
      </div>

      {/* Founder Section */}
      <Founder />
    </>
  );
}

export default Home;
