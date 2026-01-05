import React from "react";
import { AiFillYoutube, AiFillInstagram } from "react-icons/ai";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>© {new Date().getFullYear()} Skillup Burger. All rights reserved.</p>

        <div className="social-media">
          <a
            href="https://www.youtube.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
            className="social-link"
          >
            <AiFillYoutube size={24} />
          </a>

          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="social-link"
          >
            <AiFillInstagram size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
