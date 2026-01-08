import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import { useStore } from "../../context/StoreContext";

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useStore();
  const [form, setForm] = useState({ name: "", email: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError("Please enter name and email.");
      return;
    }
    setError("");
    login({ name: form.name, email: form.email });
    navigate("/me");
  };

  useEffect(() => {
    if (isAuthenticated) navigate("/me");
  }, [isAuthenticated, navigate]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-primary/10 to-pink-light flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-dark mb-2">Welcome Back!</h2>
          <p className="text-dark-light">
            Login to continue your burger journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-dark font-medium mb-2">Name</label>
            <div className="relative">
              <AiOutlineUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-light text-xl" />
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Your name"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-dark font-medium mb-2">Email</label>
            <div className="relative">
              <AiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-light text-xl" />
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Login
          </button>
        </form>
      </motion.div>
    </section>
  );
}

export default Login;
