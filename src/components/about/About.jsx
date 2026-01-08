import React from "react";
import { motion } from "framer-motion";
import { GiHamburger } from "react-icons/gi";
import { AiFillStar } from "react-icons/ai";

function About() {
  const features = [
    { title: "Premium Quality", desc: "Fresh ingredients sourced daily" },
    { title: "Expert Chefs", desc: "Skilled culinary professionals" },
    { title: "Fast Delivery", desc: "Hot burgers delivered to your door" },
    { title: "Great Value", desc: "Affordable prices without compromise" },
  ];

  return (
    <section className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <GiHamburger className="text-6xl text-primary mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl font-bold text-dark mb-4">
            About <span className="text-primary">Skillup Burger</span>
          </h2>
          <p className="text-dark-light text-lg max-w-3xl mx-auto">
            We are passionate about crafting the perfect burger experience.
            Since our founding, we've been committed to serving the best burgers
            in town using only the finest ingredients.
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary/10 to-pink-light rounded-2xl p-8 md:p-12 mb-16"
        >
          <h3 className="text-3xl font-bold text-dark mb-6">Our Story</h3>
          <div className="space-y-4 text-dark-light text-lg">
            <p>
              Founded with a simple mission: to create the most delicious and
              satisfying burgers that bring joy to every customer. Our journey
              started with a passion for quality food and exceptional service.
            </p>
            <p>
              Today, we continue to uphold our commitment to excellence,
              preparing each burger with care, using premium ingredients, and
              serving with a smile. Every burger tells a story of dedication and
              love for great food.
            </p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AiFillStar className="text-3xl text-primary" />
              </div>
              <h4 className="text-xl font-bold text-dark mb-2">
                {feature.title}
              </h4>
              <p className="text-dark-light">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a
            href="/#menu"
            className="inline-block bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Try Our Burgers Today!
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default About;
