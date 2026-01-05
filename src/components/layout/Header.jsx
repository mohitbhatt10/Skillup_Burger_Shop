import React from "react";
import { Link } from "react-router-dom";

function Header({ isAuthenticated }) {
	return (
		<header className="header">
			<nav className="nav">
				<div className="nav-left">
					<Link to="/" className="brand">
						Skillup Burger
					</Link>
				</div>

				<div className="nav-right">
					<Link to="/" className="nav-link">
						Home
					</Link>
					<Link to="/about" className="nav-link">
						About
					</Link>
					<Link to="/contact" className="nav-link">
						Contact
					</Link>
					{isAuthenticated ? (
						<Link to="/me" className="nav-link">
							Profile
						</Link>
					) : (
						<Link to="/login" className="nav-link">
							Login
						</Link>
					)}
				</div>
			</nav>
		</header>
	);
}

export default Header;
// Write all the code here
