import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineEnvironment,
} from "react-icons/ai";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", email: "", message: "" });
    }, 3000);
  };

  return (
    <section className="min-h-screen bg-pink-light py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-dark mb-4">
            Get In <span className="text-primary">Touch</span>
          </h2>
          <p className="text-dark-light text-lg">We'd love to hear from you!</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-primary/10 p-4 rounded-full">
                  <AiOutlineMail className="text-3xl text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-dark mb-2">
                    Email Us
                  </h3>
                  <p className="text-dark-light">support@skillupburger.com</p>
                  <p className="text-dark-light">info@skillupburger.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-primary/10 p-4 rounded-full">
                  <AiOutlinePhone className="text-3xl text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-dark mb-2">
                    Call Us
                  </h3>
                  <p className="text-dark-light">+91 123 456 7890</p>
                  <p className="text-dark-light">Mon-Sun: 10AM - 10PM</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <AiOutlineEnvironment className="text-3xl text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-dark mb-2">
                    Visit Us
                  </h3>
                  <p className="text-dark-light">123 Burger Street</p>
                  <p className="text-dark-light">Food City, FC 12345</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-dark font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-dark font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-dark font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="Your message..."
                    required
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors resize-none"
                  />
                </div>

                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 text-green-600 py-3 px-4 rounded-lg text-center font-semibold"
                  >
                    Message sent successfully! ✓
                  </motion.div>
                )}

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Send Message
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
