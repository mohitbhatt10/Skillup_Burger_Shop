const Razorpay = require("razorpay");

let razorpayInstance = null;

const configureRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;

  razorpayInstance = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return razorpayInstance;
};

const getRazorpay = () => razorpayInstance;

module.exports = { configureRazorpay, getRazorpay };
