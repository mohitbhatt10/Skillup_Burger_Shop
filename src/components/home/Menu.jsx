import React from "react";
import MenuCard from "./MenuCard";
import burger1 from "../../assets/burger1.png";
import burger2 from "../../assets/burger2.png";
import burger3 from "../../assets/burger3.png";

const sampleItems = [
	{ id: 1, title: "Classic Burger", price: 199, img: burger1 },
	{ id: 2, title: "Cheese Burger", price: 249, img: burger2 },
	{ id: 3, title: "Double Deluxe", price: 299, img: burger3 },
];

function Menu() {
	const handleBuy = (id) => {
		console.log("Buy", id);
	};

	return (
		<section className="menu">
			<h2>Our Menu</h2>
			<div className="menu-grid">
				{sampleItems.map((it, idx) => (
					<MenuCard
						key={it.id}
						itemNum={it.id}
						burgerSrc={it.img}
						price={it.price}
						title={it.title}
						handler={handleBuy}
						delay={idx * 0.1}
					/>
				))}
			</div>
		</section>
	);
}

export default Menu;
