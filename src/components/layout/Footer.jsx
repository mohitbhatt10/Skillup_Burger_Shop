import React from "react";
import {
  AiFillYoutube,
  AiFillInstagram,
  AiFillFacebook,
  AiFillTwitterCircle,
} from "react-icons/ai";
import { GiHamburger } from "react-icons/gi";

function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <GiHamburger className="text-4xl text-primary" />
              <h3 className="text-2xl font-bold">Skillup Burger</h3>
            </div>
            <p className="text-gray-400">
              Crafting the finest burgers with passion and premium ingredients
              since 2024.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/cart"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Cart
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noreferrer"
                className="text-3xl hover:text-primary transition-colors transform hover:scale-110"
              >
                <AiFillYoutube />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="text-3xl hover:text-primary transition-colors transform hover:scale-110"
              >
                <AiFillInstagram />
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                className="text-3xl hover:text-primary transition-colors transform hover:scale-110"
              >
                <AiFillFacebook />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noreferrer"
                className="text-3xl hover:text-primary transition-colors transform hover:scale-110"
              >
                <AiFillTwitterCircle />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Skillup Burger. All rights reserved.
            Made with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
