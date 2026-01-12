require("dotenv").config();
const Product = require("../models/Product");
const connectDB = require("../config/db");

const products = [
  {
    title: "Classic Burger",
    description:
      "Juicy beef patty with fresh lettuce, tomato, onion, and special sauce",
    price: 199,
    image: "https://res.cloudinary.com/demo/image/upload/burger1.png",
    category: "burger",
    available: true,
    rating: 4.5,
    numReviews: 25,
  },
  {
    title: "Cheese Burger",
    description: "Classic burger topped with melted cheddar cheese",
    price: 249,
    image: "https://res.cloudinary.com/demo/image/upload/burger2.png",
    category: "burger",
    available: true,
    rating: 4.7,
    numReviews: 38,
  },
  {
    title: "Double Deluxe",
    description:
      "Double beef patties with extra cheese, bacon, and premium toppings",
    price: 299,
    image: "https://res.cloudinary.com/demo/image/upload/burger3.png",
    category: "burger",
    available: true,
    rating: 4.8,
    numReviews: 42,
  },
];

const seedProducts = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log("Products seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();
