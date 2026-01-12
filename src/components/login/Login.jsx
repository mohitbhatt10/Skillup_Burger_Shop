import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import { useStore } from "../../context/StoreContext";

function Login() {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useStore();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState("login");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter email and password.");
      return;
    }
    if (mode === "register" && !form.name) {
      setError("Please enter your name.");
      return;
    }
    setError("");
    setSubmitting(true);
    const action = mode === "login" ? login : register;
    const { error: authError } = await action(form);
    setSubmitting(false);
    if (authError) {
      setError(authError);
      return;
    }
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
          {mode === "register" && (
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
          )}

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

          <div>
            <label className="block text-dark font-medium mb-2">Password</label>
            <div className="relative">
              <AiOutlineUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-light text-xl" />
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="Enter password"
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
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Register"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode((m) => (m === "login" ? "register" : "login"))}
          className="w-full mt-4 text-primary hover:text-primary-dark font-semibold"
        >
          {mode === "login"
            ? "Need an account? Register"
            : "Already have an account? Login"}
        </button>
      </motion.div>
    </section>
  );
}

export default Login;
