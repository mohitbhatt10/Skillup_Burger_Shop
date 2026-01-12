import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AiOutlineShoppingCart,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";
import { GiHamburger } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";

function Header({ isAuthenticated, cartCount = 0, isAdmin = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <GiHamburger className="text-4xl text-primary group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-2xl font-bold text-dark hidden sm:block">
              Skillup <span className="text-primary">Burger</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-dark hover:text-primary transition-colors duration-300 font-medium relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative text-dark hover:text-primary transition-colors duration-300"
            >
              <AiOutlineShoppingCart className="text-2xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Links */}
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin/products"
                    className="text-dark hover:text-primary transition-colors duration-300 font-medium"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/myorders"
                  className="text-dark hover:text-primary transition-colors duration-300 font-medium"
                >
                  Orders
                </Link>
                <Link
                  to="/me"
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                  Profile
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-dark text-3xl focus:outline-none"
          >
            {mobileMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4"
            >
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-dark hover:text-primary transition-colors duration-300 font-medium py-2 border-b border-gray-200"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-dark hover:text-primary transition-colors duration-300 font-medium py-2 border-b border-gray-200 flex items-center justify-between"
                >
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className="bg-primary text-white text-xs rounded-full px-2 py-1">
                      {cartCount}
                    </span>
                  )}
                </Link>
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin/products"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-dark hover:text-primary transition-colors duration-300 font-medium py-2 border-b border-gray-200"
                      >
                        Admin
                      </Link>
                    )}
                    <Link
                      to="/myorders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-dark hover:text-primary transition-colors duration-300 font-medium py-2 border-b border-gray-200"
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/me"
                      onClick={() => setMobileMenuOpen(false)}
                      className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full text-center transition-all duration-300"
                    >
                      Profile
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full text-center transition-all duration-300"
                  >
                    Login
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

export default Header;
