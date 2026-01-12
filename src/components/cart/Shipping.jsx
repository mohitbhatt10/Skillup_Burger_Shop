import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Country, State } from "country-state-city";
import { motion } from "framer-motion";
import {
  AiOutlineHome,
  AiOutlineEnvironment,
  AiOutlinePhone,
} from "react-icons/ai";
import { useStore } from "../../context/StoreContext";

const Shipping = () => {
  const [country, setCountry] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [form, setForm] = useState({
    house: "",
    city: "",
    pinCode: "",
    contact: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setShipping, placeOrder } = useStore();

  const countries = useMemo(() => Country.getAllCountries(), []);
  const states = useMemo(
    () => (country ? State.getStatesOfCountry(country) : []),
    [country]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.house ||
      !form.city ||
      !country ||
      !stateCode ||
      !form.pinCode ||
      !form.contact
    ) {
      setError("Please complete all fields.");
      return;
    }
    setError("");
    const shippingData = { ...form, country, state: stateCode };
    setShipping(shippingData);
    setSubmitting(true);
    const { orderId, error: placeError } = await placeOrder(shippingData);
    setSubmitting(false);
    if (placeError) {
      setError(placeError);
      return;
    }
    if (orderId) {
      setSuccess(true);
      setTimeout(() => {
        navigate(`/order/${orderId}`);
      }, 1000);
    }
  };

  return (
    <section className="min-h-screen bg-pink-light py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          <h1 className="text-3xl font-bold text-dark mb-2 text-center">
            Shipping <span className="text-primary">Details</span>
          </h1>
          <p className="text-dark-light text-center mb-8">
            Enter your delivery information
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-dark font-medium mb-2 flex items-center space-x-2">
                  <AiOutlineHome className="text-primary" />
                  <span>House No.</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter House No."
                  value={form.house}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, house: e.target.value }))
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-dark font-medium mb-2 flex items-center space-x-2">
                  <AiOutlineEnvironment className="text-primary" />
                  <span>City</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter City"
                  value={form.city}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, city: e.target.value }))
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-dark font-medium mb-2">
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setStateCode("");
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.isoCode} value={c.isoCode}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-dark font-medium mb-2">
                  State
                </label>
                <select
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value)}
                  disabled={!country}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors disabled:bg-gray-100"
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s.isoCode} value={s.isoCode}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-dark font-medium mb-2">
                  Pin Code
                </label>
                <input
                  type="number"
                  placeholder="Enter Pincode"
                  value={form.pinCode}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, pinCode: e.target.value }))
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-dark font-medium mb-2 flex items-center space-x-2">
                  <AiOutlinePhone className="text-primary" />
                  <span>Contact</span>
                </label>
                <input
                  type="tel"
                  placeholder="Enter Contact Number"
                  value={form.contact}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, contact: e.target.value }))
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
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

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 text-green-600 py-3 px-4 rounded-lg text-center font-semibold"
              >
                Order Placed Successfully! ✓
              </motion.div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? "Placing Order..." : "Confirm Order"}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Shipping;
